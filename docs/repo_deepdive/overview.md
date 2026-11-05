# 六种实现路线与选型

[返回索引](README.md) · [动态比较](implementation-atlas.html)

## 1. 不按一个“RSI 等级”排队

| 项目 | 被改变的主要状态 | 提案/变化如何发生 | 反馈与保留 | 没有自动证明的事 |
|---|---|---|---|---|
| GenericAgent | 会话、SOP、Skill、操作资产 | 模型调用工具，文件化经验与提示流程 | 真实应用结果与后续复用 | 统一自动技能学习、元改进或权重学习 |
| GEPA | prompt/文本程序候选、样本级分数与谱系 | 反思变异、可选合并 | evaluator、互补候选/前沿与预算 | 评价真值可靠、跨模型泛化或 L3 |
| SoL-Pi | 工具组合、观察表示、archive/receipt、compact 状态 | opt-in extension hooks | 证据校验、可召回观察和经济判定 | 发布 runtime 包含完整自动研究器 |
| HyperAgents | agent/meta-agent 程序、patch、archive | 元代理修改、父代继承、隔离执行 | domain 评价、父代选择、历史 | 任意任务自加速、所有代都改进 |
| RRSI | Harness、diff/commit、history、incumbent | 分析、proposer、critic、执行 | 性能 floor、成本与 domain guards | 正则化就能保证未见泛化 |
| OpenRSI Evo | solution、算子轨迹、经验、Journal/数据库 | 配置驱动的算子搜索与 sandbox | 权威 scorer、预算、程序状态 | Evo 本身在训练基础模型权重 |

## 2. 理论到代码，至少经过三层

1. **理论对象**：论文究竟改什么，收益依赖什么假设。
2. **发布接口**：当前 commit 提供什么入口、数据结构、可变面和外部依赖。
3. **执行证据**：在具体资源/版本/任务下是否真正运行并得到可核验结果。

本组主要完成前两层的源码落地解释。没有把“开源了目录”当作“实验已经可一键复现”，也没有把“有 Docker”当作“权限边界已经完备”。

## 3. 三个容易误读的具体细节

### HyperAgents 默认父代不是随便随机选

默认 `generate_loop(parent_selection="score_prop")` 与可选 `select_next_parent.py` 路径不同。后者有最终 `random.choice`，不能据此把默认系统讲成随机父代搜索。见[对应章节](cases/hyperagents.md)。

### GEPA 的 Pareto 不是自动等于费用—性能

样本级互补候选前沿可以保留各自擅长不同实例的方案。若要画费用—性能前沿，必须在具体配置中明确存在这两个目标，不能用一个流行词替换真实状态。见[GEPA](cases/gepa.md)。

### SoL-Pi 发布的是运行机制，不是整个研究过程

论文中的自动研究产生了可复用机制；当前包把这些机制作为扩展执行。四个 feature 默认关闭、按配置注册，不是每次调用都必须通过四个串行步骤。见[SoL-Pi](cases/sol-pi.md)。

## 4. 怎样选择起步项目

- **想看最小模型—工具循环与技能复用**：GenericAgent，但要控制真实外部副作用。
- **想给已有 pipeline 优化 prompt/文本组件**：GEPA，先定义可信 evaluator。
- **想降低已有 Pi 运行开销**：SoL-Pi，先锁版本、逐机制消融与检查证据可恢复。
- **想研究可编辑改进过程**：HyperAgents，先读许可、可变面与容器边界。
- **想做有准入规则的 Harness 演化**：RRSI，先固定 benchmark 和成本口径。
- **想研究机器学习工程任务与算子搜索**：OpenRSI，先分清 Gym、ERL、Evo 和外部服务依赖。

## 5. 最有价值的横向实践

不要直接横比不同论文的最高分。先固定任务与 backbone，再比较：

1. 无持久状态 vs 保留旧状态 vs 更新后状态。
2. 同预算随机/固定提案 vs 有历史的提案。
3. 固定模型换 Harness、固定 Harness 换模型。
4. 只看当前任务 vs 冻结产物后的未见任务。
5. 任务分数 vs 提案/失败/评价/部署的全生命周期成本。
6. 任务改进 vs 同起点继续实验中的改进效率变化。

这些是本文的对照建议，不是声称六个项目已经实现了相同评测制度。
