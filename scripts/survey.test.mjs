import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {root} from './validate-delivery.mjs';
import {chromePath,connectBrowser} from './browser-test-utils.mjs';

const data=JSON.parse(fs.readFileSync(path.join(root,'data/survey-guide.json'),'utf8'));
const chapter=fs.readFileSync(path.join(root,data.chapter_href),'utf8');
const methodsSection=chapter.split('## 5. 方法矩阵')[1]?.split('## 6.')[0];

test('research synthesis compares mechanisms, assumptions and evidence rather than listing titles',()=>{
  assert.ok((chapter.match(/\p{Script=Han}/gu)??[]).length>=12000);
  assert.ok(methodsSection);
  const rows=methodsSection.match(/^\| [^|\n]+ \[(?:P|S|F)[^\]]+\] \|/gm)??[];
  assert.equal(rows.length,data.evidence_scope.methods_compared);
  for(const topic of ['阶段所有权','结构性递归','有效递归','配对继续实验','负结果','未解决的问题','同起点','反馈协议'])assert.ok(chapter.includes(topic),`Missing survey argument ${topic}`);
  const costSection=chapter.split('### 9.3 ')[1]?.split('### 9.4 ')[0];
  assert.ok(costSection);
  for(const cost of ['数据或任务生成','失败候选','executor','训练','验证','路由','人工审核','恢复'])assert.ok(costSection.includes(cost),`Missing lifecycle cost ${cost}`);
  for(const work of ['Harness²','Evo²','RRSI','OO-Harness'])assert.ok(chapter.includes(work));
  assert.ok(chapter.includes('不是领域标准')&&chapter.includes('没有运行研究代码'));
  assert.ok(chapter.includes('pics/rsi-survey-map-zh.svg'));
});

test('bilingual survey cards and primary framework references are complete',()=>{
  assert.ok(data.cards.length>=8&&data.cards.length<=12);
  assert.equal(new Set(data.cards.map(card=>card.id)).size,data.cards.length);
  assert.ok(data.executive_summary.en.split(/\s+/).length>=180);
  assert.ok(data.executive_summary.zh.length>=150);
  assert.equal(data.sources.length,3);
  for(const card of data.cards){
    for(const language of ['en','zh'])assert.ok(card.title[language]&&card.summary[language]&&card.question[language]);
    assert.equal(card.chapter_href,data.chapter_href);
    assert.ok(card.primary_urls.length&&card.primary_urls.every(url=>url.startsWith('https://')));
    assert.ok(card.families.length&&card.families.every(code=>'ABCDEF'.includes(code)));
  }
  assert.equal(data.evidence_scope.independent_results_reproduced,false);
});

test('local reading receipt covers all three supplied source documents without publishing it',t=>{
  const file=path.join(root,'.local/research/survey-synthesis-20261106/coverage-receipt.json');
  if(!fs.existsSync(file)){t.skip('Full local reading provenance is intentionally not published');return;}
  const receipt=JSON.parse(fs.readFileSync(file,'utf8'));
  assert.equal(receipt.must_not_publish,true);
  assert.equal(receipt.supplied_documents.length,3);
  assert.equal(receipt.supplied_documents.reduce((n,source)=>n+source.line_count,0),4712);
  for(const source of receipt.supplied_documents){
    assert.equal(source.read_in_full,true);
    assert.match(source.sha256,/^[a-f0-9]{64}$/);
    assert.deepEqual(source.verified_coverage_union,[[1,source.line_count]]);
  }
});

test('real Chrome: survey is discoverable, bilingual, responsive and implementation diagrams are directly visible',{timeout:180000},async t=>{
  if(!chromePath()){t.skip('Chrome unavailable; no portal rendering pass claimed');return;}
  const browser=await connectBrowser(t,pathToFileURL(path.join(root,'index.html')).href,'window.atlasReady === true');
  const {evaluate,page,waitFor}=browser;
  assert.ok(await evaluate(`!!document.querySelector('nav [data-view="survey"]')&&!!document.querySelector('.hero-actions a[href="#survey"]')`));
  await evaluate(`location.hash='survey'`);
  await waitFor(`!document.getElementById('survey').hidden`);
  for(const language of ['en','zh']){
    await evaluate(`document.querySelector('#language [data-language="${language}"]').click()`);
    assert.equal(await evaluate(`document.querySelectorAll('#survey-topics [data-survey-topic]').length`),data.cards.length);
    assert.equal(await evaluate(`document.querySelectorAll('#survey-families tbody tr').length`),6);
    assert.ok(await evaluate(`document.getElementById('survey-intro').textContent.includes(${JSON.stringify(data.title[language])})`));
    await waitFor(`document.querySelector('.survey-map img').complete&&document.querySelector('.survey-map img').naturalWidth>0`);
    assert.ok(await evaluate(`document.querySelector('.survey-map img').src.endsWith('rsi-survey-map-${language}.svg')`));
    assert.ok(await evaluate(`Array.from(document.querySelectorAll('#survey-reading-route a'),a=>a.href).some(href=>href.endsWith(${JSON.stringify(data.chapter_href)}))`));
  }
  await evaluate(`location.hash='implementations'`);
  await waitFor(`!document.getElementById('implementations').hidden`);
  assert.equal(await evaluate(`document.querySelectorAll('#implementation-grid .implementation-preview img').length`),6);
  await waitFor(`Array.from(document.querySelectorAll('#implementation-grid .implementation-preview img')).every(img=>img.complete&&img.naturalWidth>0)`);
  const ids=await evaluate(`Array.from(document.querySelectorAll('#implementation-grid [data-implementation]'),node=>node.dataset.implementation)`);
  assert.deepEqual(ids,['genericagent','gepa','sol-pi','hyperagents','rrsi','openrsi']);
  for(const id of ids)assert.ok(await evaluate(`document.querySelector('[data-implementation="${id}"] img').src.endsWith('/pics/implementations/${id}-architecture.svg')`));
  fs.mkdirSync(path.join(root,'.delivery-check'),{recursive:true});
  for(const [width,height]of [[390,844],[1440,900],[2048,1320]]){
    await evaluate(`document.querySelector('#language [data-language="${width<600?'zh':'en'}"]').click()`);
    await page('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    for(const view of ['survey','implementations']){
      await evaluate(`location.hash='${view}';window.scrollTo(0,0)`);
      await waitFor(`!document.getElementById('${view}').hidden`);
      assert.ok(await evaluate(`document.documentElement.scrollWidth<=${width}`),`Portal ${view} overflow at ${width}`);
      await waitFor(`document.getAnimations().filter(animation=>Number.isFinite(animation.effect.getComputedTiming().endTime)).every(animation=>animation.playState!=='running')`);
      const shot=await page('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      fs.writeFileSync(path.join(root,'.delivery-check',`${view}-survey-upgrade-${width}.png`),Buffer.from(shot.data,'base64'));
    }
  }
  for(const language of ['en','zh']){
    await page('Page.navigate',{url:pathToFileURL(path.join(root,`pics/rsi-survey-map-${language}.svg`)).href});
    await waitFor(`!!document.querySelector('svg')`);
    const overflow=await evaluate(`(()=>{const svg=document.querySelector('svg'),v=svg.viewBox.baseVal;return Array.from(svg.querySelectorAll('text')).filter(text=>{const b=text.getBBox();return b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height;}).map(text=>text.textContent);})()`);
    assert.deepEqual(overflow,[],`Survey coordinate map ${language} text overflow`);
  }
  assert.deepEqual(browser.exceptions,[]);
});
