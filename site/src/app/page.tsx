"use client";

import { useEffect, useRef, useState } from "react";

const terminalScript = [
  { type: "cmd", text: "npx create-stellar-agentic my-dapp" },
  { type: "output", text: "Scaffolding Stellar Agentic dApp...", delay: 600 },
  { type: "output", text: "  ok  contracts/hello-world/src/lib.rs", delay: 200 },
  { type: "output", text: "  ok  contracts/token/src/lib.rs", delay: 180 },
  { type: "output", text: "  ok  frontend/src/app/page.tsx", delay: 220 },
  { type: "output", text: "  ok  frontend/src/app/layout.tsx", delay: 160 },
  { type: "output", text: "  ok  frontend/stellar-wallets-kit.tsx", delay: 200 },
  { type: "output", text: "  ok  backend/src/index.ts", delay: 180 },
  { type: "output", text: "  ok  docker-compose.yml", delay: 140 },
  { type: "output", text: "", delay: 300 },
  { type: "cmd", text: "npm run dev" },
  { type: "output", text: "  Stellar Agentic dApp running on http://localhost:3000", delay: 500 },
];

const features = [
  { title: "Smart Contracts", desc: "Scaffold Rust/Soroban contracts with build, test, and deploy workflows — all from a single command." },
  { title: "dApp Frontends", desc: "Generate Next.js apps pre-integrated with Stellar Wallets Kit. Connect, sign, and transact instantly." },
  { title: "Backend APIs", desc: "Build API servers and indexers that query Stellar RPC and Horizon. Ship production-grade data pipelines." },
  { title: "x402 Payments", desc: "Monetize APIs with HTTP 402 + Stellar USDC. Machine-to-machine payments out of the box." },
  { title: "Zero-Knowledge Proofs", desc: "Integrate Groth16, Circom, and Noir verifiers into Stellar contracts. Privacy-first dApps." },
  { title: "Eval-Driven", desc: "Every output is verified against structured eval criteria. Max 3 retry steers. No broken code ships." },
];

const agents = [
  { handle: "@stellar-contracts", role: "Rust smart contract specialist", skills: ["soroban-sdk", "WASM", "deploy"] },
  { handle: "@stellar-frontend", role: "Next.js dApp frontend developer", skills: ["React", "Wallets Kit", "Tailwind"] },
  { handle: "@stellar-backend", role: "API and indexer engineer", skills: ["RPC", "Horizon", "Data"] },
  { handle: "@stellar-payments", role: "x402 and MPP payment flow architect", skills: ["USDC", "Paywall", "MPP"] },
  { handle: "@stellar-zk", role: "Zero-knowledge integration engineer", skills: ["Groth16", "Circom", "Noir"] },
];

function Index({ n }: { n: number }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "12px", display: "block" }}>
      {String(n).padStart(2, "0")}
    </span>
  );
}

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [lineIdx, setLineIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (lineIdx >= terminalScript.length) return;
    const line = terminalScript[lineIdx];
    const delay = line.type === "cmd" ? 400 : (line.delay || 100);
    if (line.type === "output" && line.text === "") {
      const t = setTimeout(() => setLineIdx((i) => i + 1), 200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLineIdx((i) => i + 1), delay);
    return () => clearTimeout(t);
  }, [lineIdx]);

  useEffect(() => {
    setShowCursor(lineIdx < terminalScript.length);
  }, [lineIdx]);

  return (
    <>
      <nav>
        <div className="container">
          <a href="/" className="logo">Stellar <em>Agentic</em></a>
          <div className="links">
            <a href="#features">Features</a>
            <a href="#agents">Agents</a>
            <a href="#usage">Usage</a>
            <a href="#architecture">Architecture</a>
            <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework" target="_blank" rel="noopener">GitHub</a>
            <a href="https://www.npmjs.com/package/create-stellar-agentic" className="nav-cta">Get Started</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-glow" />
        <div className="container">
          <h1>Build Stellar dApps with AI Agents</h1>
          <p>
            An eval-driven, multi-agent coding harness that routes tasks to specialist agents,
            verifies outputs against structured evals, and produces production-grade Stellar dApps.
          </p>
          <div className="hero-actions">
            <a href="https://www.npmjs.com/package/create-stellar-agentic" className="btn btn-primary">
              npx create-stellar-agentic
            </a>
            <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework" className="btn btn-secondary">
              View on GitHub &rarr;
            </a>
          </div>

          <div className="terminal-window">
            <div className="terminal-bar">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-label">terminal</span>
            </div>
            <div className="terminal-body">
              {terminalScript.slice(0, lineIdx).map((line, i) => (
                <div key={i} className="terminal-line visible">
                  {line.type === "cmd" ? (
                    <>
                      <span className="terminal-prompt">$ </span>
                      <span className="terminal-cmd">{line.text}</span>
                    </>
                  ) : line.text === "" ? (
                    <br />
                  ) : (
                    <span className="terminal-output">
                      <span className="ok">ok  </span>
                      {line.text.replace("  ok  ", "")}
                    </span>
                  )}
                </div>
              ))}
              {showCursor && (
                <span className="terminal-prompt">
                  {lineIdx === 0 || terminalScript[lineIdx - 1]?.type === "output" ? "$ " : ""}
                  <span className="terminal-cursor" />
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="container">
          <div className="fade-in">
            <span className="section-label">Features</span>
            <h2 className="section-title">Everything you need to ship on Stellar</h2>
            <p className="section-sub">Six specialist agents, zero boilerplate. From contract to deployment in minutes.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card fade-in">
                <Index n={i + 1} />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="agents" style={{ background: "var(--surface)" }}>
        <div className="container">
          <div className="fade-in">
            <span className="section-label">Agent Registry</span>
            <h2 className="section-title">Specialist agents at your command</h2>
            <p className="section-sub">Each agent is loaded with domain-specific skills and eval criteria. Describe what you want — the harness routes it to the right agent.</p>
          </div>
          <div className="agents-grid">
            {agents.map((a, i) => (
              <div key={i} className="agent-card fade-in">
                <div className="handle">{a.handle}</div>
                <div className="role">{a.role}</div>
                <div className="skills">
                  {a.skills.map((s, j) => <span key={j}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="usage">
        <div className="container">
          <div className="fade-in">
            <span className="section-label">Quick Start</span>
            <h2 className="section-title">Ship in 3 steps</h2>
            <p className="section-sub">From empty directory to deployed dApp — the harness handles the routing, verification, and knowledge graphing.</p>
          </div>
          <div className="steps">
            <div className="step fade-in">
              <span className="num">01</span>
              <h4>Scaffold</h4>
              <p><code>npx create-stellar-agentic my-dapp</code> — generates your project with contracts, frontend, and agent config.</p>
            </div>
            <div className="step fade-in">
              <span className="num">02</span>
              <h4>Describe</h4>
              <p>Tell the harness what you want: a token, a swap, an NFT marketplace, a payment API. It routes to the right agent.</p>
            </div>
            <div className="step fade-in">
              <span className="num">03</span>
              <h4>Ship</h4>
              <p>Agents write, eval-verify, and iterate code. You get production-grade Stellar dApps with zero manual wiring.</p>
            </div>
          </div>
          <div className="fade-in" style={{ marginTop: "48px" }}>
            <h3 style={{ marginBottom: "14px", fontSize: "1rem", fontWeight: 600 }}>Example: Scaffold a token contract</h3>
            <div className="code-block">
              <span className="comment"># Create a new project</span><br />
              npx create-stellar-agentic my-token-dapp<br /><br />
              <span className="comment"># Inside the harness, describe your contract</span><br />
              <span className="keyword">@stellar-contracts</span> create a SAC-compatible token<br />
              with mint, burn, and transfer operations<br /><br />
              <span className="comment"># Agent writes the contract, evals verify it</span><br />
              <span className="ok">ok</span>  Contract compiles<br />
              <span className="ok">ok</span>  Tests pass<br />
              <span className="ok">ok</span>  Eval criteria met
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" style={{ background: "var(--surface)" }}>
        <div className="container">
          <div className="fade-in">
            <span className="section-label">Architecture</span>
            <h2 className="section-title">How it works</h2>
            <p className="section-sub">The Stellar Coding Harness orchestrates agents through a structured pipeline of routing, verification, and knowledge graphing.</p>
          </div>
          <div className="arch-diagram fade-in">
            ┌─────────────────────────────────────────────────┐
            │           Stellar Coding Harness                │
            │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
            │  │  Skills  │  │ Agents   │  │  Evals   │     │
            │  │   Load   │→ │  Route   │→ │  Verify  │──┐  │
            │  └──────────┘  └──────────┘  └──────────┘  │  │
            │                                             │  │
            │  ┌──────────────────────────────────────┐    │  │
            │  │         Knowledge Graph              │◄───┘  │
            │  │   (graphify-out/ — every project)    │       │
            │  └──────────────────────────────────────┘       │
            └─────────────────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
        Contract             Frontend            Backend
        (Rust/WASM)          (Next.js)           (API/Indexer)
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="links">
            <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework">GitHub</a>
            <a href="https://www.npmjs.com/package/create-stellar-agentic">npm</a>
            <a href="https://stellar.org">Stellar</a>
          </div>
          <p>MIT License &middot; v0.1.9</p>
        </div>
      </footer>
    </>
  );
}
