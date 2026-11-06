import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
execFileSync(process.execPath,[path.join(root,'scripts/build-repo-deepdives.mjs')],{cwd:root,stdio:'inherit'});
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const base = read('data/method-map.json');
const notes = read('data/atlas-source-notes.json');
const verification = read('data/primary-verification.json');
const collection = read('data/collection.json');
const updates = read('data/research-updates.json');
const institutionData = read('data/institutions.json');
assert.ok(Array.isArray(institutionData.attribution_reviews),'Missing attribution review registry');
const attributionReviews=new Map(institutionData.attribution_reviews.map(review=>[review.record_id,review]));
assert.equal(attributionReviews.size,institutionData.attribution_reviews.length,'Duplicate attribution review');
const translations = read('data/ui-translations.json');
const survey = read('data/survey-guide.json');
const engineeringProjects = read('data/engineering-projects.json');
const {validateEngineering,buildEngineeringGuide}=await import('./build-engineering-guide.mjs');
validateEngineering(engineeringProjects);
assert.ok(survey.chapter_href&&survey.executive_summary.en&&survey.executive_summary.zh);
assert.ok(survey.cards.length>=8&&survey.cards.length<=12);
assert.equal(new Set(survey.cards.map(card=>card.id)).size,survey.cards.length);
const dynamics = read('data/dynamic-scenes.json');
const familyArchitectures = read('data/family-architectures.json');
const paperFigures = read('data/paper-figures.json');
const checked = new Map(verification.papers.map(paper => [paper.id, paper]));
const methods = new Map(base.methods.map(method => [method.id, {
  ...method, kind: method.id === 'arxiv:cs/0309048' ? 'theory' : method.kind ?? 'method',
  mechanism: method.significance_and_limits,
  limitations: ['代表作索引未声明全文复核；具体方法与实验见专题。'],
  chapter: 'docs/zh/04_Algorithm_Handbook.md',
  reading_scope: '代表作元数据与方法摘要；未声明全文精读',
}]));
for (const note of notes.methods) {
  const existing = methods.get(note.id);
  methods.set(note.id, { ...existing, ...note });
}
for(const update of updates.records){
  const existing=methods.get(update.id);
  methods.set(update.id,{...existing,...update});
}
for(const review of attributionReviews.values()){
  assert.ok(methods.has(review.record_id),`Attribution review has no method: ${review.record_id}`);
  assert.ok(['primary_verified','publisher_verified','unverified'].includes(review.affiliation_status),`Invalid affiliation status: ${review.record_id}`);
  assert.ok(typeof review.reading_scope==='string'&&review.reading_scope.trim(),`Missing affiliation review scope: ${review.record_id}`);
}
assert.equal(base.source_overview_ids.length,35,'Preserve the complete original overview mapping');
for(const id of base.source_overview_ids)assert.ok(methods.has(id),`Original overview work lost during merge: ${id}`);
let normalizedLimitations=0;
for (const method of methods.values()) {
  if(typeof method.limitations==='string'){
    assert.ok(method.limitations.trim(),`Empty limitations: ${method.id}`);
    method.limitations=[method.limitations];
    normalizedLimitations++;
  }
  assert.ok(Array.isArray(method.limitations)&&method.limitations.length&&method.limitations.every(value=>typeof value==='string'&&value.trim()),`Invalid limitations list: ${method.id}`);
  assert.ok(method.id && method.method && method.title, 'Missing method identity');
  assert.match(method.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Date(`${method.date}T00:00:00Z`).toISOString().slice(0, 10), method.date);
  assert.ok(method.date <= collection.as_of, `Future record: ${method.id}`);
  assert.ok(method.families?.length && method.families.every(code => Object.hasOwn(base.families, code)), `Missing taxonomy: ${method.id}`);
  assert.ok(new URL(method.primary_url).protocol === 'https:');
  method.in_recent_window = method.date >= collection.recent_window_start && method.date <= collection.as_of;
  method.date_basis ??= 'arxiv_v1_or_primary_first_public_evidence_not_revision_or_project_date';
  method.supervision_verification ??= checked.get(method.id)?.level ?? 'inherited_evidence_not_newly_fulltext_verified';
  method.institution_links=institutionData.assignments.filter(link=>link.record_id===method.id);
  method.institution_ids=[...new Set(method.institution_links.map(link=>link.institution_id))];
  const attributionReview=attributionReviews.get(method.id);
  method.affiliation_status??=attributionReview?.affiliation_status??(method.institution_ids.length?'primary_verified':'unverified');
  if(attributionReview)method.affiliation_reading_scope=attributionReview.reading_scope;
  method.revision_date=method.version_date&&method.version_date!==method.date?method.version_date:null;
  if (checked.has(method.id)) assert.equal(method.date, checked.get(method.id).date, `Primary date mismatch: ${method.id}`);
}
const payload = {
  cutoff: collection.as_of, window_start: collection.recent_window_start,
  taxonomy_semantics: 'author_operational_categories_not_field_standard_or_certification',
  relationship_semantics: 'taxonomy_chronology_and_explicit_feedback_are_distinct',
  families: base.families,
  source_overview_ids: base.source_overview_ids,
  methods: [...methods.values()].sort((a, b) => a.date.localeCompare(b.date) || a.method.localeCompare(b.method)),
  dynamics, verification,
  family_architectures: familyArchitectures.families,
  paper_figures: paperFigures.figures,
  paper_figure_statuses: paperFigures.papers,
  institutions: institutionData.institutions,
  ui_translations: translations,
  focus_ids: updates.focus_ids,
  unresolved_sources: updates.unresolved_sources,
  survey,
  engineering_projects: engineeringProjects,
};
const priorFigureStatuses=new Map(paperFigures.papers.map(paper=>[paper.id,paper]));
paperFigures.papers=payload.methods.map(method=>({...priorFigureStatuses.get(method.id),id:method.id,method:method.method,primary_url:method.primary_url,status:priorFigureStatuses.get(method.id)?.status??'link_only_not_reviewed'}));
fs.writeFileSync(path.join(root,'data/paper-figures.json'),JSON.stringify(paperFigures,null,2)+'\n');
payload.paper_figure_statuses=paperFigures.papers;
const json = JSON.stringify(payload, null, 2) + '\n';
fs.writeFileSync(path.join(root, 'data/atlas-methods.json'), json);
const embedded = JSON.stringify(payload).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
const template = fs.readFileSync(path.join(root, 'scripts/viewer.template.html'), 'utf8');
assert.equal(template.split('__ATLAS_DATA__').length, 2, 'Template needs exactly one data placeholder');
assert.equal(template.split('__ENGINEERING_MARKUP__').length,2);
assert.equal(template.split('__ENGINEERING_SCRIPT__').length,2);
const viewer=template
  .replace('__ATLAS_DATA__',()=>embedded)
  .replace('__ENGINEERING_MARKUP__',()=>fs.readFileSync(path.join(root,'scripts/engineering-panel.html'),'utf8'))
  .replace('__ENGINEERING_SCRIPT__',()=>fs.readFileSync(path.join(root,'scripts/engineering-panel.js'),'utf8'));
fs.writeFileSync(path.join(root, 'index.html'),viewer);
const csvCell = value => `"${String(value).replaceAll('"', '""')}"`;
const fields = ['id','method','title','date','first_public_date','date_basis','revision_date','latest_version','kind','families','institution_ids','institution_names','affiliation_status','date_warning','date_warning_en','date_warning_zh','mechanism','primary_url','chapter','reading_scope','supervision_verification'];
const institutionNames=new Map(institutionData.institutions.map(entity=>[entity.id,entity.name]));
const csv = [fields.map(csvCell).join(','), ...payload.methods.map(method => {
  const record={...method,institution_names:method.institution_ids.map(id=>institutionNames.get(id)),date_warning_en:method.date_warning?.en,date_warning_zh:method.date_warning?.zh};
  return fields.map(field => {
    const value=record[field];
    return csvCell(Array.isArray(value)?value.join(';'):value&&typeof value==='object'?JSON.stringify(value):value??'');
  }).join(',');
})].join('\r\n');
fs.writeFileSync(path.join(root, 'data/atlas-methods.csv'), '\ufeff' + csv + '\r\n');
const baseFields=['id','method','title','date','families','significance_and_limits','primary_url','date_source','local_pdf_retained','evidence','date_basis','kind','full_text_review_claimed'];
const baseCsv=[baseFields.map(csvCell).join(','),...base.methods.map(method=>baseFields.map(field=>{
  const value=method[field];
  return csvCell(value&&typeof value==='object'?JSON.stringify(value):value??'');
}).join(','))].join('\r\n');
fs.writeFileSync(path.join(root,'data/method-map.csv'),'\ufeff'+baseCsv+'\r\n');
const md = value => String(value).replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');
const kinds = { method: '方法', benchmark: '基准/环境', framework: '框架', theory: '理论/议程', survey:'综述',boundary:'边界对照',announcement:'公司发布' };
execFileSync(process.execPath,[path.join(root,'scripts/build-family-diagrams.mjs')],{cwd:root,stdio:'inherit'});
const rows = payload.methods.map(method => `| ${method.date} | [${md(method.method)}](${method.primary_url}) | ${method.families.join(', ')} | ${kinds[method.kind]} | ${md(method.mechanism)} | [详解](${method.chapter.replace('docs/zh/', '')}) |`);
fs.writeFileSync(path.join(root, 'docs/zh/03_Method_Map_and_Timeline.md'), `# RSI 方法时间索引与机制地图

[技术全景](01_RSI_Technical_Panorama.md) · [算法手册](04_Algorithm_Handbook.md) · [最新研究](06_Latest_Year_Research.md) · [动态图](../../index.html#timeline)

截至 ${payload.cutoff}，精选 ${payload.methods.length} 条研究与相关发布记录，其中 ${payload.methods.filter(method => method.in_recent_window).length} 条日期落在 ${payload.window_start}—${payload.cutoff}。论文按首发，修订另列；公司发布使用显式标记的网页显示日期，冲突保留，不冒充已核验首发。这是代表性选择，不是穷尽或全部全文精读声明。

![分类关系，不是技术继承](../../pics/rsi-family.svg)

![三条并行路线；等宽阶段而非真实时间比例尺](../../pics/rsi-timeline.svg)

旧静态时间图只显示里程碑；[动态时间线](../../index.html#timeline)包含下表全部精选节点，并可按对象与近期窗口筛选。

家族：A 模型与训练；B 数据/任务/环境；C 记忆与技能；D Harness；E 评价；F 研究与改进器。基准、框架和理论不冒充算法。

| 首发 | 方法与原文 | 家族 | 类型 | 机制与边界 | 技术解释 |
|---|---|---|---|---|---|
${rows.join('\n')}

## 证据与导出

[完整方法卡与限制](../../data/atlas-methods.json) · [CSV](../../data/atlas-methods.csv) · [本次直接核验](../../data/primary-verification.json) · [继承专题阅读证据](research/)

正文阅读记录属于此前文档作者的版本化工作，不表示本次监督再次全文读完。日期/摘要、方法章节、图像审阅与独立复现是不同证据层级。作者结果不等于本项目测量，分类连线不等于继承，重复搜索也不等于元递归。
`);
console.log(JSON.stringify({
  methods: payload.methods.length,
  recent: payload.methods.filter(method => method.in_recent_window).length,
  direct_primary_checks: checked.size,
  normalized_limitations_records: normalizedLimitations,
  dynamic_scenes: dynamics.scenes.length,
  network_requests: 0,
}));
const {buildResearchDocs}=await import('./build-research-docs.mjs');
console.log(JSON.stringify(buildResearchDocs(payload)));
const {buildProjectPresentation}=await import('./build-project-presentation.mjs');
console.log(JSON.stringify(buildProjectPresentation(payload)));
console.log(JSON.stringify(buildEngineeringGuide(engineeringProjects)));
