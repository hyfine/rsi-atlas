# RSI 经典论文与链接索引

[全部论文在线链接](index.md)

更新：2026-11-05。根据磁盘约束，从既有归档保留 27 篇经典基础与代表性方法论文；其余方法保留元数据和原文链接，不再保存本地 PDF。没有执行新下载。

## 筛选标准

- 优先保留定义关键机制、形成重要方法路线或提供必要边界对照的原始论文。
- 覆盖模型训练、任务环境、经验技能、Harness、评价器、元改进六个对象家族；允许交叉归类。
- 2025 年的 SICA、SEAL、AlphaEvolve、GEPA 等标为代表性方法，不把“最新”自动称为经典。
- AlphaZero、Constitutional AI 是相关基础；Self-Refine 是单任务内自修订的边界对照。收录不意味着已经实现强 RSI。
- 同一论文只保留一个规范 PDF，不继续保存引用旧版本、重复下载和待命名隔离缓存。
- 保留原有 2 份用户资料，不把它们计入 27 篇核心清单。下载数量不等同于全文精读数量。

## 按首次公开时间排序的保留清单

家族：A 模型与训练；B 数据、任务与环境；C 记忆与技能；D Harness 与工作流；E 评价与验证；F 研发与元改进。

| 首次公开 | 方法 / 原文 | 论文全称 | 家族 | 保留原因与边界 | 本地归档 |
|---|---|---|---|---|---|
| 2003-09-25 | [Goedel Machine](https://arxiv.org/abs/cs/0309048) | Goedel Machines: Self-Referential Universal Problem Solvers Making Provably Optimal Self-Improvements | F | 可证明自修改的理论奠基；不将理论最优性等同于现代 Agent 的实验表现。 | 仅在本地保留 |
| 2017-12-05 | [AlphaZero](https://arxiv.org/abs/1712.01815) | Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm | A, B | 自博弈训练的基础参照；不是自主改写改进器的直接证据。 | 仅在本地保留 |
| 2019-01-07 | [POET](https://arxiv.org/abs/1901.01753) | Paired Open-Ended Trailblazer (POET): Endlessly Generating Increasingly Complex and Diverse Learning Environments and Their Solutions | B | 环境与求解策略共同演化的代表。 | 仅在本地保留 |
| 2020-06-15 | [DreamCoder](https://arxiv.org/abs/2006.08381) | DreamCoder: Growing generalizable, interpretable knowledge with wake-sleep Bayesian program learning | C, F | 程序库积累与搜索学习相互促进的早期代表。 | 仅在本地保留 |
| 2020-12-03 | [PAIRED](https://arxiv.org/abs/2012.02096) | Emergent Complexity and Zero-shot Transfer via Unsupervised Environment Design | B | 无监督环境设计与课程生成的代表。 | 仅在本地保留 |
| 2022-03-28 | [STaR](https://arxiv.org/abs/2203.14465) | STaR: Bootstrapping Reasoning With Reasoning | A | 以自身推理轨迹自举训练的代表。 | 仅在本地保留 |
| 2022-12-15 | [Constitutional AI](https://arxiv.org/abs/2212.08073) | Constitutional AI: Harmlessness from AI Feedback | A, E | AI 反馈和规范约束下的对齐训练基础。 | 仅在本地保留 |
| 2022-12-20 | [Self-Instruct](https://arxiv.org/abs/2212.10560) | Self-Instruct: Aligning Language Models with Self-Generated Instructions | A, B | 自生成指令数据改善模型的代表。 | 仅在本地保留 |
| 2023-03-20 | [Reflexion](https://arxiv.org/abs/2303.11366) | Reflexion: Language Agents with Verbal Reinforcement Learning | C | 语言反馈与情景记忆改进 Agent 行为的代表。 | 仅在本地保留 |
| 2023-03-30 | [Self-Refine](https://arxiv.org/abs/2303.17651) | Self-Refine: Iterative Refinement with Self-Feedback | C | 保留作输出自修订的边界对照，不把一次任务内迭代称为持久 RSI。 | 仅在本地保留 |
| 2023-05-25 | [Voyager](https://arxiv.org/abs/2305.16291) | Voyager: An Open-Ended Embodied Agent with Large Language Models | C | 可执行技能库与开放式探索的代表。 | 仅在本地保留 |
| 2023-08-17 | [ReST](https://arxiv.org/abs/2308.08998) | Reinforced Self-Training (ReST) for Language Modeling | A | 生成、筛选、再训练闭环的代表。 | 仅在本地保留 |
| 2023-09-28 | [Promptbreeder](https://arxiv.org/abs/2309.16797) | Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution | D, F | 任务提示与变异提示共同演化的代表。 | 仅在本地保留 |
| 2023-10-03 | [STOP](https://arxiv.org/abs/2310.02304) | Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation | D, F | 改进代码生成优化器本身的直接自改进代表。 | 仅在本地保留 |
| 2023-10-05 | [DSPy](https://arxiv.org/abs/2310.03714) | DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines | D | 声明式 LM 程序与自动优化管线的基础。 | 仅在本地保留 |
| 2023-12-11 | [ReST-EM](https://arxiv.org/abs/2312.06585) | Beyond Human Data: Scaling Self-Training for Problem-Solving with Language Models | A | 使用可验证问题求解反馈进行自训练的代表。 | 仅在本地保留 |
| 2024-01-02 | [SPIN](https://arxiv.org/abs/2401.01335) | Self-Play Fine-Tuning Converts Weak Language Models to Strong Language Models | A | 利用不同轮次模型构造自博弈微调的代表。 | 仅在本地保留 |
| 2024-01-18 | [Self-Rewarding LM](https://arxiv.org/abs/2401.10020) | Self-Rewarding Language Models | A, E | 模型同时参与回答和奖励判断的代表，也用于讨论内生评价风险。 | 仅在本地保留 |
| 2024-06-11 | [TextGrad](https://arxiv.org/abs/2406.07496) | TextGrad: Automatic "Differentiation" via Text | D | 以自然语言反馈优化复合计算系统的代表。 | 仅在本地保留 |
| 2024-08-15 | [ADAS](https://arxiv.org/abs/2408.08435) | Automated Design of Agentic Systems | D, F | 自动设计 Agent 代码和结构的代表。 | 仅在本地保留 |
| 2024-10-14 | [AFlow](https://arxiv.org/abs/2410.10762) | AFlow: Automating Agentic Workflow Generation | D | 自动搜索 Agent 工作流的代表。 | 仅在本地保留 |
| 2025-04-21 | [SICA](https://arxiv.org/abs/2504.15228) | A Self-Improving Coding Agent | D, F | Agent 修改自身编码实现的直接自改进代表。 | 仅在本地保留 |
| 2025-04-22 | [TTRL](https://arxiv.org/abs/2504.16084) | TTRL: Test-Time Reinforcement Learning | A | 测试时参数适应的代表；与外部记忆和 Harness 修改分开讨论。 | 仅在本地保留 |
| 2025-05-06 | [Absolute Zero](https://arxiv.org/abs/2505.03335) | Absolute Zero: Reinforced Self-play Reasoning with Zero Data | A, B, E | 任务生成、求解与执行反馈相结合的自博弈代表。 | 仅在本地保留 |
| 2025-06-12 | [SEAL](https://arxiv.org/abs/2506.10943) | Self-Adapting Language Models | A, B, F | 学习生成自适应训练数据与更新指令的代表。 | 仅在本地保留 |
| 2025-06-16 | [AlphaEvolve](https://arxiv.org/abs/2506.13131) | AlphaEvolve: A coding agent for scientific and algorithmic discovery | D, F | 代码进化与外部可执行评价的代表；算法发现不自动等同于改进器递归。 | 仅在本地保留 |
| 2025-07-25 | [GEPA](https://arxiv.org/abs/2507.19457) | GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning | D | 反思式程序提示演化与多目标候选保留的代表。 | 仅在本地保留 |

## 未保留 PDF 的文献

[完整分卷索引](index.md)保留全部 6465 条记录的原文链接、标题和日期状态。状态 `link_only` 表示主动选择仅链接，不是下载失败；原始获取状态另存以便审计。Frontis-MA1 / OpenRSI、Dream-RSI 及其他较新扩展路线继续在综述中介绍和引用，但不因被引用就下载 PDF。

- [Frontis-MA1 / OpenRSI](https://arxiv.org/abs/2607.28568)
- [Dream-RSI](https://arxiv.org/abs/2609.14858)
- [Gödel Agent](https://aclanthology.org/2025.acl-long.1354/)

## 公开边界

公开仓库仅提供原始论文链接，不再分发 PDF、原论文图、下载缓存或本地清理日志。核心清单是阅读优先级，不是全文阅读完成声明；分卷目录是未经专家全文确认的宽口径发现语料。

[维护与证据协议](../docs/zh/07_Maintenance_and_Review.md)。
