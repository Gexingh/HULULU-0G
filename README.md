# 呼噜噜 ChainBrief 0G

> Web3 决策前，先要一份可追溯 AI 风险简报。

呼噜噜 ChainBrief 0G 是一个基于 0G Private Computer 的 Web3 风险摘要工具。用户粘贴 DAO 提案、DeFi 策略、NFT 路线图或项目介绍后，系统通过 0G Router 调用模型，生成 0-100 Risk Score、机会点、主要风险、尽调问题和可追溯请求信息。

## 参赛赛道

**Build with 0G Private Computer — AI³ Growth Hackathon**

项目面向 Web3 普通用户、DAO 成员和项目研究者，帮助他们在投入时间或资金前，先用可验证 AI 推理网络完成一次结构化风险初筛。

## 核心功能

- 支持粘贴 DAO 提案、DeFi 策略、NFT 项目介绍或白皮书片段
- 通过 0G Private Computer Router 调用模型
- 请求中启用 `verify_tee: true`
- 输出 Web3 Risk Score、总体判断、机会点、主要风险、尽调问题和建议
- 页面展示模型名称、请求 ID、TEE 请求状态和推理延迟
- API Key 仅在服务端读取，不发送到浏览器

## 技术接入

- 推理入口：`https://router-api.0g.ai/v1/chat/completions`
- 调用方式：OpenAI-compatible Chat Completions
- 默认模型：`0gm-1.0-35b-a3b`
- 请求参数：`verify_tee: true`
- 环境变量：`ZG_API_KEY`、`ZG_MODEL`

## 本地运行

环境要求：Node.js 22.13 或更高版本。

```bash
npm install
```

复制环境变量示例并填入 0G Private Computer API Key：

```bash
cp .env.example .env.local
```

```env
ZG_API_KEY=your_0g_private_computer_api_key_here
ZG_MODEL=0gm-1.0-35b-a3b
```

启动：

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 在线 Demo

https://www.asihg.com/test02/

## 安全与免责声明

- 本工具不构成投资、法律或财务建议
- 风险分只用于信息初筛，不代表项目安全或违法判断
- `.env*`、本地 key 文件和构建产物均已加入 `.gitignore`
- 当前版本不保存用户输入和分析结果

## 后续计划

- 支持粘贴合约地址后自动读取基础链上信息
- 增加 DAO 治理提案模板化分析
- 展示更完整的 0G 可验证推理证明字段
- 支持多模型交叉风险摘要
