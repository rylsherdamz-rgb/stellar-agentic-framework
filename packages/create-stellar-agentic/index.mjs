#!/usr/bin/env node

import { existsSync, mkdirSync, cpSync, readdirSync, statSync, writeFileSync, readFileSync } from "fs";
import { join, dirname, relative, basename } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "../..");
const TEMPLATES_DIR = join(PKG_ROOT, "templates");
const SKILLS_DIR = join(PKG_ROOT, "skills");

const REQUIRED_SKILLS = [
  "smart-contracts", "dapp", "data", "assets",
  "agentic-payments", "standards", "zk-proofs",
  "graphify",
];

const IS_TTY = process.stdout.isTTY;

function ask(query) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(query, (answer) => { rl.close(); resolve(answer.trim()); });
  });
}

async function installDependencySkills() {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  if (!homeDir) { console.log("  ⚠ Cannot determine home dir — skipping skill install"); return; }
  const skillBase = join(homeDir, ".claude", "skills");
  const missing = REQUIRED_SKILLS.filter((s) => !existsSync(join(skillBase, s, "SKILL.md")));
  if (missing.length === 0) {
    console.log("  ✓ All 9 dependency skills already installed");
    return;
  }
  console.log(`  Installing ${missing.length} missing skills...`);
  for (const name of missing) {
    const src = join(SKILLS_DIR, name);
    if (!existsSync(join(src, "SKILL.md"))) {
      console.log(`  ⚠ ${name} skill not found in framework — skipping`);
      continue;
    }
    const dest = join(skillBase, name);
    mkdirSync(dest, { recursive: true });
    copyDir(src, dest);
  }
  console.log(`  ✓ Installed ${missing.length} dependency skills to ~/.claude/skills/`);
}

function copyDir(src, dest, filter = () => true) {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (!filter(srcPath)) continue;
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath, filter);
    } else {
      cpSync(srcPath, destPath);
    }
  }
}

function copyFile(src, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
}

function copyFrameworkSkill(targetDir) {
  const files = [
    "SKILL.md", "CLAUDE.md", "package.json", "README.md", ".env.example",
  ];
  for (const f of files) {
    const src = join(PKG_ROOT, f);
    if (existsSync(src)) copyFile(src, join(targetDir, f));
  }
  // agents
  copyDir(join(PKG_ROOT, "agents"), join(targetDir, "agents"));
  // .claude/commands
  copyDir(join(PKG_ROOT, ".claude"), join(targetDir, ".claude"));
  // evals
  copyDir(join(PKG_ROOT, "evals"), join(targetDir, "evals"));
  // data scaffold
  mkdirSync(join(targetDir, "data/projects"), { recursive: true });
  mkdirSync(join(targetDir, "data/decisions"), { recursive: true });
  mkdirSync(join(targetDir, "data/logs"), { recursive: true });
  writeFileSync(join(targetDir, "data/README.md"),
    "# Data Directory\n\nPersistent file-based memory for the Stellar Agentic OS.\n");
}

function scaffoldTemplates(targetDir, types) {
  if (types.includes("contracts") || types.includes("full")) {
    copyDir(join(TEMPLATES_DIR, "contracts"), join(targetDir, "contracts"));
    console.log("  ✓ contracts/");
  }
  if (types.includes("frontend") || types.includes("full")) {
    const dst = join(targetDir, "frontend");
    copyDir(join(TEMPLATES_DIR, "frontend"), dst, (p) => !p.endsWith("package-lock.json"));
    console.log("  ✓ frontend/");
  }
  if (types.includes("backend") || types.includes("full")) {
    const dst = join(targetDir, "backend");
    copyDir(join(TEMPLATES_DIR, "backend"), dst, (p) => !p.endsWith("package-lock.json"));
    console.log("  ✓ backend/");
  }
  if (types.includes("cicd") || types.includes("full")) {
    copyDir(join(TEMPLATES_DIR, "cicd"), join(targetDir, ".github/workflows"));
    console.log("  ✓ .github/workflows/");
  }
  if (types.includes("tests") || types.includes("full")) {
    copyDir(join(PKG_ROOT, "tests"), join(targetDir, "tests"));
    console.log("  ✓ tests/");
  }
}

async function main() {
  const args = process.argv.slice(2);
  const usage = `
Usage:
  npx create-stellar-agentic <project-name> [options]
  npx create-stellar-agentic --skill-only <dir>
  npx create-stellar-agentic --help

Options:
  --skill-only     Install only the Agentic OS skill files into an existing project
  --template <t>   Scaffold type: full (default), contract-only, frontend-only, backend-only, payment-only
  --no-install     Skip npm install step
  --yes, -y        Skip all prompts

Examples:
  npx create-stellar-agentic my-stellar-dapp
  npx create-stellar-agentic . --skill-only
  npx create-stellar-agentic my-contracts --template contract-only
`;

  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage);
    process.exit(0);
  }

  const skillOnly = args.includes("--skill-only");
  const noInstall = args.includes("--no-install");
  const skipPrompts = args.includes("--yes") || args.includes("-y");

  // Determine template type
  let tmplIdx = args.indexOf("--template");
  let tmplType = "full";
  if (tmplIdx !== -1 && tmplIdx + 1 < args.length) {
    tmplType = args[tmplIdx + 1];
  }

  // Determine target dir
  let targetDir;
  if (skillOnly) {
    const dirIdx = args.indexOf("--skill-only");
    targetDir = args[dirIdx + 1] || ".";
  } else {
    const nameArg = args.find((a) => !a.startsWith("-"));
    targetDir = nameArg || (IS_TTY ? await ask("Project name: ") : ".");
  }

  targetDir = targetDir.trim();
  if (!targetDir) {
    console.error("Error: no project directory specified.");
    console.log(usage);
    process.exit(1);
  }

  // Resolve path
  const resolved = join(process.cwd(), targetDir);

  if (skillOnly) {
    // Install skill files into existing project
    console.log(`\n  Installing Stellar Agentic skill into ${targetDir}...\n`);
    copyFrameworkSkill(resolved);
    console.log("  ✓ SKILL.md, CLAUDE.md");
    console.log("  ✓ agents/");
    console.log("  ✓ .claude/commands/");
    console.log("  ✓ evals/");
    console.log("  ✓ data/");
    await installDependencySkills();
    console.log("\n  Done! The Stellar Agentic Framework is ready in this project.");
    console.log("  Run /scaffold to generate your first template, or use the agents directly.");
    console.log("");
    process.exit(0);
  }

  // Full project scaffold
  console.log(`\n  Creating Stellar dApp in ${targetDir}/...\n`);

  if (existsSync(resolved) && !skipPrompts) {
    const ok = await ask(`  Directory ${targetDir} already exists. Overwrite? (y/N) `);
    if (ok.toLowerCase() !== "y") {
      console.log("  Aborted.");
      process.exit(0);
    }
  }

  mkdirSync(resolved, { recursive: true });

  // Copy framework skill files
  copyFrameworkSkill(resolved);

  // Scaffold templates
  const types = tmplType === "full"
    ? ["contracts", "frontend", "backend", "cicd", "tests"]
    : tmplType === "contract-only" ? ["contracts"]
    : tmplType === "frontend-only" ? ["frontend"]
    : tmplType === "backend-only" ? ["backend"]
    : tmplType === "payment-only" ? ["backend"]
    : ["contracts", "frontend", "backend", "cicd"];

  scaffoldTemplates(resolved, types);

  // Install dependency skills (smart-contracts, graphify, etc.)
  if (!noInstall) {
    await installDependencySkills();
  }

  // Write project README
  const projectName = basename(resolved);
  writeFileSync(join(resolved, "README.md"), `# ${projectName}

Scaffolded with [create-stellar-agentic](https://github.com/rylsherdamz-rgb/stellar-agentic-framework).

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Build contracts
cd contracts && cargo build --release --target wasm32v1-none

# Start frontend
cd frontend && npm run dev

# Start backend
cd backend && npm run dev
\`\`\`

## Components
${types.includes("contracts") ? "- **contracts/** — Rust smart contracts (soroban-sdk)\n" : ""}${types.includes("frontend") ? "- **frontend/** — Next.js 15 + Stellar Wallets Kit\n" : ""}${types.includes("backend") ? "- **backend/** — Express API + x402/MPP payments\n" : ""}- **agents/** — Stellar Agentic OS specialist agents
- **evals/** — Evaluation criteria for each component
- **.claude/commands/** — Slash commands for deploy/test/graphify

## Stellar Agentic Framework

This project uses the [Stellar Agentic Framework](https://github.com/rylsherdamz-rgb/stellar-agentic-framework) — an eval-driven, multi-agent harness for building production Stellar dApps.
`);

  console.log("");
  console.log(`  ✦ ${projectName} created! ✦`);
  console.log("");
  console.log(`  cd ${targetDir}`);

  if (!noInstall && types.includes("frontend")) {
    try {
      console.log("  npm install...");
      const { execSync } = await import("child_process");
      execSync("npm install", { cwd: resolved, stdio: "inherit" });
    } catch {}
  }

  console.log("");
  console.log("  Next steps:");
  if (types.includes("contracts")) {
    console.log("    cd contracts && cargo build --release --target wasm32v1-none");
    console.log("    stellar contract deploy ...");
  }
  if (types.includes("frontend")) {
    console.log("    cd frontend && npm run dev");
  }
  if (types.includes("backend")) {
    console.log("    cd backend && npm run dev");
  }
  console.log("");
  console.log("  Explore the project architecture:");
  console.log("    /graphify query \"how does the payment flow work?\"");
  console.log("    /deploy . testnet 2>/dev/null || echo 'set up your keys first'");
  console.log("");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
