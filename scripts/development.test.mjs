import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import crypto from 'node:crypto';
import {root,publicationFiles} from './validate-delivery.mjs';
import {chromePath,connectBrowser} from './browser-test-utils.mjs';
import {buildDevelopmentVisuals} from './build-development-visuals.mjs';

test('development panorama precedes narrow focus and includes offline fan/tree fallbacks',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.ok(html.indexOf('id="rsi-growth-tree"')<html.indexOf('id="focus-spotlight"'));
  assert.ok(html.indexOf('id="research-landscape"')<html.indexOf('id="focus-spotlight"'));
  assert.ok(html.includes('id="rsi-method-fan"'));
  assert.ok(fs.existsSync(path.join(root,'pics/rsi-method-fan.svg')));
  assert.equal((fs.readFileSync(path.join(root,'pics/rsi-method-fan.svg'),'utf8').match(/data-fan-sector=/g)??[]).length,6);
});

test('standalone tree SVG is generated from the corrected embedded source',()=>{
  const markup=fs.readFileSync(path.join(root,'scripts/growth-tree.html'),'utf8');
  const svg=markup.match(/<svg\b[^>]*\bid="grt-svg"[\s\S]*?<\/svg>/)?.[0];
  assert.ok(svg);
  const before=fs.readFileSync(path.join(root,'pics/rsi-growth-tree.svg'),'utf8');
  assert.ok(before.includes('xml:lang="en"')&&before.includes('width="1920" height="896"'));
  assert.ok(before.includes('>Memory &amp; skills</tspan>'));
  assert.ok(before.includes('>Co-evolving environments &amp; solvers</text>'));
  const chinese=fs.readFileSync(path.join(root,'pics/rsi-growth-tree-zh.svg'),'utf8');
  assert.ok(chinese.includes('xml:lang="zh-CN"')&&chinese.includes('>记忆与技能</tspan>'));
  assert.ok(fs.readFileSync(path.join(root,'README.md'),'utf8').includes('(pics/rsi-growth-tree.svg)'));
  assert.ok(fs.readFileSync(path.join(root,'README.zh-CN.md'),'utf8').includes('(pics/rsi-growth-tree-zh.svg)'));
  assert.ok(before.includes('Co-evolving environments &amp; solvers'));
  buildDevelopmentVisuals(JSON.parse(fs.readFileSync(path.join(root,'data/atlas-methods.json'),'utf8')));
  assert.equal(fs.readFileSync(path.join(root,'pics/rsi-growth-tree.svg'),'utf8'),before);
  assert.equal(fs.readFileSync(path.join(root,'pics/rsi-growth-tree-zh.svg'),'utf8'),chinese);
});

test('real Chrome: every published SVG parses as standalone XML and README images actually load',{timeout:120000},async t=>{
  if(!chromePath()){t.skip('Chrome unavailable; no standalone SVG/image pass claimed');return;}
  const directory=path.join(root,'.delivery-check');
  fs.mkdirSync(directory,{recursive:true});
  const preview=path.join(directory,'standalone-svg-images.html');
  t.after(()=>fs.rmSync(preview,{force:true}));
  const images=new Set();
  for(const file of ['README.md','README.zh-CN.md']){
    const text=fs.readFileSync(path.join(root,file),'utf8');
    for(const match of text.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)|<img\b[^>]*\bsrc="([^"]+)"/g))images.add(match[1]??match[2]);
  }
  const imagePaths=[...images];
  assert.ok(imagePaths.includes('pics/rsi-growth-tree.svg'));
  fs.writeFileSync(preview,`<!doctype html><html><head><meta charset="utf-8"><base href="${pathToFileURL(root).href}"><style>img{display:block;max-width:100%;height:auto}</style></head><body>${imagePaths.map((src,index)=>`<img id="image-${index}" src="${src}" alt="README image ${index}">`).join('')}</body></html>`);
  const browser=await connectBrowser(t,pathToFileURL(preview).href,'document.readyState === "complete"');
  const {evaluate,page,waitFor}=browser;
  const files=publicationFiles().filter(file=>file.endsWith('.svg'));
  for(const file of files){
    const text=fs.readFileSync(file,'utf8');
    const error=await evaluate(`(()=>{const doc=new DOMParser().parseFromString(${JSON.stringify(text)},"image/svg+xml");return doc.querySelector("parsererror")?.textContent??null;})()`);
    assert.equal(error,null,`Invalid standalone SVG: ${path.relative(root,file)}\n${error}`);
  }
  await waitFor('Array.from(document.images).every(image=>image.complete)');
  const loaded=await evaluate('Array.from(document.images,image=>({src:image.getAttribute("src"),width:image.naturalWidth,height:image.naturalHeight}))');
  for(const image of loaded)assert.ok(image.width>0&&image.height>0,`README image refused: ${image.src}`);
  assert.deepEqual(loaded.find(image=>image.src==='pics/rsi-growth-tree.svg'),{src:'pics/rsi-growth-tree.svg',width:1920,height:896});
  await page('Page.navigate',{url:pathToFileURL(path.join(root,'pics/rsi-growth-tree.svg')).href});
  await waitFor('document.readyState === "complete"');
  assert.equal(await evaluate('document.querySelectorAll("parsererror").length'),0);
  assert.equal(await evaluate('document.documentElement.localName'),'svg');
  assert.equal(await evaluate('document.querySelectorAll(".grt-method").length'),88);
  assert.equal(await evaluate('document.documentElement.getAttribute("xml:lang")'),'en');
  assert.ok(await evaluate(`Array.from(document.querySelectorAll('text,title')).every(node=>!/[\\u3400-\\u9fff]/.test(node.textContent))`),'Default tree image has non-English visible labels');
  await page('Page.navigate',{url:pathToFileURL(path.join(root,'pics/rsi-growth-tree-zh.svg')).href});
  await waitFor('document.readyState === "complete"');
  assert.equal(await evaluate('document.documentElement.getAttribute("xml:lang")'),'zh-CN');
  assert.ok(await evaluate(`Array.from(document.querySelectorAll('text')).some(node=>node.textContent.includes('记忆与技能'))`));
  assert.deepEqual(browser.exceptions,[]);
  t.diagnostic(JSON.stringify({standalone_svgs_parsed:files.length,readme_images_loaded:loaded.length}));
});

test('survey fulltext claims preserve exact page coverage, access limits and versioned evidence',t=>{
  const data=JSON.parse(fs.readFileSync(path.join(root,'data/survey-fulltext-evidence.json'),'utf8'));
  assert.equal(data.entire_fulltext_papers.length,6);
  assert.equal(new Set(data.papers.map(paper=>paper.key)).size,6);
  assert.equal(data.papers.reduce((sum,paper)=>sum+paper.fulltext_access.pages,0),data.entire_fulltext_total_pages);
  assert.equal(data.entire_fulltext_total_pages,387);
  assert.ok(data.metadata_only_candidates.length>0);
  for(const paper of data.papers){
    assert.ok(paper.version_read&&paper.source_urls.every(url=>url.startsWith('https://')));
    assert.ok(paper.sections.length&&paper.framework_axes.length);
    assert.ok(paper.fulltext_access.status.startsWith('entire_'));
  }
  const receipt=path.join(root,'.local/research/growth-redesign-20261109/source-reading-receipt.json');
  if(!fs.existsSync(receipt)){t.diagnostic('Local page/hash receipts excluded from public publication');return;}
  const local=JSON.parse(fs.readFileSync(receipt,'utf8'));
  assert.equal(local.papers.length,6);
  for(const paper of local.papers){
    assert.equal(paper.entire_text_read,true);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(paper.pdf_path)).digest('hex'),paper.sha256);
    const covered=new Set();
    for(const range of paper.all_read_ranges)for(let page=range.physical_pages[0];page<=range.physical_pages[1];page++)covered.add(page);
    assert.deepEqual([...covered].sort((a,b)=>a-b),Array.from({length:paper.page_count},(_,i)=>i+1));
  }
});

test('real Chrome: flourishing tree has evidence-bound method leaves, replay, timeline, pan and zoom',{timeout:180000},async t=>{
  if(!chromePath()){t.skip('Chrome unavailable; no growth-tree rendering pass claimed');return;}
  const browser=await connectBrowser(t,pathToFileURL(path.join(root,'index.html')).href,'window.atlasReady === true && window.rsiTreeReady === true');
  const {evaluate,page,waitFor}=browser;
  const atlas=JSON.parse(fs.readFileSync(path.join(root,'data/atlas-methods.json'),'utf8'));
  await evaluate('window.rsiTree.finish()');
  assert.deepEqual((await evaluate('window.rsiTreeState.plannedMethodIds')).sort(),atlas.methods.map(record=>record.id).sort());
  assert.ok(await evaluate('window.rsiTreeState.branchCount>=100 && window.rsiTreeState.subbranchCount>=18 && window.rsiTreeState.decorativeLeafCount>=180'));
  assert.ok(await evaluate(`window.rsiTreeState.topologyEdges.every(edge=>edge.semantics==='visual_membership_not_inheritance')`));
  assert.equal(await evaluate(`document.querySelectorAll('#grt-svg .grt-method').length`),atlas.methods.length);
  await evaluate(`document.querySelector('[data-grt-method="arxiv:1901.01753"]').focus()`);
  assert.equal(await evaluate(`document.getElementById('grt-detail').hidden`),false);
  await evaluate(`document.querySelector('[data-grt-method="arxiv:1901.01753"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))`);
  assert.equal(await evaluate(`document.getElementById('method-dialog').open`),true);
  await evaluate(`document.getElementById('close-dialog').click()`);
  await evaluate(`document.getElementById('grt-detail-close').click();document.getElementById('grt-zoom-in').click()`);
  assert.ok(await evaluate('window.rsiTreeState.transform.scale>1'));
  await evaluate(`document.getElementById('grt-fit').click();document.getElementById('grt-stage').scrollIntoView({behavior:'instant',block:'center'})`);
  const point=await evaluate(`(()=>{const r=document.getElementById('grt-stage').getBoundingClientRect();return{x:r.left+20,y:r.top+35};})()`);
  const original=await evaluate('window.rsiTreeState.transform');
  await page('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
  await page('Input.dispatchMouseEvent',{type:'mouseMoved',button:'left',buttons:1,x:point.x+65,y:point.y+25});
  await page('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x:point.x+65,y:point.y+25});
  assert.notDeepEqual(await evaluate('window.rsiTreeState.transform'),original);
  await page('Input.dispatchMouseEvent',{type:'mouseWheel',deltaX:0,deltaY:-120,...point});
  await waitFor('window.rsiTreeState.transform.scale>1');
  await evaluate(`document.getElementById('grt-stage').focus()`);
  await page('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home',windowsVirtualKeyCode:36});
  assert.equal(await evaluate('window.rsiTreeState.transform.scale'),1);
  await evaluate(`document.getElementById('grt-scrubber').value='500';document.getElementById('grt-scrubber').dispatchEvent(new Event('input',{bubbles:true}))`);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-grt-method="recursive:flint"]')).visibility`),'hidden');
  assert.ok(await evaluate('window.rsiTreeState.visibleMethodCount<88'));
  await evaluate(`document.getElementById('grt-replay').click()`);
  await waitFor('window.rsiTreeState.progress>0.02 && window.rsiTreeState.progress<0.2');
  await evaluate('window.rsiTree.pause(true)');
  const paused=await evaluate('window.rsiTreeState.progress');
  await evaluate(`document.querySelector('#language [data-language="zh"]').click()`);
  assert.equal(await evaluate('window.rsiTreeState.progress'),paused);
  assert.equal(await evaluate('window.rsiTreeState.visualProgress'),1);
  await evaluate('window.rsiTree.play(false)');
  await waitFor(`window.rsiTreeState.progress>${paused+.01}`);
  await evaluate(`location.hash='survey'`);
  await waitFor('window.rsiTreeState.playing === false');
  await evaluate(`location.hash='panorama';document.getElementById('grt-replay').click()`);
  const deadline=Date.now()+22000;
  while(!await evaluate('window.rsiTreeState.completed')&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,100));
  assert.equal(await evaluate('window.rsiTreeState.completed'),true,'Growth must complete within the declared finite animation');
  assert.equal(await evaluate('window.rsiTreeState.visibleMethodCount'),88);
  assert.equal(await evaluate('window.rsiTreeState.playing'),false);
  fs.mkdirSync(path.join(root,'.delivery-check'),{recursive:true});
  for(const [width,height]of [[390,844],[1440,900],[1600,1000],[1920,1080],[2048,1320]]){
    await page('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    assert.ok(await evaluate(`document.documentElement.scrollWidth<=${width}`),`Tree overflow at ${width}`);
    await evaluate(`document.getElementById('rsi-growth-tree').scrollIntoView({behavior:'instant',block:'start'})`);
    if(width>=1440){
      const size=await evaluate(`(()=>{const text=document.querySelector('.grt-method-name'),svg=document.getElementById('grt-svg'),rect=svg.getBoundingClientRect(),box=svg.viewBox.baseVal;return parseFloat(getComputedStyle(text).fontSize)*Math.min(rect.height/box.height,rect.width/box.width);})()`);
      assert.ok(size>=12,`Desktop tree labels too small (${size}px)`);
    }
    if(width===390||width===1440||width===2048){
      const shot=await page('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(path.join(root,'.delivery-check',`development-tree-${width}.png`),Buffer.from(shot.data,'base64'));
    }
  }
  await page('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await waitFor('window.rsiTreeState.reducedMotion === true');
  await evaluate(`document.getElementById('grt-replay').click()`);
  assert.equal(await evaluate('window.rsiTreeState.completed'),true);
  assert.deepEqual(browser.exceptions,[]);
});

test('real Chrome: fan unfolds sequentially to180degrees, replays, pauses and exposes classics/recent methods',{timeout:180000},async t=>{
  if(!chromePath()){t.skip('Chrome unavailable; no fan visualization pass claimed');return;}
  const browser=await connectBrowser(t,pathToFileURL(path.join(root,'index.html')).href,'window.atlasReady === true && window.rsiFanReady === true');
  const {evaluate,page,waitFor}=browser;
  await evaluate(`location.hash='survey'`);
  await waitFor(`!document.getElementById('survey').hidden`);
  await waitFor(`window.rsiFanState.completed === true`);
  assert.equal(await evaluate('window.rsiFanState.angle'),180);
  const sectors=await evaluate(`Array.from(document.querySelectorAll('#fan-canvas [data-fan-sector]'),node=>node.dataset.fanSector)`);
  assert.deepEqual(sectors,['A','B','C','D','E','F']);
  for(const code of sectors){
    await evaluate(`document.querySelector('[data-fan-pick="${code}"]').click()`);
    assert.equal(await evaluate('window.rsiFanState.selected'),code);
    assert.ok(await evaluate(`document.querySelectorAll('#fan-selected [data-fan-record]').length>0`));
    const dates=await evaluate(`Array.from(document.querySelectorAll('#fan-selected .fan-method-card span'),node=>node.textContent.slice(0,10))`);
    assert.ok(dates.some(date=>date<'2025-01-01')&&dates.some(date=>date>='2025-01-01'),`Fan ${code} needs classics and recent methods`);
  }
  await evaluate(`document.querySelector('#fan-selected [data-fan-record]').click()`);
  assert.equal(await evaluate(`document.getElementById('method-dialog').open`),true);
  await evaluate(`document.getElementById('close-dialog').click();document.getElementById('fan-replay').click()`);
  await waitFor('window.rsiFanState.progress>0.05 && window.rsiFanState.progress<0.2');
  assert.ok(await evaluate(`document.querySelector('[data-fan-sector="F"]').getAttribute('transform')!=='rotate(0 600 650)'`));
  await evaluate(`document.getElementById('fan-play').click()`);
  const paused=await evaluate('window.rsiFanState.progress');
  assert.equal(await evaluate('window.rsiFanState.playing'),false);
  await evaluate(`document.querySelector('#language [data-language="zh"]').click()`);
  assert.equal(await evaluate('window.rsiFanState.progress'),paused);
  await evaluate(`document.getElementById('fan-open').click()`);
  assert.equal(await evaluate('window.rsiFanState.angle'),180);
  await evaluate(`document.getElementById('fan-replay').click();location.hash='methods'`);
  await waitFor('window.rsiFanState.playing === false');
  await page('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate(`location.hash='survey';document.getElementById('fan-replay').click()`);
  assert.equal(await evaluate('window.rsiFanState.completed'),true);
  fs.mkdirSync(path.join(root,'.delivery-check'),{recursive:true});
  for(const [width,height]of [[390,844],[1440,900],[1600,1000],[1920,1080],[2048,1320]]){
    await page('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    assert.ok(await evaluate(`document.documentElement.scrollWidth<=${width}`),`Fan overflow at ${width}`);
    await evaluate(`document.getElementById('rsi-method-fan').scrollIntoView({behavior:'instant',block:'start'})`);
    if(width===390||width===1440||width===2048){
      const shot=await page('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(path.join(root,'.delivery-check',`method-fan-${width}.png`),Buffer.from(shot.data,'base64'));
    }
  }
  assert.deepEqual(browser.exceptions,[]);
});
