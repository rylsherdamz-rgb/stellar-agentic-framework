#!/usr/bin/env node
// generate-voiceover.mjs — ElevenLabs TTS per scene for the promo video.
//
// Usage: ELEVENLABS_API_KEY=<key> [ELEVENLABS_VOICE_ID=<id>] node generate-voiceover.mjs
//
// Reads src/scenes.ts, calls ElevenLabs for each scene, writes MP3s to public/voiceover/.
// Skips scenes whose audio already exists (pass --force to regenerate).

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "cgSgspJ2msm6clMCkdW9";
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
const FORCE = process.argv.includes("--force");

if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY is required");
  process.exit(1);
}

const scenesSrc = readFileSync(join(__dirname, "src", "scenes.ts"), "utf-8");
const voiceovers = [...scenesSrc.matchAll(/voiceover:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]);
if (!voiceovers.length) {
  console.error("Could not parse voiceover lines from src/scenes.ts");
  process.exit(1);
}

const outDir = join(__dirname, "public", "voiceover");
mkdirSync(outDir, { recursive: true });

const ids = [...scenesSrc.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);

async function synthesize(text, outFile) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: { stability: 0.85, similarity_boost: 0.85, style: 0.05 },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 200)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outFile, buf);
  return buf.length;
}

for (let i = 0; i < voiceovers.length; i++) {
  const id = ids[i] || String(i + 1).padStart(2, "0");
  const outFile = join(outDir, `${id}.mp3`);
  if (existsSync(outFile) && !FORCE) {
    console.log(`skip  ${id}.mp3 (exists)`);
    continue;
  }
  process.stdout.write(`gen   ${id}.mp3 ... `);
  try {
    const bytes = await synthesize(voiceovers[i], outFile);
    console.log(`ok (${(bytes / 1024).toFixed(1)} kB)`);
  } catch (err) {
    console.error(`FAILED: ${err.message}`);
  }
}

console.log("\nDone. MP3s in public/voiceover/");
