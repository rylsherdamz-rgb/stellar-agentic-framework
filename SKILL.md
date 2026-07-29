---
name: stellar-agentic-framework
description: "Eval-driven coding harness for building production Stellar dApps. Routes tasks to 6 specialist agents, verifies output with structured evals, steers on failure, e2e-tests with Stellar Agentic Kit, and builds a knowledge graph of every project."
version: 0.1.0
license: MIT
tags:
  - stellar
  - soroban
  - smart-contracts
  - dapp
  - multi-agent
  - eval-driven
  - coding-harness
  - x402
  - mpp
  - stellar-wallets-kit
homepage: https://github.com/rylsherdamz-rgb/stellar-agentic-framework
user-invocable: true
argument-hint: "[project name or 'scaffold' to create a new project]"
---

# Stellar Coding Harness

Build production Stellar dApps with an eval-driven, multi-agent harness. This skill loads Stellar skills and graphify, routes work to 6 specialist agents via the kernel in CLAUDE.md, verifies every output against evals, and runs e2e tests with Stellar Agentic Kit.

## Architecture

```
project/
├── CLAUDE.md          # Harness kernel: identity, routing, agent registry
├── SKILL.md           # This file — harness workflow orchestration
├── agents/            # 6 specialist agent definitions
├── .claude/commands/  # 4 slash commands (scaffold, deploy, test-e2e, graphify)
├── evals/             # 5 evaluation definitions
├── data/              # Persistent memory: projects, decisions, logs
└── templates/         # Reference code for contracts, frontend, backend
```

## Skills (must always be loaded)
Every skill listed below must be loaded into context at session start and never dropped:
- `smart-contracts` — Rust/soroban-sdk contract development
- `dapp` — Next.js frontend, Stellar Wallets Kit
- `data` — Stellar RPC, Horizon queries
- `assets` — Classic assets, SAC, trustlines
- `agentic-payments` — x402, MPP Charge/Channel
- `standards` — SEPs, CAPs, ecosystem references
- `zk-proofs` — Zero-knowledge proofs, Groth16
- `graphify` — Knowledge graph for every project

## Harness Workflow

### Phase 0 — Skill Boot + Self-Graphify
Before handling any user request, ensure all skills are loaded:
1. Run the SKILL_BOOT procedure from CLAUDE.md (reads each skill's SKILL.md into context)
2. Verify all 8 skills are present; if any missing, install from `skills/` dir
3. Graph the framework itself for architecture navigation:
```bash
/graphify . --no-viz
```
```bash
/graphify . --no-viz
```

### Phase 1 — Intent Capture
Ask the user what they're building. Map keywords to eval templates and write a decision record.

| Keyword | Eval template |
|---------|--------------|
| token / asset | contract + asset |
| defi / lend / swap | contract + backend |
| payment / paywall / api | agentic-payments |
| nft / collectible | contract + frontend |
| wallet / connect | frontend |
| zk / zero-knowledge | contract + zk |
| full / dapp / app | all evals |

### Phase 2 — Spawn Agents (parallel)
Route sub-tasks to specialist agents via Task tool. Each agent loads its skill context.

Each agent receives: user intent, eval criteria, template files, example patterns
from `templates/<domain>/examples/`, and strict instruction to use
`useStellarData()` / agentic kit for all blockchain queries — never raw RPC or curl.

| Agent | Skills loaded |
|-------|--------------|
| `@stellar-contracts` | smart-contracts + assets + zk-proofs |
| `@stellar-frontend` | dapp + data |
| `@stellar-backend` | data + agentic-payments |
| `@stellar-payments` | agentic-payments + assets |
| `@stellar-ops` | (no extra skills) |
| `@stellar-zk` | zk-proofs |

### Phase 3 — Verify & Steer
Run evals against every agent output. On failure: steer with corrective context (max 3 retries).

```text
EVAL: <eval-name>
  Check: <description> → PASS/FAIL (attempt X/3)
  Result: X/Y passed
```

### Phase 4 — E2E Test
1. Start local Stellar network
2. Deploy contracts
3. Run Playwright e2e tests
4. Run Stellar Agentic Kit payment tests (x402 + MPP)
5. Record results

### Phase 4.5 — Auto-Graphify
```bash
/graphify <project> --no-viz
```

### Phase 5 — Report
```text
STELLAR CODING HARNESS :: EVAL REPORT
=========================================
Project: <name>
CONTRACT EVALS:     X/Y passed
FRONTEND EVALS:     X/Y passed
BACKEND EVALS:      X/Y passed
PAYMENT EVALS:      X/Y passed
E2E EVALS:          X/Y passed
GRAPH HEALTH:       X nodes, Y edges
Overall:            SHIP IT / NEEDS WORK
```

## Slash Commands
- `/scaffold` — Create a new Stellar project from templates
- `/deploy` — Deploy contracts to testnet/mainnet/local
- `/test-e2e` — Run end-to-end tests
- `/graphify` — Knowledge graph the project

## Decision Records
All decisions logged to `data/decisions/` in ADR format.

## Eval Definitions
Evals in `evals/` define pass/fail criteria for every component type.

## Related Skills
- smart-contracts, dapp, data, assets, agentic-payments, standards, zk-proofs
- graphify
