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
    assert.ok(family.nodes.length>=7&&family.nodes.length<=10);
    assert.ok(family.archetype&&family.diagram.kind);
    assert.equal(new Set(family.nodes.map(node=>node.id)).size,family.nodes.length);
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
      if(kind==='architecture'){
        assert.equal((svg.match(/class="architecture-node"/g)??[]).length,family.nodes.length);
        assert.equal((svg.match(/data-from=/g)??[]).length,family.diagram.edges.length);
        assert.ok(svg.includes(family.diagram.kind));
      }
    }
  }
});
test('family architectures differ in graph topology, layout and explanatory mechanism',()=>{
  assert.equal(new Set(families.map(family=>family.diagram.kind)).size,6);
  assert.equal(new Set(families.map(family=>family.archetype)).size,6);
  const degree=family=>family.nodes.map(node=>[
    family.diagram.edges.filter(edge=>edge.to===node.id).length,
    family.diagram.edges.filter(edge=>edge.from===node.id).length,
  ].join(':')).sort().join(',');
  assert.equal(new Set(families.map(degree)).size,6,'Renaming the same loop is not a distinct architecture');
  assert.equal(new Set(families.map(family=>JSON.stringify(family.nodes.map(node=>node.box)))).size,6);
  assert.equal(families.find(family=>family.id==='b').nodes.filter(node=>node.shape==='database').length,2);
  assert.ok(families.find(family=>family.id==='e').diagram.edges.some(edge=>edge.optional));
  assert.ok(families.find(family=>family.id==='f').nodes.some(node=>node.id==='handoff'));
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
test('canonical chapters resolve the formerly missing family-e image without an external mirror',()=>{
  const chapterRoot=path.join(root,'docs/zh/chapters');
  const evaluation=fs.readFileSync(path.join(chapterRoot,'04_Meta_RSI_Evaluation_and_Safety.md'),'utf8');
  const reference=evaluation.match(/!\[[^\]]*\]\(([^)]+family-e-flow\.svg)\)/);
  assert.ok(reference,'The evaluation family must retain its visible representative flow');
  assert.equal(path.resolve(chapterRoot,reference[1]),path.join(root,'pics/family-e-flow.svg'));
  const files=fs.readdirSync(chapterRoot).filter(name=>name.endsWith('.md')).map(name=>path.join(chapterRoot,name));
  files.push(path.join(root,'docs/zh/08_Family_Architectures.md'),path.join(root,'docs/zh/09_Paper_Figures.md'));
  for(const file of files){
    const text=fs.readFileSync(file,'utf8');
    for(const match of text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)){
      if(/^https?:/.test(match[1]))continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file),decodeURIComponent(match[1]))),`Missing canonical image ${path.basename(file)}: ${match[1]}`);
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
        assert.equal(await evaluate(`document.querySelectorAll('#architecture-frame [data-node]').length`),family.nodes.length);
        await evaluate(`document.querySelector('#architecture-frame [data-node="${family.nodes.length-1}"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))`);
        const selected=family.nodes.at(-1),detail=await evaluate(`document.getElementById('node-detail').textContent`);
        assert.ok(detail.includes(selected.label));
        for(const note of selected.detail)assert.ok(detail.includes(note));
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
          if(kind==='architecture'&&width===1440){
            const collisions=await evaluate(`(()=>{
              const svg=document.querySelector('#architecture-frame svg'),nodes=${JSON.stringify(family.nodes)};
              const hits=[];
              for(const edge of svg.querySelectorAll('.edge[data-from]')){
                const length=edge.getTotalLength();
                for(let at=4;at<length;at+=4){
                  const p=edge.getPointAtLength(at);
                  for(const node of nodes){
                    if(node.id===edge.dataset.from||node.id===edge.dataset.to)continue;
                    const[x,y,w,h]=node.box;
                    if(p.x>x+2&&p.x<x+w-2&&p.y>y+2&&p.y<y+h-2){hits.push({edge:edge.dataset.from+'→'+edge.dataset.to,node:node.id});at=length;break;}
                  }
                  for(const text of svg.querySelectorAll('.architecture-region text')){
                    const b=text.getBBox();if(p.x>b.x&&p.x<b.x+b.width&&p.y>b.y&&p.y<b.y+b.height){hits.push({edge:edge.dataset.from+'→'+edge.dataset.to,region:text.textContent});at=length;break;}
                  }
                }
              }
              for(const text of svg.querySelectorAll('.edge-caption text')){
                const b=text.getBBox();
                for(const node of nodes){const[x,y,w,h]=node.box;if(b.x<x+w&&b.x+b.width>x&&b.y<y+h&&b.y+b.height>y)hits.push({label:text.textContent,node:node.id});}
              }
              for(const group of svg.querySelectorAll('[data-node]')){
                const node=nodes[Number(group.dataset.node)],[x,y,w,h]=node.box;
                for(const text of group.querySelectorAll('text')){const b=text.getBBox();if(b.x<x||b.x+b.width>x+w||b.y<y||b.y+b.height>y+h)hits.push({text:text.textContent,node:node.id});}
              }
              return hits;
            })()`);
            assert.deepEqual(collisions,[],`Family ${family.id} paths/labels obscure unrelated components`);
          }
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
