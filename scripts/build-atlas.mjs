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
  assert.ok(method.date <= verification.cutoff, `Future paper: ${method.id}`);
  assert.ok(method.families?.length && method.families.every(code => Object.hasOwn(base.families, code)), `Missing taxonomy: ${method.id}`);
  assert.ok(new URL(method.primary_url).protocol === 'https:');
  method.in_recent_window = method.date >= verification.window_start && method.date <= verification.cutoff;
  method.date_basis = 'arxiv_v1_or_primary_first_public_evidence_not_revision_or_project_date';
  method.supervision_verification = checked.get(method.id)?.level ?? 'inherited_evidence_not_newly_fulltext_verified';
  if (checked.has(method.id)) assert.equal(method.date, checked.get(method.id).date, `Primary date mismatch: ${method.id}`);
}
const payload = {
  cutoff: verification.cutoff, window_start: verification.window_start,
  taxonomy_semantics: 'author_operational_categories_not_field_standard_or_certification',
  relationship_semantics: 'taxonomy_chronology_and_explicit_feedback_are_distinct',
  families: base.families,
  methods: [...methods.values()].sort((a, b) => a.date.localeCompare(b.date) || a.method.localeCompare(b.method)),
  dynamics, verification,
  family_architectures: familyArchitectures.families,
  paper_figures: paperFigures.figures,
  paper_figure_statuses: paperFigures.papers,
};
const json = JSON.stringify(payload, null, 2) + '\n';
fs.writeFileSync(path.join(root, 'data/atlas-methods.json'), json);
const embedded = JSON.stringify(payload).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
const template = fs.readFileSync(path.join(root, 'scripts/viewer.template.html'), 'utf8');
assert.equal(template.split('__ATLAS_DATA__').length, 2, 'Template needs exactly one data placeholder');
fs.writeFileSync(path.join(root, 'index.html'), template.replace('__ATLAS_DATA__', embedded));
const csvCell = value => `"${String(value).replaceAll('"', '""')}"`;
const fields = ['method', 'date', 'kind', 'families', 'mechanism', 'primary_url', 'chapter', 'reading_scope', 'supervision_verification'];
const csv = [fields.map(csvCell).join(','), ...payload.methods.map(method => fields.map(field => csvCell(Array.isArray(method[field]) ? method[field].join(';') : method[field])).join(','))].join('\r\n');
fs.writeFileSync(path.join(root, 'data/atlas-methods.csv'), '\ufeff' + csv + '\r\n');
const md = value => String(value).replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');
const kinds = { method: '方法', benchmark: '基准/环境', framework: '框架', theory: '理论/议程' };
execFileSync(process.execPath,[path.join(root,'scripts/build-family-diagrams.mjs')],{cwd:root,stdio:'inherit'});
const rows = payload.methods.map(method => `| ${method.date} | [${md(method.method)}](${method.primary_url}) | ${method.families.join(', ')} | ${kinds[method.kind]} | ${md(method.mechanism)} | [详解](${method.chapter.replace('docs/zh/', '')}) |`);
fs.writeFileSync(path.join(root, 'docs/zh/03_Method_Map_and_Timeline.md'), `# RSI 方法时间索引与机制地图

[技术全景](01_RSI_Technical_Panorama.md) · [算法手册](04_Algorithm_Handbook.md) · [最新研究](06_Latest_Year_Research.md) · [动态图](../../index.html#timeline)

截至 ${payload.cutoff}，精选 ${payload.methods.length} 个方法与支撑研究，其中 ${payload.methods.filter(method => method.in_recent_window).length} 个首发于 ${payload.window_start}—${payload.cutoff}。这是代表性选择，不是穷尽或全部全文精读声明。日期以原始首发证据为准，修订与项目公告不移入新首发节点。

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
