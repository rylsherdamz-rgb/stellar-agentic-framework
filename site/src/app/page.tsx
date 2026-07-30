"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Box, Layout, Server, CreditCard, ShieldCheck, GitBranch, ArrowRight, ChevronDown, Copy, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const terminalScript = [
  { type: "cmd", text: "npx create-stellar-agentic my-dapp" },
  { type: "output", text: "Scaffolding Stellar Agentic dApp...", delay: 600 },
  { type: "output", text: "  ok  contracts/hello-world/src/lib.rs", delay: 200 },
  { type: "output", text: "  ok  contracts/token/src/lib.rs", delay: 180 },
  { type: "output", text: "  ok  frontend/src/app/page.tsx", delay: 220 },
  { type: "output", text: "  ok  frontend/src/app/layout.tsx", delay: 160 },
  { type: "output", text: "  ok  frontend/stellar-wallets-kit.tsx", delay: 200 },
  { type: "output", text: "  ok  backend/src/index.ts", delay: 180 },
  { type: "output", text: "", delay: 300 },
  { type: "cmd", text: "npm run dev" },
  { type: "output", text: "  Stellar Agentic dApp running on http://localhost:3000", delay: 500 },
];

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

function CopyButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(getText()); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
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
      <line x1="6.1" y1="6.1" x2="9.9" y2="9.9" stroke="#7c3aed" strokeWidth="1" opacity="0.2" />
      <line x1="14.1" y1="14.1" x2="17.9" y2="17.9" stroke="#7c3aed" strokeWidth="1" opacity="0.2" />
      <line x1="17.9" y1="6.1" x2="14.1" y2="9.9" stroke="#7c3aed" strokeWidth="1" opacity="0.2" />
      <line x1="9.9" y1="14.1" x2="6.1" y2="17.9" stroke="#7c3aed" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const agentsRef = useRef<HTMLDivElement>(null);
  const usageRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const [lineIdx, setLineIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (lineIdx >= terminalScript.length) return;
    const line = terminalScript[lineIdx];
    const delay = line.type === "cmd" ? 400 : (line.delay || 100);
    const t = setTimeout(() => setLineIdx((i) => i + 1), line.type === "output" && line.text === "" ? 200 : delay);
    return () => clearTimeout(t);
  }, [lineIdx]);

  useEffect(() => { setShowCursor(lineIdx < terminalScript.length); }, [lineIdx]);

  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;
    gsap.fromTo(hero.querySelector("h1"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(hero.querySelector("p"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.2 });
    gsap.fromTo(hero.querySelector(".hero-actions"), { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.4 });
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom top", onUpdate: (self) => { gsap.set(glow, { y: self.progress * 80, scale: 1 + self.progress * 0.15, opacity: 1 - self.progress * 0.4 }); } });
    }, hero);
    return () => ctx.revert();
  }, []);

  useSectionAnim(featuresRef, ".card", { stagger: 0.07 });
  useSectionAnim(agentsRef, ".agent-card", { stagger: 0.06, extra: { scale: 0.95 } });
  useSectionAnim(usageRef, ".step", { stagger: 0.1, extra: { x: -20 } });

  useEffect(() => {
    const el = archRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".arch-card");
    const ctx = gsap.context(() => {
      gsap.fromTo(cards, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1, ease: "back.out(1.3)", scrollTrigger: { trigger: el, start: "top 82%" } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <nav>
        <div className="container">
          <a href="/" className="logo"><Logomark size={22} /> Stellar <em>Agentic</em> <span className="logo-suffix">Framework</span></a>
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

      <section className="hero" ref={heroRef}>
        <div className="hero-glow" ref={glowRef} />
        <div className="container hero-inner">
          <h1><span>Build Stellar dApps</span><br />with AI Agents</h1>
          <p>An eval-driven, multi-agent coding harness that routes tasks to specialist agents, verifies outputs against structured evals, and produces production-grade Stellar dApps.</p>
          <div className="hero-actions">
            <a href="https://www.npmjs.com/package/create-stellar-agentic" className="btn btn-primary">npx create-stellar-agentic</a>
            <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework" className="btn btn-secondary">View on GitHub &rarr;</a>
          </div>
          <div className="terminal-window">
            <div className="terminal-bar">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-label">create-stellar-agentic</span>
              <CopyButton getText={() => "npx create-stellar-agentic my-dapp"} />
            </div>
            <div className="terminal-body">
              {terminalScript.slice(0, lineIdx).map((line, i) => (
                <div key={i} className="terminal-line visible">
                  {line.type === "cmd" ? (
                    <><span className="terminal-prompt">$ </span><span className="terminal-cmd">{line.text}</span></>
                  ) : line.text === "" ? <br /> : (
                    <span className="terminal-output"><span className="ok">ok  </span>{line.text.replace("  ok  ", "")}</span>
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
              <h4>Scaffold</h4>
              <p><code>npx create-stellar-agentic my-dapp</code> generates your project with contracts, frontend, and agent config.</p>
            </div>
            <div className="step">
              <span className="num">02</span>
              <h4>Describe</h4>
              <p>Tell the harness what you want: a token, a swap, a marketplace, a payment API. It routes to the right agent.</p>
            </div>
            <div className="step">
              <span className="num">03</span>
              <h4>Ship</h4>
              <p>Agents write, eval-verify, and iterate. Production-grade Stellar dApps with zero manual wiring.</p>
            </div>
          </div>
          <div className="code-block-wrapper" style={{ marginTop: "52px" }}>
            <div className="code-block-bar">
              <span className="code-block-lang">Shell</span>
              <CopyButton getText={() => "npx create-stellar-agentic my-token-dapp\n\n@stellar-contracts create a SAC-compatible token\nwith mint, burn, and transfer operations"} />
            </div>
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

      <section id="architecture" className="section-alt" ref={archRef}>
        <div className="container">
          <span className="section-label">Architecture</span>
          <h2 className="section-title">How it works</h2>
          <p className="section-sub">A pipeline of skills, routing, verification, and knowledge graphing — all orchestrated by the Stellar Coding Harness.</p>
          <div className="arch-diagram">
            <div className="arch-box arch-harness">
              <div className="arch-box-label">Stellar Coding Harness</div>
              <div className="arch-row">
                <div className="arch-card"><div className="arch-card-label">01</div><div className="arch-card-title">Skills</div><div className="arch-card-sub">load domain knowledge</div></div>
                <div className="arch-arrow"><ArrowRight size={14} /></div>
                <div className="arch-card"><div className="arch-card-label">02</div><div className="arch-card-title">Agent Router</div><div className="arch-card-sub">match &amp; route task</div></div>
                <div className="arch-arrow"><ArrowRight size={14} /></div>
                <div className="arch-card"><div className="arch-card-label">03</div><div className="arch-card-title">Evals</div><div className="arch-card-sub">verify output</div></div>
              </div>
              <div className="arch-connector-v"><ChevronDown size={14} /></div>
              <div className="arch-row arch-single">
                <div className="arch-card arch-card-green">
                  <div className="arch-card-label">04</div>
                  <div className="arch-card-title">Knowledge Graph</div>
                  <div className="arch-card-sub">graphify-out/ &mdash; query &middot; path &middot; explain</div>
                </div>
              </div>
            </div>
            <div className="arch-connector-v arch-connector-out"><ChevronDown size={14} /></div>
            <div className="arch-box arch-output">
              <div className="arch-box-label">Output</div>
              <div className="arch-row">
                <div className="arch-card"><div className="arch-card-title">Contract</div><div className="arch-card-sub">Rust / WASM</div></div>
                <div className="arch-card"><div className="arch-card-title">Frontend</div><div className="arch-card-sub">Next.js / Wallets Kit</div></div>
                <div className="arch-card"><div className="arch-card-title">Backend</div><div className="arch-card-sub">API / Indexer</div></div>
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
