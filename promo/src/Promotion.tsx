import React, { useEffect, useRef } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { SCENES, type Scene } from "./scenes";
import type { PromoProps } from "./calculate-metadata";

// ---------------------------------------------------------------------------
// Palette & typography
// ---------------------------------------------------------------------------
const C = {
  bg: "#07070d",
  surface: "#0c0c14",
  surface2: "#12121c",
  border: "#1c1c2e",
  border2: "#26263c",
  text: "#e6e6ed",
  dim: "#9b9bb8",
  faint: "#52527a",
  accent: "#7c3aed",
  amber: "#f59e0b",
  green: "#34d399",
  red: "#ff5f57",
  yellow: "#ffbd2e",
  blue: "#38bdf8",
  pink: "#f472b6",
  lime: "#a3e635",
};

const FONT_MAIN = "'DM Sans', Inter, system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'SFMono-Regular', Menlo, monospace";

const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const sec = (fps: number) => (s: number) => Math.round(s * fps);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// ---------------------------------------------------------------------------
// Deterministic random (per-frame) — for film grain & particles
// ---------------------------------------------------------------------------
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Sound
// ---------------------------------------------------------------------------
const Sfx: React.FC<{ file: string; at: number; volume?: number }> = ({
  file,
  at,
  volume = 1,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + 4], [0, volume], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });
  return (
    <Sequence from={at} durationInFrames={Math.max(1, 8)} layout="none">
      <Audio src={staticFile(file)} volume={v} />
    </Sequence>
  );
};

const Whoosh: React.FC<{ at: number }> = ({ at }) => (
  <Sfx file="sfx/whoosh.wav" at={at - 2} volume={0.5} />
);
const Pop: React.FC<{ at: number; volume?: number }> = ({ at, volume = 0.4 }) => (
  <Sfx file="sfx/pop.wav" at={at} volume={volume} />
);
const Ding: React.FC<{ at: number; volume?: number }> = ({ at, volume = 0.5 }) => (
  <Sfx file="sfx/ding.wav" at={at} volume={volume} />
);
const Riser: React.FC<{ at: number }> = ({ at }) => (
  <Sfx file="sfx/riser.wav" at={at} volume={0.6} />
);
const Tick: React.FC<{ at: number }> = ({ at }) => (
  <Sfx file="sfx/tick.wav" at={at} volume={0.35} />
);

const Letterbox: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const hIn = interpolate(frame, [0, 18], [0, 88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });
  const hOut = interpolate(frame, [totalFrames - 20, totalFrames - 2], [88, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const h = Math.min(hIn, hOut);
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: "#000", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "#000", pointerEvents: "none" }} />
    </>
  );
};

// ---------------------------------------------------------------------------
// Cinematic overlays: vignette, letterbox, light sweep
// ---------------------------------------------------------------------------
const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);

const LightSweep: React.FC<{ at: number; dur?: number }> = ({ at, dur = 1.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at * fps, (at + dur) * fps], [-0.5, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-30%",
          bottom: "-30%",
          left: `${p * 100}%`,
          width: 420,
          background:
            "linear-gradient(90deg, transparent, rgba(124,58,237,0.10) 40%, rgba(255,255,255,0.14) 50%, rgba(124,58,237,0.10) 60%, transparent)",
          transform: "skewX(-14deg)",
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Continuous world: breathing glow, drifting orbs, parallax dots, slow zoom
// ---------------------------------------------------------------------------
const DotGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const drift = Math.sin(t * 0.12) * 18;
  const dots = [];
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 18; y++) {
      const ox = (x * 64 + drift * (x % 3 === 0 ? 1 : 0.5)) % 2048;
      const oy = (y * 64 + Math.sin(t * 0.2 + x) * 10) % 1152;
      dots.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: ox,
            top: oy,
            width: 2,
            height: 2,
            borderRadius: 999,
            background: "rgba(124,58,237,0.13)",
          }}
        />,
      );
    }
  }
  return <div style={{ position: "absolute", inset: 0 }}>{dots}</div>;
};

const Orb: React.FC<{
  size: number;
  x: number;
  y: number;
  hue: string;
  speed: number;
  depth: number;
}> = ({ size, x, y, hue, speed, depth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const dx = Math.sin(t * speed * 0.5) * 90 * depth;
  const dy = Math.cos(t * speed * 0.35) * 70 * depth;
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx,
        top: y + dy,
        width: size,
        height: size,
        borderRadius: 999,
        background: `radial-gradient(circle, ${hue} 0%, transparent 65%)`,
        filter: "blur(10px)",
        opacity: 0.16 * depth,
      }}
    />
  );
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const breathe = 1 + Math.sin(t * 0.3) * 0.04;
  const zoom = 1.04 + (frame / fps) * 0.003;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", inset: -80, scale: zoom }}>
        <div
          style={{
            position: "absolute",
            top: "-35%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 1300,
            height: 1000,
            borderRadius: 999,
            scale: breathe,
            background: "radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 60%)",
          }}
        />
        <DotGrid />
        <Orb size={900} x={-200} y={100} hue="rgba(124,58,237,1)" speed={0.6} depth={1} />
        <Orb size={600} x={1400} y={500} hue="rgba(168,85,247,1)" speed={0.8} depth={0.7} />
        <Orb size={500} x={700} y={900} hue="rgba(79,70,229,1)" speed={0.5} depth={0.5} />
      </div>
    </AbsoluteFill>
  );
};

const Camera: React.FC<{ children: React.ReactNode; push?: number; drift?: number }> = ({
  children,
  push = 0.05,
  drift = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const dur = durationInFrames / fps;
  const zoom = 1.02 + (frame / durationInFrames) * push;
  const x = Math.sin(t * 0.12) * drift;
  const y = Math.sin(t * 0.1 + 1.2) * drift * 0.6;
  void dur;
  return (
    <div style={{ position: "absolute", inset: -60, scale: zoom, translate: `${x}px ${y}px` }}>
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Motion primitives
// ---------------------------------------------------------------------------
const useSpringT = (delay = 0, config = { damping: 13, stiffness: 110, mass: 0.9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - Math.round(delay * fps),
    fps,
    config,
  });
};

const Title: React.FC<{ text: string; delay?: number; size?: number; gradient?: boolean }> = ({
  text,
  delay = 0,
  size = 82,
  gradient = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  const t = frame / fps - delay;
  const idle = Math.sin(t * 0.8) * 0.004;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.2em",
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.06,
        letterSpacing: "-0.03em",
        color: C.text,
        maxWidth: 1580,
        textAlign: "center",
        fontFamily: FONT_MAIN,
      }}
    >
      {words.map((w, i) => {
        const s = useSpringT(delay + i * 0.055, { damping: 13, stiffness: 120, mass: 0.8 });
        const skew = interpolate(s, [0, 1], [-8, 0]);
        const blur = interpolate(s, [0, 1], [16, 0]);
        const y = interpolate(s, [0, 1], [80, 0]);
        const isKey = gradient && i === 1;
        return (
          <span
            key={i}
            style={{
              scale: 0.9 + s * 0.1 + idle,
              translate: `0 ${y}px`,
              rotate: `${skew}deg`,
              filter: `blur(${blur}px)`,
              display: "inline-block",
              background: isKey
                ? "linear-gradient(135deg, #a78bfa, #7c3aed 45%, #38bdf8)"
                : "none",
              WebkitBackgroundClip: isKey ? "text" : undefined,
              backgroundClip: isKey ? "text" : undefined,
              color: isKey ? "transparent" : C.text,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Subtitle: React.FC<{ text: string; delay?: number; width?: number; size?: number }> = ({
  text,
  delay = 0,
  width = 1120,
  size = 30,
}) => {
  const s = useSpringT(delay, { damping: 15, stiffness: 90, mass: 1 });
  const y = interpolate(s, [0, 1], [26, 0]);
  const blur = interpolate(s, [0, 1], [10, 0]);
  return (
    <div
      style={{
        opacity: Math.min(1, s * 1.4),
        translate: `0 ${y}px`,
        filter: `blur(${blur}px)`,
        fontSize: size,
        color: C.dim,
        maxWidth: width,
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

const Chip: React.FC<{ text: string; at: number; color?: string; accent?: boolean }> = ({
  text,
  at,
  color = C.dim,
  accent = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - Math.round(at * fps),
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.7 },
  });
  const t = frame / fps;
  const idle = Math.sin(t * 1.3 + at * 3) * 3;
  return (
    <div
      style={{
        scale: s,
        translate: `0 ${interpolate(s, [0, 1], [18, 0]) + idle}px`,
        opacity: Math.min(1, s * 1.5),
        padding: "10px 22px",
        borderRadius: 999,
        background: accent ? "rgba(124,58,237,0.14)" : C.surface,
        border: `1px solid ${accent ? "rgba(124,58,237,0.6)" : C.border}`,
        color,
        fontFamily: FONT_MONO,
        fontSize: 20,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

const StatCounter: React.FC<{ value: number; at: number; label: string; color?: string }> = ({
  value,
  at,
  label,
  color = C.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 14, stiffness: 60, mass: 1 } });
  const v = Math.round(interpolate(s, [0, 1], [0, value], { easing: easeOutExpo }));
  const t = frame / fps;
  const pulse = 1 + Math.sin(t * 1.8 + at * 4) * 0.03;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        style={{
          scale: pulse,
          fontSize: 76,
          fontWeight: 800,
          fontFamily: FONT_MAIN,
          color,
          letterSpacing: "-0.04em",
          textShadow: `0 0 46px ${color}55`,
        }}
      >
        {v}
      </div>
      <div style={{ fontSize: 19, color: C.dim, fontFamily: FONT_MONO, letterSpacing: 1 }}>{label}</div>
    </div>
  );
};

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

// ---------------------------------------------------------------------------
// Code window — IDE chrome + syntax-highlighted typing
// ---------------------------------------------------------------------------
type Tok = { t: string; c: string };
const KW = new Set([
  "pub", "struct", "impl", "fn", "let", "mut", "use", "for", "if", "else", "return",
  "async", "await", "const", "import", "from", "export", "interface", "type", "new",
  "class", "extends", "true", "false", "mod", "match", "Self", "self", "move",
]);
function tokenize(line: string): Tok[] {
  const toks: Tok[] = [];
  const re = /(\/\/.*|#!?.*)|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*\s*\()|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const [full, comment, str, num, func, word, ws] = m;
    if (full === "") continue;
    if (comment !== undefined) toks.push({ t: full, c: "#52527a" });
    else if (str !== undefined) toks.push({ t: full, c: C.amber });
    else if (num !== undefined) toks.push({ t: full, c: C.yellow });
    else if (func !== undefined) toks.push({ t: func.slice(0, -1), c: C.blue });
    else if (word !== undefined) toks.push({ t: full, c: KW.has(word) ? C.accent : C.text });
    else if (ws !== undefined) toks.push({ t: full, c: C.text });
    else toks.push({ t: full, c: "#8b8ba8" });
  }
  return toks;
}

const CodeWindow: React.FC<{
  lines: string[];
  startAt: number;
  charsPerSec?: number;
  filename?: string;
  color?: string;
  width?: number;
}> = ({ lines, startAt, charsPerSec = 40, filename = "contract.rs", color = C.accent, width = 760 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpringT(startAt, { damping: 14, stiffness: 80, mass: 1.1 });
  const t = frame / fps - startAt;
  const totalChars = lines.join("\n").length;
  const progress = interpolate(clamp01((t * charsPerSec) / totalChars), [0, 1], [0, 1], {
    easing: easeInOut,
  });
  const fullChars = Math.floor(progress * totalChars);
  let budget = fullChars;
  const shownLines: { line: string; active: boolean }[] = [];
  for (const raw of lines) {
    if (budget <= 0) {
      shownLines.push({ line: "", active: false });
      continue;
    }
    if (raw.length <= budget) {
      shownLines.push({ line: raw, active: false });
      budget -= raw.length + 1;
    } else {
      shownLines.push({ line: raw.slice(0, budget), active: true });
      budget = 0;
    }
  }
  const caretBlink = Math.sin((frame / fps) * 9) > 0 ? 1 : 0.12;
  const idle = Math.sin((frame / fps) * 0.5) * 0.5;
  const linePops: React.ReactNode[] = [];
  {
    let cum = 0;
    for (let i = 0; i < lines.length; i++) {
      cum += lines[i].length + 1;
      linePops.push(<Pop key={i} at={(startAt + cum / charsPerSec) * fps} volume={0.13} />);
    }
  }
  return (
    <div
      style={{
        scale: 0.94 + s * 0.06,
        translate: `0 ${interpolate(s, [0, 1], [44, 0]) + idle}px`,
        opacity: Math.min(1, s * 1.5),
        width,
        background: "#0a0a13",
        border: `1px solid ${color === C.accent ? "rgba(124,58,237,0.5)" : C.border2}`,
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: FONT_MONO,
        fontSize: 19,
        lineHeight: 1.55,
        boxShadow: `0 26px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.05)`,
      }}
    >
      <div
        style={{
          padding: "11px 16px",
          background: C.surface2,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 999, background: C.red }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: C.yellow }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: C.blue }} />
        <span style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#7d7da0" }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: "inline-block" }} />
          {filename}
        </span>
      </div>
      <div style={{ padding: "18px 20px" }}>
        {shownLines.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            <span style={{ color: "#3d3d5c", width: 22, textAlign: "right", userSelect: "none" }}>
              {i + 1}
            </span>
            <span style={{ whiteSpace: "pre", flex: 1 }}>
              {tokenize(l.line).map((tok, j) => (
                <span key={j} style={{ color: tok.c }}>
                  {tok.t}
                </span>
              ))}
              {l.active ? (
                <span style={{ color: C.text, opacity: caretBlink, background: "rgba(124,58,237,0.35)" }}>▌</span>
              ) : null}
              {linePops}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Terminal
// ---------------------------------------------------------------------------
const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = C.amber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  return (
    <span style={{ color, fontSize: size, display: "inline-block", transform: "rotate(0deg)" }}>
      {chars[Math.floor(frame / fps / 0.08) % chars.length]}
    </span>
  );
};

const TerminalWindow: React.FC<{
  children: React.ReactNode;
  title?: string;
  accent?: boolean;
  width?: number;
  startAt?: number;
}> = ({ children, title = "bash", accent = false, width = 940, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - Math.round(startAt * fps), fps, config: { damping: 14, stiffness: 70, mass: 1.1 } });
  const t = frame / fps;
  const idle = Math.sin(t * 0.5) * 0.4;
  return (
    <div
      style={{
        scale: 0.92 + s * 0.08,
        rotate: `${interpolate(s, [0, 1], [-1.2, 0])}deg`,
        translate: `0 ${interpolate(s, [0, 1], [40, 0]) + idle}px`,
        opacity: Math.min(1, s * 1.6),
        marginTop: 46,
        width,
        background: "#0a0a12",
        border: `1px solid ${accent ? "rgba(124,58,237,0.6)" : C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: FONT_MONO,
        boxShadow: accent
          ? "0 24px 80px rgba(124,58,237,0.18)"
          : "0 24px 70px rgba(0,0,0,0.55)",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          background: C.surface2,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span style={{ width: 11, height: 11, borderRadius: 999, background: C.red }} />
        <span style={{ width: 11, height: 11, borderRadius: 999, background: C.yellow }} />
        <span style={{ width: 11, height: 11, borderRadius: 999, background: C.blue }} />
        <span style={{ marginLeft: 8, fontSize: 13, color: C.faint, textTransform: "uppercase", letterSpacing: 1 }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "22px 26px", display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
};

const CmdLine: React.FC<{ text: string; at?: number; color?: string; ticks?: boolean }> = ({
  text,
  at = 0,
  color = C.text,
  ticks = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = Math.round(at * fps);
  const typingDuration = Math.max(20, Math.round(text.length * 1.4));
  const width = interpolate(frame, [start, start + typingDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(easeInOut),
  });
  const visible = Math.floor(text.length * width);
  const caretBlink = Math.sin((frame / fps) * 8) > 0 ? 1 : 0.15;
  const ticksDone = Math.floor(((frame - start) / typingDuration) * (text.length / 4));
  const tickSfx: React.ReactNode[] = [];
  if (ticks) {
    const n = Math.max(0, Math.min(ticksDone, 24));
    for (let i = 0; i < n; i++) {
      tickSfx.push(<Tick key={i} at={start + ((i * 4) / Math.max(1, text.length)) * typingDuration + 1} />);
    }
  }
  return (
    <div style={{ fontSize: 22, color, display: "flex", gap: 10, whiteSpace: "pre" }}>
      <span style={{ color: C.amber, userSelect: "none" }}>❯</span>
      <span>{text.slice(0, visible)}</span>
      {visible < text.length ? <span style={{ color: C.text, opacity: caretBlink }}>▌</span> : null}
      {tickSfx}
    </div>
  );
};

const OkLine: React.FC<{ text: string; at: number; volume?: number; color?: string }> = ({
  text,
  at,
  volume = 0.5,
  color = C.green,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 12, stiffness: 150, mass: 0.6 } });
  const x = interpolate(s, [0, 1], [-24, 0]);
  const glow = interpolate(s, [0, 1], [0, 8]);
  return (
    <div
      style={{
        opacity: Math.min(1, s * 1.6),
        translate: `${x}px 0`,
        fontSize: 20,
        color,
        whiteSpace: "pre",
        textShadow: s > 0.9 ? `0 0 ${glow}px ${color}88` : "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ color, display: "inline-block", scale: s }}>✔</span>
      {text}
      <Ding at={Math.round(at * fps)} volume={volume} />
    </div>
  );
};

const ProgressBar: React.FC<{ at: number; dur: number; width?: number; color?: string; label?: string }> = ({
  at,
  dur,
  width = 620,
  color = C.accent,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(clamp01((frame / fps - at) / dur), [0, 1], [0, 1], { easing: easeInOut });
  const t = frame / fps;
  const shimmer = ((t * 600) % (width * 2)) - width;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, color: C.dim }}>
        <span>{label ?? "installing"}</span>
        <span style={{ color }}>{Math.round(p * 100)}%</span>
      </div>
      <div
        style={{
          width,
          height: 14,
          borderRadius: 999,
          background: C.surface2,
          border: `1px solid ${C.border}`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${p * 100}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 18px ${color}66`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: shimmer,
            width: 140,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          }}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Agent network graph — the framework reveal
// ---------------------------------------------------------------------------
const AGENT_META: { name: string; color: string; x: number; y: number }[] = [
  { name: "contracts", color: C.accent, x: 960, y: 200 },
  { name: "frontend", color: C.green, x: 1315, y: 355 },
  { name: "backend", color: C.amber, x: 1315, y: 700 },
  { name: "payments", color: C.blue, x: 960, y: 855 },
  { name: "zk", color: C.pink, x: 605, y: 700 },
  { name: "ops", color: C.lime, x: 605, y: 355 },
];

const NetworkGraph: React.FC<{ startAt: number; verifyAt?: number }> = ({ startAt, verifyAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const centerSpring = spring({
    frame: frame - Math.round(startAt * fps),
    fps,
    config: { damping: 13, stiffness: 90, mass: 1.1 },
  });
  const t = frame / fps;
  const spin = (t * 0.12) % (Math.PI * 2);
  const cx = 960;
  const cy = 540;
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      {AGENT_META.map((a, i) => {
        const pop = spring({
          frame: frame - Math.round((startAt + 0.45 + i * 0.38) * fps),
          fps,
          config: { damping: 12, stiffness: 120, mass: 0.8 },
        });
        const draw = interpolate(pop, [0, 1], [0, 1], { easing: easeInOut });
        const pulse = 1 + Math.sin(t * 2 + i) * 0.05;
        const verified = verifyAt ? frame >= Math.round((verifyAt + i * 0.42) * fps) : false;
        const vp = verifyAt
          ? spring({
              frame: frame - Math.round((verifyAt + i * 0.42) * fps),
              fps,
              config: { damping: 11, stiffness: 140, mass: 0.6 },
            })
          : 0;
        const halo = verified && vp > 0.1 ? 14 + Math.sin(t * 6 + i) * 4 : 0;
        return (
          <g key={a.name}>
            <line
              x1={cx}
              y1={cy}
              x2={a.x}
              y2={a.y}
              stroke={a.color}
              strokeWidth="1.6"
              strokeDasharray={`${340 * draw} 340`}
              strokeLinecap="round"
              opacity={0.85}
              style={{ filter: `drop-shadow(0 0 5px ${a.color})` }}
            />
            <g
              transform={`translate(${a.x}, ${a.y}) scale(${0.6 + pop * 0.4 * pulse})`}
              opacity={Math.min(1, pop * 1.6)}
            >
              {halo > 0 ? (
                <circle r={halo + 26} fill="none" stroke={a.color} strokeWidth="2" opacity={0.5 - halo * 0.015} />
              ) : null}
              <circle r="30" fill="#0c0c14" stroke={a.color} strokeWidth="2.5" />
              <circle r="30" fill={a.color} opacity="0.12" />
              <text textAnchor="middle" y="8" fill={a.color} fontSize="30" fontFamily={FONT_MONO} fontWeight="700">
                {verified ? "✔" : "…"}
              </text>
              <text textAnchor="middle" y="52" fill="#c9c9dc" fontSize="19" fontFamily={FONT_MONO}>
                @stellar-{a.name}
              </text>
            </g>
          </g>
        );
      })}
      <g transform={`translate(${cx}, ${cy}) scale(${0.7 + centerSpring * 0.3})`} opacity={Math.min(1, centerSpring * 1.6)}>
        <circle r="86" fill="none" stroke={C.accent} strokeWidth="1.5" strokeDasharray="8 10" opacity="0.7" transform={`rotate(${(spin * 180) / Math.PI})`} />
        <circle r="72" fill="rgba(124,58,237,0.16)" stroke={C.accent} strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 16px rgba(124,58,237,0.8))" }} />
        <circle r="72" fill="url(#gcore)" />
        <text textAnchor="middle" y="-18" fill="#fff" fontSize="26" fontFamily={FONT_MAIN} fontWeight="800">
          Graph
        </text>
        <text textAnchor="middle" y="14" fill="#fff" fontSize="26" fontFamily={FONT_MAIN} fontWeight="800">
          Engine
        </text>
        <text textAnchor="middle" y="42" fill="#b9a7f5" fontSize="15" fontFamily={FONT_MONO}>
          6 agents
        </text>
        <defs>
          <radialGradient id="gcore">
            <stop offset="0%" stopColor="rgba(124,58,237,0.5)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0.05)" />
          </radialGradient>
        </defs>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene shells
// ---------------------------------------------------------------------------
const SceneShell: React.FC<{ children: React.ReactNode; camera?: boolean }> = ({
  children,
  camera = true,
}) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {camera ? (
      <Camera push={0.03} drift={6}>
        <Background />
      </Camera>
    ) : (
      <Background />
    )}
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 160px",
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Scene 1 — Hook: "Building a Stellar dApp is hard."
// Six tool windows fail around the title; chaos then calm.
// ---------------------------------------------------------------------------
const FAIL_TOOLS = [
  { name: "contracts", err: "no contract interface", color: C.red },
  { name: "frontend", err: "wallet mismatch", color: C.yellow },
  { name: "backend", err: "CORS 500", color: C.red },
  { name: "payments", err: "x402 route missing", color: C.yellow },
  { name: "deploys", err: "wrangler auth expired", color: C.red },
  { name: "indexer", err: "ledger reorg", color: C.yellow },
];

const Scene1Hook: React.FC<{ scene: Scene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();
  const failAt = 2.0;
  const toolSpring = (i: number) =>
    spring({ frame: frame - Math.round((failAt + i * 0.42) * fps), fps, config: { damping: 11, stiffness: 130, mass: 0.8 } });
  return (
    <SceneShell>
      <LightSweep at={0.3} />
      <Title text={scene.title} delay={0.4} size={92} />
      <div style={{ marginTop: 26 }}>
        <Subtitle text={scene.subtitle!} delay={4.8} width={1150} />
      </div>
      <div
        style={{
          marginTop: 74,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
        }}
      >
        {FAIL_TOOLS.map((tool, i) => {
          const s = toolSpring(i);
          const killed = frame >= Math.round((failAt + i * 0.42 + 0.35) * fps);
          const kill = killed
            ? spring({ frame: frame - Math.round((failAt + i * 0.42 + 0.35) * fps), fps, config: { damping: 12, stiffness: 150, mass: 0.5 } })
            : 0;
          const tilt = Math.sin((frame / fps) * 0.6 + i) * 1.2;
          return (
            <div
              key={tool.name}
              style={{
                scale: s,
                rotate: `${tilt * (1 - kill * 0.7)}deg`,
                translate: `${interpolate(kill, [0, 1], [0, 0])}px 0`,
                opacity: Math.min(1, s * 1.6) * (1 - kill * 0.15),
                width: 330,
                background: "#0a0a12",
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                overflow: "hidden",
                fontFamily: FONT_MONO,
                fontSize: 17,
              }}
            >
              <div style={{ padding: "9px 14px", background: C.surface2, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#8b8ba8" }}>{tool.name}</span>
                <span style={{ color: tool.color, fontWeight: 700, fontSize: 16 }}>{killed ? "✕" : "…"}</span>
              </div>
              <div style={{ padding: "12px 14px", color: tool.color, whiteSpace: "nowrap", overflow: "hidden" }}>
                {killed ? tool.err : "running…"}
              </div>
            </div>
          );
        })}
      </div>
      <Pop at={failAt * fps} />
      <Pop at={(failAt + 0.42) * fps} />
      <Pop at={(failAt + 0.84) * fps} />
      <Pop at={(failAt + 1.26) * fps} />
      <Pop at={(failAt + 1.68) * fps} />
      <Pop at={(failAt + 2.1) * fps} />
      <Whoosh at={fps * 0.4} />
      <Audio src={staticFile(scene.audioFile)} />
    </SceneShell>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — Framework reveal: code vibe → graph engine → evals verified
// ---------------------------------------------------------------------------
const Scene2Framework: React.FC<{ scene: Scene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();
  const beat = (frame / fps);
  const graphAt = 3.4;
  const verifyAt = 9.3;
  const codeLines = [
    "// token.rs — written by @stellar-contracts",
    "#[contract]",
    "pub struct Token;",
    "#[contractimpl]",
    "impl Token {",
    "    pub fn transfer(e: Env, from: Address,",
    "                   to: Address, amount: i128) {",
    "        from.require_auth();",
    "        // ... balances, evals pass",
    "    }",
    "}",
  ];
  const codeDone = beat >= 1.15 + 0.15 + codeLines.join("\n").length / 130;
  return (
    <SceneShell camera={false}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
            justifyContent: "center",
            paddingBottom: 40,
            opacity: beat < graphAt ? 1 : interpolate(beat, [graphAt, graphAt + 0.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            scale: beat < graphAt ? 1 : 1 - interpolate(beat, [graphAt, graphAt + 0.5], [0, 0.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: beat < graphAt ? "0 0" : `0 ${interpolate(beat, [graphAt, graphAt + 0.5], [0, -24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px`,
          }}
        >
          <CodeWindow lines={codeLines} startAt={1.15} charsPerSec={130} filename="token.rs — Soroban" width={780} />
        </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: beat < graphAt ? 0 : interpolate(beat, [graphAt - 0.2, graphAt + 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut }),
          scale: beat < graphAt ? 1.06 : interpolate(beat, [graphAt - 0.2, graphAt + 0.4], [1.06, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutExpo }),
        }}
      >
        <NetworkGraph startAt={graphAt} verifyAt={verifyAt} />
      </div>
      {beat >= verifyAt ? (
        <div
          style={{
            position: "absolute",
            bottom: 92,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            fontFamily: FONT_MONO,
            fontSize: 22,
          }}
        >
          {[
            { label: "act", at: 9.6, color: C.blue },
            { label: "verify", at: 10.3, color: C.yellow },
            { label: "retry", at: 11.0, color: C.pink },
            { label: "pass", at: 11.7, color: C.green },
          ].map((f, i, arr) => {
            const active = beat >= f.at && beat < (arr[i + 1]?.at ?? 99);
            const s = spring({
              frame: frame - Math.round(f.at * fps),
              fps,
              config: { damping: 11, stiffness: 150, mass: 0.7 },
            });
            const pulse = active ? 1 + Math.sin(beat * 9) * 0.04 : 1;
            return (
              <React.Fragment key={f.label}>
                {i > 0 ? (
                  <span
                    style={{
                      color: beat >= f.at ? C.faint : "#26263c",
                      fontSize: 24,
                      transition: "none",
                    }}
                  >
                    →
                  </span>
                ) : null}
                <div
                  style={{
                    scale: s * pulse,
                    translate: `0 ${interpolate(s, [0, 1], [18, 0])}px`,
                    opacity: Math.min(1, s * 1.6) * (active ? 1 : 0.5),
                    padding: "12px 28px",
                    borderRadius: 999,
                    background: active ? `${f.color}1f` : C.surface,
                    border: `1px solid ${active ? f.color : C.border}`,
                    color: active ? f.color : "#6b6b8a",
                    textShadow: active ? `0 0 20px ${f.color}aa` : "none",
                    boxShadow: active ? `0 0 34px ${f.color}44` : "none",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {f.label}
                </div>
                <Pop at={f.at * fps} volume={0.32} />
              </React.Fragment>
            );
          })}
          <Ding at={11.7 * fps} volume={0.45} />
        </div>
      ) : null}
      {beat >= verifyAt
        ? Array.from({ length: 6 }).map((_, i) => (
            <Ding key={i} at={(verifyAt + i * 0.42) * fps} volume={0.22} />
          ))
        : null}
      {codeDone && beat < graphAt ? <Pop at={fps * 2.6} volume={0.4} /> : null}
      <Whoosh at={fps * 0.3} />
      <Whoosh at={fps * (graphAt - 0.15)} />
      <Audio src={staticFile(scene.audioFile)} />
    </SceneShell>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — Install the Skill: terminal + skill ticker
// ---------------------------------------------------------------------------
const SKILL_NAMES = [
  "smart-contracts", "dapp", "data", "assets", "stellar-mcp",
  "agentic-payments", "standards", "zk-proofs", "frontend-design", "graphify",
];

const Scene3Skill: React.FC<{ scene: Scene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();
  const cmdAt = 1.1;
  const cmdDone = frame >= Math.round(cmdAt * fps) + Math.round(scene.code![0].length * 1.4) + 6;
  const barAt = cmdAt + scene.code![0].length * 1.4 / fps + 0.15;
  const barDur = 2.0;
  const countShown = Math.floor(((frame / fps - barAt) / barDur) * 10);
  return (
    <SceneShell>
      <Title text={scene.title} delay={0.25} />
      <Subtitle text={scene.subtitle!} delay={0.75} />
      <TerminalWindow startAt={0.7} title="terminal — install skill" width={900}>
        <CmdLine text={scene.code![0]} at={cmdAt} />
        {cmdDone ? (
          <>
            <ProgressBar at={barAt} dur={barDur} label="harness activating" width={640} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {SKILL_NAMES.slice(0, Math.max(0, countShown)).map((s, i) => (
                <span
                  key={s}
                  style={{
                    fontSize: 16,
                    color: C.dim,
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    padding: "5px 12px",
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <span style={{ color: C.green }}>✓</span>
                  {s}
                </span>
              ))}
            </div>
            {countShown >= 10 ? (
              <div style={{ fontSize: 18, color: C.green, display: "flex", gap: 8, alignItems: "center" }}>
                <span>✔</span> 10 skills installed — harness active in every session
                <Ding at={fps * (barAt + barDur + 0.2)} volume={0.6} />
              </div>
            ) : null}
          </>
        ) : null}
      </TerminalWindow>
      <Whoosh at={fps * 0.3} />
      <Audio src={staticFile(scene.audioFile)} />
    </SceneShell>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — CLI: spinner → tree draw → stat counters
// ---------------------------------------------------------------------------
const TREE_LINES: { line: string; count: number; at: number }[] = [
  { line: "contracts/    hello-world + token", count: 4, at: 3.3 },
  { line: "frontend/     Next.js + Wallets Kit", count: 8, at: 4.05 },
  { line: "backend/      Express + x402 payments", count: 6, at: 4.8 },
  { line: ".github/      CI/CD workflows", count: 5, at: 5.55 },
  { line: "skills/       10 skills auto-installed", count: 10, at: 6.3 },
];

const Scene4Cli: React.FC<{ scene: Scene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();
  const cmdAt = 1.1;
  const cmdDone = frame >= Math.round(cmdAt * fps) + Math.round(scene.code![0].length * 1.4) + 6;
  const spinEnd = 3.3;
  const step = Math.min(5, Math.max(0, Math.floor((frame / fps - spinEnd) / 0.75)));
  const showStats = frame / fps >= 7.6;
  return (
    <SceneShell>
      <Title text={scene.title} delay={0.25} />
      <Subtitle text={scene.subtitle!} delay={0.75} />
      <TerminalWindow startAt={0.7} title="terminal — scaffold" width={900}>
        <CmdLine text={scene.code![0]} at={cmdAt} />
        {frame / fps >= 3.3 && frame / fps < 4.05 ? (
          <div style={{ fontSize: 19, color: C.amber, display: "flex", gap: 10, alignItems: "center" }}>
            <Spinner /> resolving template · fetching skills
          </div>
        ) : null}
        {step > 0 ? (
          <div style={{ fontFamily: FONT_MONO, fontSize: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ color: C.text, whiteSpace: "pre" }}>my-dapp/</div>
            {TREE_LINES.slice(0, step).map((l, i) => {
              const isLast = i === step - 1;
              return (
                <div key={l.line} style={{ display: "flex", alignItems: "center", gap: 12, whiteSpace: "pre" }}>
                  <span style={{ color: C.faint }}>{isLast ? "└──" : "├──"}</span>
                  <span style={{ color: isLast ? C.green : C.text }}>{l.line}</span>
                  {isLast ? <OkLine text="" at={l.at} volume={0} /> : <Ding at={fps * (l.at + 0.2)} volume={0.35} />}
                </div>
              );
            })}
          </div>
        ) : null}
      </TerminalWindow>
      {showStats ? (
        <div style={{ marginTop: 56, display: "flex", gap: 110 }}>
          <StatCounter value={10} at={7.6} label="SKILLS" color={C.green} />
          <StatCounter value={6} at={8.2} label="AGENTS" color={C.accent} />
          <StatCounter value={5} at={8.8} label="EVALS" color={C.amber} />
        </div>
      ) : null}
      <Whoosh at={fps * 0.3} />
      <Audio src={staticFile(scene.audioFile)} />
    </SceneShell>
  );
};

// ---------------------------------------------------------------------------
// Scene 5 — Together: CLI ⇄ Skill with flowing particles
// ---------------------------------------------------------------------------
const Scene5Together: React.FC<{ scene: Scene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const s1 = useSpringT(0.9, { damping: 12, stiffness: 120, mass: 0.7 });
  const s2 = useSpringT(1.5, { damping: 12, stiffness: 120, mass: 0.7 });
  const cap = useSpringT(5.0, { damping: 14, stiffness: 90, mass: 0.9 });
  const beamOn = spring({ frame: frame - fps * 1.15, fps, config: { damping: 12, stiffness: 90, mass: 0.8 } });
  const rnd = mulberry32(777);
  const particles: { x: number; y: number; sp: number; ph: number }[] = [];
  for (let i = 0; i < 26; i++) {
    particles.push({ x: rnd() * 700, y: -60 + rnd() * 320, sp: 340 + rnd() * 420, ph: rnd() * Math.PI * 2 });
  }
  return (
    <SceneShell>
      <Title text={scene.title} delay={0.25} />
      <Subtitle text={scene.subtitle!} delay={0.75} />
      <div style={{ marginTop: 64, display: "flex", alignItems: "center", gap: 0, fontFamily: FONT_MONO, fontSize: 22 }}>
        <div
          style={{
            scale: s1,
            translate: `0 ${interpolate(s1, [0, 1], [30, 0])}px`,
            opacity: Math.min(1, s1 * 1.5),
            padding: "24px 40px",
            borderRadius: 16,
            background: C.surface,
            border: `1px solid ${C.border}`,
            color: C.text,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ color: C.accent }}>cli</span> scaffold
          <span style={{ color: C.faint, fontSize: 16 }}>— project tree, CI</span>
        </div>
        <div style={{ position: "relative", width: 340, height: 200, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 90,
              height: 3,
              transform: `scaleX(${beamOn})`,
              background: `linear-gradient(90deg, rgba(124,58,237,0.1), ${C.green}66, rgba(124,58,237,0.1))`,
              boxShadow: `0 0 24px ${C.green}66`,
              opacity: 0.8,
            }}
          />
          {particles.map((p, i) => {
            const x = ((t * p.sp + p.ph * 60) % 700);
            const y = 90 + Math.sin(t * 3 + p.ph) * 26;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: i % 2 ? C.green : C.accent,
                  opacity: 0.5 + 0.5 * Math.sin(t * 6 + p.ph),
                  boxShadow: `0 0 10px ${i % 2 ? C.green : C.accent}`,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 340 - 20, top: 82, fontSize: 26, color: C.green, textShadow: "0 0 18px rgba(52,211,153,0.7)" }}>
            ➜
          </div>
        </div>
        <div
          style={{
            scale: s2,
            translate: `0 ${interpolate(s2, [0, 1], [30, 0])}px`,
            opacity: Math.min(1, s2 * 1.5),
            padding: "24px 40px",
            borderRadius: 16,
            background: C.surface,
            border: `1px solid ${C.accent}`,
            color: C.text,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ color: C.accent }}>skill</span> build
          <span style={{ color: C.faint, fontSize: 16 }}>— 6 agents, evals</span>
        </div>
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 21,
          color: C.dim,
          fontFamily: FONT_MONO,
          opacity: Math.min(1, cap * 1.6),
          translate: `0 ${interpolate(cap, [0, 1], [14, 0])}px`,
        }}
      >
        bootstraps <span style={{ color: C.green }}>→</span> builds <span style={{ color: C.green }}>→</span> ships
      </div>
      <Pop at={fps * 0.9} />
      <Pop at={fps * 1.5} volume={0.45} />
      <Whoosh at={fps * 0.3} />
      <Audio src={staticFile(scene.audioFile)} />
    </SceneShell>
  );
};

// ---------------------------------------------------------------------------
// Scene 6 — CTA end card
// ---------------------------------------------------------------------------
const Scene6Cta: React.FC<{ scene: Scene; fps: number }> = ({ scene, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const cmdAt = 0.8;
  const cmdDone = frame >= Math.round(cmdAt * fps) + Math.round(scene.code![0].length * 1.4) + 6;
  const lockup = useSpringT(0.3, { damping: 12, stiffness: 80, mass: 1.1 });
  const urlPulse = 1 + Math.sin(t * 1.6) * 0.02;
  const ring = useSpringT(0.5, { damping: 10, stiffness: 50, mass: 1.4 });
  const cmdLen = scene.code![0].length;
  const okAt = cmdAt + (cmdLen * 1.4) / fps + 0.4;
  return (
    <SceneShell camera={false}>
      <LightSweep at={0.2} dur={2.2} />
      <Title text={scene.title} delay={0.15} size={76} />
      <div style={{ marginTop: 20 }}>
        <Subtitle text="stellar-agentic-framework.vercel.app" delay={1.0} width={900} size={26} />
      </div>
      <TerminalWindow startAt={0.8} accent width={860}>
        <CmdLine text={scene.code![0]} at={cmdAt} />
        {cmdDone ? <OkLine text="6 agents ready to build Stellar" at={okAt} volume={0.6} /> : null}
      </TerminalWindow>
      <div
        style={{
          marginTop: 34,
          display: "flex",
          alignItems: "center",
          gap: 18,
          scale: lockup * urlPulse,
          opacity: Math.min(1, lockup * 1.5),
        }}
      >
        <LogoMark size={40} />
        <span style={{ fontFamily: FONT_MAIN, fontWeight: 800, fontSize: 28, color: C.text, letterSpacing: "-0.02em" }}>
          Stellar <span style={{ color: C.accent }}>Agentic</span> Framework
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 560,
          height: 560,
          borderRadius: 999,
          border: "1px solid rgba(124,58,237,0.25)",
          scale: ring,
          translate: "-50% -50%",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <Riser at={fps * 0.15} />
      <Whoosh at={fps * 0.3} />
      <Audio src={staticFile(scene.audioFile)} />
    </SceneShell>
  );
};

// ---------------------------------------------------------------------------
// Switcher + global layers
// ---------------------------------------------------------------------------
const SceneSwitcher: React.FC<{ scene: Scene; fps: number }> = ({ scene, fps }) => {
  switch (scene.kind) {
    case "hook":
      return <Scene1Hook scene={scene} fps={fps} />;
    case "framework":
      return <Scene2Framework scene={scene} fps={fps} />;
    case "skill":
      return <Scene3Skill scene={scene} fps={fps} />;
    case "cli":
      return <Scene4Cli scene={scene} fps={fps} />;
    case "together":
      return <Scene5Together scene={scene} fps={fps} />;
    case "cta":
      return <Scene6Cta scene={scene} fps={fps} />;
    default:
      return null;
  }
};

const GlobalSfx: React.FC<{ boundaries: number[]; totalFrames: number; fps: number }> = ({
  boundaries,
  totalFrames,
  fps,
}) => {
  const frame = useCurrentFrame();
  void frame;
  return (
    <>
      {boundaries.map((b, i) => (
        <Whoosh key={i} at={b - 6} />
      ))}
      {boundaries.length > 0 ? <Riser at={boundaries[0] - Math.round(1.2 * fps)} /> : null}
      <Riser at={totalFrames - Math.round(1.6 * fps)} />
    </>
  );
};

const TransitionFlash: React.FC<{ boundaries: number[] }> = ({ boundaries }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {boundaries.map((b, i) => {
        const o = interpolate(frame, [b - 3, b, b + 7], [0, 0.24, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, rgba(124,58,237,${o}), rgba(56,189,248,${o * 0.6}))`,
              opacity: 1,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

const AmbientPad: React.FC<{ totalFrames: number; fps: number }> = ({ totalFrames, fps }) => {
  const frame = useCurrentFrame();
  const dur = totalFrames / fps;
  const vol = interpolate(
    frame,
    [0, 4 * fps, dur * fps - 3 * fps, dur * fps],
    [0, 0.22, 0.22, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <Audio src={staticFile("sfx/pad.wav")} volume={vol} />;
};

export const Promotion: React.FC<PromoProps> = ({ sceneDurations, totalFrames }) => {
  let cursor = 0;
  const boundaries: number[] = [];
  for (const d of sceneDurations) {
    cursor += d;
    boundaries.push(cursor);
  }
  boundaries.pop();
  cursor = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AmbientPad totalFrames={totalFrames} fps={30} />
      <GlobalSfx boundaries={boundaries} totalFrames={totalFrames} fps={30} />
      {SCENES.map((scene, idx) => {
        const from = cursor;
        const duration = sceneDurations[idx] ?? scene.defaultFrames;
        cursor += duration;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration}>
            <SceneSwitcher scene={scene} fps={30} />
          </Sequence>
        );
      })}
      <TransitionFlash boundaries={boundaries} />
      <Vignette />
      <Letterbox totalFrames={totalFrames} />
    </AbsoluteFill>
  );
};