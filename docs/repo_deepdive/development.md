# 文档构建、源码锚点与维护

[返回索引](README.md)

## 1. 文件职责

- [repositories.json](repositories.json)：作者选择、star/活动快照、固定 commit、理论解释、实验与建议。
- [source-audits.json](source-audits.json)：静态读取到的入口、源码模块、分支与命令定位。
- [cases/](cases/)：由两类输入生成的六篇详细文档。
- [implementation-atlas.html](implementation-atlas.html)：内嵌公开数据的独立交互模块与动态路径。

证据和分析分开：星数变化不修改源码事实，理论框架也不替代函数/类存在性。

## 2. 从仓库根目录构建

```sh
node scripts/build-atlas.mjs
node scripts/validate-delivery.mjs
node scripts/validate-repo-deepdives.mjs --source-root ../review-sources
node --test scripts/viewer.test.mjs scripts/implementation.test.mjs
```

源码根目录下使用六个独立 checkout：`GenericAgent`、`gepa`、`SoL-Pi`、`HyperAgents`、`rrsi`、`OpenRSI`，各自 HEAD 必须等于快照 commit。没有这些源码时可省略 `--source-root` 做文档形状检查，但输出明确 `source_verified=false`，不冒充源码核验。

## 3. 更新协议

1. 重新查询 repo 元数据，写清获取日期；star 不用作科研效果指标。
2. 固定新的源码版本，旧分析不套用到浮动 main。
3. 沿真实入口检查调用、配置、候选状态、评价与失败路径。
4. 更新模块/流程和源码锚点；文件第 1 行不是某个不存在函数。
5. 重新构建、检查相对链接、源码行与浏览器交互。
6. 记录静态阅读、配置/单测、真实任务和论文复现各自范围。

## 4. 检查不覆盖什么

源码锚点检查只证明所引文件/行/符号与固定 checkout 对应，不自动证明整个语义解释无误。浏览器测试证明图和控件工作，不证明研究方法有效。即使 benchmark 复现成功，也不自动证明开放世界或元改进收益。

## 5. 隐私与发布边界

公开构建只读取上述六个公开项目的审计数据，不读取企业工作目录。企业内案例应在授权本地位置维护和交付，不能将原始日志、服务标识、数据或源码通过“案例补充”顺带上传。
