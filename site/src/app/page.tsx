'use client';

import { useEffect, useRef } from "react";

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
      },
      { threshold: 0.1 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return ref;
}

function FadeSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeIn();
  return <div ref={ref} className={`fade-in ${className}`}>{children}</div>;
}

export default function Home() {
  return (
    <>
      <nav>
        <div className="container">
          <a href="#" className="logo"><span>✦</span> stellar-agentic</a>
          <div className="links">
            <a href="#features">Features</a>
            <a href="#agents">Agents</a>
            <a href="#usage">Usage</a>
            <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework">GitHub</a>
            <a href="https://www.npmjs.com/package/create-stellar-agentic" className="nav-cta">npx install</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-badge">✦ v0.1.9 · Eval-Driven Multi-Agent Harness</div>
          <h1>Build Stellar dApps<br />with AI Agents</h1>
          <p>An eval-driven coding harness that routes your request to 6 specialist agents, verifies output against structured evals, steers on failure, and produces a ship-ready eval report.</p>
          <div className="hero-actions">
            <a href="https://www.npmjs.com/package/create-stellar-agentic" className="btn btn-primary">npx create-stellar-agentic</a>
            <a href="#features" className="btn btn-secondary">Learn More</a>
          </div>
          <div className="hero-cmd">
            <span className="prompt">$</span> <span className="cmd">npx create-stellar-agentic my-dapp --yes</span><br />
            <span className="comment" style={{ color: "#6a6a8a" }}>  ⠋ Scaffolding full Stellar dApp...</span><br />
            <span className="comment" style={{ color: "#6a6a8a" }}>  ✔ contracts/ · frontend/ · backend/ · cicd/</span>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="container">
          <FadeSection><div className="section-label">Features</div></FadeSection>
          <FadeSection><h2 className="section-title">What the Framework Provides</h2></FadeSection>
          <FadeSection><p className="section-sub">10 bundled skills, 6 AI agents, 5 eval definitions — everything you need to ship production Stellar dApps.</p></FadeSection>
          <div className="features-grid">
            {[
              ["🧠", "6 Specialist Agents", "Parallel execution for contracts, frontend, backend, payments, ops, and ZK — each loaded with domain-specific skills and templates."],
              ["✅", "Eval-Driven Quality", "Every agent output checked against structured pass/fail criteria. Failed checks trigger corrective retries (max 3). Pass@k metrics reported."],
              ["🔗", "Stellar Agentic Kit", "Typed React hooks — useStellarData, useContract, useStellarWallet — for all blockchain queries. No raw RPC needed."],
              ["📦", "One-Command Scaffold", "npx create-stellar-agentic scaffolds SEP-41 token contract, Next.js frontend, Express backend, and x402 middleware."],
              ["⚡", "MCP Integrations", "Claude has direct blockchain access through Stellar RPC, filesystem, GitHub, and Playwright MCP servers."],
              ["🧩", "10 Bundled Skills", "smart-contracts, dapp, data, assets, agentic-payments, standards, zk-proofs, stellar-mcp, frontend-design, graphify."],
              ["📊", "Knowledge Graphs", "Every project auto-graphified for architecture navigation, dependency queries, and natural-language explain across code and docs."],
              ["🔄", "Stateful Memory", "Per-project context files, ADR-format architecture decisions, session logs, deploy tracker for contract IDs and WASM hashes."],
            ].map(([icon, title, desc], i) => (
              <FadeSection key={i} className="feature-card">
                <span className="icon">{icon}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      <section id="agents" style={{ background: "var(--surface)" }}>
        <div className="container">
          <FadeSection><div className="section-label">Agent Registry</div></FadeSection>
          <FadeSection><h2 className="section-title">Six Specialist AI Agents</h2></FadeSection>
          <FadeSection><p className="section-sub">The kernel routes each request to the right agents based on intent. Agents run in parallel, each with its own skill context and eval criteria.</p></FadeSection>
          <div className="agents-grid">
            {[
              ["@stellar-contracts", "Rust smart contracts (soroban-sdk)", ["smart-contracts", "assets", "zk-proofs"]],
              ["@stellar-frontend", "Next.js + Stellar Wallets Kit", ["dapp", "data", "frontend-design"]],
              ["@stellar-backend", "Express + RPC + x402", ["data", "agentic-payments"]],
              ["@stellar-payments", "x402 + MPP payment flows", ["agentic-payments", "assets"]],
              ["@stellar-ops", "CI/CD + deploy + Docker", ["—"]],
              ["@stellar-zk", "Groth16 + Circom + Noir", ["zk-proofs"]],
            ].map(([handle, role, skills], i) => (
              <FadeSection key={i} className="agent-card">
                <div className="handle">{handle}</div>
                <div className="role">{role}</div>
                <div className="skills">{(skills as string[]).map((s) => <span key={s}>{s}</span>)}</div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      <section id="usage">
        <div className="container">
          <FadeSection><div className="section-label">Quick Start</div></FadeSection>
          <FadeSection><h2 className="section-title">Install &amp; Build in Seconds</h2></FadeSection>
          <FadeSection><p className="section-sub">Three ways to get started — choose the one that fits your workflow.</p></FadeSection>
          <div className="steps">
            {[
              ["Install as Claude Code Skill", "npx skills add rylsherdamz-rgb/stellar-agentic-framework\n\nThen just say: \"Build a token contract with a React frontend\""],
              ["Scaffold a Full Project", "npx create-stellar-agentic my-dapp --yes\n\nContracts, frontend, backend, CI/CD — all pre-configured."],
              ["Install Skill-Only", "npx create-stellar-agentic --skill-only .\n\nJust the agent harness and eval definitions for an existing project."],
            ].map(([title, desc], i) => (
              <FadeSection key={i} className="step">
                <div className="num">{i + 1}</div>
                <h4>{title}</h4>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", whiteSpace: "pre-line" }}>{desc}</p>
              </FadeSection>
            ))}
          </div>

          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Scaffold Output</h3>
            <FadeSection>
              <div className="code-block">
                <span className="comment"># npx create-stellar-agentic my-dapp --yes</span><br />
                <span style={{ color: "var(--accent2)" }}>✔</span> contracts/  — SEP-41 token (Rust, soroban-sdk)<br />
                <span style={{ color: "var(--accent2)" }}>✔</span> frontend/   — Next.js + Stellar Wallets Kit + Tailwind<br />
                <span style={{ color: "var(--accent2)" }}>✔</span> backend/    — Express + RPC + x402 middleware<br />
                <span style={{ color: "var(--accent2)" }}>✔</span> .github/    — CI/CD workflows for contracts + frontend + backend<br />
                <span style={{ color: "var(--accent2)" }}>✔</span> agents/     — 6 specialist agent definitions<br />
                <span style={{ color: "var(--accent2)" }}>✔</span> evals/      — 5 eval definitions per component<br />
                <span style={{ color: "var(--accent2)" }}>✔</span> skills/     — 10 bundled dependency skills<br />
                <span style={{ color: "var(--accent2)" }}>✔</span> data/       — Project memory, deploy tracker, ADR log
              </div>
            </FadeSection>
          </div>

          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Agentic Kit Hook Example</h3>
            <FadeSection>
              <div className="code-block">
                <span className="kw">import</span> {"{"} useWallet, useContract {"}"} <span className="kw">from</span> <span className="str">"@/providers/wallet-provider"</span>;<br /><br />
                <span className="kw">function</span> <span style={{ color: "#6fc" }}>TokenBalance</span>({"{"} contractId {"}"}: {"{""} contractId: string {"}"}) {"{"}<br />
                &nbsp;&nbsp;<span className="kw">const</span> {"{"} address {"}"} = <span style={{ color: "#6fc" }}>useWallet</span>();<br />
                &nbsp;&nbsp;<span className="kw">const</span> {"{"} read {"}"} = <span style={{ color: "#6fc" }}>useContract</span>(contractId);<br /><br />
                &nbsp;&nbsp;<span className="comment">// read() = simulation only, zero fees, no wallet prompt</span><br />
                &nbsp;&nbsp;<span className="kw">const</span> balance = <span style={{ color: "#6fc" }}>read</span>(<span className="str">"balance"</span>, [address]);<br />
                &nbsp;&nbsp;<span className="kw">return</span> <span className="str">&lt;div&gt;</span>{"{"}balance{"}"}<span className="str">&lt;/div&gt;</span>;<br />
                {"}"}
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      <section id="architecture" style={{ background: "var(--surface)" }}>
        <div className="container">
          <FadeSection><div className="section-label">Architecture</div></FadeSection>
          <FadeSection><h2 className="section-title">How It Works</h2></FadeSection>
          <FadeSection><p className="section-sub">The kernel orchestrates user requests through a pipeline of routing, parallel agent execution, verification, and reporting.</p></FadeSection>
          <FadeSection>
            <div className="arch-diagram">{`
            ┌─────────────────────────────┐
            │    User Request              │
            │  "Build a DeFi dApp"         │
            └──────────────┬──────────────┘
                           │
            ┌──────────────▼──────────────┐
            │    Kernel (CLAUDE.md)        │
            │    Route → Track → Report    │
            └──────────────┬──────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                  │
    ┌────▼────┐      ┌─────▼─────┐      ┌────▼────┐
    │Contracts │      │ Frontend  │      │ Backend │
    │   Rust   │      │  Next.js  │      │ Express │
    └────┬────┘      └─────┬─────┘      └────┬────┘
         │                 │                  │
    ┌────▼────┐      ┌─────▼─────┐      ┌────▼────┐
    │Payments │      │    Ops    │      │   ZK    │
    │  x402   │      │  CI/CD    │      │ Groth16 │
    └────┬────┘      └─────┬─────┘      └────┬────┘
         │                 │                  │
         └────────┬────────┴────────┬─────────┘
                  │                 │
           ┌──────▼──────┐   ┌──────▼──────┐
           │  Verify &   │   │   E2E Test  │
           │  Steer      │   │  Playwright │
           └──────┬──────┘   └──────┬──────┘
                  │                 │
           ┌──────▼──────────────────▼──────┐
           │         Eval Report             │
           │  CONTRACT: 5/5  FRONTEND: 4/4   │
           │  BACKEND: 3/3   E2E: 2/2        │
           │  Overall: SHIP IT ✓              │
           └─────────────────────────────────┘
            `.trim()}</div>
          </FadeSection>
        </div>
      </section>

      <section id="why">
        <div className="container" style={{ textAlign: "center" }}>
          <FadeSection><div className="section-label">Why This Exists</div></FadeSection>
          <FadeSection><h2 className="section-title" style={{ maxWidth: 700, margin: "0 auto 16px" }}>AI-Native Stellar Development</h2></FadeSection>
          <FadeSection>
            <p className="section-sub" style={{ margin: "0 auto 40px" }}>
              Building on Stellar means juggling Rust smart contracts, Next.js frontends, Express backends, x402 payment flows, and CI/CD — across multiple tools and workflows. The Stellar Agentic Framework collapses all of that into a single Claude Code session. Instead of context-switching, you describe what you want and 6 parallel agents build, verify, and deploy it — with structured eval reports at every step.
            </p>
          </FadeSection>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <a href="https://www.npmjs.com/package/create-stellar-agentic" className="btn btn-primary">npx create-stellar-agentic</a>
            <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework" className="btn btn-secondary">View on GitHub</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="links">
            <a href="https://www.npmjs.com/package/create-stellar-agentic">npm</a>
            <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework">GitHub</a>
            <a href="https://developers.stellar.org/docs">Stellar Docs</a>
          </div>
          <p>Built with the Stellar Agentic Framework · <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework">MIT License</a></p>
        </div>
      </footer>
    </>
  );
}
