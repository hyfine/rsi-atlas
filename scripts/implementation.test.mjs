import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { root } from './validate-delivery.mjs';
import { validateImplementations } from './validate-repo-deepdives.mjs';
import { chromePath,connectBrowser } from './browser-test-utils.mjs';

const output=path.join(root,'docs/repo_deepdive/implementation-atlas.html');
test('six public implementations have source-grounded modules, diagrams and no external runtime',()=>{
  const result=validateImplementations();
  assert.equal(result.modules,72);
  assert.equal(result.source_verified,false);
  const html=fs.readFileSync(output,'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(script);
  new vm.Script(script[1],{filename:'implementation-inline.js'});
});
test('implementation chapters and offline diagrams rebuild deterministically',()=>{
  const names=['implementation-atlas.html',...['genericagent','gepa','sol-pi','hyperagents','rrsi','openrsi'].map(id=>`cases/${id}.md`)];
  const before=names.map(name=>fs.readFileSync(path.join(root,'docs/repo_deepdive',name),'utf8'));
  execFileSync(process.execPath,[path.join(root,'scripts/build-repo-deepdives.mjs')],{cwd:root});
  names.forEach((name,index)=>assert.equal(fs.readFileSync(path.join(root,'docs/repo_deepdive',name),'utf8'),before[index]));
});
test('real Chrome: all six source walkthroughs, playback and responsive layouts',{timeout:120000},async t=>{
  if(!chromePath()){t.skip('Chrome/Chromium unavailable; no browser pass claimed');return;}
  const browser=await connectBrowser(t,pathToFileURL(output).href+'?repo=rrsi','window.implementationsReady === true');
  const {page,evaluate,waitFor}=browser;
  assert.equal(await evaluate(`document.getElementById('repo').value`),'rrsi');
  const ids=await evaluate(`Array.from(document.getElementById('repo').options,option=>option.value)`);
  assert.equal(ids.length,6);
  for(const id of ids){
    await evaluate(`document.getElementById('repo').value=${JSON.stringify(id)};document.getElementById('repo').dispatchEvent(new Event('change'))`);
    assert.equal(await evaluate(`document.querySelectorAll('#modules [data-module]').length`),12);
    assert.ok(await evaluate(`document.querySelectorAll('#flow tr').length>=6`));
    const source=await evaluate(`document.querySelector('#walk-detail a').href`);
    assert.match(source,/github\.com\/.+\/blob\/[a-f0-9]{40}\/.+#L\d+/);
    await evaluate(`document.getElementById('next').click()`);
    assert.match(await evaluate(`document.getElementById('position').textContent`),/^2 \/ /);
    await evaluate(`document.getElementById('reset').click()`);
    assert.match(await evaluate(`document.getElementById('position').textContent`),/^1 \/ /);
    await evaluate(`document.querySelectorAll('#modules [data-module]')[4].click()`);
    assert.ok(await evaluate(`document.querySelector('#module-detail a').href.includes('/blob/')`));
  }
  await evaluate(`document.getElementById('speed').value='600';document.getElementById('play').click()`);
  await waitFor(`!document.getElementById('position').textContent.startsWith('1 /')`);
  await evaluate(`document.getElementById('play').click()`);
  assert.equal(await evaluate(`document.getElementById('play').getAttribute('aria-pressed')`),'false');
  fs.mkdirSync(path.join(root,'.delivery-check'),{recursive:true});
  for(const [width,height]of [[360,780],[390,844],[1440,900],[2048,1320]]){
    await page('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    for(const id of ids){
      await evaluate(`document.getElementById('repo').value=${JSON.stringify(id)};document.getElementById('repo').dispatchEvent(new Event('change'))`);
      const metrics=await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})`);
      assert.ok(metrics.scrollWidth<=width,`Overflow ${id} ${JSON.stringify(metrics)}`);
    }
    if(width===390||width===1440){
      await evaluate(`window.scrollTo(0,0)`);
      const shot=await page('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(path.join(root,'.delivery-check',`implementations-${width}.png`),Buffer.from(shot.data,'base64'));
    }
  }
  assert.deepEqual(browser.exceptions,[]);
});
