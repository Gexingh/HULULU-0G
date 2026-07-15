"use client";

import { FormEvent, useState } from "react";

type Analysis = {
  riskScore: number;
  label: string;
  verdict: string;
  summary: string;
  opportunities: string[];
  risks: string[];
  diligenceQuestions: string[];
  recommendation: string;
  analyzedAt: string;
  latencyMs: number;
  model: string;
  requestId: string;
  teeVerified: boolean;
  provider?: string;
};

const examples = [
  "DAO 提案：社区金库拟拿出 15% 资金购买某新发行治理代币，并授权核心团队在 30 天内择机执行。",
  "DeFi 策略：用户把稳定币存入一个年化 38% 的新收益池，合约刚上线两周，审计报告暂未公布。",
  "NFT 项目：团队计划发行 5000 个会员 NFT，承诺未来空投和线下权益，但路线图没有明确交付日期。",
];

export function ChainBriefApp() {
  const [memo, setMemo] = useState("");
  const [projectType, setProjectType] = useState("DAO / DeFi / NFT 项目");
  const [result, setResult] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!memo.trim()) {
      setError("请先粘贴一段 Web3 项目、DAO 提案或策略文本。");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/test02/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ memo: memo.trim(), projectType }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "0G 摘要暂时失败，请稍后重试。");
      setResult(payload);
      setTimeout(() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "0G 摘要暂时失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="呼噜噜 ChainBrief 首页">
          <span className="brand-mark">0G</span>
          <span>呼噜噜 <b>ChainBrief</b></span>
        </a>
        <div className="top-actions">
          <a href="#how">工作原理</a>
          <div className="network-status"><i /> 0G Private Computer</div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span>0G PRIVATE COMPUTER · VERIFIABLE AI BRIEFING</span></div>
            <h1>把 Web3 风险，<br /><em>交给可验证 AI 先过一遍。</em></h1>
            <p className="lead">粘贴 DAO 提案、DeFi 策略、NFT 项目介绍或白皮书片段。ChainBrief 通过 0G Router 调用模型，生成风险分、机会点、尽调问题和可追溯调用信息。</p>
            <div className="hero-badges"><span>0G Router API</span><span>TEE verification</span><span>Web3 尽调摘要</span></div>
            <div className="hero-stats">
              <div><strong>0G</strong><span>Private Computer</span></div>
              <div><strong>TEE</strong><span>可信推理路径</span></div>
              <div><strong>0-100</strong><span>Risk Score</span></div>
            </div>
          </div>
          <div className="signal-card" aria-hidden="true">
            <div className="signal-top"><span>VERIFIABLE ROUTING</span><b><i /> TEE REQUESTED</b></div>
            <div className="orbit">
              <div className="orbit-ring ring-one" />
              <div className="orbit-ring ring-two" />
              <div className="core"><span>CHAIN</span><strong>0G</strong><small>BRIEF</small></div>
              <div className="node node-a"><b>AI</b><span>风险摘要<br />模型推理</span></div>
              <div className="node node-b"><b>TEE</b><span>调用追踪<br />可信证明</span></div>
            </div>
            <div className="signal-foot"><span><b>1</b> request</span><span><b>5</b> checks</span><span><b>0G</b> trace</span></div>
          </div>
        </div>

        <form className="checker" onSubmit={submit}>
          <div className="checker-head">
            <span className="step">01</span>
            <div><strong>粘贴要分析的 Web3 材料</strong><small>DAO 提案、DeFi 策略、NFT 路线图、项目介绍都可以</small></div>
          </div>
          <div className="url-row">
            <span aria-hidden="true">⌁</span>
            <label className="sr-only" htmlFor="projectType">材料类型</label>
            <input id="projectType" value={projectType} onChange={(e) => setProjectType(e.target.value)} placeholder="材料类型，例如 DAO 提案 / DeFi 策略 / NFT 项目" />
          </div>
          <label className="sr-only" htmlFor="memo">待分析材料</label>
          <textarea id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="例如：某 DAO 准备把金库资金投入一个新收益池，年化收益 38%，合约刚上线两周……" maxLength={10000} />
          {error && <p className="error" role="alert">{error}</p>}
          <div className="checker-actions">
            <span>不构成投资建议 · 用于提交前风险初筛</span>
            <button disabled={loading} type="submit">
              {loading ? <><i className="spinner" /> 0G 正在生成风险摘要</> : <>生成 ChainBrief <b>→</b></>}
            </button>
          </div>
        </form>

        <div className="examples">
          <span>试试示例</span>
          {examples.map((example, i) => <button key={example} onClick={() => { setMemo(example); setResult(null); }}>{String(i + 1).padStart(2, "0")} {example.slice(0, 25)}…</button>)}
        </div>
      </section>

      <section className="method" id="how">
        <div><span>①</span><strong>输入 Web3 材料</strong><small>提案、策略、路线图或白皮书片段</small></div>
        <b>→</b>
        <div><span>②</span><strong>0G 模型推理</strong><small>通过 Router 请求 TEE 验证</small></div>
        <b>→</b>
        <div><span>③</span><strong>输出尽调清单</strong><small>风险分、机会、问题与建议</small></div>
      </section>

      {result && <Report result={result} />}

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">0G</span><span>呼噜噜 <b>ChainBrief</b></span></div>
        <p>Web3 决策前，先要一份可追溯 AI 风险简报。</p>
        <span>Built for AI³ Growth Hackathon · 0G Private Computer</span>
      </footer>
    </main>
  );
}

function Report({ result }: { result: Analysis }) {
  const level = result.riskScore >= 70 ? "bad" : result.riskScore >= 40 ? "warn" : "good";
  return (
    <section className="report" id="report">
      <div className="report-kicker"><span>0G 风险简报</span><time>{new Date(result.analyzedAt).toLocaleString("zh-CN")}</time></div>
      <div className="score-card">
        <div className={`score-ring ${level}`} style={{ "--score": `${result.riskScore * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{result.riskScore}</strong><span>/ 100</span></div>
        </div>
        <div className="score-copy">
          <small>WEB3 RISK SCORE</small>
          <h2>{result.label}</h2>
          <p>{result.summary}</p>
          <div className="formula">模型：{result.model} · 延迟：{Math.round(result.latencyMs / 1000)}s · TEE：{result.teeVerified ? "verified" : "requested"}</div>
        </div>
      </div>

      <div className="model-grid">
        <article className="model-card">
          <div className="model-head"><span>01</span><div><small>总体判断</small><h3>{result.verdict}</h3></div><b>{result.riskScore}</b></div>
          <h4>机会点</h4>
          <ul>{result.opportunities.map((item) => <li key={item}>{item}</li>)}</ul>
          <h4>主要风险</h4>
          <ul className="uncertain">{result.risks.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="model-card">
          <div className="model-head"><span>02</span><div><small>下一步</small><h3>尽调问题</h3></div><b>?</b></div>
          <h4>继续追问</h4>
          <ul>{result.diligenceQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="request-id"><span><i /> 0G REQUEST ID</span><code>{result.requestId}</code></div>
          {result.provider && <div className="request-id"><span><i /> PROVIDER</span><code>{result.provider}</code></div>}
        </article>
      </div>

      <div className="recommendation"><span>建议</span><p>{result.recommendation}</p></div>
      <p className="disclaimer">本工具只做信息初筛，不构成投资、法律或财务建议。高风险结果不代表项目违法，低风险结果也不代表安全。</p>
    </section>
  );
}
