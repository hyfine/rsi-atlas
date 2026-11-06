import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {root} from './validate-delivery.mjs';
import {buildFamilyDiagrams} from './build-family-diagrams.mjs';
import {chromePath,connectBrowser} from './browser-test-utils.mjs';

const families=JSON.parse(fs.readFileSync(path.join(root,'data/family-architectures.json'),'utf8')).families;
const figures=JSON.parse(fs.readFileSync(path.join(root,'data/paper-figures.json'),'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const assets=families.flatMap(family=>['architecture','flow'].flatMap(kind=>['svg','html'].map(extension=>`pics/family-${family.id}-${kind}.${extension}`)));

test('all six families have independent architecture and representative flow artifacts',()=>{
  assert.deepEqual(families.map(family=>family.id),['a','b','c','d','e','f']);
  for(const family of families){
    assert.equal(family.nodes.length,8);
    assert.ok(family.idea&&family.persistent&&family.distinction&&family.boundary&&family.evidence);
    for(const kind of ['architecture','flow']){
      const svg=fs.readFileSync(path.join(root,`pics/family-${family.id}-${kind}.svg`),'utf8');
      const html=fs.readFileSync(path.join(root,`pics/family-${family.id}-${kind}.html`),'utf8');
      assert.match(svg,/^<svg/);
      assert.ok(html.includes('不是实验运行记录'));
      assert.ok(!/<script[^>]+src=|<link[^>]+stylesheet/i.test(html));
      const embedded=JSON.parse(html.match(/<script type="application\/json" id="family-data">([\s\S]*?)<\/script>/)[1]);
      assert.equal(embedded.default_view,kind);
      assert.deepEqual(embedded.family,family);
      new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
      if(kind==='architecture')assert.equal((svg.match(/class="architecture-node"/g)??[]).length,8);
    }
  }
});
test('paper figures have explicit permission, complete attribution and unchanged asset hashes',()=>{
  assert.equal(figures.figures.length,6);
  assert.equal(new Set(figures.figures.map(figure=>figure.family)).size,6);
  for(const figure of figures.figures){
    assert.equal(figure.license_url,'https://creativecommons.org/licenses/by/4.0/');
    assert.ok(figure.authors.length&&figure.title&&figure.figure&&figure.changes);
    assert.ok(figure.source_url.includes(figure.identifier+figure.version));
    const bytes=fs.readFileSync(path.join(root,figure.asset));
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(sha(bytes),figure.sha256);
    assert.equal(bytes.readUInt32BE(16),figure.width);
    assert.equal(bytes.readUInt32BE(20),figure.height);
    assert.ok(figure.width>=200&&figure.height>=100);
    assert.ok(figures.papers.some(paper=>paper.figure_id===figure.id&&paper.status==='included_cc_by'));
  }
  assert.deepEqual(fs.readdirSync(path.join(root,'pics/papers')).filter(name=>name.endsWith('.png')).sort(),figures.figures.map(figure=>path.basename(figure.asset)).sort());
});
test('family assets, paper placement and generated guides rebuild without duplicate blocks',()=>{
  const names=[...assets,'docs/zh/08_Family_Architectures.md','docs/zh/09_Paper_Figures.md',...['02_Training_Environments_and_AI_Research.md','03_Agent_Skills_and_Harness.md','04_Meta_RSI_Evaluation_and_Safety.md'].map(name=>'docs/zh/chapters/'+name)];
  const before=names.map(name=>fs.readFileSync(path.join(root,name)));
  buildFamilyDiagrams();
  names.forEach((name,index)=>assert.equal(sha(fs.readFileSync(path.join(root,name))),sha(before[index]),`Non-idempotent family generation ${name}`));
  const chapters=names.filter(name=>name.startsWith('docs/zh/chapters/')).map(name=>fs.readFileSync(path.join(root,name),'utf8')).join('\n');
  for(const family of families)assert.equal(chapters.split(`<!-- family-${family.id}-architecture:start -->`).length,2);
  for(const figure of figures.figures)assert.equal(chapters.split(`<!-- paper-figure-${figure.id}:start -->`).length,2);
});
test('explicit local notes mirror repairs the exact missing family-e relative image',t=>{
  const notes=process.env.RSI_NOTES_ROOT;
  if(!notes){t.skip('Set RSI_NOTES_ROOT to verify a local notes mirror; not claimed by public-only checks');return;}
  for(const asset of [...assets,...figures.figures.map(figure=>figure.asset)])assert.equal(sha(fs.readFileSync(path.join(notes,asset))),sha(fs.readFileSync(path.join(root,asset))),`Stale/missing notes asset ${asset}`);
  const missing=path.resolve(notes,'chapters','../pics/family-e-flow.svg');
  assert.match(fs.readFileSync(missing,'utf8'),/^<svg/);
  const files=fs.readdirSync(path.join(notes,'chapters')).filter(name=>name.endsWith('.md')).map(name=>path.join(notes,'chapters',name));
  files.push(path.join(notes,'04_Family_Architectures.md'),path.join(notes,'05_Paper_Figures.md'));
  for(const file of files){
    const text=fs.readFileSync(file,'utf8');
    for(const match of text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)){
      if(/^https?:/.test(match[1]))continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file),decodeURIComponent(match[1]))),`Missing note image ${path.basename(file)}: ${match[1]}`);
    }
  }
});
test('real Chrome: every family renders, source text fits, flow plays and original paper images load',{timeout:180000},async t=>{
  if(!chromePath()){t.skip('Chrome absent; no browser rendering pass claimed');return;}
  const first=pathToFileURL(path.join(root,'pics/family-a-architecture.html')).href;
  const browser=await connectBrowser(t,first,'window.familyReady === true');
  const {page,evaluate,waitFor}=browser;
  fs.mkdirSync(path.join(root,'.delivery-check'),{recursive:true});
  for(const family of families){
    for(const kind of ['architecture','flow']){
      await page('Page.navigate',{url:pathToFileURL(path.join(root,`pics/family-${family.id}-${kind}.html`)).href});
      await waitFor('window.familyReady === true');
      assert.equal(await evaluate(`document.getElementById('${kind}').hidden`),false);
      await evaluate('document.fonts.ready.then(()=>true)');
      if(kind==='architecture'){
        assert.equal(await evaluate(`document.querySelectorAll('#architecture-frame [data-node]').length`),8);
        await evaluate(`document.querySelector('#architecture-frame [data-node="7"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))`);
        assert.ok((await evaluate(`document.getElementById('node-detail').textContent`)).length>25);
        await evaluate(`document.getElementById('theme').click()`);
        assert.equal(await evaluate(`document.body.classList.contains('light')`),true);
        await evaluate(`document.getElementById('theme').click()`);
      }else{
        await evaluate(`document.getElementById('next').click()`);
        assert.equal(await evaluate(`document.getElementById('position').textContent`),'2 / 6');
        await evaluate(`document.getElementById('reset').click();document.getElementById('speed').value='650';document.getElementById('play').click()`);
        await waitFor(`!document.getElementById('position').textContent.startsWith('1 /')`);
        await evaluate(`document.getElementById('play').click()`);
        assert.equal(await evaluate(`document.getElementById('play').getAttribute('aria-pressed')`),'false');
      }
      for(const [width,height]of [[390,844],[1440,900],[1600,1000],[1920,1080],[2048,1320]]){
        await page('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
        assert.ok(await evaluate(`document.documentElement.scrollWidth<=${width}`),`Family ${family.id} ${kind} overflow at ${width}`);
        if(width>=1440){
          const overflow=await evaluate(`(()=>{const svg=document.querySelector('#${kind} .diagram svg'),v=svg.viewBox.baseVal;return Array.from(svg.querySelectorAll('text')).map(text=>({text:text.textContent,b:text.getBBox()})).filter(({b})=>b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height).map(item=>item.text);})()`);
          assert.deepEqual(overflow,[],`Text outside family-${family.id}-${kind} SVG`);
        }
        if(width===1440&&kind==='architecture'){
          const rect=await evaluate(`(()=>{const r=document.querySelector('#architecture-frame svg').getBoundingClientRect();return{x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height,scale:1};})()`);
          const shot=await page('Page.captureScreenshot',{format:'png',clip:rect,captureBeyondViewport:true});
          fs.writeFileSync(path.join(root,'.delivery-check',`family-${family.id}-architecture.png`),Buffer.from(shot.data,'base64'));
        }
      }
    }
  }
  await page('Page.navigate',{url:pathToFileURL(path.join(root,'index.html')).href});
  await waitFor('window.atlasReady === true');
  await evaluate(`location.hash='methods';document.getElementById('search').value='';document.getElementById('search').dispatchEvent(new Event('input'))`);
  for(const figure of figures.figures){
    await evaluate(`document.querySelector('#method-list [data-method="arxiv:${figure.identifier}"]').click()`);
    await waitFor(`!!document.querySelector('#paper-figure img')&&document.querySelector('#paper-figure img').getAttribute('src')===${JSON.stringify(figure.asset)}&&document.querySelector('#paper-figure img').complete&&document.querySelector('#paper-figure img').naturalWidth>0`);
    assert.ok(await evaluate(`document.getElementById('paper-figure').textContent.includes('CC BY 4.0')`));
    await evaluate(`document.getElementById('close-dialog').click()`);
  }
  await evaluate(`location.hash='panorama'`);
  assert.equal(await evaluate(`document.querySelectorAll('#family-architecture-gallery img').length`),6);
  await waitFor(`Array.from(document.querySelectorAll('#family-architecture-gallery img')).every(img=>img.complete&&img.naturalWidth>0)`);
  assert.deepEqual(browser.exceptions,[]);
});
