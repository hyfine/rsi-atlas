# RSI 方法时间索引与机制地图

[技术全景](01_RSI_Technical_Panorama.md) · [算法手册](04_Algorithm_Handbook.md) · [最新研究](06_Latest_Year_Research.md) · [动态图](../../index.html#timeline)

截至 2026-11-06，精选 88 条研究与相关发布记录，其中 58 条日期落在 2025-11-06—2026-11-06。论文按首发，修订另列；公司发布使用显式标记的网页显示日期，冲突保留，不冒充已核验首发。这是代表性选择，不是穷尽或全部全文精读声明。

![分类关系，不是技术继承](../../pics/rsi-family.svg)

![三条并行路线；等宽阶段而非真实时间比例尺](../../pics/rsi-timeline.svg)

旧静态时间图只显示里程碑；[动态时间线](../../index.html#timeline)包含下表全部精选节点，并可按对象与近期窗口筛选。

家族：A 模型与训练；B 数据/任务/环境；C 记忆与技能；D Harness；E 评价；F 研究与改进器。基准、框架和理论不冒充算法。

| 首发 | 方法与原文 | 家族 | 类型 | 机制与边界 | 技术解释 |
|---|---|---|---|---|---|
| 2003-09-25 | [Goedel Machine](https://arxiv.org/abs/cs/0309048) | F | 理论/议程 | 可证明自修改的理论奠基；不将理论最优性等同于现代 Agent 的实验表现。 | [详解](04_Algorithm_Handbook.md) |
| 2017-12-05 | [AlphaZero](https://arxiv.org/abs/1712.01815) | A, B | 方法 | 自博弈训练的基础参照；不是自主改写改进器的直接证据。 | [详解](11_Institutions_and_Updates.md) |
| 2019-01-07 | [POET](https://arxiv.org/abs/1901.01753) | B | 方法 | Environment-policy pairs co-evolve through environment mutation, minimal-criterion admission, novelty selection, within-environment ES optimization and direct/proposal policy transfer. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2020-06-15 | [DreamCoder](https://arxiv.org/abs/2006.08381) | C, F | 方法 | 程序库积累与搜索学习相互促进的早期代表。 | [详解](04_Algorithm_Handbook.md) |
| 2020-12-03 | [PAIRED](https://arxiv.org/abs/2012.02096) | B | 方法 | 无监督环境设计与课程生成的代表。 | [详解](04_Algorithm_Handbook.md) |
| 2022-03-28 | [STaR](https://arxiv.org/abs/2203.14465) | A | 方法 | Generate reasoning with current model, filter by provided correct answers, rationalize failures using answer hints, remove hints for training, and fine-tune anew from the original base each round. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2022-12-15 | [Constitutional AI](https://arxiv.org/abs/2212.08073) | A, E | 方法 | AI 反馈和规范约束下的对齐训练基础。 | [详解](04_Algorithm_Handbook.md) |
| 2022-12-20 | [Self-Instruct](https://arxiv.org/abs/2212.10560) | A, B | 方法 | An existing LM expands a human-seeded task pool with instructions and input-output examples, filters invalid/near-duplicate instances, then instruction-tunes the original model on the collected corpus. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2023-03-20 | [Reflexion](https://arxiv.org/abs/2303.11366) | C | 方法 | 把任务反馈转换为语言反思并保留在episodic memory，影响后续尝试而不更新权重。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2023-03-30 | [Self-Refine](https://arxiv.org/abs/2303.17651) | C | 方法 | 保留作输出自修订的边界对照，不把一次任务内迭代称为持久 RSI。 | [详解](04_Algorithm_Handbook.md) |
| 2023-05-25 | [Voyager](https://arxiv.org/abs/2305.16291) | C | 方法 | 自动课程、可执行技能库、环境反馈及执行错误驱动的迭代提示，共同支持Minecraft持续探索；GPT4黑盒调用而非参数微调。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2023-08-17 | [ReST](https://arxiv.org/abs/2308.08998) | A | 方法 | 生成、筛选、再训练闭环的代表。 | [详解](04_Algorithm_Handbook.md) |
| 2023-09-28 | [Promptbreeder](https://arxiv.org/abs/2309.16797) | D, F | 方法 | 任务提示与变异提示共同演化的代表。 | [详解](04_Algorithm_Handbook.md) |
| 2023-10-03 | [Self-Taught Optimizer (STOP)](https://arxiv.org/abs/2310.02304) | D, F | 方法 | 摘要明确说明固定 LM 驱动的种子 improver 生成并选择程序，再以自身作为待改进程序；产物改变后续程序改进方式。 | [详解](chapters/04_Meta_RSI_Evaluation_and_Safety.md) |
| 2023-10-05 | [DSPy](https://arxiv.org/abs/2310.03714) | D | 方法 | 用声明式模块表示文本变换图，编译器依据给定指标优化组合，模块可通过收集示例以及提示、微调等技术配置学习。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2023-12-11 | [ReST-EM](https://arxiv.org/abs/2312.06585) | A | 方法 | Generate/E-step samples solutions to external training prompts and filters by binary feedback; Improve/M-step resets to the base model and fine-tunes on retained outputs before next-round resampling. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2024-01-02 | [SPIN](https://arxiv.org/abs/2401.01335) | A | 方法 | Fixed SFT targets are contrasted with responses sampled from the previous policy, using a log-ratio logistic objective; updated policy becomes next opponent and reference. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2024-01-18 | [Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020) | A, E | 方法 | Instruction-following model also judges its candidate responses; self-scored preference pairs train the next model by iterative DPO. IFT/EFT seed data initialize both roles. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2024-06-11 | [TextGrad](https://arxiv.org/abs/2406.07496) | D | 方法 | 将LLM语言反馈沿计算图传回变量，改进复合系统中的提示、代码等对象；文本梯度并非神经权重数值求导。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2024-08-15 | [ADAS / Meta Agent Search](https://arxiv.org/abs/2408.08435) | D, F | 方法 | 固定meta agent读取历史agent档案，生成forward代码，经过两轮设计反思与验证评估；错误最多修复五次，候选及指标回写档案。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2024-10-14 | [AFlow](https://arxiv.org/abs/2410.10762) | D | 方法 | 使用蒙特卡洛树搜索、代码修改、树状经验和执行反馈，搜索代码表示的智能体工作流。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2025-02-07 | [Recurrent Depth](https://arxiv.org/abs/2502.05171) | A | 边界对照 | 推理时重复执行 recurrent block，在潜空间增加内部计算深度；没有由此建立跨任务持久更新或改进器演化，不等于跨任务 RSI，且首发在窗口外。 | [详解](04_Algorithm_Handbook.md) |
| 2025-04-21 | [SICA](https://arxiv.org/abs/2504.15228) | D, F | 方法 | Agent 修改自身编码实现的直接自改进代表。 | [详解](04_Algorithm_Handbook.md) |
| 2025-04-22 | [TTRL](https://arxiv.org/abs/2504.16084) | A | 方法 | 测试时参数适应的代表；与外部记忆和 Harness 修改分开讨论。 | [详解](04_Algorithm_Handbook.md) |
| 2025-05-06 | [Absolute Zero](https://arxiv.org/abs/2505.03335) | A, B, E | 方法 | One model proposes and solves deduction, abduction and induction tasks grounded in deterministic Python execution; a finite-rollout learnability reward trains task proposal while correctness rewards train solutions, with task-role-relative advantages. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2025-05-29 | [DGM](https://arxiv.org/abs/2505.22954) | D, F | 方法 | 档案父代实际实现自己的代码修改，固定o1诊断模块提供改进任务；能编译且保留代码编辑功能的后代入档，即使并非立即更优。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2025-06-12 | [SEAL](https://arxiv.org/abs/2506.10943) | A, B, F | 方法 | 学习生成自适应训练数据与更新指令的代表。 | [详解](11_Institutions_and_Updates.md) |
| 2025-06-16 | [AlphaEvolve](https://arxiv.org/abs/2506.13131) | D, F | 方法 | Human-specified mutable program blocks and evaluators drive an evolutionary program database; Gemini-generated diffs pass evaluation cascades. A separate meta-prompt database can evolve mutation instructions. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2025-07-25 | [GEPA](https://arxiv.org/abs/2507.19457) | D | 方法 | 从推理和工具执行轨迹做语言反思，提出并测试提示修改，组合候选前沿的互补经验。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2025-10-06 | [TRM](https://arxiv.org/abs/2510.04871) | A | 边界对照 | 小网络在单次问题求解中递归细化内部状态；这是内部递归计算，不等于跨任务 RSI 或持久改进器更新，2025 年 10 月首发也不在近一年窗口内。 | [详解](04_Algorithm_Handbook.md) |
| 2025-11-13 | [AgentEvolver](https://arxiv.org/abs/2511.10395) | A, B, C | 框架 | 自提问生成任务，自导航复用经验，自归因给轨迹状态与动作分配奖励；减少人工任务构造不等于取消环境反馈，摘要将实验明确称为初步证据。 | [详解](04_Algorithm_Handbook.md) |
| 2025-11-17 | [Live-SWE-agent](https://arxiv.org/abs/2511.13646) | D | 方法 | 从最小 bash scaffold 出发，在解决软件任务时修改自身 scaffold 实现；摘要支持运行时自修改，未建立跨任务继承或新改进器续跑更强，不能按标题升级为严格 RSI。 | [详解](04_Algorithm_Handbook.md) |
| 2025-11-20 | [Agent0](https://arxiv.org/abs/2511.16043) | A, B | 方法 | 同源课程 agent 与执行 agent 多步协同演化，工具扩展解题能力又推动课程生成更难任务；零外部数据不是零先验、零工具或无验证假设。 | [详解](04_Algorithm_Handbook.md) |
| 2025-12-02 | [Self-Improving VLM Judges](https://arxiv.org/abs/2512.05145) | A, B, E | 方法 | 合成不同质量的多模态回答，按预期质量筛选判断与推理轨迹，再训练评价器；免人工偏好标注不使自设质量等级变成独立真值。 | [详解](04_Algorithm_Handbook.md) |
| 2025-12-18 | [SAGE](https://arxiv.org/abs/2512.17102) | A, C | 方法 | Sequential Rollout 让相似任务链继承技能库，用技能整合奖励联合优化生成和使用；作者主要结果依赖带专家经验的 SFT 起点，不能转述成零监督通用演化。 | [详解](04_Algorithm_Handbook.md) |
| 2026-01-06 | [MemRL](https://arxiv.org/abs/2601.03192) | C | 方法 | 固定推理模型，用环境反馈在情景记忆上学习效用，并通过两阶段检索筛选可用经验；运行时记忆强化学习不是模型参数更新，检索收益也非改进规则自演化证明。 | [详解](04_Algorithm_Handbook.md) |
| 2026-01-26 | [Yunjue Agent](https://arxiv.org/abs/2601.18226) | C | 方法 | 固定工作流和上下文设计、无模型权重更新；Manager 检索工具，Developer 按缺口生成，Executor 执行，批次结束后 LLM Aggregator/Merger 聚类吸收为持久工具库。C 类；L1/L2 边界，不是自改写元算法。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-02-02 | [MemSkill](https://arxiv.org/abs/2602.02474) | C, F | 方法 | controller 学习选择记忆技能，executor 按技能写记忆，designer 根据困难案例修订技能集合；记忆操作本身成为可变对象，但 designer 的改进规则是否变强仍需单独测试。 | [详解](04_Algorithm_Handbook.md) |
| 2026-03-06 | [SAHOO](https://arxiv.org/abs/2603.06333) | D, E | 方法 | 以语义、词汇、结构、分布漂移的加权 GDI，结合约束评分和回归风险触发停止；附录 A.2/C.3 描述用质量与漂移反馈构造下一轮改进提示。 | [详解](chapters/04_Meta_RSI_Evaluation_and_Safety.md) |
| 2026-03-09 | [PostTrainBench](https://arxiv.org/abs/2603.08640) | A, E | 基准/环境 | A CLI research agent chooses data and training recipes for a supplied base model under a target benchmark and resource limit, submits a checkpoint, and is audited for contamination/model substitution. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-03-19 | [Hyperagents / DGM-H](https://arxiv.org/abs/2603.19461) | D, F | 方法 | 摘要提出把task agent与可修改自身的meta agent放进一个可编辑程序，试图解除DGM中下游编码能力与自修改能力必须对齐的假设。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-04-01 | [Meta-TTL](https://arxiv.org/abs/2604.00830) | D, F | 方法 | 内环测候选自改进策略如何利用跨 episode 经验，外环以平衡改进分数做反思式元训练；学到 updater 是更直接的元改进证据，但不证明外层元训练机制也递归加速。 | [详解](04_Algorithm_Handbook.md) |
| 2026-04-10 | [SkillMOO](https://arxiv.org/abs/2604.09297) | C, D | 方法 | 利用语言模型提出技能编辑，并通过 NSGA-II 按任务通过率与推理成本进行帕累托选择，演化编程智能体技能包。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-04-18 | [GenericAgent](https://arxiv.org/abs/2604.17091) | C | 方法 | 固定模型权重与九个原子工具接口，把验证过的执行经验凝练为事实、SOP 和复用脚本，分层按需取回；自主探索可参考技能树和使用统计。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-04-22 | [COS-PLAY](https://arxiv.org/abs/2604.20987) | A, C | 方法 | Qwen3-8B决策agent与技能库agent共同训练。轨迹分段、效果契约验证和curator审核控制技能实体化、细化、合并、拆分与退休；五个功能LoRA以GRPO优化。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-04-28 | [Agentic Harness Engineering (AHE)](https://arxiv.org/abs/2604.25850) | C, D | 方法 | 将框架组件显式化为可编辑、可回滚对象，把轨迹提炼为可检索证据，并用后续任务结果检验每次编辑的预期。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-05-07 | [Skill1](https://arxiv.org/abs/2605.06130) | A, C | 方法 | 单一可训练策略生成查询、重排技能、执行与蒸馏；冻结encoder检索top5。终局二元奖励直接训练利用，技能EMA监督排序，结果减库中最佳效用作为蒸馏代理奖励。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-05-09 | [RewardHarness](https://arxiv.org/abs/2605.08703) | C, D, E | 框架 | 用偏好示例比较奖励判断，演化图像编辑评价所需工具与技能库，再为下游 RL 提供奖励；评价框架免参数训练不等于无人工偏好数据，奖励器与学生收益须分开。 | [详解](04_Algorithm_Handbook.md) |
| 2026-06-01 | [Adaptive Auto-Harness](https://arxiv.org/abs/2606.01770) | C, D | 框架 | 分离持久演化工作区与可部署 Harness，在任务流上替换演化过程并修订累计知识；档案增长不保证持续收益，跨任务有效经验也会因分布变化失效。 | [详解](04_Algorithm_Handbook.md) |
| 2026-06-04 | [Retrospective Harness Optimization (RHO)](https://arxiv.org/abs/2606.05922) | C, D | 方法 | 选择历史困难任务，通过自验证与一致性分析回溯轨迹，再以成对自偏好选择框架更新。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-07-08 | [Bounded Refinement to Research Loops (survey)](https://arxiv.org/abs/2607.07663) | A, D, E, F | 综述 | 按改进对象与闭环程度组织文献，单列评价信号、共同错误和研究方向选择瓶颈；验证层次是综述分析，不是新算法或已测得的跨领域定律。 | [详解](04_Algorithm_Handbook.md) |
| 2026-07-28 | [RSIBench-Data](https://arxiv.org/abs/2607.25886) | B, E | 基准/环境 | 固定 base model、Tinker LoRA SFT、Harbor/E2B 评测与受限训练配置；研究者改数据策略，根据 selection feedback 选 checkpoint，再做 official evaluation。 | [详解](chapters/04_Meta_RSI_Evaluation_and_Safety.md) |
| 2026-07-30 | [Frontis-MA1](https://arxiv.org/abs/2607.28568) | A, F | 方法 | Executable MLE environments support SFT and RL of Draft/Improve/Debug/Crossover operators; trained operators are reused in experience-guided evolutionary search. Training-state selection differs from inference parent selection. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-08-31 | [Aspire](https://arxiv.org/abs/2608.31111) | B, E | 基准/环境 | Vague-goal benchmark separates the model being updated, its harness, the decision model and controller-only evaluator. Candidates undergo provenance checks, protocol-specific selection and weight rollback. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-08-31 | [S3Gym](https://arxiv.org/abs/2608.31100) | B, E | 基准/环境 | Self-testing, self-judging, consolidation and update are separated from stricter held-out evaluation. Agent self-scores estimate immediate reward; verifier rewards and terminal scores are withheld during exploration. History, summary and auxiliary parameter training are distinct persistence paths. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-09-01 | [HarnessDev](https://arxiv.org/abs/2609.01437) | D, E | 基准/环境 | Creator builds a persistent executable harness, then frozen versions are evaluated under self or fixed executors. Evolution feedback is separated from post-freeze held-out evaluation. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-09-03 | [EvoHarnessBench](https://arxiv.org/abs/2609.04280) | D, E | 基准/环境 | 由基准提供单调扩张的工具/技能/专家池，外层harness演化与内层记忆/技能等状态适应分开；按阶段及任务cohort测保留、适应和成本。 | [详解](chapters/04_Meta_RSI_Evaluation_and_Safety.md) |
| 2026-09-06 | [MetaRSI / RSI2](https://arxiv.org/abs/2609.06396) | A, B, C, D, F | 框架 | 通过共享循环内核组合数据、框架和模型三类 RSI，联合优化算子顺序与提案策略，并由元策略调整调度。 | [详解](chapters/04_Meta_RSI_Evaluation_and_Safety.md) |
| 2026-09-10 | [The Last AI Built by Humans](https://arxiv.org/abs/2609.11873) | F | 理论/议程 | 使用 Headroom-Closed Index，并提出涵盖改进执行、策略、经验获取、环境适应和递归元改进的自主性路线图。 | [详解](chapters/04_Meta_RSI_Evaluation_and_Safety.md) |
| 2026-09-14 | [Dream-RSI](https://arxiv.org/abs/2609.14858) | B, D, F | 方法 | 将历史发现树作为回放模拟器，低成本优化探索策略，再在线部署策略以扩展发现历史。 | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-09-14 | [RSIAgent](https://arxiv.org/abs/2609.15364) | B, C, E | 方法 | 课程、执行和验证智能体开展先广后深的探索，验证结果并积累可复用的环境因果记忆，而不更新模型参数。 | [详解](11_Institutions_and_Updates.md) |
| 2026-09-17 | [SoL-Pi](https://arxiv.org/abs/2609.20519) | D, F | 方法 | 152方向、535开发环境的隔离离线研究谱系，能力门后效率门与非支配选择；冻结四机制Action Fusion、Online Context Compact、ObservationPack、Evidence-Preserving Reducer。D类L1；多代自加速是未来愿景。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-09-18 | [Designer-RSI](https://arxiv.org/abs/2609.22086) | C, D | 方法 | 冻结前沿模型权重，从用户任务经验中积累和精炼可复用的自然语言设计技能，更新外部程序性记忆。 | [详解](11_Institutions_and_Updates.md) |
| 2026-09-21 | [RRSI](https://arxiv.org/abs/2609.24972) | D | 方法 | 保持可编辑空间开放，只正则化搜索路径：提案侧用余弦退火预算限制单候选独立修改数，记录完整假设与得失，并在停滞时探索未试组件；选择侧先以 critic 筛除泄漏，再用历史最优减噪声容差作为性能底线，按得分增益限制 token 成本增长，并把近期无正收益组件交给 proposer 删除。噪声带内候选有单独的成本/结构新颖性规则，并非一律拒绝。 | [详解](10_Harness_Focus.md) |
| 2026-09-22 | [AIDE² (AIDE2)](https://arxiv.org/abs/2609.26457) | D, F | 方法 | AI 研究智能体提出自身代码修改，在 AI 研发任务上测试修改后的智能体，并根据隐藏评估保留改进。 | [详解](11_Institutions_and_Updates.md) |
| 2026-09-25 | [On-Policy Distillation RSI (DCE + SRCL)](https://arxiv.org/abs/2609.30652) | A | 方法 | 结合特权教师与学生的动态共同演化，以及对在线策略回答进行更简短、经验证重写的自精炼简洁学习。 | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-09-27 | [REUSE: Risk-controlled Evaluation Under Sequential Evolution](https://arxiv.org/abs/2609.33180) | E | 方法 | 以 decision-only 反馈约束样本对提案的影响，为所有可能的promotion histories、轮次和候选分配总错误预算；配对检验并保存不反馈给提案者的累计收益证书。 | [详解](chapters/04_Meta_RSI_Evaluation_and_Safety.md) |
| 2026-09-27 | [TraceDance](https://arxiv.org/abs/2609.33295) | B, E | 基准/环境 | 通过可编程检索、候选确认和锚点规格迭代合成，从部署轨迹构建针对特定行为的基准。 | [详解](11_Institutions_and_Updates.md) |
| 2026-09-28 | [Intelligence-explosion scenario analysis](https://arxiv.org/abs/2609.36054) | F | 理论/议程 | 分析自动化 AI 研发可能加速 AI 进步的证据、潜在后果及政策应对。 | [详解](chapters/04_Meta_RSI_Evaluation_and_Safety.md) |
| 2026-09-28 | [RSI-Master](https://arxiv.org/abs/2609.35561) | D, F | 框架 | 结合约束实验行为并保留可追溯记录的 Experiment OS，以及由评审引导、动态增长的研究 DAG 工作编排。 | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-10-08 | [Multi-Agent Self-Supervision (MASS)](https://arxiv.org/abs/2610.12176) | A, D, E | 方法 | 交替执行多智能体工作流演化优化与自生成轨迹监督微调，使后续负责优化和评估工作流的模型同步增强。 | [详解](11_Institutions_and_Updates.md) |
| 2026-10-09 | [Evo²](https://arxiv.org/abs/2610.13025) | A, D, F | 方法 | 一个共享参数策略通过不同角色提示同时担任 Proposer 和 Reflector。Proposer 自主编辑或执行 Reflector 的定向修改；Reflector 根据源码、差异、性能变化和执行轨迹选择修订、跨分支策略移植或保留。搜索树积累 harness 和策略库。EvoTIDE 将这些过程转成训练轨迹，通过编辑提取和前缀续写回收有效编辑，先 SFT，再交错进行双角色 GRPO。被训练的是 evolver；任务 executor 在共同演化期间冻结。 | [详解](10_Harness_Focus.md) |
| 2026-10-09 | [Harness²](https://arxiv.org/abs/2610.14224) | C, D, F | 方法 | 任务内采用 Propose–Probe–Compose：从参考执行分别提出跨域通用和领域专用修改，在相同任务与匹配配置下实际执行候选，再根据轨迹和交付物的行为对照选择性组合修改。任务后保存被采用的可执行 harness 及有证据支持的经验，供后续改进会话按需检索。下一任务仍从共同基线 H0 开始，而非直接继承上一任务的特化 harness。所谓第二层递归实际通过经验库改变后续改进的上下文，不是训练模型或任意重写整个改进算法。 | [详解](10_Harness_Focus.md) |
| 2026-10-13 | [AReaL-RSI](https://arxiv.org/abs/2610.18083) | C, D, F | 框架 | 在不更新骨干语言模型权重的情况下，组织和扩展具有共享经验的持久研究智能体团队。 | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-10-14 | [SwarmRSI](https://arxiv.org/abs/2610.20431) | C, D, F | 方法 | 演化科学研究智能体群，并跨智能体重组保留的假设与互补程序组件。 | [详解](11_Institutions_and_Updates.md) |
| 2026-10-15 | [R²Orch (R2Orch)](https://arxiv.org/abs/2610.22740) | D, F | 方法 | 结合内层编排自博弈与外层技能撤除、内化，并用递归可学习性选择任务。 | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-10-18 | [CoEvo-RSI](https://arxiv.org/abs/2610.25078) | A, D, F | 方法 | 元智能体利用演化档案和执行反馈，协调框架继承、模型检查点选择或合并及后续适配。 | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-10-18 | [Recursive Flint](https://recursive.com/updates/introducing-recursive-flint) | F | 公司发布 | 企业发布：介绍通过 Eureka Machine 的提案、实现、实验和反馈自动化循环参与开发的本地编程混合专家模型。 | [详解](11_Institutions_and_Updates.md) |
| 2026-10-19 | [HarnessPro](https://arxiv.org/abs/2610.26770) | D | 方法 | 利用生成测试，在无参考标签条件下演化智能体框架，并通过帕累托优化平衡任务表现与执行成本。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-10-20 | [OO-Harness](https://arxiv.org/abs/2610.28380) | C, D | 方法 | 先从基线在 discovery tasks 上的执行记录聚类共享需求，再由 evolution agent 选择任务簇和父类，生成继承基线或既有特化类的子类，通过覆盖或新增方法实现修改。只在目标簇评估，满足提升和领域检查后保留；成功与失败记录可提炼为设计和路由经验。测试前冻结类层级与经验。新任务先执行基线，路由器依据任务、可观察基线轨迹和冻结经验选择一个完整 harness 类，或直接复用基线结果。 | [详解](10_Harness_Focus.md) |
| 2026-10-23 | [RSI-Opt](https://arxiv.org/abs/2610.32026) | D, F | 方法 | 固定 meta-agent 根据运行证据演化 optimizer-agent 的 prompt、playbook、代码库与决策调度；训练内按固定决策机会修改更新器；合法候选包含低分者都进入档案。 | [详解](04_Algorithm_Handbook.md) |
| 2026-10-23 | [RSIHub](https://arxiv.org/abs/2610.32253) | D, F | 框架 | 通过可复用算子和可变资源组合智能体演化配方，共享执行、评估、恢复和谱系记录基础设施。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-10-25 | [ParetoRSI-Gym](https://arxiv.org/abs/2610.34386) | A, B, E | 基准/环境 | An agent revises a multi-domain data pool and written principles using proxy traces, selects a historical checkpoint and bounded LoRA SFT settings, then evaluates final/proxy-selected checkpoints on unexposed generalization suites. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-10-26 | [Trustworthy RSI](https://arxiv.org/abs/2610.35193) | E, F | 综述 | 从持续改进、行为约束与对齐、安全与隐私、透明性与可控性四方面组织可信递归自改进问题。 | [详解](chapters/04_Meta_RSI_Evaluation_and_Safety.md) |
| 2026-10-29 | [RSI-Dojo / RSI-Craft](https://arxiv.org/abs/2611.03698) | A, B, F | 框架 | RSI-Craft converts research artifacts and InspectAI tasks into executable post-training environments, filters reliability/discriminability, collects guided frontier-model trajectories and applies process/outcome filtering before SFT of researcher models. | [详解](chapters/02_Training_Environments_and_AI_Research.md) |
| 2026-10-31 | [CogRSI](https://arxiv.org/abs/2611.01113) | C, D, E | 方法 | 依据校准后的准确率增益迭代文字化认知推理原则，可附加反事实检查，再通过可执行的小故事测试审计原则。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-11-02 | [CoworkOS](https://arxiv.org/abs/2611.03178) | C, D, F | 框架 | 将模型负责的任务策略与运行时执行管理分离，结合委派、共享应用、持久工作区和语义记忆。 | [详解](chapters/03_Agent_Skills_and_Harness.md) |
| 2026-11-02 | [SelfImprove-Bench](https://arxiv.org/abs/2611.02797) | B, E | 基准/环境 | 固定 backbone，在 held-in 任务流演化 prompts/memory/harness；由基准接口在 held-in 任务上评候选，冻结状态后测试 G0 重放、G1 新实例、G2 新难度、G3 同类新任务、G4 跨能力任务；分析修改轨迹。 | [详解](chapters/04_Meta_RSI_Evaluation_and_Safety.md) |

## 证据与导出

[完整方法卡与限制](../../data/atlas-methods.json) · [CSV](../../data/atlas-methods.csv) · [本次直接核验](../../data/primary-verification.json) · [继承专题阅读证据](research/)

正文阅读记录属于此前文档作者的版本化工作，不表示本次监督再次全文读完。日期/摘要、方法章节、图像审阅与独立复现是不同证据层级。作者结果不等于本项目测量，分类连线不等于继承，重复搜索也不等于元递归。
