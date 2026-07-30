"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Box, Layout, Server, CreditCard, ShieldCheck, GitBranch, ArrowRight, Copy, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Box, title: "Smart Contracts", desc: "Scaffold Rust/Soroban contracts with build, test, and deploy workflows." },
  { icon: Layout, title: "dApp Frontends", desc: "Generate Next.js apps pre-integrated with Stellar Wallets Kit." },
  { icon: Server, title: "Backend APIs", desc: "Build API servers and indexers that query Stellar RPC and Horizon." },
  { icon: CreditCard, title: "x402 Payments", desc: "Monetize APIs with HTTP 402 and Stellar USDC. Machine-to-machine payments." },
  { icon: ShieldCheck, title: "Zero-Knowledge Proofs", desc: "Integrate Groth16, Circom, and Noir verifiers into Stellar contracts." },
  { icon: GitBranch, title: "Eval-Driven", desc: "Every output verified against structured eval criteria with max 3 retry steers." },
];

const agents = [
  { handle: "@stellar-contracts", role: "Rust smart contract specialist", skills: ["soroban-sdk", "WASM", "deploy"] },
  { handle: "@stellar-frontend", role: "Next.js dApp frontend developer", skills: ["React", "Wallets Kit", "Tailwind"] },
  { handle: "@stellar-backend", role: "API and indexer engineer", skills: ["RPC", "Horizon", "Data"] },
  { handle: "@stellar-payments", role: "x402 and MPP payment flow architect", skills: ["USDC", "Paywall", "MPP"] },
  { handle: "@stellar-zk", role: "Zero-knowledge integration engineer", skills: ["Groth16", "Circom", "Noir"] },
];

const ROUTES = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Install", href: "#install" },
  { label: "Agents", href: "#agents" },
  { label: "Usage", href: "#usage" },
];

function CopyButton({ getText, children, className = "" }: { getText: () => string; children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className={`copy-btn ${className}`} onClick={() => { navigator.clipboard.writeText(getText()); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : (children || "Copy")}
    </button>
  );
}

function useSectionAnim(ref: React.RefObject<HTMLDivElement | null>, cardSel: string, opts?: { stagger?: number; extra?: gsap.TweenVars }) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = el.querySelectorAll(cardSel);
    const label = el.querySelector(".section-label")!;
    const title = el.querySelector(".section-title")!;
    const sub = el.querySelector(".section-sub");
    const ctx = gsap.context(() => {
      gsap.fromTo(label, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 87%" } });
      gsap.fromTo(title, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 87%" } });
      if (sub) gsap.fromTo(sub, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 87%" } });
      gsap.fromTo(cards, { autoAlpha: 0, y: 20, ...(opts?.extra || {}) }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: opts?.stagger || 0.07, ease: "back.out(1.4)", scrollTrigger: { trigger: el, start: "top 82%" } });
    });
    return () => ctx.revert();
  }, []);
}

function Logomark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="3.5" fill="#7c3aed" />
      <circle cx="3" cy="12" r="1.5" fill="#7c3aed" opacity="0.5" />
      <circle cx="12" cy="3" r="1.5" fill="#7c3aed" opacity="0.5" />
      <circle cx="21" cy="12" r="1.5" fill="#7c3aed" opacity="0.5" />
      <circle cx="12" cy="21" r="1.5" fill="#7c3aed" opacity="0.5" />
      <line x1="12" y1="3" x2="12" y2="8.5" stroke="#7c3aed" strokeWidth="1" opacity="0.35" />
      <line x1="12" y1="15.5" x2="12" y2="21" stroke="#7c3aed" strokeWidth="1" opacity="0.35" />
      <line x1="3" y1="12" x2="8.5" y2="12" stroke="#7c3aed" strokeWidth="1" opacity="0.35" />
      <line x1="15.5" y1="12" x2="21" y2="12" stroke="#7c3aed" strokeWidth="1" opacity="0.35" />
    </svg>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const installRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const agentsRef = useRef<HTMLDivElement>(null);
  const usageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;
    gsap.fromTo(hero.querySelector("h1"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(hero.querySelector("p"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.2 });
    gsap.fromTo(hero.querySelector(".hero-actions"), { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.3 });
    gsap.fromTo(hero.querySelector(".hero-mini-term"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.5 });
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom top", onUpdate: (self) => { gsap.set(glow, { y: self.progress * 80, scale: 1 + self.progress * 0.15, opacity: 1 - self.progress * 0.4 }); } });
    }, hero);
    return () => ctx.revert();
  }, []);

  useSectionAnim(archRef, ".arch-pipe-card", { stagger: 0.08 });
  useSectionAnim(installRef, ".install-card", { stagger: 0.12 });
  useSectionAnim(featuresRef, ".card", { stagger: 0.07 });
  useSectionAnim(agentsRef, ".agent-card", { stagger: 0.06, extra: { scale: 0.95 } });
  useSectionAnim(usageRef, ".step", { stagger: 0.1, extra: { x: -20 } });

  return (
    <>
      <nav>
        <div className="container">
          <a href="/" className="logo"><Logomark size={22} /> Stellar <em>Agentic</em> <span className="logo-suffix">Framework</span></a>
          <div className="links">
            {ROUTES.map((r) => <a key={r.label} href={r.href}>{r.label}</a>)}
            <a href="#install" className="nav-cta">Get Started</a>
          </div>
        </div>
      </nav>

      <section className="hero" ref={heroRef}>
        <div className="hero-glow" ref={glowRef} />
        <div className="container hero-inner">
          <h1><span>Build Stellar dApps</span><br />with AI Agents</h1>
          <p>An eval-driven, multi-agent coding harness that routes tasks to specialist agents, verifies outputs against structured evals, and produces production-grade Stellar dApps.</p>
          <div className="hero-actions">
            <div className="hero-cta-group">
              <span className="hero-cta-label">Use with Claude Code / OpenCode</span>
              <CopyButton getText={() => "npx skills add rylsherdamz-rgb/stellar-agentic-framework"} className="btn btn-primary btn-copy">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Install Skill
              </CopyButton>
            </div>
            <div className="hero-cta-group">
              <span className="hero-cta-label">Use standalone</span>
              <CopyButton getText={() => "npx create-stellar-agentic my-dapp"} className="btn btn-primary btn-copy">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
                Scaffold Project
              </CopyButton>
            </div>
          </div>
          <div className="hero-mini-term">
            <div className="bar">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
            <div className="body">
              Kernel routes task to <span>@stellar-contracts</span>, <span>@stellar-frontend</span>, <span>@stellar-backend</span> &mdash; each verified against evals, max 3 retries, graphified on completion.
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" ref={archRef}>
        <div className="container">
          <span className="section-label">Architecture</span>
          <h2 className="section-title">How it works</h2>
          <p className="section-sub">The kernel never writes code. It routes, verifies, and steers. Six agents do the work.</p>
          <div className="arch-pipeline">
            <div className="arch-pipe-card"><div className="label">Input</div><div className="value">Describe task</div><div className="meta">natural language</div></div>
            <div className="arch-pipe-arrow"><ArrowRight size={16} /></div>
            <div className="arch-pipe-card"><div className="label">Route</div><div className="value">Agent Router</div><div className="meta">6 specialists</div></div>
            <div className="arch-pipe-arrow"><ArrowRight size={16} /></div>
            <div className="arch-pipe-card"><div className="label">Build</div><div className="value">Skills + Evals</div><div className="meta">10 knowledge skills</div></div>
            <div className="arch-pipe-arrow"><ArrowRight size={16} /></div>
            <div className="arch-pipe-card"><div className="label">Verify</div><div className="value">Eval Gate</div><div className="meta">max 3 retries</div></div>
            <div className="arch-pipe-arrow"><ArrowRight size={16} /></div>
            <div className="arch-pipe-card"><div className="label">Output</div><div className="value">Contract + Frontend + API</div><div className="meta">graphified</div></div>
          </div>
        </div>
      </section>

      <section id="install" className="section-alt" ref={installRef}>
        <div className="container">
          <span className="section-label">Install</span>
          <h2 className="section-title">Two ways in</h2>
          <p className="section-sub">Pick the path that matches your workflow.</p>
          <div className="install-grid">
            <div className="install-card">
              <div className="install-card-header">
                <span className="install-badge">A</span>
                <h3>Agent Skill</h3>
              </div>
              <div className="install-audience">For Claude Code and OpenCode users</div>
              <p className="install-desc">Install the framework as an AI skill. The harness activates automatically in every session — describe what you want in natural language.</p>
              <div className="install-code-block">
                <div className="install-code-bar">Shell</div>
                <div className="install-code-body"><span className="cp">$ </span><span className="ccmd">npx skills add rylsherdamz-rgb/stellar-agentic-framework</span><br /><br /><span className="co"># or specify your agent</span><br /><span className="cp">$ </span><span className="ccmd">npx skills add rylsherdamz-rgb/stellar-agentic-framework --agent claude-code</span><br /><span className="cp">$ </span><span className="ccmd">npx skills add rylsherdamz-rgb/stellar-agentic-framework --agent opencode</span></div>
              </div>
              <div className="install-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>Then just describe: <em>&ldquo;Build a token contract with a React frontend and x402 payments&rdquo;</em></span>
              </div>
            </div>
            <div className="install-card">
              <div className="install-card-header">
                <span className="install-badge">B</span>
                <h3>Scaffold CLI</h3>
              </div>
              <div className="install-audience">For standalone projects</div>
              <p className="install-desc">Generate a complete Stellar dApp in one command — contracts, frontend, backend, CI/CD, agents, and evals. No Claude Code required.</p>
              <div className="install-code-block">
                <div className="install-code-bar">Shell</div>
                <div className="install-code-body"><span className="cp">$ </span><span className="ccmd">npx create-stellar-agentic my-dapp --yes</span><br /><br /><span className="co">  ✔ Scaffolding Stellar Agentic dApp...</span><br /><span className="co">  ✔ contracts/hello-world/src/lib.rs</span><br /><span className="co">  ✔ contracts/token/src/lib.rs</span><br /><span className="co">  ✔ frontend/src/app/page.tsx</span><br /><span className="co">  ✔ backend/src/index.ts</span><br /><span className="co">  ✔ All 10 skills installed</span></div>
              </div>
              <div className="install-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>If you use Claude Code later, it auto-detects the harness — no extra setup.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" ref={featuresRef}>
        <div className="container">
          <span className="section-label">Features</span>
          <h2 className="section-title">Everything you need to ship on Stellar</h2>
          <p className="section-sub">Six specialist agents, zero boilerplate. From contract to deployment in minutes.</p>
          <div className="card-grid">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card">
                  <div className="card-icon"><Icon size={18} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="agents" className="section-alt" ref={agentsRef}>
        <div className="container">
          <span className="section-label">Agent Registry</span>
          <h2 className="section-title">Specialist agents at your command</h2>
          <p className="section-sub">Each agent is loaded with domain-specific skills and eval criteria. Describe what you want — the harness routes it to the right agent.</p>
          <div className="agents-grid">
            {agents.map((a, i) => (
              <div key={i} className="agent-card">
                <div className="handle">{a.handle}</div>
                <div className="role">{a.role}</div>
                <div className="skills">{a.skills.map((s, j) => <span key={j}>{s}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="usage" ref={usageRef}>
        <div className="container">
          <span className="section-label">Quick Start</span>
          <h2 className="section-title">Ship in 3 steps</h2>
          <p className="section-sub">From empty directory to deployed dApp — the harness handles the routing, verification, and knowledge graphing.</p>
          <div className="steps">
            <div className="step">
              <span className="num">01</span>
              <h4>Install</h4>
              <p>Install the framework as an AI skill or scaffold a project.</p>
              <div className="step-cmds">
                <div><span className="step-cmd-prompt">$ </span><span>npx skills add rylsherdamz-rgb/stellar-agentic-framework</span></div>
                <div><span className="step-cmd-prompt">$ </span><span>npx create-stellar-agentic my-dapp --yes</span></div>
              </div>
            </div>
            <div className="step">
              <span className="num">02</span>
              <h4>Describe</h4>
              <p>Tell the harness what to build. It routes to the right agent automatically.</p>
              <div className="step-prompt">
                <span className="step-agent">@stellar-contracts </span>create a SAC-compatible token with mint, burn, and transfer operations
              </div>
            </div>
            <div className="step">
              <span className="num">03</span>
              <h4>Ship</h4>
              <p>Agents write code, evals verify it, knowledge graph maps the project.</p>
              <div className="step-evals">
                <div className="step-eval"><span className="step-eval-icon pass" /><span>Contract compiles to WASM</span></div>
                <div className="step-eval"><span className="step-eval-icon pass" /><span>Tests pass</span></div>
                <div className="step-eval"><span className="step-eval-icon pass" /><span>Auth on privileged functions</span></div>
                <div className="step-eval"><span className="step-eval-icon pass" /><span>TTL on writes</span></div>
                <div className="step-eval"><span className="step-eval-icon pass" /><span>Frontend wallet connect/disconnect</span></div>
                <div className="step-eval-summary">6/6 evals passed</div>
                <div className="step-deploy"><code>/deploy . testnet</code></div>
              </div>
            </div>
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
