import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const md=value=>String(value??'').replaceAll('|','\\|').replace(/[\r\n]+/g,' ');
const label=value=>String(value).replaceAll('"',"'").replaceAll('\n',' ').slice(0,68);
function describe(value,depth=0){
  if(value===null||value===undefined)return '未核验 / 未提供。';
  if(typeof value==='string')return value;
  if(typeof value==='number'||typeof value==='boolean')return String(value);
  if(Array.isArray(value))return value.map(item=>'- '+describe(item,depth+1).replace(/\n(?=[^\n])/g,'\n  ')).join('\n');
  return Object.entries(value).map(([key,item])=>key==='source_url'?`[原文定位](${item})`:`**${key}：** ${describe(item,depth+1)}`).join('\n\n');
  text+=`### 公开实现与可复现性\n\n${work.official_repo?`[作者关联的公开实现](${work.official_repo})。本章静态查看范围和源码版本边界以上述 reading_scope 为准，不声称 main 与论文实验版本逐字一致。`:'在本次一手链接和有界公开检索中未定位到作者正式实现；这不等于代码不存在。没有用同名或引用项目冒充官方实现。'} 未执行研究代码、训练或独立复现实验。\n\n`;
}
export function buildResearchDocs(atlas){
  const focus=read('data/focus-methods.json'),updates=read('data/research-updates.json'),orgs=read('data/institutions.json');
  let text=`# Harness 重点精读：Harness²、Evo²、RRSI 与 OO-Harness\n\n[返回首页](../../README.md) · [机构与更新](11_Institutions_and_Updates.md) · [交互时间轴](../../index.html#timeline)\n\n核验截点：${atlas.cutoff}。微信入口访问时返回验证页，未绕过、未取得正文，也不把其中可能存在的解读冒充已读；本章回到四篇已定位的一手论文、官方页面和可找到的公开实现。\n\n**证据范围：**所列方法章节与主要实验的版本化阅读，不是独立复现实验。未定位到官方代码的作品保持 unknown，不用相近名称仓库替代。Evo² 是权重—Harness 共同演化的改进器研究，不是基因组 Evo 2，也不是 CoEvo-RSI。\n\n`;
  for(const work of focus.works){
    const record=atlas.methods.find(item=>item.id===work.id);
    text+=`## ${work.method}\n\n**${work.title}**。[原论文](${work.primary_url})；首发 ${work.first_date}；所读版本 ${work.latest_version}，版本日期 ${work.version_date}。\n\n### 目标与核心机制\n\n${work.goal_zh}\n\n${work.mechanism_zh}\n\n### 改变什么，什么保持固定\n\n**持久更新：**\n\n${describe(work.updated_state)}\n\n**冻结与执行边界：**\n\n${describe(work.frozen_state)}\n\n### 方法流程与原文映射\n\n这是本文根据所读方法绘制的阅读图，不是论文原图或实跑 trace；循环与子过程按下方具体来源解释。\n\n\`\`\`mermaid\nflowchart TD\n${work.step_flow.map((step,index)=>`  P${index}["${label(step.label)}"]`).join('\n')}\n${work.step_flow.slice(1).map((_,index)=>`  P${index} --> P${index+1}`).join('\n')}\n\`\`\`\n\n| 图节点 | 步骤与边界 | 一手来源 |\n|---|---|---|\n${work.step_flow.map((step,index)=>`| P${index} | ${md(step.detail)} | [原文](${step.source_url}) |`).join('\n')}\n\n### 模块 / 算子与两种循环\n\n${describe(work.modules_or_operators)}\n\n### 作者报告结果与解释边界\n\n以下是作者报告，不是本机测量；主实验、专有模型子集、消融、迁移与不同成本分母不能混合。\n\n${describe(work.results_scope)}\n\n### 局限与实践检查\n\n${describe(work.limitations)}\n\n- 先冻结任务、模型、可变面和预算，再比较改进。\n- 区分任务 executor、负责修改的 evolver、router 与最外层控制；哪个权重真的训练必须明确。\n- 持久资产要实际进入后续调用，不能以“保存了新文件”代替交接。\n- 开发/搜索反馈与最终确认隔离；保留失败、拒绝及额外提案/训练成本。\n\n${work.id==='arxiv:2609.24972'?'实现级细节另见[RRSI 固定源码深读](../repo_deepdive/cases/rrsi.md)。\n\n':''}### 机构归属与阅读范围\n\n${(record?.institution_links??[]).map(link=>{const entity=atlas.institutions.find(item=>item.id===link.institution_id);return `- ${entity?.name??link.institution_id}：${link.relation}，[依据](${link.source_url})。`;}).join('\n')}\n\n${describe(work.reading_scope)}\n\n`;
  }
  text+=`## 四条路线如何比较\n\n| 路线 | 主要资产 | 关键问题 |\n|---|---|---|\n| Harness² | 任务内 harness 与跨任务改进经验 | 无标准答案的 probe 能否支持正确路由与后继改进？ |\n| Evo² | evolver 权重、harness 搜索树与训练轨迹 | 冻结 executor 后，改进器训练是否降低后续搜索成本并迁移？ |\n| RRSI | 正则化候选、incumbent、历史与代码版本 | 约束是否缓解 benchmark 特化，而不只是压低开发分数？ |\n| OO-Harness | 类层级、任务簇、设计/路由经验 | 特化与基线回退如何避免负迁移，完整路由成本是多少？ |\n\n不能把四者都叫“模型自己重写自己”。反馈、更新对象、训练权重、部署资产和后继使用路径必须分别举证。\n`;
  fs.writeFileSync(path.join(root,'docs/zh/10_Harness_Focus.md'),text);
  const entityById=new Map(orgs.institutions.map(entity=>[entity.id,entity]));
  const rows=updates.records.filter(record=>record.selection_role==='requested_update').map(record=>{
    const affiliated=atlas.methods.find(item=>item.id===record.id);
    const names=(affiliated?.institution_ids??[]).map(id=>entityById.get(id)?.name??id).join('；')||'未核验机构';
    const date=record.date_status==='primary_verified'?record.date:`${record.date}（官网显示日，最早公开待核验）`;
    return `| ${date} | [${md(record.method)}](${record.primary_url}) | ${md(names)} | ${md(record.latest_version??'非版本化发布')} / ${md(record.version_date??'未定')} |`;
  }).join('\n');
  let institutionText=`# 公司、科研机构、实验室与重点更新\n\n[返回首页](../../README.md) · [四篇 Harness 精读](10_Harness_Focus.md) · [机构时间轴](../../index.html#institutions)\n\n核验截点 ${atlas.cutoff}。机构依据论文首页/作者块或官方发布者；同一作品可以有多个归属。**不是排他所有权、当前雇佣关系、机构认可或科研质量排名。** 类型是功能性工作分类，不是法人资格认定；无法确定的类型保留 unknown。\n\n## 所给更新的核验表\n\n论文采用首发日，修订单列。公司发布可使用注明的网页显示日期，不伪装成论文 v1。\n\n| 日期与口径 | 来源 | 已核验机构 / 发布者 | 所列版本 / 修订日 |\n|---|---|---|---|\n${rows}\n\n## 日期与访问限制\n\n- AReaL-RSI 的“20226”按一手记录核为 2026，不作为未来论文。\n- SwarmRSI、RHO、SkillMOO、AHE、AFlow 的 v1 与后续修订分别记录，不把修订移成新首发。\n- Flint：网页和 HTML time 均显示 2026-10-18；Framer 站点发布注释为 2026-11-02，不是文章 datePublished；所给 10-21 未获支持。最早公开与修订未确定，时间轴显式警告，作为公司发布而非科研算法。\n- 微信正文为访问验证页；指定 OpenReview PDF 也触发验证。未绕过，未用其他综述替代原引用。\n\n${updates.unresolved_sources.map(source=>`- [${md(source.title)}](${source.primary_url})：${source.status}；所给日期 ${source.claimed_date} 不是已确认首发。`).join('\n')}\n\n## 按机构类型分类\n\n${['company','university','lab','research_institute','nonprofit','unknown'].map(type=>`### ${type}\n\n${orgs.institutions.filter(entity=>entity.type===type).map(entity=>{const links=orgs.assignments.filter(link=>link.institution_id===entity.id);const ids=[...new Set(links.map(link=>link.record_id))];return `- **${entity.name}**：${ids.map(id=>{const record=atlas.methods.find(item=>item.id===id);return record?`[${record.method}](${record.primary_url})`:id;}).join('；')}。[机构依据](${entity.sources[0]})。`;}).join('\n')||'当前核验集合中没有该类型标签。'}\n`).join('\n')}\n## 归属覆盖与复核\n\n当前方法表 ${atlas.methods.length} 条，${atlas.methods.filter(record=>record.institution_ids.length).length} 条具有一手归属链接；其余显示“机构未核验”，不当作“没有机构”。机构与归属数量不可直接相加当论文数，也不替代精读或复现。\n\n[机器可读机构与逐条来源](../../data/institutions.json) · [所给更新及访问状态](../../data/research-updates.json)。\n`;
  const attributionReviews=new Map(orgs.attribution_reviews.map(review=>[review.record_id,review]));
  institutionText+=`\n## 全表逐条归属证据\n\n以下每条关系都链接到实际引用版本的证据；无版本号的网页链接不冒充不可变快照。author_affiliation 是文中机构，publisher 只表明发布者。没有核验结果的条目保留失败边界，不能由作者姓名、模型厂商、GitHub 所有者或当前雇佣信息倒推。\n\n| 条目 | 非排他机构与逐条来源 |\n|---|---|\n${atlas.methods.map(record=>{
    const links=record.institution_links.map(link=>`${md(entityById.get(link.institution_id).name)}（${link.relation}，[依据](${link.source_url})）`);
    const review=attributionReviews.get(record.id);
    return `| [${md(record.method)}](${record.primary_url}) | ${links.join('<br>')||'机构未核验：'+md(review?.unresolved_reason??'尚无足够的一手机构证据')} |`;
  }).join('\n')}\n`;
  fs.writeFileSync(path.join(root,'docs/zh/11_Institutions_and_Updates.md'),institutionText);
  return {focus_methods:focus.works.length,dated_requested_updates:updates.records.filter(record=>record.selection_role==='requested_update').length,institutions:orgs.institutions.length,verified_attribution_records:atlas.methods.filter(record=>record.institution_ids.length).length};
}
