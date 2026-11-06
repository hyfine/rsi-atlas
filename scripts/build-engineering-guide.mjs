import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const root=fileURLToPath(new URL('../',import.meta.url));
const md=value=>String(value??'未记录').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('$','&#36;').replace(/([\\`*_])/g,'\\$1').replaceAll('|','\\|').replace(/[\r\n]+/g,' ');
const xml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));

export function validateEngineering(data){
  assert.equal(data.schema_version,1);
  assert.equal(data.categories.length,10);
  assert.equal(new Set(data.categories.map(category=>category.id)).size,data.categories.length);
  assert.equal(new Set(data.projects.map(project=>project.id)).size,data.projects.length);
  assert.equal(new Set(data.projects.map(project=>project.repository.toLowerCase())).size,data.projects.length);
  assert.equal(data.projects.length,data.source.included_rows);
  assert.equal(data.excluded.length,data.source.excluded_rows);
  const categories=new Set(data.categories.map(category=>category.id));
  for(const category of data.categories){
    assert.ok(category.name.en&&category.name.zh&&category.purpose.en&&category.purpose.zh);
    assert.ok(category.caveat.en&&category.caveat.zh&&category.families.every(id=>'ABCDEF'.includes(id)));
  }
  for(const project of data.projects){
    assert.ok(categories.has(project.category_id));
    assert.match(project.repository,/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
    assert.equal(project.url,'https://github.com/'+project.repository);
    assert.ok(Number.isInteger(project.stars)&&project.stars>=0);
    assert.ok(project.forks===null||Number.isInteger(project.forks)&&project.forks>=0);
    assert.ok(project.summary_en&&project.summary_zh&&project.mechanism_zh&&project.target_zh);
    assert.ok(project.caveat_zh&&project.source.row>=3&&project.source.sheet==='全部项目');
    assert.equal(project.evidence,'workbook_summary_not_new_source_audit');
    assert.ok(['active','moderate','low','unknown'].includes(project.activity));
    if(project.deep_dive_id)assert.ok(fs.existsSync(path.join(root,`docs/repo_deepdive/cases/${project.deep_dive_id}.md`)));
  }
  for(const item of data.excluded){
    assert.equal(item.url,'https://github.com/'+item.repository);
    assert.ok(item.reason_zh&&item.source.row>=3);
  }
  assert.equal(data.projects.reduce((sum,project)=>sum+project.stars,0),data.source.workbook_star_total);
  assert.equal(data.projects.filter(project=>project.activity==='active').length,data.source.workbook_active_count);
}

export function buildEngineeringGuide(data){
  validateEngineering(data);
  const counts=data.categories.map(category=>({...category,count:data.projects.filter(project=>project.category_id===category.id).length}));
  const maximum=Math.max(...counts.map(category=>category.count));
  const chart=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 660" role="img" aria-labelledby="engineering-chart-title"><title id="engineering-chart-title">工作簿工程分类：项目数量，不是能力或质量排名</title><rect width="1200" height="660" rx="22" fill="#0b1727"/><g font-family="system-ui,sans-serif"><text x="35" y="48" fill="#edf5ff" font-size="27" font-weight="700">${data.projects.length} 个工程入口 · ${data.categories.length} 类改进目标</text><text x="35" y="83" fill="#b5cadc" font-size="15">保留工作簿的单一主分类；A–F 是额外的分析映射，不能相加当作项目数。</text>${counts.map((category,index)=>{const y=115+index*45,width=category.count/maximum*660;return `<text x="35" y="${y+24}" fill="#d9e9f5" font-size="17">${xml(category.name.zh)}</text><rect x="360" y="${y}" width="${width}" height="30" rx="7" fill="${['#6bd9c7','#8fb8f7','#b09beb','#73bec9','#dfa979'][index%5]}"/><text x="${375+width}" y="${y+24}" fill="#edf5ff" font-size="17">${category.count}</text>`;}).join('')}<text x="35" y="607" fill="#b5cadc" font-size="14">${data.source.collected_on} 工作簿快照 · ${data.projects.length} 个收录入口 · ${data.excluded.length} 个排除候选 · 未重新审计全部源码</text><text x="35" y="635" fill="#8ea8bd" font-size="13">图表仅表达收藏的组成；stars 为页面近似值，关注度、许可和实现主张不能替代递归有效性证据。</text></g></svg>\n`;
  fs.writeFileSync(path.join(root,'pics/engineering-ecosystem.svg'),chart);
  let text=`# RSI 开源工程导航：从工作簿到可比较的实现入口

[首页](../../README.md) · [工程交互导航](../../index.html#implementations) · [固定源码深读](../repo_deepdive/README.md) · [技术研究综合](12_RSI_Research_Synthesis.md)

本章整理用户提供的工程汇总工作簿，**不提交原 Excel 文件**。保留所有 ${data.projects.length} 个收录项目、${data.excluded.length} 个排除候选及其理由，并把链接公式转换为可点击的仓库入口。日期、stars、forks、许可证、活跃度、实现完整度与机构字段均是工作簿的记录，**不是本次对全部项目重新完成的源码审计、法律许可核验或复现实验**。

## 1. 先看收录边界

- 采集日期：${data.source.collected_on}（工作簿标注）；不是所有仓库被同一天重新测量。
- 工作簿说明：核心目标须涉及改进闭环或 RSI 评测/安全；要求实现代码、配置、训练流程或脚本，排除纯论文、成果展示、清单及未完整实现者。
- 影响力门槛：工作簿采用 Star ≥ 50，并对其认定的大型科技公司官方实现豁免。机构和“官方”属性在本章仅按工作簿记录，不作为作者雇佣、官方认证或机构认可的新结论。
- 各项目只进入一个主分类。A–F 对象家族是额外的编辑性映射，不等价于工作簿的十类，也不是自治等级。
- Stars ≥ 1000 可能由页面的 \`x.xk\` 近似展开；fork 缺失保持“未记录”。最近提交的相对时间锚定采集日，不能据此推导精确提交日期。
- 摘要公式可能把空单元格显示为零：RD-Agent 与 OpenEvolve 的 Fork 在项目主表为空，本数据保留未知值，不把摘要缓存的 0 当作已知零计数。
- 不同工程的名称、README 自进化宣传、代码存在及递归有效性是不同证据。许可证“未声明”不表示允许任意使用；非标准许可需阅读具体条款。

| 工作簿核对项 | 数量 / 口径 |
|---|---|
| 收录的唯一仓库入口 | ${data.projects.length} |
| 十类工程目的 | ${data.categories.length} |
| 被记录为近一月活跃 | ${data.source.workbook_active_count} |
| 排除候选 | ${data.excluded.length} |
| Stars 近似值之和 | ${data.source.workbook_star_total.toLocaleString('en-US')}（不是独立用户数或能力指标） |

![工程类别组成，不是能力排名](../../pics/engineering-ecosystem.svg)

## 2. 按改进目标选路，而不是只看 Star

| 工作簿主分类 | 适合阅读的问题 | A–F 编辑性映射 | 最需要保留的边界 |
|---|---|---|---|
${data.categories.map(category=>`| ${md(category.name.zh)} | ${md(category.read_guide.zh)} | ${category.families.join(' / ')} | ${md(category.caveat.zh)} |`).join('\n')}

先选择可用的反馈，再选择可修改的资产。参数训练、提示优化、运行时编辑、记忆积累、程序发现、科研自动化以及评价/安全支撑，不能用同一条“自我改进”标签替代实现分析。既有六个固定源码案例保留独立入口；这里只因名称匹配而提供链接，不把其核验范围扩展到同类别的其他工程。

## 3. 全部工程，分组呈现
`;
  for(const category of data.categories){
    const projects=data.projects.filter(project=>project.category_id===category.id).sort((a,b)=>b.stars-a.stars||a.repository.localeCompare(b.repository));
    text+=`\n### ${category.name.zh}（${projects.length}）\n\n${category.purpose.zh}\n\n**阅读重点：**${category.read_guide.zh}\n\n**证据限制：**${category.caveat.zh}\n\n`;
    for(const project of projects){
      text+=`<details>\n<summary><strong>${xml(project.repository)}</strong> · ★ ${project.stars.toLocaleString('en-US')} · ${xml(project.license_zh)} · ${xml(project.activity_zh)}</summary>\n\n[仓库](${project.url})${project.deep_dive_id?` · [固定版本源码深读](../repo_deepdive/cases/${project.deep_dive_id}.md)`:''}\n\n${md(project.summary_zh)}\n\n| 比较项 | 工作簿记录 |\n|---|---|\n| 改进对象 | ${md(project.target_zh)} |\n| 核心机制 | ${md(project.mechanism_zh)} |\n| 实现形态 / 完整度主张 | ${md(project.implementation_zh)} |\n| 机构 / 作者（未重新核验） | ${md(project.attribution_zh)} |\n| 技术栈 | ${md(project.stack_zh)} |\n| 论文 / 出处 | ${md(project.reference_zh)} |\n| Stars / Forks | ${project.stars.toLocaleString('en-US')} / ${project.forks===null?'未记录':project.forks.toLocaleString('en-US')} |\n| 许可证记录 | ${md(project.license_zh)} |\n| 最近提交 / 活跃度 | ${md(project.last_commit_zh)} / ${md(project.activity_zh)}（相对采集日） |\n| 提交数 | ${project.commits===null?'未记录':project.commits.toLocaleString('en-US')} |\n| 工作簿定位 | ${md(project.source.sheet)} 第 ${project.source.row} 行 |\n\n**编辑性提醒：**${md(project.caveat_zh)}\n\n</details>\n\n`;
    }
  }
  text+=`\n## 4. 排除候选不是实现案例\n\n这些是工作簿的排除判断，可能随项目公开程度、维护状态或仓库重命名而变化；没有在本次重新断言仓库当前仍符合这些理由。保留原入口与理由便于复核，不把它们补入收录数量。\n\n| 候选 | 工作簿 Star | 排除类别 | 原记录理由 |\n|---|---:|---|---|\n${data.excluded.map(item=>`| [${md(item.repository)}](${item.url}) | ${item.stars===null?'未记录':item.stars.toLocaleString('en-US')} | ${md(item.category_zh)} | ${md(item.reason_zh)} |`).join('\n')}\n\n## 5. 实践复核清单\n\n1. 检查实际源码、入口、依赖和资源要求；不要只读项目标题。\n2. 明确哪个状态跨轮变化，什么仍冻结，以及外部奖励/教师/判断从哪里来。\n3. 核对候选接受与后继使用；有结果文件不等于机制已参与下一轮。\n4. 阅读当前 LICENSE，检查模型、数据、工具与运行时许可是否各自不同。\n5. 固定版本、同起点与完整预算，记录失败、负迁移与回滚，再评价真实改进。\n\n[结构化工程数据](../../data/engineering-projects.json) · [动态图与检索](../../index.html#implementations) · [证据与验证专题](chapters/04_Meta_RSI_Evaluation_and_Safety.md)\n`;
  fs.writeFileSync(path.join(root,'docs/zh/13_Open_Source_Engineering.md'),text);
  return {engineering_projects:data.projects.length,engineering_categories:data.categories.length,excluded_candidates:data.excluded.length,source_file_published:false};
}
