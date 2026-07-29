# Stellar Agentic Framework

An **eval-driven, multi-agent harness** for building production Stellar dApps. Spawns parallel specialist agents for contracts/frontend/backend/payments, verifies every output with structured evals, steers on failure, e2e-tests with the Stellar Agentic Kit, and builds a knowledge graph of every project.

## Architecture

```
┌─ CLAUDE.md (Kernel) ───────────────────────────────┐
│ Routes tasks, manages agents, tracks decisions      │
├─ agents/ ──────────────────────────────────────────┤
│ @stellar-contracts  @stellar-frontend               │
│ @stellar-backend    @stellar-payments               │
│ @stellar-ops        @stellar-zk                     │
├─ .claude/commands/ ────────────────────────────────┤
│ /scaffold  /deploy  /test-e2e  /graphify            │
├─ evals/ ───────────────────────────────────────────┤
│ 01-contract-eval.md  02-frontend-eval.md             │
│ 03-backend-eval.md   04-e2e-eval.md                  │
│ 05-framework-eval.md                                 │
├─ templates/ ───────────────────────────────────────┤
│ contracts/  frontend/  backend/  cicd/               │
└─────────────────────────────────────────────────────┘
```

## Core Workflow

### Phase 0 — Framework Self-Graphify
The framework graphs itself so you can explore its architecture:
```
/graphify . --no-viz
/graphify query "How do agents connect to evals?"
```

### Phase 1 — Intent Capture
You say what you want to build. The framework writes eval criteria.

### Phase 2 — Spawn Agents (parallel)
| Agent | Handles |
|-------|---------|
| `@stellar-contracts` | Rust smart contracts (soroban-sdk) |
| `@stellar-frontend` | Next.js + Stellar Wallets Kit |
| `@stellar-backend` | API servers + data services |
| `@stellar-payments` | x402/MPP payment flows |
| `@stellar-ops` | CI/CD + deployment |
| `@stellar-zk` | Zero-knowledge proofs |

### Phase 3 — Verify & Steer
Every agent output is checked against evals. On failure → corrective context → retry (max 3).

### Phase 4 — E2E Test
Deploy contracts to local Stellar network, run Playwright + Stellar Agentic Kit payment tests.

### Phase 4.5 — Auto-Graphify
The generated project is graphed for navigation and querying.

### Phase 5 — Report
pass@k metrics, eval results, SHIP IT / NEEDS WORK decision.

## Getting Started

```bash
# 1. Load the framework skill
# 2. Say: "I want to build a token with x402 payments"
# 3. The framework spawns @stellar-contracts + @stellar-frontend + @stellar-payments
# 4. Agents build the project in scaffolds/<project-name>/
# 5. Framework verifies, tests, and reports
```

## Slash Commands

| Command | Purpose |
|---------|---------|
| `/scaffold <name>` | Create a new Stellar project |
| `/deploy <path>` | Deploy contracts to testnet/mainnet |
| `/test-e2e <path>` | Run end-to-end tests |
| `/graphify [path]` | Knowledge graph the current project |

## Skills Auto-Loaded

- `smart-contracts` — Rust/soroban-sdk contract development
- `dapp` — Next.js frontend, Stellar Wallets Kit
- `data` — Stellar RPC, Horizon queries
- `assets` — Classic assets, SAC, trustlines
- `agentic-payments` — x402, MPP Charge/Channel
- `standards` — SEPs, CAPs, ecosystem
- `zk-proofs` — Zero-knowledge proofs, Groth16
- `graphify` — Knowledge graph for every project
- `agentic-os` — Kernel, agents, commands, memory

## Project Structure

```
stellar-agentic-framework/
├── SKILL.md                    # Orchestration skill
├── CLAUDE.md                   # Agentic OS kernel
├── agents/                     # 6 specialist agents
├── .claude/commands/           # 4 slash commands
├── data/                       # Persistent memory
│   ├── projects/               # Per-project context
│   ├── decisions/              # ADR-format decisions
│   └── logs/                   # Session logs
├── evals/                      # 5 eval definitions
├── templates/                  # Reference code
│   ├── contracts/              # hello-world, token
│   ├── frontend/               # Next.js + Wallets Kit
│   ├── backend/                # Express + x402/MPP
│   └── cicd/                   # GitHub Actions
├── tests/                      # E2E test suite
├── .env.example
└── package.json
```

## Eval-Driven Development

Every task starts with a defined eval:
```markdown
[CAPABILITY EVAL: stellar-contracts]
Success Criteria:
  - [ ] Contract compiles to WASM
  - [ ] All unit tests pass
  - [ ] Auth required on privileged functions
  - [ ] TTL extended on writes
Result: X/Y passed (pass@1: X%)
```

## Related

- [Stellar Developer Docs](https://developers.stellar.org/docs)
- [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit)
- [Stellar Agentic Kit](https://github.com/stellar/stellar-agentic-kit)
- [OpenZeppelin Stellar Contracts](https://github.com/OpenZeppelin/stellar-contracts)

---

Built with the [Stellar Agentic Framework](https://github.com/rylsherdamz-rgb/stellar-agentic-framework).
