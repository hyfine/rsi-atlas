# RSI Atlas · 递归自我改进技术全景

**从“更好的答案”到“更好的系统”，再到“更会改进的改进器”。**

研究截点：**2026-11-05**。近一年窗口：**2025-11-05—2026-11-05**。中文技术解释、原始论文入口、可离线播放的动态流程和可审计证据，集中在一个仓库。

> 这是研究导航和机制分析，不是 RSI 能力认证，也不是论文实验复现。分类是本图谱的操作性框架；作者报告、本文解释、工程建议分别标明。全量目录包含邻近领域和未经人工复核的候选，不能把目录数量解释成已精读数量。

## 开始阅读

| 想解决的问题 | 入口 |
|---|---|
| 先看清领域如何发展、各路线如何连接 | [技术全景](docs/zh/01_RSI_Technical_Panorama.md) · [动态全景站](https://hyfine.github.io/rsi-atlas/) |
| 各算法究竟更新什么、如何实现、怎样选型 | [算法手册](docs/zh/04_Algorithm_Handbook.md) |
| 最近一年有哪些方法，最新论文是什么 | [近一年研究与最新方法](docs/zh/06_Latest_Year_Research.md) |
| 训练、自博弈、环境演化与自动研究 | [训练与环境专题](docs/zh/chapters/02_Training_Environments_and_AI_Research.md) |
| 记忆、技能、工作流、Harness 演化 | [Agent 与 Harness 专题](docs/zh/chapters/03_Agent_Skills_and_Harness.md) |
| 元改进、泛化、成本与安全怎么验证 | [Meta-RSI 与评测专题](docs/zh/chapters/04_Meta_RSI_Evaluation_and_Safety.md) |
| 产业案例、综述边界及未解决问题 | [综述与前沿专题](docs/zh/chapters/05_Surveys_Industry_and_Frontiers.md) |
| 逐篇日期、方法分类、来源与阅读层级 | [方法数据](data/atlas-methods.json) · [代表作时间索引](docs/zh/03_Method_Map_and_Timeline.md) |
| 更多文献线索 | [全量分卷目录](catalog/index.md) · [经典阅读清单](catalog/classics.md) |
| 想继续维护，而不只看一次 | [维护与验收协议](docs/zh/07_Maintenance_and_Review.md) |

## 一张图理解 RSI

![六个改进对象家族](pics/rsi-family.svg)

![三条并行发展路线](pics/rsi-timeline.svg)

**六类对象：** A 模型与训练；B 数据、任务与环境；C 记忆与技能；D Harness 与工作流；E 评价器；F 研究与改进器。

**四种闭环：** L0 任务内修订；L1 固定改进器下的持久适应；L2 更新产物参与下一轮改进；L3 改进机制本身改变并被后续使用。这是反馈深度，不是成熟度或安全等级。

## 动态图不只是装饰

[打开自包含 HTML](index.html)，或者访问[在线图谱](https://hyfine.github.io/rsi-atlas/)。

- 六家族全景、可筛选真实日期时间线、逐篇方法详情和原文跳转。
- 十个可播放闭环：通用晋级、自训练、自博弈、技能积累、Harness 搜索、Dream-RSI、MetaRSI、CoEvo-RSI、评价器校准、RSI-Opt。
- 支持播放/暂停、单步、复位、速度选择、键盘操作、明暗主题与减少动态效果设置。
- 每一步解释变化对象、冻结边界、反馈来源和验证局限；**动画是机制示意，不是假造实验轨迹**。
- 数据内嵌、无 CDN、无遥测；下载单个 HTML 即可离线使用。论文原文和 Markdown 章节仍需要网络或完整仓库。

## 最新论文与主要转向

近一年不是“全部 2025 年经典”，也不是“最近修订过的旧论文”。已直接复核的近期原始来源包括：

- 2026-11-02：[CoworkOS](https://arxiv.org/abs/2611.03178)、[SelfImprove-Bench](https://arxiv.org/abs/2611.02797)。
- 2026-10-31：[CogRSI](https://arxiv.org/abs/2611.01113)：提高准确率的规则仍可能语义错误。
- 2026-10-29：[RSI-Dojo](https://arxiv.org/abs/2611.03698)：可执行后训练环境与训练模型做后训练的能力。
- 2026-10-25：[ParetoRSI-Gym](https://arxiv.org/abs/2610.34386)：多领域收益与退化需要同时测量。
- 2026-10-23：[RSI-Opt](https://arxiv.org/abs/2610.32026)、[RSIHub](https://arxiv.org/abs/2610.32253)。
- 2026-10-19 / 18：[HarnessPro](https://arxiv.org/abs/2610.26770)、[CoEvo-RSI](https://arxiv.org/abs/2610.25078)。
- 2026-09：[MetaRSI](https://arxiv.org/abs/2609.06396)、[Dream-RSI](https://arxiv.org/abs/2609.14858)、[SoL-Pi](https://arxiv.org/abs/2609.20519)、[RRSI](https://arxiv.org/abs/2609.24972)。

检索截至 11 月 5 日，不保证数据库已经完整索引截止日的所有新稿。当前直接核验的最新首发日期是 11 月 2 日；arXiv 编号月份不总等于 submission history 的日期。详细范围见[近期研究](docs/zh/06_Latest_Year_Research.md)。

## 可复现构建与检查

Node.js 22+，无需安装依赖：

```sh
node scripts/build-atlas.mjs
node scripts/validate-delivery.mjs
node --test scripts/viewer.test.mjs
```

浏览器实测需要本机 Chrome/Chromium；测试找不到浏览器时明确标记 skipped，不能当成视觉通过。公开构建不调用模型、不下载论文、不执行研究仓库源码。

原始语料采集工具及日志只保留在作者工作区，不进入公开 Git；[语料说明](scripts/CORPUS.md)解释其边界。论文 PDF、第三方论文原图、模型权重、下载缓存和个人路径不公开再分发。图谱中的 SVG/HTML 图由本项目重绘。

## 最重要的结论

1. 参数冻结不代表没有学习；持久的技能、记忆和执行结构也是能力载体。
2. 一次优化、多轮搜索、递归改进与改进效率提高是不同命题。
3. 验证吞吐、留出泛化、跨模型迁移和端到端成本比单条上涨曲线更重要。
4. 2026 年前沿集中在多对象协同、元改进、低成本验证与经验继承；尚不能据此宣称开放世界的无限加速已实现。
