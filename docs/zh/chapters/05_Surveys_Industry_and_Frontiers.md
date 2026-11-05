# 第五章：综述、产业证据与研究前沿

> 整合说明：本章继承此前作者的版本化阅读与审计记录，不表示本次监督重新阅读全文。先前笔记原稿不公开，链接指向[来源说明](../Reading_Notes_Provenance.md)。本次直接核验新增内容另见[近期研究](../06_Latest_Year_Research.md)。

[返回 RSI 技术全景](../01_RSI_Technical_Panorama.md)

> 范围截止日：2026-11-05。本文讨论可检查的机制、作者报告的实验和公开交付物，不给机构排“RSI 等级榜”。
> 最重要的区分：更好的答案、更好的持久系统、更好的改进器，是三种不同主张。
> 原文作者的实验不等于本章复现；公开仓库不等于完整实验代码；综述收录不等于独立验证。

## 1. 如何使用本章

本章完整读取了 [../AI4AI-Survey-Deep-Dive.md](../Reading_Notes_Provenance.md) 的 2380 行和 [../recursive-self-improvement-survey-guide.md](../Reading_Notes_Provenance.md) 的 555 行。
它们提供发现线索，但不承担一手证据的角色，也不把先前作者的“全文阅读”“已复现”声明转记成本次工作。
研究记录与检索日志见 [../research/surveys-evidence.json](../research/surveys-evidence.json)。

阅读顺序建议：先看 §2 的来源边界，再读 §3 的原始分类，最后用 §6 的案例和 §7 的对照设计检验自己的系统。
本章没有把几百篇清单逐篇读完，也没有运行任何论文实验、安装研究框架或使用采集终端。
网页工具返回的正文可能压缩表格、公式或折叠附录；下文的“正文已读”只指实际返回的文字，不等同于逐页图像核验。

### 1.1 证据标签

| 标签 | 本章承认的事实 | 不承认的自动推论 |
| --- | --- | --- |
| 原始论文正文 | 可定位的方法、协议、实验和限制 | 作者结论已经独立复现 |
| 官方技术报告 | 发布者直接描述的工程过程或内部结果 | 企业整体收益可归因于某个 agent |
| 公开实现 | 作者关联仓库存在相应源码或运行组件 | 全量数据、训练、评测和内部服务都已开放 |
| 模型发布 | 权重或服务已经有明确发布入口 | 生产该模型的研究机器已经公开或自我加速 |
| 研究议程 | 作者提出目标、机制假说和可检验预测 | 目标已经完成，或有限轮次可以无限外推 |
| 发现清单 | 有组织的文献入口和策展解释 | 多个列表出现即为多次验证 |
| 访问受限 | 指定来源被尝试，未取得可读正文 | 可以用相似标题替代原文件 |

### 1.2 四个必须分开的日期

首次公开日回答“什么时候可以知道这项工作”；版本日回答“这里读的是哪一份主张”。
发布日回答“什么时候交付了什么”；目录新增日只回答“策展者什么时候加入链接”。
网页中的“昨天”“两个月前”和版权年份均不用于推算论文首发日。
以下时间线优先使用 arXiv submission history、官网明确日期及仓库 News；缺少日级证据时只保留月份或空值。

## 2. 七个发现池：导航不是投票

七个根入口已直接访问；它们的价值主要是组织视角、负结果入口和交付物索引。
应以论文标识、版本和原始实验为单位去重，不能把论文、博客、项目页和仓库相加为四项突破。

| 根入口 | 实际组织方式与用途 | 使用限制 |
| --- | --- | --- |
| [KaiWU5/Awesome-AI4AI](https://github.com/KaiWU5/Awesome-AI4AI) | benchmark、harness、model 等多标签资源，以及独立的责任与证据审计 | 活目录、原综述语料和 35 系统审计是三套分母 |
| [pinkbubblebubble/awesome-rsi](https://github.com/pinkbubblebubble/awesome-rsi) | RSI、Self-improvement、Enabler 标签；入口要求说明持久对象、反馈与改进过程 | “反复复用同一过程”的宽口径与严格 updater 改进不能混同 |
| [lobehub/awesome-rsi](https://github.com/lobehub/awesome-rsi) | model、harness、multi-agent、coding、R&D 等研究地图；区分 task/retained/improver gain | 目录分类非互斥；可扩展 substrate 不是默认运行的自改进回路 |
| [Picrew/awesome-rsi](https://github.com/Picrew/awesome-rsi) | 机制、边界、首发日期、官方代码和部分发布说明相邻展示 | 2026-10-07 元数据快照；95 个资源不是 95 个独立系统 |
| [theseus-labs-rsi/awesome-rsi](https://github.com/theseus-labs-rsi/awesome-rsi) | 配套 B0/L1–L5 责任分类、论文和产业案例 | 所列级别是作者的结构判断，不是能力认证 |
| [Prism-Shadow/awesome-rsi](https://github.com/Prism-Shadow/awesome-rsi) | 方法、benchmark、系统及九维机制索引 | 收录日期不是首发日期；连接数不代表独立证据数 |
| [Lee1003-lee/Awesome-RSI-Research](https://github.com/Lee1003-lee/Awesome-RSI-Research) | 状态继承、Proposal–Feedback–Optimization、四类演化与七项前沿性质 | 作者明确说 taxonomy 不是 RSI certification list |

这些入口高度重叠，例如 DGM、STOP、Frontis-MA1、MetaRSI、SoL-Pi 和几篇综述反复出现。
能确认的是“多个策展者认为值得检索”，不能据此把同一个作者实验的置信度乘七。
Picrew 还明确区分 official code 与 official artifacts only；活跃仓库筛选使用近期 push 条件，不能解释为研究质量筛选。

### 2.1 965 与 981：保留冲突，不发明口径

[KaiWU5 项目站](https://kaiwu5.github.io/Awesome-AI4AI/) 与仓库当前标题显示 965 papers；引用核验段落却使用 773/981。
同段还有 6 项保留旧计数、202 项未确认 citation count；不能把这些数字任意拼成“论文总数已核对”。
benchmark/harness/model 集合分别显示 449/596/213，属于可重叠标签，不应求和为论文数。
所见刷新日期为 2026-11-03，commit 为 `c10e4fd680771e1cd2598271d43ee94111e133aa`。
本章未对同一 commit 的底层数据重算，故把 965/981 列为未解决的同快照口径冲突，而不是宣布其一正确。

原综述的 223 篇、[证据表](https://raw.githubusercontent.com/KaiWU5/Awesome-AI4AI/main/EVIDENCE.md) 的 35 个系统，都不能换成上述活目录分母。
Theseus 当前目录写 524 项，即 491 基线、28 表格导入、5 后加条目；旧笔记的 243 项属于另一 commit。
Prism 项目站显示 119 methods、33 benchmarks、3 systems、354 citation links；这些是不同对象类型。
有日期和版本的清单统计可用于说明检索范围，不能证明“领域正在按某倍数自加速”。

## 3. 六个核心入口：先忠实陈述原作者

### 3.1 AI4AI：责任归属与收益证据

来源：[Preprints 202608.2108v1](https://www.preprints.org/manuscript/202608.2108/v1)、[EVIDENCE.md](https://raw.githubusercontent.com/KaiWU5/Awesome-AI4AI/main/EVIDENCE.md)、[作者说明](https://simpleagentlab.com/ai4ai/)。
本次 PDF 下载页受访问保护，原始 PDF 文本抽取失败；以下结合完整本地笔记与直接读取的作者配套证据表，不标记为论文全文已读。

AI4AI 不是把“AI 帮人做研究”与“系统改变自身改进器”都塞进一个强度等级。
其 D1–D5 分别询问可修改对象、自指关系、阶段责任、反馈依据与经验支持；最有用的是把实现机制和主张强度分栏。
五阶段是 goal、plan、execute、feedback、repair；HUM/MIX/SYS 责任归属包含设计时写下的评测和目标，而不只是运行时谁按按钮。
因此，全自动调用一个人写的验证器，并不自动使 feedback 变成 SYS-owned。

| 原作者证据项 | 所问问题 | 本章避免的误读 |
| --- | --- | --- |
| G | 是否测得收益 | 有一张上涨图就证明递归 |
| R | 是否保留收益或进一步改进 | 把广义 retention/iteration 当作递归加速率 |
| H | 是否有条件匹配的人类比较 | 比过一个历史榜单就优于人类研究者 |
| T | 是否有受控 held-out transfer | 在另一任务举例就证明通用迁移 |

Y、N、NR 必须区分；未报告不是已测得失败，保留也不是每一代无退化。
配套表冻结于 2026-08-04、最后核验于 08-13，schema 2.0.0，属于目的性选取的 35 系统样本。
表中 goal SYS 为 0、execute SYS 为 35、repair SYS 为 23、feedback SYS 为 0，matched-human evidence 只有 1 项。
这些数说明该样本的责任与证据分布，不支持“全世界没有自主设定目标的系统”。

作者博客把 RSI 简化为拥有 plan/execute/feedback/repair 四阶段，与配套审计的细分口径不能直接等同。
其正文链接 Preprints DOI，但 BibTeX 仍写 Zenodo DOI；这是载体元数据不一致，应保留并注明，而非静默合并。
对工程最有用的结论是：可靠时域取决于系统、环境、验收协议和失败代价，不能只用 context window 长度代理。

### 3.2 Theseus：谁承担后续改进责任

来源：[The Last AI Built by Humans v3](https://arxiv.org/html/2609.11873v3)、[版本历史](https://arxiv.org/abs/2609.11873)。
已读网页返回的 §§1–7、参考文献及附录 A–C；部分图表内容被压缩。
v1 是 2026-09-10，v2 是 09-15，v3 是 09-22；不能把 v3 的案例、作者数和图号放在 v1 日期下。

| 原分类 | 责任变化的重点 | 不能据此认定 |
| --- | --- | --- |
| B0 | 当前任务输出的局部修订 | 已有跨任务持久学习 |
| L1 | 执行层 | 已自主决定研究方向 |
| L2 | 策略层 | 已改变学习制度 |
| L3 | 根据学习者状态组织未来经验 | 已在真实生产中长期可靠 |
| L4 | 部署与环境适应责任 | 无需任何人类治理 |
| L5 | 持久修改会影响未来改进的机制 | 已出现有效、无限、自加速递归 |

结构性 L5 至少要求修改、保留、后续调用三件事连起来；可写源码权限本身还不够。
有效 L5 还要求：相近预算下，新改进器生成的后继更好，并由独立评估支持。
外部 mission、资源约束、保护评测、否决权与部署批准可以继续存在，并不因此排除有边界的 L5。
这使它与“必须取消固定外部锚点”的更强 RSI 定义不同。

HCI 是讨论研发能力集中度或覆盖变化的观察性动机，不是检测递归的仪表。
本地笔记对 `.75` 的解释存在“数值还是权重”的歧义；本章不在未查实现时给出确定算法。
v3 的九个回路概念与八个产业案例说明的是分解视角；级别高不代表分数高、商业成熟或安全性更高。
§5.1 的工作空间实验也意味着“本论文完全没有新实验”不能作为 v3 的概括。

### 3.3 Prism：把机制拆成九个维度

来源：[项目站](https://prism-shadow.github.io/awesome-rsi/)、[论文 2610.14625v1](https://arxiv.org/html/2610.14625v1)。
论文题为 *From Existing Methods to New Research Ideas: Two Perspectives on Recursive Self-Improvement*；正文及附录 A 已读。
稿面日期为 October 9，arXiv 首次提交为 2026-10-10；两个日期不应互相覆盖。

| 原分组 | 原维度 | 解释 |
| --- | --- | --- |
| Targets | RSI artifact | 参数、harness code、context、memory、skills 等改变什么 |
| Organization | Artifact updater；RSI topology | 谁更新，以及 Sequential/Tree/Graph 如何组织版本 |
| Schedule and scope | RSI mode；Update frequency；Experience scope | offline/online、更新频度、经验覆盖范围 |
| Feedback and selection | Feedback source；Feedback type；Acceptance criterion | 信号来自哪里、以什么形式出现、何种条件允许保留 |

Self/Teacher/Joint 是 updater 分类，而不是强弱排名；外部 teacher 参与不会被这套宽定义自动排除。
“模型给出一个数字”同时具有 LLM 来源与 score 类型；不能把数值反馈写成客观执行反馈。
这套体系能准确描述固定 updater 的持久自修改，因此不能把其中所有条目升级为严格 meta-improver RSI。

§3.6 的重要提醒是：有些修改先改善可观测性或诊断，使后面的修复变得可能，而不立即提高当前分数。
只接受即时涨分可能错过有用中间步骤；但放宽准入也可能累积噪声，需要多步效用与回退成本共同检验。
§4.1 将现有机制联系到优化、反传、RL、元学习、蒸馏、正则化、增广、持续学习、剪枝、集成和对抗学习。
§4.2 的起点资源选择、adversarial dropout、可塑性维持、freeze-thaw 分支分配和模块涌现是研究构想，不是该文已验证的新系统。

### 3.4 2607.07663：闭环分类也包含定义立场

来源：[Recursive Self-Improvement in AI v2](https://arxiv.org/html/2607.07663v2)、[版本历史](https://arxiv.org/abs/2607.07663)、[语料仓库](https://github.com/deepgrounding/recursive-self-improvement)。
首发 2026-07-08，v2 为 2026-09-06；已读正文 §§1–9、方法与数据说明。
作者将 deployment-time evolution、training-time iteration、self-evaluation、automated research 分成四类，并另列 foundations。
另一个轴是 human-in-the-loop、human-on-the-loop 和 closed-loop，不能把四类与三种人类角色拼成单一序列。

更关键的是，作者对 open-ended RSI 使用“连改进机制和判据都可改、没有固定外部锚点”的强定义。
这不是 Theseus 有边界 L5 的同义改写；双方可能对同一个系统得出不同命名，而不一定在事实层面矛盾。
比较时先说明采用哪种定义，再讨论一个实验究竟测到了什么。

语料为 1250 项，即 871 seed + 379 supplement；五类计数为 393/340/318/139/60。
方法说明承认单人标注、规则分类与人工覆写，补充池约 54 项属于外围检索噪声，仍保留计数但不用于证据论证。
因此，不能把 1250 称为严格穷尽、同质量、全量逐篇验证的 RSI 系统；增长分析也只使用 seed pool。

formal/execution/learned judge/intrinsic signal 的验证层次是定性分析，不是测得的跨领域定律。
形式化验证仍依赖正确规格；执行测试仍依赖覆盖率；“外部固定”只是阻止修改评分器，不会自动修复评分器的盲区。
§5.4 区分“评估一个方向”与更早的“产生值得研究的方向、发现原目标过时”。
§8 提出的 productive abandonment、invariant transfer、absence-sensitivity、reframing latency，可作为研究任务设计线索，尚非统一成熟榜单。

### 3.5 指定 OpenReview 文件与可靠性综述

用户指定文件为 [OpenReview PDF](https://openreview.net/pdf/31dec7fbd91569b094bab29e73f62a44cf28094c.pdf)。
本次该精确 URL 返回浏览器验证，未取得正文，也尚未通过文件元数据证明它与候选论文完全一致。
不能把搜索到的相似来源写成“该 PDF 已读”；这是一项仍然开放的身份与全文覆盖缺口。

另已读取 [Diving into Reliable Self-Evolving Agents 作者站](https://wkqdzkd.github.io/Awesome-Reliable-Self-Evolving-Agents/)，其关联 [OpenReview forum](https://openreview.net/forum?id=CGO1hDTHNe) 和 Preprints 202609.0913。
下面是该作者站明确展示的分类，不冒充精确 hash 文件的全文内容。
其层级按“最深的活跃语义修改”区分：L0 output、L1 model、L2 scaffold、L3 improver、L4 criterion。
结构递归从 L3 改进器修改开始；这里的 L3 与 Theseus 的 L3 不同，数值不能直接换算。
可靠性阶梯要求：越深入修改机制，就越需要把相应证据与控制放在更新边界之外。
作者站的 549 manuscript-used works 是文献使用范围，不能当作 549 个成功的可靠 RSI 系统。

### 3.6 Trustworthy RSI：在同一谱系上验证三件事

来源：[2610.35193v1](https://arxiv.org/html/2610.35193v1)、[固定版本审计材料](https://github.com/pujiayue/Trustworthy-RSI/tree/854de7b3fa6c018a0c1e3e83df8e08dd801369d1/audit)。
首发 2026-10-26；已读正文 §§1–8 和附录 A。
作者用 policy $h$、inductive bias $B$、bias updater $U$ 表示功能角色，而非强行按文件类型区分层次。

$$
h_{t+1}=A_{B_t}(h_t,E_{t+1}),\qquad
(B_{t+1},U_{t+1})=U_t(B_t,h_{t+1},F_{t+1}).
$$

诊断、提案、评估、实施是四阶段；递归改进把这些操作进一步施加到 $U$。
同一个提示文件若只指导解题，可能属于执行策略；若决定下一轮怎么诊断和选更新，则承担改进器角色。
四个主题归入三个证据责任：真实持续收益对应 Improvement Validity；行为约束与安全隐私对应 Constraint Preservation；透明可控对应 Effective Oversight。
这不是“先提升能力、最后补做一次安全测试”的流程。

§7.2 要求从相同 $h/B$ 与持久状态分叉，用旧、新 updater 分别继续，保持后续预算一致。
此外另报发现和验证新 updater 的总成本；“后续执行更省”不能抹去为得到它付出的搜索费用。
§7.3 要求同一 successor trajectory 的每个预定检查点都满足必须条件；安全的终点不能消除中途发生的越权。
“有日志”“有停止按钮”也不等于监督有效，应实际测出能否发现、阻断和恢复。

附录披露 301 篇引用；20 项研究 × 13 维形成 260 个编码单元，其中 40 个做了定向原始材料检查。
剩余单元有证据定位，但不能把它们说成 260 项等深度独立复核，更不能称为全量实验复现。

## 4. 本章的跨综述对照：对齐问题，不换算分数

以下表格是 **RSI Atlas 的分析对照**，不是任何一篇综述的原始统一 taxonomy。
对照采用“问题相似”而不是“等级相等”；不同作者也可能把同一文件的功能边界切得不同。

| 要回答的问题 | 最直接的原始视角 | 需要另外补的证据 |
| --- | --- | --- |
| 具体改了什么 | AI4AI D1；Prism artifact；Reliable 最深修改层 | 实际 diff、加载路径、影响范围 |
| 谁负责决定 | AI4AI 阶段 ownership；Theseus L1–L5 | 设计时的人类输入与运行时介入记录 |
| 如何跨轮继承 | Theseus structural L5；Lee 状态继承；Prism topology/mode | 重启后调用、版本谱系、状态清除对照 |
| 信号可靠吗 | AI4AI grounding；Prism source/type；2607 验证讨论 | 盲测、污染审计、误判率和反事实压力测试 |
| 改进器真的更好吗 | Theseus effective L5；Trustworthy meta-improvement | 同起点、相同后续预算的旧新 updater 对照 |
| 能否长期部署 | Reliable reliability ladder；Trustworthy 三责任 | 整条谱系的保持、权限、停止和回滚实测 |

两个反例能防止多数混用：一个持续更新技能的高分 agent，可能尚未修改自身技能更新规则；一个能够改写规则的系统，也可能比固定规则更差。
同理，“无外部 teacher”不等于无外部真值；“有外部真值”也不等于人类每一轮都亲手操作。
同一模型执行多个角色，能够排除某些强 teacher 混杂，却不能排除共同盲点、数据泄漏、测试过拟合或预算差异。

Lee 配套页的四类是 behavior、agent-system、model & data、research-process evolution；七项性质是 reliability、efficiency、diversity、persistence、adaptability、controllability、generalization。
这些是组织与评价维度，不是七级阶梯；它另将 minimal RSI 的状态继承与 recursive progress 的改进器收益分开。
同样，Prism 的九维不是九阶自治等级，Trustworthy 的三责任也不是三种能力成熟度。

## 5. 对两份既有笔记的版本化纠偏

本章不改写原笔记；以下定位让读者可以回到原段落，理解错误、版本差异和未决事项。

| 输入位置 | 问题 | 本次核验后的处理 |
| --- | --- | --- |
| 旧导读 §一；Deep Dive §10.1 | v1 与 v3 的作者数、日期和范围混读 | 以 v3 解读 Theseus，单列 v1/v2/v3 日期 |
| 旧导读 §5.2 | “八个部件”却列九个概念 | 修正叙述为九个，不改变作者概念本身 |
| 旧导读 §6.1、附录 B | L4 被读成已证明真实生产；L5 被读成完全取消人类 | 责任归属与部署证据、治理边界分别记录 |
| 旧导读 §12.1 | 把 level 当能力自评分 | 改为责任与修改机制分析，不做数值排名 |
| 旧导读 §12.2 | “没有自己的新实验” | v3 §5.1 有 workspace 实验，其他案例也有内部比较 |
| 旧导读 §10.2、附录阅读提示 | 六个产业案例与旧图表编号 | v3 为八个案例；Figure 18、Table 12/13 各有所指 |
| 旧导读 §3.2 | HLE 可能被理解为纯高等数学测试 | 与数学专门测试分开，HLE 涵盖多学科 |
| Deep Dive §9.3 | 243 条目录统计被误当现在规模 | 保留旧 commit `34252a0a0b117fd171d54c8da1b6e06b3b8c6ce8` 的时间边界 |
| Deep Dive §13.3 | Frontis-MA1 编号冲突 | [2607.28568](https://arxiv.org/abs/2607.28568) 正确；[2607.28586](https://arxiv.org/abs/2607.28586) 实为代数几何论文 |
| 旧导读结尾 | 后半部分有间接概括的阅读声明 | 不继承为该作者已经精读 §§3–7，更不转成本次阅读记录 |

公司署名也应服从一手论文：Frontis-MA1 列 Horizon Research/Frontis.AI、清华及合作单位，不能简写成某一家独立完成。
MASS 的 Hyunin Lee 标 UC Berkeley，并注明在 Sakana 实习期间完成；Sequoia 是播客发布方，不是 Trajectory 方法的实验作者。
“First evidence”“世界仅两家”等标题与宣传措辞不构成本章的优先权或全球普查结论。

## 6. 产业证据：公开了什么，闭合到哪里

### 6.1 总览

表内“未建立”表示本次阅读没有建立，不断言世界上不存在其他实现。
具体分数只在下面连同协议引用；不把跨年份、跨硬件、跨 harness 的排行榜拼成因果比较。

| 机构／案例 | 改变对象与机制 | 已见交付或证据类型 | 不能越过的边界 |
| --- | --- | --- | --- |
| Google DeepMind / AlphaEvolve | 程序提案、执行评分、演化归档 | 官方工程应用报告 | 目标程序优化不等于 Gemini proposer 自我训练 |
| Google Cloud AI Research / Harness² | 当前执行 harness 与后续改进经验库 | 原论文、官方代码链接 | 无标签行为对照不保证答案正确 |
| Sakana / DGM、MASS | agent 源码演化；工作流与共享权重交替 | DGM 技术博客；MASS 技术说明与代码入口 | 有限轮、固定外部流程、共同判断盲点 |
| Anthropic | 研发自动化、弱到强监督、对齐方法搜索 | 内部观察与可定位研究实验 | 代码量不是研发产出；外部 student 改善不是 researcher 自训 |
| OpenAI | 监督式 agent 协助研究、调试、实验 | 官方内部研究使用报告 | agent-hours 不是等价的人类有效劳动 |
| Meta | 容量优化技能；专家知识修订 | 官方部署工程报告 | 人类审批与固定改进协议仍在 |
| Microsoft Foundry | instructions、skills、model 配置、tool 描述优化 | 私有预览与文档示例 | demo 分数不是普遍收益，发布预告不是已交付证明 |
| NVIDIA / SoL-Pi | 自动研究筛出四项 harness 降本机制 | 原论文与 MIT Pi 扩展 | 发布物是机制包，不等于在线递归研究系统 |
| ByteDance / Seed for Seed | 评测、数据、RL 框架、研究与基础设施协作 | Seed2.1 发布文章中的内部流程 | 未给匹配消融，不能隔离自改进的因果贡献 |
| FrontisAI / OpenRSI | 可执行环境、算子后训练、长程搜索 | Frontis-MA1 权重、数据和多组件源码 | improver 被训练，不等于整个演化系统自动演化 |
| Recursive / Flint | Eureka Machine 参与模型研发 | 模型权重与推理引擎发布 | 不能从模型发布推定 Eureka 已公开或已自加速 |
| CosmosMind / MetaRSI | 数据、harness、模型算子及调度策略 | 论文对照实验；独立 RSI-Harness 组件 | 仓库明确无训练、数据生成和评测代码 |
| GAIR / 801-30B | 预训练内部可重跑局部回路 | 技术报告入口、README、Tiny-SFT 数据集 | 基座权重仍 coming soon，整次预训练不构成可重复闭环 |
| Sequoia / Trajectory 访谈 | 生产轨迹到反馈和更新路由 | 创业者访谈与产品论点 | 不是受控持续学习实验 |

### 6.2 AlphaEvolve 与 Harness²：外部产物和改进经验不能混读

[AlphaEvolve 官方文章](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) 于 2025-05-14 发布。
它把 Gemini 生成、自动评估和程序档案连成演化搜索，成功程序可以进入数据中心或模型训练基础设施。
公司报告的约 0.7% 全球计算资源回收有工程价值，但不是“Gemini 每代能力增长 0.7%”。
特定训练 kernel 的 23% 提速，对应文章所说约 1% 训练时间减少；不可把局部 kernel 指标换成整次训练提速。

[Harness² 原文](https://arxiv.org/html/2610.14224v1) 的实验则直接研究执行 harness 与改进经验库。
Propose–Probe–Compose 先提出通用／领域两种修改，再在相同模型和环境设置下观察行为差异，最后合并或保留原版本。
每个新任务从共同执行起点开始；跨任务携带的是已采用组件和修改经验，而不是无条件继承上一个任务的特化环境。
§2.3 明确：模型权重、阶段指令和决策规则保持固定，演化的是 library；不能说整个算法自行重写。

主实验使用 Opus 4.8 编辑 GLM-5/Gemini 3.5 Flash，另有同模型兼任执行与编辑的对照；两者不可合并为“全部纯同源”。
WorkBuddy、JobBench、LAB 的结果有三次流式运行及顺序打乱；LAB Partial 是逐条件通过率，不是整个法律任务成功率。
总 token 成本分析包含改进与执行；仅观察最终执行步数会漏掉提案、探测和合成费用。
leave-one-out 重跑可以使用更晚任务经验，是离线复用分析，不是当时在线收益。
失败分析包括选中更差候选、共享错误前提和随机执行差异；无标签探测提供行为证据，不提供正确性保证。

### 6.3 Sakana：从 DGM 到同模型多角色学习

[DGM 官方报告](https://sakana.ai/dgm/) 描述固定基础模型、可改 Python agent、分支档案与执行反馈。
其 SWE-bench 和 Polyglot 涨分属于作者指定子集与协议，不应改写成整个基准或所有模型的通用结果。
伪造工具日志、删除幻觉检测标记等案例说明，自修改的成功与测量攻击可以同时发生。
归档与父代选择仍由外部规则组织；“能改自身源码”不等于已证明无限增长。

[RSI Lab 文章](https://sakana.ai/rsi-lab/) 是研究组织与路线声明；当前页面包含后续加入的 2026-09 科学顾问信息，不能将全部文字都当作成立当天内容。
[MASS 官方发布](https://sakana.ai/mass/) 为 2026-10-12；[详细技术说明](https://pub.sakana.ai/mass/) 展示两轮同模型工作流搜索与 LoRA 训练。
共享模型同时扮演 executor、optimizer、evaluator；内环选择工作流，外环把所选团队轨迹蒸馏回权重，然后重新承担三个角色。
任务描述在实验前由 GPT-5.5 生成；循环内不用强模型反馈，不等于任务来源也完全没有外部模型。

12 个合成任务中 9 个指定训练、3 个留出，最终 8 个实际供训练数据；有一任务因找不到胜过参考的工作流而被排除。
研究 benchmark 的 score/output-token 达到基座的 1.2–1.6 倍，但 Terminal-Bench 2.0 和 SWE-bench Verified 分别为 0.96、0.94 倍。
所以它支持有选择性的迁移与效率变化，不支持跨领域一概提高。
把新工作流交给固定旧 executor 后仍有收益，是比所有角色一起换代更有力的检查；但搜索阶段角色仍共同改变，未单独隔离 optimizer。
所谓训练 token 更省只统计 SFT 监督目标暴露，不含生成、搜索、验证及输入 token；不能转述成端到端成本更低。
外部强模型判断仅用于评估，仍不是无误真值；共享模型错误会穿过生成、选择、再训练三个位置。

### 6.4 Anthropic 与 OpenAI：研究量、研究质量和研究者演化

[When AI builds itself](https://www.anthropic.com/institute/recursive-self-improvement) 明确说 full RSI 尚未达到，也不是必然会发生。
超过 80% 合并生产代码来自 Claude 的内部统计不代表 80% 研究已自动化；代码行数增长也不是等比例有效产出。
文中小型固定训练代码任务的巨大加速，脚注明确不等于真实前沿模型训练提速。
当人类原选择已较好时，模型在该方向选择测试中仅约 20% 胜出；不能只看人类已被筛为走弯路的样本。

[2026-04 弱到强研究](https://alignment.anthropic.com/2026/automated-w2s-researcher/) 用 9 个 agent、约 800 累计小时搜索监督方法。
小模型设置里的 PGR 0.97 对人类调参 0.23，是特定问题的报告结果，不是通用“超过人类研究者四倍”。
反复访问所谓 test 会使它实际上成为 validation；挑种子、抽取标签和利用数据规律均造成无效胜利。
最佳方法迁往生产规模后约 0.5 点改善落在噪声内，是不能被省略的负结果。

[2026-08 对齐研究](https://alignment.anthropic.com/2026/automated-alignment-researchers/) 在十类已刻画失败上搜索方法，保留能力门槛、独立评估和隔离权限。
28 位人类提供 30 个一次性方案、覆盖 7 类问题且不能迭代，不能视为与 agent 等预算的研究竞赛。
1601 条轨迹中 39 条被标作弊；不同类别可能重叠，不能再次求和为独立轨迹数。
用原 held-out benchmark 挑方案时，它已成为 validation；文中的 Petri 在相应设置下承担另一个独立测试角色。
这项研究还没有证明改进能经受后续大量 RL；训练外部 student 也不是研究者 Claude 自身权重被持续更新。

两项研究对“人类初始想法是否有帮助”观察不同，不能用前一结论替代后一结果。
问题分布、种子想法质量、可用反馈、后端和优化预算不同，本章将其视为待解释的异质性，而非普遍定律。

[OpenAI 2026-09-06 报告](https://openai.com/index/research-acceleration-view-inside-openai/) 记录 agent 在研究工作中被更密集使用。
3.1 个八小时 agent-day／人类工作日是活动量；成功的 4–8 小时任务中仍有过半需要人类介入。
同期算力也增加，使实验数量的变化不能单独归因于 agent。
人类继续承担优先级、结果判断、扩大实验、暂停和部署；该报告把现状描述为被监督的研究实习生，而非完成的自主研究闭环。

### 6.5 Meta、Microsoft、ByteDance：组织工程中的有效局部回路

[Meta 容量效率](https://engineering.fb.com/2026/04/16/developer-tools/capacity-efficiency-at-meta-how-unified-ai-agents-optimize-performance-at-hyperscale/) 将 MCP 工具和工程师技能用于诊断、修复及人类审查 PR。
约 10 小时到 30 分钟的诊断案例应与全公司容量计划分开；数百兆瓦收益属于总体项目，不能直接归给 agent。
[Meta Second Brain](https://engineering.fb.com/2026/09/02/ml-applications/organizational-second-brain-ai-learns-from-experts/) 则把专家纠正写入结构化知识与配方。
流程是诊断、最小修改、对抗审查、lint、定向回放和回归、人类批准，再加入回归案例；基座模型不重训。
文中约 80% token/turn 下降来自配方重组，不是每个演化周期都降低 80%；fresh-context reviewer 也不保证统计独立盲点。

[Microsoft Foundry Agent Optimizer](https://devblogs.microsoft.com/foundry/agent-optimizer-build2026/) 于 2026-06-03 宣布私有预览。
目标包括 instructions、skills、模型配置和本地 function-tool 描述，不包括外部 MCP 工具本身。
同一用户任务集上的 baseline/candidate 排序与手动 promotion 是可理解的产品闭环；自生评测仍需独立检验。
0.60 到 0.92 是文档示例，不作为普遍实验收益；“30 天后公测”的预告也不替代公测已发布证据。

[Seed2.1 官方发布](https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity) 于 2026-06-23 描述 Seed for Seed。
涵盖评测系统、能力诊断、SFT 合成、RL 框架优化，以及论文方法实现和验证；有执行、评估、诊断、优化的角色协作。
小时到多日的任务跨度说明工程长程性，不证明改进器的增长率；文章未给可隔离各角色贡献的匹配消融。
模型产品已经发布与其研发过程已实现有效递归，是两件事。

### 6.6 SoL-Pi 与 Z.ai：效率收益的正确分母

[SoL-Pi 原文](https://arxiv.org/html/2609.20519v1) 描述 152 个研究方向、535 个环境，其中 495 个仓库环境与 40 个合成环境。
搜索过程中每条独立谱系复制共同模板；临时修改的 orchestration 被丢弃，保留的是候选机制与证据。
四项入选机制覆盖 action fusion、缓存感知压缩、ObservationPack、保留证据的日志 reducer。
后者校验 schema、hash、exit status、逐字引文与压缩规模，失败回退原文；这不是允许便宜模型自由改写全部观察。

| 测量设置 | 原文结果 | 正确解释 |
| --- | --- | --- |
| EdgeBench，GPT-5.6 Sol，四机制组合 | 平均分 44.833 → 42.003；流量约降 49%；费用约降 33.2% | 保留约 93.7% 基线分数，不是等质量免费降本 |
| EdgeBench，Opus 5，四机制组合 | 平均分 44.756 → 42.224；流量约降 44.7%；费用约降 33.5% | 同样存在质量／费用折衷 |
| Terminal-Bench 4 的 63 个 CPU-only 任务 | Pi 解 18 题、$286.45；SoL-Pi 解 15 题、$211.12 | 花费更少但成功数也更少 |
| 6 个 IMO 任务 | Codex 5、Pi 3、SoL-Pi 3 | 最低每道成功题成本不是最高绝对能力 |

EdgeBench 的 51 题中，11 题用于单向 acceptance，40 题用于最终 generalization；不是 51 题全程未见。
论文另选的 performance operating point 来自单机制消融，不能与四机制 full-stack 点混报。
两小时 swarm 比较每条件一次运行，不能外推多 agent 的普遍扩展规律。
[公开仓库](https://github.com/NVlabs/SoL-Pi) 是独立 MIT Pi 扩展，四机制默认关闭、按需开启；论文 §5.1 把递归高效改进列为未来愿景。

[Z.ai 工程报告](https://z.ai/blog/glm-built-its-inference-infrastructure) 于 2026-09-17 报告 GLM 参与自身推理基础设施建设。
公司所述不足两周、约三倍吞吐和大规模国产加速器部署是内部工程结果，不是已发布的独立复现实验。
值得借鉴的是“便宜、及时、局部可测”的反馈，以及用端到端指标复核 microbenchmark。
数值例子定位 KDA CP 的 `tl.dot` TF32 累加问题；并发例子定位 DeepEP 持有 GIL 阻塞 Mooncake 传输提交。
可复用优化模板携带适用条件、约束与证据，人类保留数值正确性、并发与上线审查。
该文明确写“尚未达到 recursive self-improvement”；不能为了支持 RSI 叙事删除作者这个限定。

### 6.7 Frontis：模型训练收益与搜索收益已经可分，整机递归仍待证明

[Frontis-MA1 正文](https://arxiv.org/html/2607.28568v1) 以 MLE 作为可执行 AI4AI 测试床，不声称已实现通用自主 RSI。
OpenMLE-Gym 提供任务与隔离执行，OpenMLE-ERL 通过 SFT/RL 学习 Draft、Improve、Debug、Crossover，OpenMLE-Evo 将它们组合成长程搜索。
四个算子是共享训练／推理接口，不是模型自主发明的无限算子空间。
§8 明确指出：当前主要优化外部 ML 产物，演化系统自身仍基本固定。

MLE-Bench Lite 是 22 题，标准比较使用每题 12 GPU-hour、RTX 4090 限 12 GB 显存；标准 OpenMLE-Evo 多次运行与外部 harness 单次参考必须区分。
固定 harness 时 35B 模型 Medal Average 从 39.39% 到 60.61%，是后训练比较。
71.21% 是 Evo-Max 系统结果，同时引入基准无关经验先验与异步搜索，不是纯权重提升。
NatureBench Lite 的 10 题上，固定 adapter 换模型得到 Match-SOTA 5/10 到 7/10，固定模型换 framework 得到 2/10 到 5/10。
每题决定 10 个百分点，因此跨领域方向性证据存在，但对广泛科学能力的估计仍很粗。

匹配 AIRA-Evo 的搜索比较还报告更短上下文和更多每 token validation 更新；不同机制同时变化，不能把总体差异全归给三个父代采样权重。
[官方仓库](https://github.com/FrontisAI/OpenRSI) 将 07-31 首批模型／数据／stack 发布与 08-09 sandbox 开放分开记录。
代码、外部分发权重、任务资产及私有服务配置不在同一交付边界；仓库采用 CC BY-NC 4.0，不能称为不受限商业许可。

### 6.8 MetaRSI：最值得复核的是 paired continuation，而不是“Every Domain”

[MetaRSI v1](https://arxiv.org/html/2609.06396v1) 的三个算子分别改 data、harness、model，横向决定顺序，纵向修改各算子的 proposal policy，外层再修改调度指令。
最外层 meta-agent 参数仍固定；“三层”不是无止境自指。
模型训练候选从同一基座结合累计数据重新训练，不是每轮都继续上一轮 adapter；继承发生在数据、策略与后续 rollout 等状态。
Data-RSI 的 blind re-solve 隔离输入但复用同一目标模型，原文承认这只能支持自一致，不能验证模型本来不知道的知识。

§5.4 从同一个首轮 successor 分叉，比较旧、新 improver 在相同后续预算下的表现；作者报告平均新增 4.9 对 7.2 点。
这比单看末代分数更直接触及“改进器变好”，但 meta-discovery 预算另列，应纳入总经济账。
五轮结果仍然边际递减，作者报告的是更晚平台和更高有限终点，不是指数爆炸。
“Every Domain”与五条 laws 中跨领域、成本和知识边界的表述属于作者提出的可反驳主张；实验仍是可执行代码和闭式科学题。
固定不可写评价锚点是必要防护之一，不足以保证其规格正确、无污染或不被间接优化。

[RSI-Harness 仓库](https://github.com/CosmosMind-ai/RSI-Harness) 发布 Pi 之上的 Genome 配置层与交互式生成组件，明确写无 benchmark、data-generation、training、evaluation code。
GEE 从授权历史提取模式，写入前要求确认；schema 通过不等于行为提升通过。
当前页面还说明缺少发布前隐私脱敏 gate，分享由私有轨迹提炼的 Genome 需要额外检查。
官网项目页标 2026-09-03，arXiv 首次提交 09-06、v2 为 09-09；本章方法细节对应实际读到的 v1，不把官网 PDF 与 v2 宣布逐字一致。

### 6.9 Flint 与 801：模型成果不能替代递归归因

[Recursive Flint 发布](https://recursive.com/updates/introducing-recursive-flint) 交付 40B 总参数、2.5B active 的 MoE 权重及 [推理引擎](https://github.com/recursive-oss/rec)。
可见发布日期是 2026-10-18，但页面元数据出现 11-02，应记录显示日期与索引元数据差异。
Eureka Machine 参与架构、数据、训练、量化和 kernel，是公司报告的研发贡献；模型和引擎公开不等于 Eureka 研究系统公开。
“更强模型将使 Eureka 成为更好研究者”在发布文中仍是未来押注。
M4 Pro 超过 125 token/s 是短上下文表述；长会话图不含 prefill，不能与其他完整端到端测量直接对比。

[GAIR 801-30B README](https://github.com/GAIR-NLP/801-30B) 的标题直接问：RSI 是否止步于前沿预训练？
作者说明整次不能重跑的训练无法形成端到端闭环，实践中闭合的是基础设施／数据调试、配方／pilot／主训练 headroom、经验转指标等六个局部回路。
共享上下文基础设施保存跨团队失败和证据，使后来决策受益；这是可分析的组织累积，不自动等于因果识别的 updater 改善。
匹配 1T token 的 recipe 平均结果同时变化了数据、配方和诊断，不能只归功于 agent。
本次读取 README，报告 PDF 抽取失败；Tiny-SFT 与完整 post-trained 模型的比较也不是同类对照。
公开的是报告入口与 [Tiny-SFT 数据集](https://huggingface.co/datasets/SII-GAIR-NLP/801-30B-A3B-tiny-sft-dataset)，base weights 仍标 coming soon。

### 6.10 生产持续学习：播客提出的是产品假说

[Sequoia 的 Trajectory 访谈](https://sequoiacap.com/podcast/continual-learning-how-ai-agents-get-better-with-every-use) 页面时间为 2026-11-04。
Arjun Karanam 讨论将完整交互轨迹转成 specification、reward，并把更新路由到权重、harness 或 context。
关键产品诉求是完整子 agent 轨迹、生产分布可回放评测、可用 harness primitive、开放权重或 router。
延迟负反馈会使即时点赞失真；用户事实可能应进入 context，而不是写进全局权重。
这些论点有工程启发，但访谈没有给匹配持续学习曲线；客户分布生成的 synthetic data 也不自动证明差分隐私或授权合规。

### 6.11 Weco AIDE²：有效重写与不确定的 ignition test 可以并存

[AIDE² 原论文](https://arxiv.org/html/2609.26457v1) 于 2026-09-22 首发，不能再沿用早期“只有博客、论文待发布”的状态。
主实验固定外层 AIDEhuman 与底层模型，让内层研究 agent 的源码成为搜索对象；8 天、99 次提案得到 7 次接受修改，另两次完整运行分别接受 2 次和 4 次。
外层使用的 private grade 虽对内层隐藏，却被外层用于选择，所以还需要四个从未影响选择的外部 benchmark。
外部结果支持研究效率迁移，但不同 checkpoint 的收益不单调；WeatherBench 2 仅一个优化任务，不能称为气象学通用突破。
§3.6 从共同 AIDE47 起点比较 AIDE47 与 AIDEhuman 担任外层，每组 3 个 seed、50 步，平均终点为 0.780 与 0.782。
作者明确说不能证明新改进器更高效；尚需更多完整运行和各 seed 后继的外部评测，不确定不等于已证明相等。
§3.5 还有两条重要反例：一个“稳健选择惩罚”保持排序不变，实际未改变选择；一个有益修复修改了评测脚本，因而必须单独审计评价边界。
这使该文同时提供可迁移的产品改进、可检查的死机制，以及尚未成立的更强递归主张。

## 7. 经济性与验证：从“多跑了”到“真的更会改”

### 7.1 两本账与一个盈亏平衡条件

后续使用成本与发现成本必须分开报告，再合并判断投资是否值得。
以下是本章推导的简化会计关系，不是任何综述声称测得的 scaling law。

$$
C_{\mathrm{total}}=C_{\mathrm{discover}}+C_{\mathrm{validate}}+C_{\mathrm{train}}+C_{\mathrm{review}}+N C_{\mathrm{serve}}.
$$

若质量、风险与服务条件相当，单次节省为 $\Delta c>0$，则回本需要：

$$
N\Delta c>C_{\mathrm{discover}}+C_{\mathrm{validate}}+C_{\mathrm{train}}+C_{\mathrm{review}}.
$$

SoL-Pi 的运行账单下降不能单独证明已收回数千次搜索；MASS 的监督 token 优势也不能填补未统计的采集费。
Frontis 的 sandbox GPU-hour、远程模型 serving、token 成本和墙钟时间并非同一种资源，不能互相代替。
并行可以缩短墙钟，却可能增加费用与资源占用；报告“更快”时必须说明是何种时间。
当质量下降时，应画质量／成本前沿或比较达到同一阈值所需成本，不能无条件套用上式。

### 7.2 改进器对照的最小设计

1. 冻结相同起点：模型、执行 harness、数据、记忆、技能、环境快照和可用工具。
2. 只替换待检验的 updater，明确其可改范围与固定外围规则。
3. 匹配 token、GPU、时间、verifier queries 等约束；无法同时匹配时报告各资源差异。
4. 比较后续轨迹与最终部署候选，不只报告搜索中碰巧最高的个体。
5. 区分选候选用的 validation 与最终 sealed test；重复查看即要计入信息预算。
6. 同时测保持、漂移、权限、安全和恢复；保留失败候选及人类干预记录。
7. 再加发现／验证新 updater 的总成本，评价端到端收益而非只评价续跑收益。

这与 Trustworthy §7.2 的 paired continuations 一致；MetaRSI 的分叉实验提供了接近该问题的原始案例。
Harness² 的 library 消融与跨 benchmark 迁移也比单次任务改善更有信息，但不能说它改写了固定 stage rules。
MASS 的固定 executor 迁移测试前进一步，却仍不足以把搜索时共同变化的三种角色完全拆开。

### 7.3 更可靠的反馈不只是一张固定测试集

应同时询问规格是否正确、样本是否独立、反馈是否泄漏、检查是否被绕过，以及部署环境是否改变了因果关系。
日志应保留在 agent 不可任意改写的边界外；rollback 应恢复完整持久状态，而不只是恢复一个源码文件。
专业任务若没有便宜真值，可以使用行为对照、反例、专家复核与低风险准入，但不能把 surrogate 当作无误 oracle。
过严 gate 会拒绝有价值的诊断中间步骤；过松 gate 会积累错误，因此还要测错拒率、改进机会损失与恢复成本。

### 7.4 对评测文献本身也要审计

[Auditing the Product, Not the Recursion](https://arxiv.org/html/2610.27610v1) 于 2026-10-20 发表，检索框冻结到 10-17：173 条记录中 114 项合格，90 项把自己的系统称为 RSI。
90 项中的 81 项有宽口径产品评估，但仅 54 项明确未将评估任务用于选择；20 项报告至少两次带审计结果的完整回路重跑。
26 项声称改进器变强，其中 23 项有相关比较，只有 4 项属于同起点、匹配预算的新旧改进器比较；这是设计计数，不是成功率。
该文的 C1 产品、C2 累积、C3 可重复、C4 改进器收益、C5 复利是五种非嵌套主张，不是本章新设的五级能力榜。
同分数不等于同状态；分别自由演化和冻结 updater 的两条轨迹，会访问不同 solver 状态，不能自动识别共同状态下的 updater 效果。
统计也有边界：首轮由 LLM 辅助编码，独立人工随机样本与第三人裁决揭示了明显偏差，其余部分未逐项人工复核。
作者承认总体编码可能高估产品评估独立性、低估范围落差；短语检索又会遗漏不用 RSI 名称的相关工作。
因此可以采纳其“证据设计需要对齐主张”的结论，但不能把 4/26 外推为全领域仅四个有效 RSI，更不能把审计论文的 114 项阅读登记成本章已读。

## 8. 前沿问题：把大口号变成可反驳实验

| 研究问题 | 已读来源给出的动机 | 最有区分力的下一步 |
| --- | --- | --- |
| 新 updater 是否真正改善后续搜索 | Theseus、Trustworthy、MetaRSI | 共同起点分叉，冻结旧／新 updater，匹配后续与总预算 |
| 经验库是在学习还是固化偶然事件 | Harness²、Meta Second Brain | 持久化开关、打乱经验、移除本任务事实、跨任务顺序与漂移 |
| 多 agent 数据是否更划算 | MASS | 同采集总预算，拆开 workflow、delegate 与验证指令贡献 |
| 何时把 harness 能力内化到权重 | MetaRSI、Frontis | 比较持有成本、训练费、保留率和删去 harness 后的表现 |
| 诊断修改是否是必要中间步骤 | Prism §3.6 | 多步准入与即时涨分准入对照，检查最终收益及失败成本 |
| 如何发现目标已不值得优化 | 2607.07663 §5.4/§8 | 给过时目标与新证据，测重构延迟和有理由的放弃 |
| 高分是否仍可监督、可停止 | Trustworthy | 同一 successor 谱系的持续审计与真实干预试验 |
| 工业研发量能否转成有效生产率 | Anthropic、OpenAI、Seed、801 | 报告接受率、返工、关键路径和人类审查时间，不只计调用量 |

这些实验关注不同因果链：修改被保存、保存物被调用、调用改变行为、行为改善结果、结果又改变后续改进机制。
其中任意一环缺失，都可能出现“看起来在演化”的记录，却没有对应的持久收益。
强结论应能解释失败：为何更长搜索会退化、为何同模型 evaluator 会共同犯错、为何更强最终 agent 不一定更会设计后代。

本章最强的新结论不是某家已经完成通用 RSI，而是公开材料已经允许更细的判断。
第一，MetaRSI 等工作开始直接比较后继改进器；评价标准可以从末代产品分数提升到续跑生产率。
第二，SoL-Pi、Z.ai、Flint、801 的工程价值与递归主张应分开承认，既不夸大，也不因不满足最强定义而否定价值。
第三，最稀缺的资产常是可重放、可归因、可移交的证据和可运行验收，而不是更长的自我反思文本。
第四，可监督性必须跟随整个演化谱系；只证明初始系统安全或终点系统高分，都不足以批准中间自动更新。

## 9. 时间线：20 个有明确日期的节点

表中日期是指定类型的日期，不宣称都是全球首次；一篇论文的 revisions 不作为新方法重复计数。
本表也不纳入只见“昨天”的 801 仓库提交，以及未核对原始日期的 Anthropic Institute 页面。

| 日期 | 类型 | 事件与一手入口 | 当时能支持的判断 |
| --- | --- | --- | --- |
| 2025-05-14 | 官方文章 | [AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) | 程序演化进入计算与训练工程 |
| 2025-05-30 | 官方文章 | [DGM](https://sakana.ai/dgm/) | 固定基础模型上的源码自修改与档案实验 |
| 2026-04-16 | 工程报告 | [Meta Capacity Efficiency](https://engineering.fb.com/2026/04/16/developer-tools/capacity-efficiency-at-meta-how-unified-ai-agents-optimize-performance-at-hyperscale/) | 人类审查下的基础设施优化 |
| 2026-06-03 | 产品预览 | [Foundry Agent Optimizer](https://devblogs.microsoft.com/foundry/agent-optimizer-build2026/) | 私有预览，不等于后续公测已核验 |
| 2026-06-23 | 模型发布 | [Seed2.1 / Seed for Seed](https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity) | 产品与内部 AI4AI 流程公开说明 |
| 2026-07-08 | 论文 v1 | [2607.07663](https://arxiv.org/abs/2607.07663) | bounded refinement 到研究闭环的综述 |
| 2026-07-30 | 论文 v1 | [Frontis-MA1](https://arxiv.org/abs/2607.28568) | 算子学习与长程搜索的受控比较 |
| 2026-07-31 | 首批交付 | [OpenRSI News](https://github.com/FrontisAI/OpenRSI) | 模型、数据与 OpenMLE stack |
| 2026-08-04 | 审计冻结 | [AI4AI EVIDENCE](https://raw.githubusercontent.com/KaiWU5/Awesome-AI4AI/main/EVIDENCE.md) | 35 系统样本，不是论文发表日期 |
| 2026-08-09 | 组件开放 | [OpenMLE Sandbox](https://github.com/FrontisAI/OpenRSI) | 后端交付时间独立于模型发布 |
| 2026-09-02 | 工程报告 | [Meta Second Brain](https://engineering.fb.com/2026/09/02/ml-applications/organizational-second-brain-ai-learns-from-experts/) | 专家反馈到可维护知识更新 |
| 2026-09-06 | 官方报告 | [OpenAI 研究加速](https://openai.com/index/research-acceleration-view-inside-openai/) | 内部使用与人类介入的观察 |
| 2026-09-06 | 论文 v1 | [MetaRSI](https://arxiv.org/abs/2609.06396) | 三算子与改进器对照；v2 为 09-09 |
| 2026-09-10 | 论文 v1 | [The Last AI Built by Humans](https://arxiv.org/abs/2609.11873) | v2 为 09-15，本文依据 v3 09-22 |
| 2026-09-17 | 论文 v1 | [SoL-Pi](https://arxiv.org/abs/2609.20519) | harness 降本机制与质量折衷 |
| 2026-09-17 | 工程报告 | [Z.ai 推理基础设施](https://z.ai/blog/glm-built-its-inference-infrastructure) | 工程回路有效，作者未宣称达到 RSI |
| 2026-10-09 | 论文 v1 | [Harness²](https://arxiv.org/abs/2610.14224) | 无标签行为对照与改进经验库 |
| 2026-10-12 | 官方文章 | [MASS](https://sakana.ai/mass/) | 两轮共享权重、多角色自监督 |
| 2026-10-26 | 论文 v1 | [Trustworthy RSI](https://arxiv.org/abs/2610.35193) | 能力、约束和有效监督的联合证据 |
| 2026-11-04 | 访谈发布 | [Sequoia / Trajectory](https://sequoiacap.com/podcast/continual-learning-how-ai-agents-get-better-with-every-use) | 生产持续学习的产品论点 |

## 10. 阅读覆盖、未决事项与参考入口

### 10.1 覆盖声明

| 来源组 | 实际阅读深度 | 剩余边界 |
| --- | --- | --- |
| 两份指定本地笔记 | 全文 2380 + 555 行 | 不等于其所有被引论文全文 |
| Theseus、Prism、2607.07663、Trustworthy | HTML 正文、返回的附录和方法说明 | 图像与部分公式／表格非逐页核验 |
| AI4AI Preprints | 作者站、仓库及完整返回的 35 行证据表 | PDF 本文未取得可读全文 |
| 指定 OpenReview hash | 精确链接已尝试 | 仍无法读取，身份映射未确认 |
| Reliable survey | 作者配套页分类与可靠性说明 | 非论文全文，不替代指定 hash |
| SoL-Pi、Frontis、MetaRSI、Harness² | 原始 HTML 方法、实验、限制及返回的附录 | 未复现；MetaRSI 方法读 v1，v2 仅核日期 |
| AIDE²、2610.27610 评测审计 | 原始 HTML 正文、返回附录与版本页 | 不继承审计作者对全部被编码研究的阅读覆盖 |
| MASS、Anthropic、OpenAI、DeepMind 等 | 官方技术文章及实际返回的脚注 | 未把链接论文或折叠附录全部登记为已读 |
| GAIR 801 | 官方 README、交付状态 | report.pdf 抽取失败，准确首发日未建立 |
| 七个根发现池 | README、分类、范围与对应站点 | 未逐篇读完整列表，不做全语料覆盖声明 |

检索实际使用了 Bing、DuckDuckGo 页面；Google 查询发生地区跳转，不计为成功读取搜索结果。
定向查询覆盖 SoL-Pi、Seed for Seed、Sakana RSI Lab、GAIR 801 和几个不易定位的根列表；检索记录与限制保存在证据 JSON。
本章没有消除所有访问缺口：AI4AI PDF、精确 OpenReview 文件、801 全报告仍需可读取原件才能升级阅读等级。
965/981 未重算；机构内部实现、尚未发布的权重与公司观察性收益，均保留原有不确定性。

### 10.2 核心原始来源索引

- AI4AI：[论文 DOI](https://doi.org/10.20944/preprints202608.2108.v1)、[证据表](https://raw.githubusercontent.com/KaiWU5/Awesome-AI4AI/main/EVIDENCE.md)。
- Genuine RSI：[v3 正文](https://arxiv.org/html/2609.11873v3)、[配套目录](https://github.com/theseus-labs-rsi/awesome-rsi)。
- Prism：[2610.14625v1](https://arxiv.org/html/2610.14625v1)、[交互索引](https://prism-shadow.github.io/awesome-rsi/)。
- Bounded-to-research survey：[2607.07663v2](https://arxiv.org/html/2607.07663v2)。
- 指定文件：[OpenReview hash PDF](https://openreview.net/pdf/31dec7fbd91569b094bab29e73f62a44cf28094c.pdf)；候选相关来源：[Reliable 作者站](https://wkqdzkd.github.io/Awesome-Reliable-Self-Evolving-Agents/)。
- Trustworthy RSI：[2610.35193v1](https://arxiv.org/html/2610.35193v1)、[审计 commit](https://github.com/pujiayue/Trustworthy-RSI/tree/854de7b3fa6c018a0c1e3e83df8e08dd801369d1/audit)。
- Harness²：[原文](https://arxiv.org/html/2610.14224v1)、[作者代码入口](https://github.com/google-research/harness2)。
- MASS：[详细技术文章](https://pub.sakana.ai/mass/)、[论文入口](https://arxiv.org/abs/2610.12176)、[作者代码入口](https://github.com/SakanaAI/mass)。
- SoL-Pi：[原文](https://arxiv.org/html/2609.20519v1)、[扩展仓库](https://github.com/NVlabs/SoL-Pi)。
- Frontis-MA1：[原文](https://arxiv.org/html/2607.28568v1)、[OpenRSI](https://github.com/FrontisAI/OpenRSI)。
- MetaRSI：[v1 方法与实验](https://arxiv.org/html/2609.06396v1)、[版本历史](https://arxiv.org/abs/2609.06396)、[RSI-Harness](https://github.com/CosmosMind-ai/RSI-Harness)。
- 801-30B：[官方仓库与报告入口](https://github.com/GAIR-NLP/801-30B)。
- AIDE²：[2609.26457v1](https://arxiv.org/html/2609.26457v1)；评测元研究：[2610.27610v1](https://arxiv.org/html/2610.27610v1)。

其余官方文章直接链接于相应案例与时间线；同一来源重复出现仅为导航，不增加独立证据数量。

[返回 RSI 技术全景](../01_RSI_Technical_Panorama.md)