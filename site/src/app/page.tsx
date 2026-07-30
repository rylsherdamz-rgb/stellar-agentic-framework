"use client";

import { useEffect, useRef } from "react";

const features = [
  { icon: "⚡", title: "Smart Contracts", desc: "Scaffold Rust/Soroban contracts with build, test, and deploy workflows — all from a single command." },
  { icon: "🎨", title: "dApp Frontends", desc: "Generate Next.js apps pre-integrated with Stellar Wallets Kit. Connect, sign, and transact instantly." },
  { icon: "🔌", title: "Backend APIs", desc: "Build API servers and indexers that query Stellar RPC and Horizon. Ship production-grade data pipelines." },
  { icon: "💸", title: "x402 Payments", desc: "Monetize APIs with HTTP 402 + Stellar USDC. Machine-to-machine payments out of the box." },
  { icon: "🛡️", title: "Zero-Knowledge Proofs", desc: "Integrate Groth16, Circom, and Noir verifiers into Stellar contracts. Privacy-first dApps." },
  { icon: "🧪", title: "Eval-Driven", desc: "Every output is verified against structured eval criteria. Max 3 retry steers. No broken code ships." },
];

const agents = [
  { handle: "@stellar-contracts", role: "Rust smart contract specialist", skills: ["soroban-sdk", "WASM", "deploy"] },
  { handle: "@stellar-frontend", role: "Next.js dApp frontend developer", skills: ["React", "Wallets Kit", "Tailwind"] },
  { handle: "@stellar-backend", role: "API & indexer engineer", skills: ["RPC", "Horizon", "Data"] },
  { handle: "@stellar-payments", role: "x402 / MPP payment flow architect", skills: ["USDC", "Paywall", "MPP"] },
  { handle: "@stellar-zk", role: "Zero-knowledge integration engineer", skills: ["Groth16", "Circom", "Noir"] },
];

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <nav>
        <div className="container">
          <a href="#" className="logo">Stellar <span>Agentic</span></a>
          <div className="links">
            <a href="#features">Features</a>
            <a href="#agents">Agents</a>
            <a href="#usage">Usage</a>
            <a href="#architecture">Architecture</a>
            <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework" target="_blank" rel="noopener">GitHub</a>
            <a href="https://www.npmjs.com/package/create-stellar-agentic" className="nav-cta">npx create-stellar-agentic</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-badge">🧪 v0.1.9 — Eval-Driven Stellar dApp Framework</div>
          <h1>Build Stellar dApps<br />with AI Agents</h1>
          <p>An eval-driven, multi-agent coding harness that routes tasks to specialist agents, verifies outputs against structured evals, and produces production-grade Stellar dApps.</p>
          <div className="hero-actions">
            <a href="https://www.npmjs.com/package/create-stellar-agentic" className="btn btn-primary">npx create-stellar-agentic</a>
            <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework" className="btn btn-secondary">View on GitHub →</a>
          </div>
          <div className="hero-cmd">
            <span className="prompt">$</span> npx create-stellar-agentic my-dapp<br />
            <span className="comment"># → Scaffolds a complete Stellar dApp with contracts + frontend</span>
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
                <span className="icon">{f.icon}</span>
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
              <div className="num">1</div>
              <h4>Scaffold</h4>
              <p><code>npx create-stellar-agentic my-dapp</code> — generates your project with contracts, frontend, and agent config.</p>
            </div>
            <div className="step fade-in">
              <div className="num">2</div>
              <h4>Describe</h4>
              <p>Tell the harness what you want: a token, a swap, an NFT marketplace, a payment API. It routes to the right agent.</p>
            </div>
            <div className="step fade-in">
              <div className="num">3</div>
              <h4>Ship</h4>
              <p>Agents write, eval-verify, and iterate code. You get production-grade Stellar dApps with zero manual wiring.</p>
            </div>
          </div>
          <div className="fade-in" style={{ marginTop: "48px" }}>
            <h3 style={{ marginBottom: "16px" }}>Example: Scaffold a token contract</h3>
            <div className="code-block">
              <span className="comment"># Create a new project</span><br />
              npx create-stellar-agentic my-token-dapp<br /><br />
              <span className="comment"># Inside the harness, describe your contract</span><br />
              <span className="kw">@stellar-contracts</span> create a SAC-compatible token<br />
              with mint, burn, and transfer operations<br /><br />
              <span className="comment"># Agent writes the contract, evals verify it</span><br />
              ✓ Contract compiles<br />
              ✓ Tests pass<br />
              ✓ Eval criteria met (3/3)
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
          <p>Built on Stellar · MIT License · v0.1.9</p>
        </div>
      </footer>
    </>
  );
}
