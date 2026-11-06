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
  assert.equal(result.native_svg_diagrams,6);
  assert.ok(result.diagram_nodes>=48);
  assert.ok(result.diagram_edges>=48);
  assert.equal(result.source_verified,false);
  const html=fs.readFileSync(output,'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(script);
  new vm.Script(script[1],{filename:'implementation-inline.js'});
});
test('implementation chapters and offline diagrams rebuild deterministically',()=>{
  const ids=['genericagent','gepa','sol-pi','hyperagents','rrsi','openrsi'];
  const names=['docs/repo_deepdive/implementation-atlas.html',...ids.map(id=>`docs/repo_deepdive/cases/${id}.md`),...ids.map(id=>`pics/implementations/${id}-architecture.svg`)];
  const before=names.map(name=>fs.readFileSync(path.join(root,name),'utf8'));
  execFileSync(process.execPath,[path.join(root,'scripts/build-repo-deepdives.mjs')],{cwd:root});
  names.forEach((name,index)=>assert.equal(fs.readFileSync(path.join(root,name),'utf8'),before[index]));
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
    assert.equal(await evaluate(`document.querySelectorAll('#architecture-frame > svg').length`),1);
    assert.equal(await evaluate(`document.querySelector('#architecture-frame svg').dataset.repo`),id);
    assert.match(await evaluate(`document.querySelector('#architecture-download').href`),new RegExp(`/pics/implementations/${id}-architecture\\.svg$`));
    assert.equal(await evaluate(`document.querySelector('#architecture-download').download`),`${id}-architecture.svg`);
    const nodeIds=await evaluate(`Array.from(document.querySelectorAll('#architecture-frame g[data-module]'),node=>node.dataset.module)`);
    for(const module of nodeIds){
      const selector=`#architecture-frame g[data-module="${module}"]`;
      await evaluate(`document.querySelector(${JSON.stringify(selector)}).dispatchEvent(new MouseEvent('click',{bubbles:true}))`);
      assert.equal(await evaluate(`document.querySelector('#module-detail').dataset.module`),module);
      assert.equal(await evaluate(`document.querySelector('#modules [data-module="${module}"]').getAttribute('aria-pressed')`),'true');
      assert.match(await evaluate(`document.querySelector('#module-detail a').href`),/github\.com\/.+\/blob\/[a-f0-9]{40}\/.+#L\d+/);
    }
    for(const [index,key]of [[0,'Enter'],[1,' ']]){
      await evaluate(`document.querySelector('#architecture-frame g[data-module="${nodeIds[index]}"]').focus()`);
      await page('Input.dispatchKeyEvent',{type:'keyDown',key,code:key===' '?'Space':'Enter',windowsVirtualKeyCode:key===' '?32:13});
      await page('Input.dispatchKeyEvent',{type:'keyUp',key,code:key===' '?'Space':'Enter',windowsVirtualKeyCode:key===' '?32:13});
      assert.equal(await evaluate(`document.querySelector('#module-detail').dataset.module`),nodeIds[index]);
    }
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
  for(const [width,height]of [[390,844],[1440,1000],[2048,1320]]){
    await page('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    for(const id of ids){
      await evaluate(`document.getElementById('repo').value=${JSON.stringify(id)};document.getElementById('repo').dispatchEvent(new Event('change'))`);
      const metrics=await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})`);
      assert.ok(metrics.scrollWidth<=width,`Overflow ${id} ${JSON.stringify(metrics)}`);
      const geometry=await evaluate(`(()=>{
        const svg=document.querySelector('#architecture-frame svg');
        const texts=[...svg.querySelectorAll('text')],errors=[];
        const box=element=>{
          const b=element.getBBox(),p=svg.getCTM().inverse().multiply(element.getCTM());
          const a=new DOMPoint(b.x,b.y).matrixTransform(p),z=new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(p);
          return{x:a.x,y:a.y,right:z.x,bottom:z.y};
        };
        for(const text of texts){
          const b=box(text);
          if(b.x<0||b.y<0||b.right>1200||b.bottom>820)errors.push('Canvas text overflow: '+text.textContent);
          const node=text.closest('g[data-module]');
          if(node){const r=box(node.querySelector('rect'));if(b.x<r.x+5||b.right>r.right-5||b.y<r.y||b.bottom>r.bottom)errors.push('Node text overflow: '+text.textContent);}
        }
        for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){
          const a=box(texts[i]),b=box(texts[j]);
          if(Math.min(a.right,b.right)-Math.max(a.x,b.x)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1)errors.push('Text overlap: '+texts[i].textContent+' / '+texts[j].textContent);
        }
        for(const path of svg.querySelectorAll('.connection>path')){
          const points=[...path.getAttribute('d').matchAll(/[ML]([0-9.]+),([0-9.]+)/g)].map(match=>[Number(match[1]),Number(match[2])]);
          for(let index=1;index<points.length;index++){
            const [ax,ay]=points[index-1],[bx,by]=points[index];
            for(const text of texts){
              const b=box(text);
              const crosses=ax===bx?ax>b.x+1&&ax<b.right-1&&Math.max(ay,by)>b.y+1&&Math.min(ay,by)<b.bottom-1:ay>b.y+1&&ay<b.bottom-1&&Math.max(ax,bx)>b.x+1&&Math.min(ax,bx)<b.right-1;
              if(crosses)errors.push('Edge/text overlap: '+path.parentElement.dataset.from+' / '+text.textContent);
            }
          }
        }
        return errors;
      })()`);
      assert.deepEqual(geometry,[],`SVG geometry ${id} at ${width}`);
      await evaluate(`document.getElementById('architecture-frame').scrollIntoView({block:'start'})`);
      await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`);
      const bounds=await evaluate(`(()=>{const r=document.getElementById('architecture-frame').getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1};})()`);
      const architectureShot=await page('Page.captureScreenshot',{format:'png',clip:bounds,captureBeyondViewport:true});
      fs.writeFileSync(path.join(root,'.delivery-check',`implementations-${id}-architecture-${width}.png`),Buffer.from(architectureShot.data,'base64'));
      await evaluate(`document.getElementById('architecture-zoom').click()`);
      assert.equal(await evaluate(`document.getElementById('architecture-zoom').getAttribute('aria-pressed')`),'true');
      assert.ok(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),`Zoom overflow ${id} ${width}`);
      assert.ok(await evaluate(`document.querySelector('#architecture-frame svg').getBoundingClientRect().width>=1200`));
      await evaluate(`document.getElementById('architecture-zoom').click()`);
    }
    if(width===390||width===1440){
      await evaluate(`window.scrollTo(0,0)`);
      const shot=await page('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(path.join(root,'.delivery-check',`implementations-${width}.png`),Buffer.from(shot.data,'base64'));
    }
  }
  const downloads=path.join(root,'.delivery-check/implementation-downloads');
  fs.mkdirSync(downloads,{recursive:true});
  await page('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
  const download=path.join(downloads,'openrsi-architecture.svg');
  const expectedDownload=fs.readFileSync(path.join(root,'pics/implementations/openrsi-architecture.svg'),'utf8');
  fs.rmSync(download,{force:true});
  const downloadPoint=await evaluate(`(()=>{const a=document.getElementById('architecture-download');a.scrollIntoView({block:'center'});const b=a.getBoundingClientRect();return{x:b.x+b.width/2,y:b.y+b.height/2};})()`);
  await page('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...downloadPoint});
  await page('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...downloadPoint});
  const deadline=Date.now()+10000;
  while((!fs.existsSync(download)||fs.statSync(download).size<Buffer.byteLength(expectedDownload))&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,50));
  assert.ok(fs.existsSync(download),'Native SVG download did not complete');
  assert.equal(fs.readFileSync(download,'utf8'),expectedDownload);
  fs.rmSync(download);
  fs.rmdirSync(downloads);
  for(const [width,height]of [[390,844],[1440,1000],[2048,1320]]){
    await page('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    for(const id of ids){
      await page('Page.navigate',{url:pathToFileURL(path.join(root,`pics/implementations/${id}-architecture.svg`)).href});
      await waitFor(`document.documentElement.tagName==='svg'&&document.documentElement.dataset.repo===${JSON.stringify(id)}`);
      assert.equal(await evaluate(`document.querySelectorAll('parsererror').length`),0);
      assert.equal(await evaluate(`document.documentElement.viewBox.baseVal.width`),1200);
      assert.ok(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),`Standalone SVG overflow ${id} ${width}`);
    }
  }
  assert.deepEqual(browser.exceptions,[]);
});
