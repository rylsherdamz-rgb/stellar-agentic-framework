#!/usr/bin/env node
// generate-sfx.mjs — synthesizes sound-design assets for the promo video.
// Writes WAV files to public/sfx/ (gitignored). No external assets needed.
//
// Usage: node generate-sfx.mjs

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "public", "sfx");
const SR = 44100;

mkdirSync(OUT, { recursive: true });

function writeWav(name, samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  writeFileSync(join(OUT, name), buf);
  console.log(`wrote ${name} (${(buf.length / 1024).toFixed(1)} kB, ${(n / SR).toFixed(2)}s)`);
}

function env(i, n, a, d, r) {
  const attack = Math.min(1, i / (a * SR));
  let decay = 1;
  const di = n - r * SR;
  if (i >= di) decay = Math.max(0, 1 - (i - di) / (r * SR));
  return Math.min(attack, 1) * decay * Math.min(1, i / (0.002 * SR));
}

function onePoleLowpass(y, x, cutoff) {
  const a = 1 - Math.exp(-2 * Math.PI * cutoff / SR);
  return y + a * (x - y);
}

// --- whoosh: filtered noise swell, 0.7s ---
{
  const n = Math.round(0.7 * SR);
  const out = new Float32Array(n);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const cutoff = 250 + 3800 * Math.pow(t, 1.7);
    lp = onePoleLowpass(lp, Math.random() * 2 - 1, cutoff);
    out[i] = lp * env(i, n, 0.06, 0.55, 0.22) * 0.5;
  }
  writeWav("whoosh.wav", out);
}

// --- pop: pitch-rising blip, 0.09s ---
{
  const n = Math.round(0.09 * SR);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const freq = 650 + 500 * Math.pow(t, 2);
    phase += (2 * Math.PI * freq) / SR;
    out[i] = Math.sin(phase) * Math.pow(1 - t, 2.2) * 0.5;
  }
  writeWav("pop.wav", out);
}

// --- tick: tiny click, 0.02s ---
{
  const n = Math.round(0.02 * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3) * 0.5;
  }
  writeWav("tick.wav", out);
}

// --- ding: two-tone chime, 0.7s ---
{
  const n = Math.round(0.7 * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const envv = Math.pow(1 - t, 2.6);
    const s1 = Math.sin((2 * Math.PI * 880 * i) / SR);
    const s2 = Math.sin((2 * Math.PI * 1320 * i) / SR);
    const s3 = Math.sin((2 * Math.PI * 2200 * i) / SR) * 0.3;
    out[i] = (s1 * 0.6 + s2 * 0.35 + s3) * envv * 0.4;
  }
  writeWav("ding.wav", out);
}

// --- riser: tension sweep into a moment, 1.2s ---
{
  const n = Math.round(1.2 * SR);
  const out = new Float32Array(n);
  let phase = 0;
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const freq = 180 + 1100 * Math.pow(t, 2.4);
    phase += (2 * Math.PI * freq) / SR;
    const sine = Math.sin(phase);
    lp = onePoleLowpass(lp, Math.random() * 2 - 1, 300 + 3000 * t);
    out[i] = (sine * 0.35 + lp * 0.55) * Math.pow(t, 1.4) * env(i, n, 0.02, 0.3, 0.25) * 0.55;
  }
  writeWav("riser.wav", out);
}

// --- pad: warm ambient bed (A major), 62s, slow LFO ---
{
  const dur = 62;
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const freqs = [55, 110, 164.81, 220, 277.18, 329.63, 440];
  const detune = (f) => f * (1 + (Math.random() - 0.5) * 0.006);
  const voices = freqs.map((f) => ({ f1: detune(f), f2: detune(f), p1: 0, p2: 0 }));
  const lfoFreq = 0.07;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const fadeIn = Math.min(1, i / (4 * SR));
    const fadeOut = Math.min(1, (n - i) / (3 * SR));
    const lfo = 0.75 + 0.25 * Math.sin(2 * Math.PI * lfoFreq * t);
    let s = 0;
    for (const v of voices) {
      v.p1 += (2 * Math.PI * v.f1 * (1 + 0.0015 * Math.sin(2 * Math.PI * 0.13 * t))) / SR;
      v.p2 += (2 * Math.PI * v.f2) / SR;
      s += Math.sin(v.p1) * 0.5 + Math.sin(v.p2) * 0.35;
    }
    const x = s * lfo * fadeIn * fadeOut;
    out[i] = Math.tanh(x * 0.35) * 0.12;
  }
  writeWav("pad.wav", out);
}

console.log("Done. SFX in public/sfx/");
