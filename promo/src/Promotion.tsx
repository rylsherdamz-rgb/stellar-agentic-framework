import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { SCENES, type Scene } from "./scenes";
import type { PromoProps } from "./calculate-metadata";

// Brand palette (matches site)
const C = {
  bg: "#07070d",
  surface: "#0c0c14",
  border: "#1c1c2e",
  text: "#e6e6ed",
  dim: "#9b9bb8",
  accent: "#7c3aed",
  amber: "#f59e0b",
  green: "#34d399",
  red: "#ff5f57",
  yellow: "#ffbd2e",
  blue: "#28c840",
};

const FONT_MAIN = "'DM Sans', Inter, system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'SFMono-Regular', Menlo, monospace";

const LogoMark: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3.5" fill="#7c3aed" />
    <circle cx="3" cy="12" r="1.5" fill="#7c3aed" />
    <circle cx="12" cy="3" r="1.5" fill="#7c3aed" />
    <circle cx="21" cy="12" r="1.5" fill="#7c3aed" />
    <circle cx="12" cy="21" r="1.5" fill="#7c3aed" />
    <line x1="12" y1="3" x2="12" y2="8.5" stroke="#7c3aed" strokeWidth="1" />
    <line x1="12" y1="15.5" x2="12" y2="21" stroke="#7c3aed" strokeWidth="1" />
    <line x1="3" y1="12" x2="8.5" y2="12" stroke="#7c3aed" strokeWidth="1" />
    <line x1="15.5" y1="12" x2="21" y2="12" stroke="#7c3aed" strokeWidth="1" />
  </svg>
);

const DotGrid: React.FC = () => {
  const dots = [];
  for (let x = 0; x < 30; x++) {
    for (let y = 0; y < 18; y++) {
      dots.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x * 70,
            top: y * 70,
            width: 2,
            height: 2,
            borderRadius: 999,
            background: "rgba(124,58,237,0.12)",
          }}
        />,
      );
    }
  }
  return <div style={{ position: "absolute", inset: 0 }}>{dots}</div>;
};

const Glow: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: "-35%",
      left: "50%",
      transform: "translateX(-50%)",
      width: 1300,
      height: 1000,
      borderRadius: 999,
      background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 60%)",
    }}
  />
);

const Wordmark: React.FC = () => (
  <div style={{ position: "absolute", top: 46, left: 80, display: "flex", alignItems: "center", gap: 12 }}>
    <LogoMark size={34} />
    <span style={{ fontFamily: FONT_MAIN, fontWeight: 700, fontSize: 21, color: C.text, letterSpacing: "-0.02em" }}>
      Stellar <span style={{ color: C.accent }}>Agentic</span>{" "}
      <span style={{ color: "#52527a", fontWeight: 500 }}>Framework</span>
    </span>
  </div>
);

const AnkiTitle: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - delay * fps;
  const opacity = interpolate(t, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const scale = interpolate(t, [0, 14], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        opacity,
        scale,
        fontWeight: 800,
        fontSize: 82,
        lineHeight: 1.08,
        letterSpacing: "-0.03em",
        color: C.text,
        maxWidth: 1500,
        textAlign: "center",
        fontFamily: FONT_MAIN,
      }}
    >
      {text}
    </div>
  );
};

const AnkiSub: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - delay * fps;
  const opacity = interpolate(t, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const y = interpolate(t, [0, 14], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        opacity,
        translate: `0 ${y}px`,
        fontSize: 30,
        color: C.dim,
        maxWidth: 1100,
        textAlign: "center",
        fontFamily: FONT_MAIN,
        lineHeight: 1.5,
        marginTop: 26,
      }}
    >
      {text}
    </div>
  );
};

const TerminalWindow: React.FC<{ children: React.ReactNode; hasPrefix?: boolean }> = ({ children, hasPrefix = false }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 12], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        opacity,
        translate: `0 ${y}px`,
        marginTop: 50,
        width: 940,
        background: "#0a0a12",
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: FONT_MONO,
        boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
      }}
    >
      <div style={{ padding: "12px 16px", background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ width: 11, height: 11, borderRadius: 999, background: C.red }} />
        <span style={{ width: 11, height: 11, borderRadius: 999, background: C.yellow }} />
        <span style={{ width: 11, height: 11, borderRadius: 999, background: C.blue }} />
        {hasPrefix ? <span style={{ marginLeft: 8, fontSize: 13, color: "#52527a", textTransform: "uppercase", letterSpacing: 1 }}>bash</span> : null}
      </div>
      <div style={{ padding: "22px 26px", display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
};

const CmdLine: React.FC<{ text: string; color?: string }> = ({ text, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = interpolate(frame, [0, Math.max(30, text.length * 2)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visible = Math.floor(text.length * width);
  return (
    <div style={{ fontSize: 22, color: color || C.text, display: "flex", gap: 10, whiteSpace: "pre" }}>
      <span style={{ color: C.amber, userSelect: "none" }}>❯</span>
      <span>{text.slice(0, visible)}</span>
      {visible < text.length ? <span style={{ color: C.text }}>▌</span> : null}
    </div>
  );
};

const OkLine: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity, fontSize: 20, color: C.green, whiteSpace: "pre" }}>
      <span style={{ color: C.green }}>✔ </span>
      {text}
    </div>
  );
};

const Scene1Hook: React.FC<{ scene: Scene; durationInFrames: number }> = ({ scene, durationInFrames }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Glow />
    <DotGrid />
    <Wordmark />
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 160px" }}>
      <AnkiTitle text={scene.title} delay={0.2} />
      <AnkiSub text={scene.subtitle!} delay={0.6} />
      <div style={{ marginTop: 56, display: "flex", gap: 14 }}>
        {["Soroban", "Next.js", "x402", "ZK", "CI/CD"].map((s, i) => {
          const frame = useCurrentFrame();
          const { fps } = useVideoConfig();
          const start = 1.2 * fps + i * 0.15 * fps;
          const opacity = interpolate(frame, [start, start + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const x = interpolate(frame, [start, start + 8], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={s} style={{ opacity, translate: `${x}px 0`, padding: "10px 22px", borderRadius: 999, background: C.surface, border: `1px solid ${C.border}`, color: C.dim, fontFamily: FONT_MONO, fontSize: 20 }}>
              {s}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
    <Audio src={staticFile(scene.audioFile)} />
  </AbsoluteFill>
);

const AgentChips: React.FC = () => {
  const frame = useCurrentFrame();
  const agents = [
    "@stellar-contracts",
    "@stellar-frontend",
    "@stellar-backend",
    "@stellar-payments",
    "@stellar-ops",
    "@stellar-zk",
  ];
  const { fps } = useVideoConfig();
  return (
    <div style={{ marginTop: 46, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 1150 }}>
      {agents.map((a, i) => {
        const start = 18 + i * fps * 0.3;
        const opacity = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(frame, [start, start + 10], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={a} style={{ opacity, translate: `0 ${y}px`, padding: "12px 24px", borderRadius: 999, border: `1px solid ${C.border}`, background: C.surface, fontFamily: FONT_MONO, fontSize: 20, color: C.accent }}>
            {a}
          </div>
        );
      })}
    </div>
  );
};

const Scene2Framework: React.FC<{ scene: Scene }> = ({ scene }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Glow />
    <DotGrid />
    <Wordmark />
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 160px" }}>
      <AnkiTitle text={scene.title} delay={0.2} />
      <AnkiSub text={scene.subtitle!} delay={0.6} />
      <AgentChips />
    </AbsoluteFill>
    <Audio src={staticFile(scene.audioFile)} />
  </AbsoluteFill>
);

const Scene3Skill: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const reveal = frame > 30;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Glow />
      <DotGrid />
      <Wordmark />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 160px" }}>
        <AnkiTitle text={scene.title} delay={0.2} />
        <AnkiSub text={scene.subtitle!} delay={0.6} />
        <TerminalWindow hasPrefix>
          <CmdLine text="npx skills add rylsherdamz-rgb/stellar-agentic-framework" />
          {reveal ? <OkLine text="installed — 10 skills · 6 agents · graph engine" delay={20} /> : null}
        </TerminalWindow>
      </AbsoluteFill>
      <Audio src={staticFile(scene.audioFile)} />
    </AbsoluteFill>
  );
};

const Scene4Cli: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = Math.min(4, Math.round(frame / fps));
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Glow />
      <DotGrid />
      <Wordmark />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 160px" }}>
        <AnkiTitle text={scene.title} delay={0.2} />
        <AnkiSub text={scene.subtitle!} delay={0.6} />
        <TerminalWindow hasPrefix>
          <CmdLine text="npx create-stellar-agentic my-dapp --yes" />
          {step >= 1 ? <OkLine text="contracts/    hello-world + SEP-41 token" delay={10} /> : null}
          {step >= 2 ? <OkLine text="frontend/     Next.js 15 + Wallets Kit" delay={10} /> : null}
          {step >= 3 ? <OkLine text="backend/      Express + RPC + x402 middleware" delay={10} /> : null}
          {step >= 4 ? <OkLine text=".github/      CI/CD workflows" delay={10} /> : null}
          {step >= 5 ? <OkLine text="+ all 10 skills auto-installed" delay={10} /> : null}
        </TerminalWindow>
      </AbsoluteFill>
      <Audio src={staticFile(scene.audioFile)} />
    </AbsoluteFill>
  );
};

const Scene5Together: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s1 = interpolate(frame, [0, 14], [1, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s2 = interpolate(frame, [14, 28], [1, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const doStatic = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Glow />
      <DotGrid />
      <Wordmark />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 160px" }}>
        <AnkiTitle text={scene.title} delay={0.2} />
        <AnkiSub text={scene.subtitle!} delay={0.6} />
        <div style={{ opacity, marginTop: 60, display: "flex", alignItems: "center", gap: 40, fontFamily: FONT_MONO, fontSize: 24 }}>
          <div style={{ scale: s1, padding: "26px 42px", borderRadius: 16, background: C.surface, border: `1px solid ${C.border}`, color: C.text, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: C.accent }}>cli</span>
            scaffold
          </div>
          <div style={{ scale: doStatic, color: C.green, fontSize: 34 }}>→</div>
          <div style={{ scale: s2, padding: "26px 42px", borderRadius: 16, background: C.surface, border: `1px solid ${C.accent}`, color: C.text, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: C.accent }}>skill</span>
            build
          </div>
        </div>
      </AbsoluteFill>
      <Audio src={staticFile(scene.audioFile)} />
    </AbsoluteFill>
  );
};

const Scene6Cta: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Glow />
      <DotGrid />
      <Wordmark />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 160px" }}>
        <AnkiTitle text={scene.title} delay={0.2} />
        <AnkiSub text={scene.subtitle!} delay={0.6} />
        <TerminalWindow hasPrefix>
          <CmdLine text="npx skills add rylsherdamz-rgb/stellar-agentic-framework" />
        </TerminalWindow>
        <div style={{ opacity, marginTop: 30, fontFamily: FONT_MONO, fontSize: 22, color: "#52527a" }}>
          CLI · Skill · 10 skills · 6 agents · 5 evals
        </div>
      </AbsoluteFill>
      <Audio src={staticFile(scene.audioFile)} />
    </AbsoluteFill>
  );
};

const SceneSwitcher: React.FC<{ scene: Scene; durationInFrames: number }> = ({ scene, durationInFrames }) => {
  switch (scene.kind) {
    case "hook":
      return <Scene1Hook scene={scene} durationInFrames={durationInFrames} />;
    case "framework":
      return <Scene2Framework scene={scene} />;
    case "skill":
      return <Scene3Skill scene={scene} />;
    case "cli":
      return <Scene4Cli scene={scene} />;
    case "together":
      return <Scene5Together scene={scene} />;
    case "cta":
      return <Scene6Cta scene={scene} />;
    default:
      return null;
  }
};

export const Promotion: React.FC<PromoProps> = ({ sceneDurations }) => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {SCENES.map((scene, idx) => {
        const from = cursor;
        const duration = sceneDurations[idx] ?? scene.defaultFrames;
        cursor += duration;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration}>
            <SceneSwitcher scene={scene} durationInFrames={duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};