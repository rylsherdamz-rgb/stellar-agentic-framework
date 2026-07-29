---
name: stellar-agentic-framework
description: "Eval-driven agentic harness for building production Stellar dApps. Spawns parallel specialist agents for contracts/frontend/backend/payments, verifies output with structured evals, steers on failure, e2e-tests with Stellar Agentic Kit, and builds a knowledge graph of every project."
version: 0.1.0
license: MIT
tags:
  - stellar
  - soroban
  - smart-contracts
  - dapp
  - agentic-os
  - multi-agent
  - eval-driven
  - x402
  - mpp
  - stellar-wallets-kit
homepage: https://github.com/richie/stellar-agentic-framework
user-invocable: true
argument-hint: "[project name or 'scaffold' to create a new project]"
---
# Stellar Agentic Framework

Build production Stellar dApps with an eval-driven, multi-agent harness. This skill loads **all Stellar skills** and **graphify** automatically, routes work to specialist agents, verifies every output, and e2e-tests with the Stellar Agentic Kit (x402 + MPP).

## Skills auto-loaded
- `smart-contracts` (Rust, soroban-sdk)
- `dapp` (Next.js, Stellar Wallets Kit)
- `data` (RPC, Horizon)
- `assets` (classic assets, SAC, trustlines)
- `agentic-payments` (x402, MPP Charge/Channel)
- `standards` (SEPs, CAPs, ecosystem)
- `zk-proofs` (Groth16, BLS12-381, Circom)
- `graphify` (knowledge graph for every project)
- `agentic-os` (kernel, agents, commands, memory)

## Workflow

### Phase 0 — Framework self-graphify
Before any user task, ensure this framework repo itself is graphed:
```bash
/graphify . --no-viz
```
This enables `/graphify query` on the framework itself so you can navigate its architecture.

### Phase 1 — Intent Capture
Ask the user: "What are you building?"
Listen for keywords to determine the eval template:
- `token` / `asset` → contract + asset evals
- `defi` / `lend` / `swap` / `vault` → contract + backend evals
- `payment` / `paywall` / `api` → agentic-payments (x402/MPP) evals
- `nft` / `collectible` → contract + frontend evals
- `wallet` / `connect` → frontend evals
- `zk` / `zero-knowledge` / `private` → contract + zk evals
- `full` / `dapp` / `app` → all evals

**Output:** eval definition written to `<project>/evals/<intent>.md` with pass/fail criteria.
Also write a decision record to `data/decisions/<date>-scaffold.md`.

### Phase 2 — Spawn Agents (parallel)
Route sub-tasks to specialist agents based on intent. Each agent loads its own skill context:

| Agent | Loads | Handles |
|-------|-------|---------|
| `@stellar-contracts` | smart-contracts + assets + zk-proofs | Rust contracts, deploy, test |
| `@stellar-frontend` | dapp + data | Next.js, Wallets Kit, tx building |
| `@stellar-backend` | data + agentic-payments | API servers, x402/MPP, indexers |
| `@stellar-payments` | agentic-payments + assets | x402 setup, MPP charge/channel |
| `@stellar-ops` | (no extra skills) | CI/CD, Docker, deployment |
| `@stellar-zk` | zk-proofs | Groth16 verifiers, Circom/Noir |

Launch all needed agents in a single message (parallel Task calls).

Each agent receives:
1. The user's intent description
2. The relevant eval criteria from Phase 1
3. The template files from `templates/` as reference
4. Instruction to write output to `<project>/<domain>/`

### Phase 3 — Verify & Steer
For every agent output, run the corresponding evals:

```bash
# Contract evals
cargo test --manifest-path <project>/contracts/<name>/Cargo.toml && echo "PASS" || echo "FAIL"
cargo build --release --target wasm32v1-none --manifest-path <project>/contracts/<name>/Cargo.toml && echo "PASS" || echo "FAIL"
stellar contract build --manifest-path <project>/contracts/<name>/Cargo.toml && echo "PASS" || echo "FAIL"

# Frontend evals
[ -f <project>/frontend/package.json ] && echo "PASS" || echo "FAIL"
npx --prefix <project>/frontend tsc --noEmit && echo "PASS" || echo "FAIL"

# Backend evals
[ -f <project>/backend/api/index.ts ] && echo "PASS" || echo "FAIL"
```

**Steer on failure:** If an eval fails:
1. Identify the specific failure (compile error, missing import, wrong pattern)
2. Load the relevant skill for corrective context
3. Re-spawn the agent with: "Fix [specific issue]. Reference: [skill section:line]"
4. Max 3 retries per agent. After 3 failures, flag for human review.

**Eval grader format used:**
```text
EVAL: <eval-name>
  Check: <description>
         → PASS/FAIL (attempt X/3)
  Check: <description>
         → PASS/FAIL (attempt X/3)
  Result: X/Y passed
```

### Phase 4 — E2E Test with Stellar Agentic Kit
After all agents pass verification:

1. **Start local Stellar network:** `stellar container start local` (or docker-compose)
2. **Deploy contracts:** `stellar contract deploy --wasm <project>/contracts/<name>/target/wasm32v1-none/release/<name>.wasm --source-account dev --network local`
3. **Fund test accounts:** Friendbot or key generation
4. **Run Playwright e2e suite:**
   ```bash
   npx playwright test --config <project>/tests/playwright.config.ts
   ```
5. **Run Stellar Agentic Kit payment tests:**
   ```bash
   # x402 flow: client requests paid endpoint, gets 402, signs auth entries, gets resource
   node <project>/tests/x402-flow.mjs
   # MPP flow: charge mode with SAC transfer
   node <project>/tests/mpp-charge-flow.mjs
   ```
6. **Verify contract interactions on-chain** via RPC queries

**Record results in** `data/decisions/<date>-e2e-results.md`

### Phase 4.5 — Auto-Graphify Project
Run graphify on the generated project so the user can explore it:
```bash
/graphify <project> --no-viz
```

### Phase 5 — Report
Generate the final eval report:

```text
STELLAR AGENTIC FRAMEWORK :: EVAL REPORT
=========================================
Project: <name>
Date:    <date>

CONTRACT EVALS:     X/Y passed (pass@1: X%)
FRONTEND EVALS:     X/Y passed (pass@1: X%)
BACKEND EVALS:      X/Y passed (pass@1: X%)
PAYMENT EVALS:      X/Y passed (pass@1: X%)
E2E EVALS:          X/Y passed (pass@1: X%)
GRAPH HEALTH:       X nodes, Y edges, Z communities

Overall:            SHIP IT / NEEDS WORK

Remaining manual steps:
1. ...
2. ...

The graph can answer questions about your project.
Run: /graphify query "<question>"
```

Present to user. If `NEEDS WORK`, explain what failed and offer to re-spawn the failing agent.

## Slash Commands
This framework registers the following commands (`.claude/commands/`):
- `/scaffold` — Create a new Stellar project from scratch
- `/deploy` — Deploy contracts to testnet/mainnet
- `/test-e2e` — Run end-to-end tests
- `/graphify` — Knowledge graph the current project

## Decision Records
All significant decisions are logged to `data/decisions/` in ADR format:
```markdown
# ADR-001: <title>
Date: <date>

## Context
What prompted this decision?

## Decision
What was chosen?

## Consequences
What trade-offs were accepted?
```

## Eval Definitions
Evals live in `evals/` and follow this structure:
```markdown
[CAPABILITY EVAL: <name>]
Task: <description>
Success Criteria:
  - [ ] Criterion 1
  - [ ] Criterion 2
Expected Output: <description>
```

## Cost Tracking
Cost data accumulates in `data/cost.json`:
```json
{
  "runs": [{"date": "...", "input_tokens": 0, "output_tokens": 0, "files": 0}],
  "total_input_tokens": 0,
  "total_output_tokens": 0
}
```

## Related Skills
- For Stellar-specific tasks: smart-contracts, dapp, data, assets, agentic-payments, standards, zk-proofs
- For knowledge graphs: graphify
- For agent orchestration: agentic-os
