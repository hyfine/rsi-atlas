# RSI 热门开放实现：理论、源码与实践

[返回 Atlas](../../README.md) · [交互模块图与动态流程](implementation-atlas.html) · [比较与选型](overview.md)

本组深入分析六个具有近期活跃度或较高关注度的公开实现，固定到 **2026-11-05 查询时的 commit**。这不是全 GitHub star 排名；star 仅说明关注度，不证明效果、可靠性或可复现性。

| 仓库 | star 快照 | 最近 push | 深入讲解 | 在 RSI 图谱中的准确位置 |
|---|---:|---|---|---|
| [GenericAgent](https://github.com/lsdefine/GenericAgent) | 14,395 | 2026-11-04 | [机制与实践](cases/genericagent.md) | 真实电脑操作与技能/经验底座，不冒充统一元递归算法 |
| [GEPA](https://github.com/gepa-ai/gepa) | 7,288 | 2026-11-04 | [机制与实践](cases/gepa.md) | 反思、样本级候选前沿与文本/程序组件优化 |
| [SoL-Pi](https://github.com/NVlabs/SoL-Pi) | 3,639 | 2026-11-05 | [机制与实践](cases/sol-pi.md) | 自动研究成果固化后的可恢复 Harness 扩展 |
| [HyperAgents](https://github.com/facebookresearch/HyperAgents) | 2,867 | 2026-07-31 | [机制与实践](cases/hyperagents.md) | task/meta agent 程序演化与存档继承 |
| [RRSI](https://github.com/google-research/rrsi) | 1,725 | 2026-09-23 | [机制与实践](cases/rrsi.md) | 正则化 Harness 搜索、成本/性能准入与历史 |
| [OpenRSI](https://github.com/FrontisAI/OpenRSI) | 872 | 2026-09-17 | [机制与实践](cases/openrsi.md) | 按模型工程关联性补选；Gym/ERL/Evo 分层，源码重点为 Evo |

GEPA 创建于 2025-08，其余项目创建于 2026；“近期活跃实现”不等于都在最近一年首发。较旧代码也不自动对应论文最新修订的全部实验。

## 每篇包含什么

- 目标、适用问题、理论与方法论。
- 实际可变对象、冻结组件与递归边界。
- 12 个源码模块，共 **72 个模块映射**，链接固定 commit 与起始行。
- 架构图、代表流程图、分支/替代入口定位、动态逐步路径。
- 依赖、固定版本、文档命令、配置与费用边界。
- 实验设计、失败语义、持久状态、效果声明与具体改进建议。

## 推荐阅读路径

1. [整体定位与对照](overview.md)：不要把 substrate、优化算法、训练栈与运行时优化混成一种 RSI。
2. [架构与源码读法](architecture.md)：可变面、外部服务、入口选择和信任边界。
3. [流程与反馈读法](flows.md)：主循环、条件分支、候选评价与停止。
4. [实践手册](usage.md)：从静态理解到最小有界实验。
5. [开发与证据维护](development.md)：源码锚点检查、离线构建、图与代码一致性。
6. [动态路径](implementation-atlas.html)：选择一个仓库，逐步定位到真实代码。

## 许可与核验范围

GenericAgent、GEPA、SoL-Pi 为 MIT，RRSI 为 Apache-2.0。HyperAgents 的原始代码采用 CC BY-NC-SA 4.0，OpenRSI 原始代码采用 CC BY-NC 4.0 并含多个上游组件条款。因此本组称“开放实现/公开源码”，不无条件把所有项目称为 OSI 软件开源。

本次没有安装、执行这些研究仓库、调用外部模型或复现论文 benchmark。验证的是固定代码、源码锚点、文档、图谱构建及交互，不把 README 成绩转记为本次实测。

公开材料只包含上述公开项目分析。企业内实践、原始工作文件、内部日志和运行标识不进入公共仓库。
