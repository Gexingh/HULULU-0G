# 呼噜噜 ChainBrief 0G｜投稿材料

## 一句话介绍

呼噜噜 ChainBrief 0G 通过 0G Private Computer 为 DAO 提案、DeFi 策略和 NFT 项目介绍生成可追溯的 Web3 风险摘要。

## 作品介绍 / 技术说明

呼噜噜 ChainBrief 0G 是一款面向 Web3 普通用户和 DAO 成员的 AI 风险初筛工具。用户粘贴 DAO 提案、DeFi 策略、NFT 路线图或项目介绍后，系统会通过 0G Private Computer Router 调用模型，对材料进行结构化分析，输出 0-100 Risk Score、总体判断、机会点、主要风险、下一步尽调问题和具体建议。

项目选择 0G 赛道，是因为 Web3 决策场景天然需要可追溯和可验证的推理链路。普通 AI 摘要只能给出文本结论，用户无法判断推理过程是否来自可信基础设施；ChainBrief 0G 在服务端接入 `https://router-api.0g.ai/v1/chat/completions`，使用 OpenAI-compatible Chat Completions，并在请求中启用 `verify_tee: true`，页面展示模型名称、请求 ID、TEE 请求状态和推理延迟，用于体现 0G Private Computer 的可信推理价值。

当前版本不保存用户输入，不构成投资建议，定位为“投入时间或资金前的第一份风险简报”。

## Sponsor 技术接入

- Sponsor：0G Labs
- 赛道：Build with 0G Private Computer
- API：`https://router-api.0g.ai/v1/chat/completions`
- 默认模型：`0gm-1.0-35b-a3b`
- 请求参数：`verify_tee: true`
- API Key 仅保存在服务端环境变量 `ZG_API_KEY`

## 核心架构

1. 用户粘贴 Web3 项目材料。
2. 服务端裁剪并组装风险分析 Prompt。
3. 服务端通过 0G Router 调用 0G 模型。
4. 模型返回结构化 JSON 风险摘要。
5. 应用展示 Risk Score、机会、风险、尽调问题和请求追踪信息。

## 后续计划

- 接入链上合约地址读取与基础风险扫描
- 增加 DAO 提案、DeFi 收益池、NFT 项目的专用分析模板
- 展示更完整的 0G 可验证推理证明字段
- 支持多模型协作风险摘要

## 投稿链接

- 在线 Demo：待部署
- GitHub：https://github.com/Gexingh/HULULU-0G
- 演示视频：待上传
