import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = path.join(root, 'docs/repo_deepdive');
const metadata = JSON.parse(fs.readFileSync(path.join(directory, 'repositories.json'), 'utf8'));
const audits = JSON.parse(fs.readFileSync(path.join(directory, 'source-audits.json'), 'utf8'));
const labels = {
  genericagent:['执行循环','Agent 初始化','工具 schema','系统提示','模型会话','流式请求与重试','Claude 可选路由','浏览器执行底座','工具分发','历史压缩','CLI 包入口','兼容旧入口'],
  gepa:['经典优化 API','通用文本 API','搜索引擎','候选与前沿状态','评估适配接口','通用API引擎分派','反思变异','反思模型','候选合并','候选选择','状态初始化','结果对象'],
  'sol-pi':['扩展入口','按开关注册','配置加载','执行融合','后续命令 schema','观察归档对象','观察账本','证据 reducer','证据回执校验','在线压缩扩展','压缩经济判定','在线状态'],
  hyperagents:['演化主循环','单代候选执行','Agent 系统接口','外部模型调用','元代理','任务代理','默认父代选择','可选开放式选择','存档与分数工具','容器执行','任务划分','领域评价'],
  rrsi:['轮次控制','运行状态','历史分析','候选工作区','critic 预检','评价结果','费用接纳规则','综合资格判定','轮次赢家选择','历史持久化','Git 分支管理','模型调用'],
  openrsi:['MLE-Bench 入口','共享并发控制','程序数据库','草稿提示构造','执行模式解析','GPU/沙箱资源池','评估网络边界','模型时间统计','沙箱请求处理','任务技能 guidance','验证划分 guidance','NatureBench 独立入口'],
};
const setups = {
  genericagent:'Python >=3.10,<3.14；按需安装 UI extra；模型 API、浏览器会话、ADB/IM 等依任务另行配置。终端和真实应用有外部副作用，不默认隔离。',
  gepa:'基础包依赖与 full/dev extras 分开。真实优化仍需 evaluator、数据、task/reflection LM 和调用预算；DSPy、Docker 等适配不是所有路径的硬依赖。',
  'sol-pi':'Node >=22.19.0；Pi peer >=0.84.2，仓库开发验证固定 Pi 1.3.0。四机制 opt-in；项目级配置优先，不与用户级配置合并。',
  hyperagents:'文档使用 Python 3.12、requirements/requirements_dev、Docker 镜像和 domain 初始配置。外部模型 API 与任务计算资源另行准备，先审查生成代码权限。',
  rrsi:'Python >=3.10、anthropic[vertex]；agentic/coding 为可选依赖。外部 agent Python、benchmark runner、Vertex 认证与费用不是仓库自动提供。',
  openrsi:'Evo 使用 Python >=3.11,<3.13、Hydra/OmegaConf/LiteLLM 等。模型服务、sandbox、task package、容器和数据另行准备；ERL 与 Evo 是不同运行路径。',
};
const walks = {
  genericagent:[['GA-2','初始化上下文与工具'],['GA-1','进入模型—工具循环'],['GA-5','请求实际模型会话'],['GA-9','条件分支：分发工具调用'],['GA-8','可选浏览器执行并返回观察'],['GA-10','条件分支：压缩历史，再继续或停止']],
  gepa:[['G-1','经典 API 接收种子与预算'],['G-11','初始化候选与状态'],['G-5','适配器执行与评分'],['G-10','从候选/前沿选择父代'],['G-7','反思失败并生成文本变异'],['G-3','评估新候选，接纳或拒绝'],['G-4','保留分数、历史与互补优势'],['G-12','预算停止并返回结果']],
  'sol-pi':[['S-1','Pi 加载公共扩展入口'],['S-3','读取项目/用户配置'],['S-2','按 opt-in flags 注册机制'],['S-4','分支A：编辑与后续验证融合'],['S-6','分支B：观察归档与可召回 handle'],['S-9','分支C：验证摘要证据回执'],['S-11','分支D：判定 compact 经济性'],['S-12','保存状态，继续或保持原行为']],
  hyperagents:[['HA-1','初始化或恢复演化运行'],['HA-7','默认 score_prop 选择父代'],['HA-2','继承父版本与已有 patch'],['HA-5','Meta agent 提出程序修改'],['HA-10','在配置的容器边界内执行'],['HA-6','Task agent 解决领域任务'],['HA-12','执行领域评价'],['HA-9','保存结果、失败与存档，再继续']],
  rrsi:[['RR-1','读取运行配置与 STOP'],['RR-2','载入 incumbent 与 frontier'],['RR-3','分析已有轨迹与瓶颈'],['RR-4','生成候选 edits 与 hypothesis'],['RR-5','critic 预检，拒绝或继续'],['RR-6','执行任务并得到评价/费用'],['RR-8','检查 floor、成本与 domain guards'],['RR-9','选 admissible 赢家或保留原版本']],
  openrsi:[['OR-1','Hydra 启动指定 benchmark'],['OR-5','解析实际执行模式'],['OR-2','按配置限制并发候选'],['OR-4','构造算子/草稿提案提示'],['OR-6','分配 sandbox/计算资源'],['OR-9','提交执行请求并读取权威结果'],['OR-3','保存程序状态与经验引用'],['OR-8','记录预算/时间并决定继续或停止']],
};
const flowDiagrams = {
  genericagent:`flowchart TD
  GA_2["GA-2 初始化Agent"] --> GA_3["GA-3 工具schema"]
  GA_3 --> GA_4["GA-4 系统提示"] --> GA_1{"GA-1 继续模型turn?"}
  GA_1 -->|继续| GA_5["GA-5 模型会话"]
  GA_5 --> GA_6["GA-6 流式请求与有界重试"]
  GA_6 --> GA_9{"GA-9 是否工具调用"}
  GA_9 -->|普通工具| GA_1
  GA_9 -->|浏览器分支| GA_8["GA-8 实际浏览器"]
  GA_8 -->|工具结果进入历史| GA_1
  GA_1 -->|历史压缩条件| GA_10["GA-10 历史压缩"]
  GA_10 --> GA_1
  GA_1 -->|停止或异常| STOP["结束当前运行；不是技能质量认证"]`,
  gepa:`flowchart TD
  G_1["G-1 经典optimize"] --> G_11["G-11 初始化状态"]
  G_11 --> G_5["G-5 adapter执行/评分"]
  G_5 --> G_4["G-4 候选/前沿状态"]
  G_4 --> G_10["G-10 选择父候选"]
  G_10 --> G_7["G-7 反思变异"]
  G_7 --> G_8["G-8 反思模型"]
  G_8 --> G_3{"G-3 候选评价与预算"}
  G_3 -->|接纳或保留历史| G_4
  G_3 -->|停止| G_12["G-12 返回结果"]
  G_4 -.可选合并.-> G_9["G-9 MergeProposer"]
  G_9 --> G_3
  G_2["G-2 optimize_anything：另一套公开API"]
  G_2 --> G_6["G-6 _build_engine / OA registry"]
  G_6 -. "按 config.engine 分派" .-> NOTE["AutoResearch / BestOfN / Gepa / MetaHarness 等实现"]`,
  'sol-pi':`flowchart TD
  S_1["S-1 Pi加载扩展"] --> S_3["S-3 配置读取"]
  S_3 --> S_2{"S-2 按feature flags注册"}
  S_2 -->|actionFusion| S_4["S-4 edit/write包装"]
  S_4 --> S_5["S-5 then_run与并发保护"]
  S_2 -->|observationPack| S_6["S-6 大观察归档对象"]
  S_6 --> S_7["S-7 账本/handle/召回"]
  S_2 -->|reducer| S_8["S-8 摘要模型与原始证据"]
  S_8 --> S_9{"S-9 receipt有效?"}
  S_9 -->|否| RAW["保留原始结果"]
  S_9 -->|是| RECEIPT["使用带证据引用的结果"]
  S_2 -->|online compact| S_10["S-10 上下文事件"]
  S_10 --> S_11{"S-11 经济与触发条件满足?"}
  S_11 -->|是| S_12["S-12 状态/原生compact/后续turn"]
  S_11 -->|否| RAW
  S_2 -->|未启用| RAW`,
  hyperagents:`flowchart TD
  HA_1["HA-1 创建/恢复archive"] --> HA_7["HA-7 默认score_prop父代"]
  HA_1 -.可选容器/可编辑选择路径.-> HA_8["HA-8 可选selector"]
  HA_7 --> HA_2["HA-2 继承parent与patch"]
  HA_8 --> HA_2
  HA_2 --> HA_5["HA-5 MetaAgent提案"]
  HA_5 --> HA_10["HA-10 Docker边界"]
  HA_10 --> HA_6["HA-6 TaskAgent"]
  HA_6 --> HA_12["HA-12 domain评价"]
  HA_12 --> HA_9["HA-9 结果/失败/metadata"]
  HA_9 -->|合法且预算允许| HA_7
  HA_9 -->|无有效父代/失败或停止| STOP["按运行条件结束，不保证改善"]`,
  rrsi:`flowchart TD
  RR_1{"RR-1 rounds/STOP/基础设施停止"} -->|继续| RR_2["RR-2 当前incumbent/frontier"]
  RR_2 --> RR_3["RR-3 analyst"]
  RR_3 --> RR_4["RR-4 工作区候选"]
  RR_4 --> RR_5{"RR-5 critic通过?"}
  RR_5 -->|否| RR_10["RR-10 保留拒绝/历史"]
  RR_5 -->|是| RR_11["RR-11 Git分支/diff"]
  RR_11 --> RR_6["RR-6 真实评价/成本结果"]
  RR_6 --> RR_8{"RR-8 floor/费用/domain guards"}
  RR_8 -->|不合格| RR_10
  RR_8 -->|合格| RR_9["RR-9 选admissible最高分"]
  RR_9 --> RR_10
  RR_10 --> RR_1
  RR_1 -->|停止| STOP["结束；未获接纳时保留incumbent"]`,
  openrsi:`flowchart TD
  OR_1["OR-1 MLE-Bench Hydra入口"] --> OR_5{"OR-5 解析实际执行模式"}
  OR_12["OR-12 NatureBench独立入口"] -.按该benchmark配置.-> OR_5
  OR_5 -->|同步/异步配置| OR_2["OR-2 并发许可"]
  OR_2 --> OR_4["OR-4 模型提案提示"]
  OR_4 --> OR_6["OR-6 sandbox/GPU资源"]
  OR_6 --> OR_9["OR-9 请求/执行/权威反馈"]
  OR_9 --> OR_3["OR-3 程序状态与历史"]
  OR_3 --> OR_8{"OR-8 时间/预算观察"}
  OR_8 -->|继续合法搜索| OR_2
  OR_8 -->|停止或失败边界| STOP["保留状态与最终有效产物"]
  OR_9 -.自打印分数不作为权威选择值.-> NOTE["诊断与scorer反馈分开"]`,
};
const md = value => String(value).replaceAll('|','\\|').replace(/[\r\n]+/g,' ');
const array = value => Array.isArray(value) ? value : [value];
const url = (repo,item) => `https://github.com/${repo.name}/blob/${repo.commit}/${item.path}#L${item.line}`;
const sourceLink = (repo,item,label=`${item.path}:${item.line}`) => `[${label}](${url(repo,item)})`;
const mermaidId = value => value.replaceAll('-','_');
const safeLabel = value => String(value).replaceAll('"',"'").replaceAll('\n',' ');
const repos = metadata.repos.map(repo => {
  const audit = audits.repos.find(record => record.id === `${repo.audit_name}@${repo.commit}`);
  assert.ok(audit, `Missing pinned audit ${repo.id}`);
  assert.equal(audit.modules.length, labels[repo.id].length);
  const modules = audit.modules.map((module,index)=>({...module,label:labels[repo.id][index],source:url(repo,module)}));
  const map = new Map(modules.map(module=>[module.id,module]));
  const walk = walks[repo.id].map(([module,label])=>{
    assert.ok(map.has(module));
    const item=map.get(module);
    return {module,label,detail:item.role,source:item.source};
  });
  for(const edge of audit.architecture_edges)assert.ok(map.has(edge.from)&&map.has(edge.to),`Unknown architecture endpoint ${repo.id}`);
  return {...repo,setup:setups[repo.id],entry:{...audit.entry,source:url(repo,audit.entry)},modules,walk,flow:audit.flow.map(step=>({...step,source:url(repo,step)})),edges:audit.architecture_edges,frozen:array(audit.frozen),mutable:array(audit.mutable),limitations:array(audit.limitations),commands:audit.commands.map(command=>({...command,source:url(repo,command)}))};
});
fs.mkdirSync(path.join(directory,'cases'),{recursive:true});
for(const repo of repos){
  const diagram = ['flowchart LR',...repo.modules.map(module=>`  ${mermaidId(module.id)}["${safeLabel(module.id+' '+module.label)}"]`),...repo.edges.map(edge=>`  ${mermaidId(edge.from)} ${/可选|仅|条件/.test(edge.label)?'-.':'--'} "${safeLabel(edge.label)}" ${/可选|仅|条件/.test(edge.label)?'.->':'-->'} ${mermaidId(edge.to)}`)].join('\n');
  const rows=repo.modules.map(module=>`| ${module.id} | ${module.label} / \`${md(module.symbol)}\` | ${md(module.role)} | ${sourceLink(repo,module)} |`).join('\n');
  const walkRows=repo.walk.map((step,index)=>`### ${index+1}. ${step.label}\n\n${step.detail}。定位模块：\`${step.module}\`。[固定源码](${step.source})。\n\n${index===0?'输入必须先固定版本、配置和评价预算；下面说明的是源码路径，不是本次实际模型运行记录。':index===repo.walk.length-1?'输出与持久状态应与原始执行条件一起保留；过程结束不等于获得泛化或部署收益。':'观察真实输出、条件分支和失败，而不是仅依据调用是否返回。具体分支见后面的源码定位表。'}\n`).join('\n');
  const flowTable=repo.flow.map(step=>`| ${step.label} | ${md(step.detail)} | ${sourceLink(repo,step)} |`).join('\n');
  const flowDiagram=flowDiagrams[repo.id];
  const extraTheory=repo.id==='rrsi'?`选择规则的解释性记号： $\\Delta S=S'-S_t$， $\\Delta C=(C'-C_t)/C_t$。显著改进时费用约束使用 $\\beta_0+\\beta_1\\Delta S$；小改进还考虑分数、成本与 novelty，并保护 $S'\\ge S^*-\\delta$。最终仍在 admissible 候选中选分数最高者。精确条件以 \`cost_rule/judge/select_round\` 固定源码为准。\n`:repo.id==='gepa'?`不要把样本级前沿自动解释成性能—成本前沿。不同候选在不同任务上占优，可以同时留在搜索状态；这是一种搜索多样性机制，不提供未见任务不退化的保证。\n`:repo.id==='hyperagents'?`特别纠偏：默认 parent-selection 参数为 \`score_prop\`。可选 \`select_next_parent.py\` 中的 \`random.choice\` 不是默认循环行为；同样，可编辑选择器的配置路径不等于每代都会修改它。\n`:repo.id==='sol-pi'?`四个机制是分支，不是每次工具调用依次经过四级处理。Reducer 失败保留原始结果属于明确的证据保全语义；不要在自己的复用中把错误吞成“摘要成功”。\n`:repo.id==='openrsi'?`本文执行深读主要覆盖 Evo 的 launcher、模式/并发、sandbox、程序状态与指导接口；不是 ERL 全部训练模块的逐行复审。公开 Gym/ERL/Evo 目录、论文中的算子训练结果和本次实际执行是三个不同范围。\n`:`文件化记忆与压缩后的会话历史不是同一种资产。README 的 Skill 结晶声明不意味着这里已经找到统一的学习—评分—晋级事务；没有证据的学习能力保持未确认。\n`;
  const protectedTheory=extraTheory.replace(/\$([^$\n]+)\$/g,(_,formula)=>'$`'+formula+'`$');
  const text=`# ${repo.title}

[返回索引](../README.md) · [交互架构与动态路径](../implementation-atlas.html?repo=${repo.id}) · [横向比较](../overview.md)

> 快照：${metadata.snapshot_date}；${repo.stars.toLocaleString('en-US')} stars；最近 push ${repo.pushed}。源码固定为 [${repo.commit}](https://github.com/${repo.name}/tree/${repo.commit})。star 不是质量或复现认证；“最近活跃”不等于项目最近首发。
>
> 本文是固定源码静态阅读与可执行路径说明。没有安装该研究仓库、运行其模型/生成代码或复现论文 benchmark。

## 1. 目标与适用问题

${repo.goal}

**准确定位：**${repo.position}

**公开与许可边界：**${repo.license}。这里只链接和解释代码，不在本仓库复制模型、任务数据或研究源码。特别是非商业/相同方式共享许可不能笼统称为 OSI 认可的软件开源许可。

### 1.1 为什么收录

${repo.practice}

${repo.id==='openrsi'?'本项目按模型工程/训练关联性补选，star 低于同组其他案例；不把它冒充全站最高 star 项目。':'该项目同时具有较高关注度和与本图谱相关的实际可读实现；选择不是全 GitHub 的穷尽排名。'}

## 2. 理论与方法论

${repo.theory}

### 2.1 用状态而不是名字判断自改进

${repo.state}

${protectedTheory}

### 2.2 实际更新与冻结对象

**可变状态：**

${repo.mutable.map(value=>`- ${value}`).join('\n')}

**固定/外部拥有：**

${repo.frozen.map(value=>`- ${value}`).join('\n')}

${repo.frozen_warning}

${repo.api_boundary?`### 2.3 实际 API 与引擎选择\n\n${repo.api_boundary}\n\n`:''}
## 3. 运行架构与核心模块

真实入口：[${repo.entry.symbol}](${repo.entry.source})。以下连线来自本次固定源码审计；未连入主图的兼容入口、接口对象或辅助模块仍列在源码表，不能推断它们是每次必经路径。

\`\`\`mermaid
${diagram}
\`\`\`

### 3.1 图节点—源码映射

| 节点 | 模块 / 代码符号 | 职责 | 固定源码 |
|---|---|---|---|
${rows}

目录是组织单位，不是可执行函数；第 1 行的 module 锚点只表示文件入口，不伪装成函数起始行。

## 4. 主路径与条件分支

${repo.algorithm}

下面图是阅读一条代表路径的机制示意，**不是统一覆盖所有 flags 的真实运行 trace**。尤其 GEPA 的另一套通用文本 API、SoL-Pi 的四机制分支、可选 browser/selection/benchmark 不能被视为全部串行必经步骤。

\`\`\`mermaid
${flowDiagram}
\`\`\`

图中模块 ID 对应 §3.1 的固定源码表；STOP/RAW/RECEIPT/NOTE 是相邻源码条件与输出语义的阅读说明，不是新发明的类。具体分支以 §4.2 定位表为准；动态图逐步顺序是代表性阅读路径，而非声明每个分支都发生在同一运行中。

### 4.1 分步解释

${walkRows}
### 4.2 分支与实现定位表

| 阅读定位 | 实际步骤 / 条件与边界 | 源码 |
|---|---|---|
${flowTable}

### 4.3 失败、停止与恢复怎么读

- 没有评价结果、无有效候选、API/容器失败和真实任务低分是不同事件。
- 代码允许失败处理，不等于已经证明每种环境都能恢复。
- archive/state/result/checkpoint 的语义随项目变化，不把文件存在当作恢复成功。
- 更新后的产物是否被后续任务或后续改进真正读取，需要使用路径或运行证据，不能只看目录里多了文件。
- 以上四点是复用时的审计要求，不声称每个项目都已经实现完整保障。

## 5. 实践：版本、依赖与最小起步

${repo.setup}

### 5.1 首先固定源码

\`\`\`sh
git clone https://github.com/${repo.name}.git
cd ${repo.name.split('/')[1]}
git checkout ${repo.commit}
\`\`\`

这三步只固定研究对象；后面的命令仍可能安装依赖、调用模型、执行生成代码或产生费用。应先理解代码与许可，再在隔离环境执行。

### 5.2 仓库文档里的命令入口

${repo.commands.map(item=>`\`\`\`sh\n${item.command}\n\`\`\`\n\n[该命令的原始说明](${item.source})。\n`).join('\n')}

命令是文档化入口，不是本次已执行的记录。凭据只配置在本地受控环境，不能提交到 Git；工具名称、环境变量名和 API key 的实际值必须分开。

### 5.3 首次实验的建议约束

1. 最小任务集合、单一模型/配置和有限候选/轮次。
2. 固定任务、输入、模型版本、评价器、随机性与资源上限。
3. 不给生成代码不必要的主机文件/网络/凭据权限。
4. 完整保存失败、拒绝、超时、API 开销和未评分分母。
5. 冻结产物后测独立任务，不用最终测试集反复选候选。
6. 先复核功能与副作用，再讨论成本下降。

这是本图谱建议的实践协议，不冒充仓库自带的完整安全或评测实现。

## 6. 怎样设计一个有判别力的对照

${repo.experiment}

推荐报告至少包含：原版本、候选版本、任务/样本分母、成功与退化、完整成本、失败原因、选择规则、独立确认范围和未解决项。不同基准、计费规则或模型下的数字不直接拼成统一 RSI 排名。

## 7. 声称、实现、运行验证分开

| 层级 | 本文能确认 | 不能自动推断 |
|---|---|---|
| 定位与论文 | 作者公开目标、研究方向与原文入口 | 通用或无限递归已实现 |
| 固定源码 | 上述入口、模块、调用关系与数据结构 | 所有 flags 都能运行、实验一定复现 |
| 本次检查 | commit 与源码锚点/文档/离线图构建 | 模型、容器或付费 benchmark 实验 |
| 未来实跑 | 需按 §5—6 保存完整证据 | 有一个成功案例就获得泛化 |

${repo.limitations.map(value=>`- ${value}`).join('\n')}

## 8. 具体优化建议

${repo.improvements.map((value,index)=>`${index+1}. ${value}`).join('\n')}

## 9. 复核清单

- [ ] 用相同 commit 而非浮动 main 复核源码。
- [ ] 确认实际选择的 API、feature flags 和外部 runner。
- [ ] 检查可变面没有不当地包含最终 evaluator 或答案。
- [ ] 记录全部候选、失败与资源账单。
- [ ] 区分任务收益、持久产物收益与后继改进效率。
- [ ] 对最外层仍固定的部分保持准确描述。

这些是读者的后续执行清单，不是本项目已经运行该仓库的证明。

[返回开源实现索引](../README.md) · [比较六种机制](../overview.md) · [交互图](../implementation-atlas.html?repo=${repo.id})
`;
  fs.writeFileSync(path.join(directory,'cases',`${repo.id}.md`),text);
}
const payload={snapshot_date:metadata.snapshot_date,scope:metadata.evidence_scope,repos};
const template=fs.readFileSync(path.join(root,'scripts/implementation.template.html'),'utf8');
assert.equal(template.split('__IMPLEMENTATION_DATA__').length,2);
const embedded=JSON.stringify(payload).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
fs.writeFileSync(path.join(directory,'implementation-atlas.html'),template.replace('__IMPLEMENTATION_DATA__',embedded));
console.log(JSON.stringify({public_repositories:repos.length,pinned_modules:repos.reduce((sum,repo)=>sum+repo.modules.length,0),source_flow_steps:repos.reduce((sum,repo)=>sum+repo.flow.length,0),new_docs:repos.length,dynamic_walkthroughs:repos.length,network_requests:0}));
