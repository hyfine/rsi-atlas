import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {root,publicationFiles} from './validate-delivery.mjs';
import {validateEngineering,buildEngineeringGuide} from './build-engineering-guide.mjs';
import {chromePath,connectBrowser} from './browser-test-utils.mjs';

const data=JSON.parse(fs.readFileSync(path.join(root,'data/engineering-projects.json'),'utf8'));
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

test('engineering data retains every included and excluded workbook row without publishing the spreadsheet',()=>{
  validateEngineering(data);
  assert.equal(data.projects.length,147);
  assert.equal(data.excluded.length,44);
  assert.equal(data.categories.length,10);
  assert.equal(data.source.workbook_star_total,704898);
  assert.equal(data.source.workbook_active_count,54);
  assert.equal(data.source.sheet_count,14);
  assert.equal(data.source.raw_file_published,false);
  assert.match(data.source.sha256,/^[a-f0-9]{64}$/);
  assert.deepEqual(data.projects.map(project=>project.source.row).sort((a,b)=>a-b),Array.from({length:147},(_,i)=>i+3));
  assert.deepEqual(data.excluded.map(project=>project.source.row).sort((a,b)=>a-b),Array.from({length:44},(_,i)=>i+3));
  assert.ok(publicationFiles().every(file=>!file.endsWith('.xlsx')));
  assert.equal(data.projects.filter(project=>project.license_zh==='未声明').length,15);
  for(const name of ['microsoft/RD-Agent','algorithmicsuperintelligence/openevolve'])assert.equal(data.projects.find(project=>project.repository===name).forks,null,'Summary-cache zero must not replace an unknown source value');
  for(const project of data.projects){
    assert.ok(project.summary_en.split(/\s+/).length>=15);
    assert.ok(project.mechanism_zh&&project.source.category_sheet&&project.source.category_row>=3);
    assert.equal(project.evidence,'workbook_summary_not_new_source_audit');
  }
});

test('engineering guide and composition chart are complete and deterministic',()=>{
  const names=['docs/zh/13_Open_Source_Engineering.md','pics/engineering-ecosystem.svg'];
  const before=names.map(name=>digest(fs.readFileSync(path.join(root,name))));
  buildEngineeringGuide(data);
  assert.deepEqual(names.map(name=>digest(fs.readFileSync(path.join(root,name)))),before);
  const text=fs.readFileSync(path.join(root,names[0]),'utf8');
  assert.equal((text.match(/^<details>/gm)??[]).length,data.projects.length);
  for(const summary of text.matchAll(/<summary>([\s\S]*?)<\/summary>/g))assert.ok(!/\\[_*`]/.test(summary[1]),'HTML summary text must not contain literal Markdown escape slashes');
  for(const project of [...data.projects,...data.excluded])assert.ok(text.includes(project.url),`Missing source URL ${project.repository}`);
  assert.ok(text.includes('不提交原 Excel 文件')&&text.includes('不是本次'));
  assert.ok(text.includes('近似')&&text.includes('未声明')&&text.includes('相对'));
});

test('real Chrome: engineering cards preserve actual counts, source fields, search, filters, pagination and mobile containment',{timeout:180000},async t=>{
  if(!chromePath()){t.skip('Chrome unavailable; no engineering UI rendering pass claimed');return;}
  const browser=await connectBrowser(t,pathToFileURL(path.join(root,'index.html')).href+'#implementations','window.atlasReady === true');
  const {evaluate,page,waitFor}=browser;
  const change=(id,value,event='change')=>evaluate(`(()=>{const e=document.getElementById(${JSON.stringify(id)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));})()`);
  const matching=()=>evaluate(`Number(document.getElementById('engineering-projects').dataset.matchCount)`);
  const cards=()=>evaluate(`Array.from(document.querySelectorAll('[data-engineering-project]'),node=>node.dataset.engineeringProject)`);
  assert.equal(await matching(),147);
  assert.ok(await evaluate(`document.getElementById('engineering-shortcut').textContent.includes('147')`));
  await evaluate(`document.getElementById('engineering-jump').click()`);
  assert.ok(await evaluate(`document.getElementById('engineering-catalog').getBoundingClientRect().top<200`));
  assert.equal((await cards()).length,18);
  assert.equal(await evaluate(`document.querySelectorAll('[data-engineering-category]').length`),10);
  assert.equal(await evaluate(`document.querySelectorAll('#engineering-excluded li').length`),44);
  for(const category of data.categories){
    await change('engineering-category',category.id);
    assert.equal(await matching(),data.projects.filter(project=>project.category_id===category.id).length);
  }
  await change('engineering-category','');
  await change('engineering-activity','active');
  assert.equal(await matching(),54);
  await change('engineering-activity','unknown');
  assert.equal(await matching(),data.projects.filter(project=>project.activity==='unknown').length);
  await change('engineering-activity','');
  await change('engineering-search','google-research/harness2','input');
  assert.equal(await matching(),1);
  assert.deepEqual(await cards(),['google-research/harness2']);
  const project=data.projects.find(project=>project.id==='google-research/harness2');
  const text=await evaluate(`document.querySelector('[data-engineering-project]').textContent`);
  assert.ok(text.includes(project.summary_en)&&text.includes(project.mechanism_zh));
  assert.ok(text.includes(project.target_zh)&&text.includes(project.license_zh));
  await evaluate(`document.querySelector('#language [data-language="zh"]').click()`);
  assert.equal(await matching(),1);
  assert.ok(await evaluate(`document.querySelector('[data-engineering-project]').textContent.includes(${JSON.stringify(project.summary_zh)})`));
  await change('engineering-search','does-not-match-any-project','input');
  assert.equal(await matching(),0);
  assert.ok(await evaluate(`document.getElementById('engineering-more').hidden`));
  await change('engineering-search','','input');
  await change('engineering-sort','name');
  while(await evaluate(`!document.getElementById('engineering-more').hidden`))await evaluate(`document.getElementById('engineering-more').click()`);
  assert.deepEqual(await cards(),data.projects.map(project=>project.id).sort((a,b)=>a.localeCompare(b)));
  await change('engineering-sort','stars');
  assert.equal((await cards()).length,18);
  fs.mkdirSync(path.join(root,'.delivery-check'),{recursive:true});
  for(const [width,height]of [[390,844],[1440,900],[2048,1320]]){
    await page('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});
    await evaluate(`document.querySelector('#language [data-language="${width<600?'zh':'en'}"]').click();document.getElementById('engineering-catalog').scrollIntoView({behavior:'instant',block:'start'})`);
    assert.ok(await evaluate(`document.documentElement.scrollWidth<=${width}`),`Engineering card overflow at ${width}`);
    await waitFor(`document.getAnimations().filter(animation=>Number.isFinite(animation.effect.getComputedTiming().endTime)).every(animation=>animation.playState!=='running')`);
    const shot=await page('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    fs.writeFileSync(path.join(root,'.delivery-check',`engineering-${width}.png`),Buffer.from(shot.data,'base64'));
  }
  await page('Page.navigate',{url:pathToFileURL(path.join(root,'pics/engineering-ecosystem.svg')).href});
  await waitFor(`!!document.querySelector('svg')`);
  assert.deepEqual(await evaluate(`(()=>{const svg=document.querySelector('svg'),v=svg.viewBox.baseVal;return Array.from(svg.querySelectorAll('text')).filter(text=>{const b=text.getBBox();return b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height;}).map(text=>text.textContent);})()`),[]);
  assert.deepEqual(browser.exceptions,[]);
});
