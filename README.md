<div align="center">

  <img src="https://stellar-agentic-framework.vercel.app/favicon.svg" width="48" height="48" alt="Stellar Agentic Framework">

  <br>

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/stellar-agentic--framework-7B3FE4?style=for-the-badge&logo=stellar&logoColor=white&labelColor=1a1a2e">
    <img alt="Stellar Agentic Framework" src="https://img.shields.io/badge/stellar-agentic--framework-7B3FE4?style=for-the-badge&logo=stellar&logoColor=white&labelColor=ffffff">
  </picture>

  <br>

  <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework">
    <img src="https://img.shields.io/github/last-commit/rylsherdamz-rgb/stellar-agentic-framework?color=7B3FE4&logo=github&label=updated">
  </a>
  <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/rylsherdamz-rgb/stellar-agentic-framework/ci.yml?branch=master&label=ci&logo=github">
  </a>
  <a href="https://www.npmjs.com/package/create-stellar-agentic">
    <img src="https://img.shields.io/npm/v/create-stellar-agentic?color=blue&logo=npm&label=cli">
  </a>
  <a href="https://stellar-agentic-framework.vercel.app">
    <img src="https://img.shields.io/badge/website-7B3FE4?logo=vercel&logoColor=white&label=docs">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green">
  </a>

  <br><br>

  <p><b>Build Stellar dApps with AI agents that write, verify, and deploy code — no context-switching.</b><br>
  <a href="https://stellar-agentic-framework.vercel.app" style="color:#7c3aed;text-decoration:none;">stellar-agentic-framework.vercel.app</a></p>

  <table>
    <tr>
      <td align="center"><b>🧠 Agentic Skill</b><br><sub>6 AI agents for contracts, frontend,<br>backend, payments, ops, ZK</sub></td>
      <td width="30"></td>
      <td align="center"><b>📦 Scaffold CLI</b><br><sub><code>npx create-stellar-agentic</code><br>Full dApp in one command</sub></td>
    </tr>
  </table>
</div>

---

## Table of Contents

- [The Problem](#the-problem)
- [How It Works](#how-it-works)
- [Option A: Claude Code Skill](#option-a-claude-code-skill)
- [Option B: Scaffold CLI](#option-b-scaffold-cli)
- [Contract Deployment](#contract-deployment)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [FAQ](#faq)

---

## The Problem

Building a Stellar dApp means juggling:

- Rust smart contracts (soroban-sdk) with auth, events, TTL
- A React frontend with wallet connection, signing, transaction UX
- An API server with x402/MPP payment middleware
- CI/CD, deployment, testnet funding
- Zero-knowledge proof integration

Each piece requires different tools, different mental models, and constant context-switching. Most projects never ship because the gap between "contract compiles" and "app works" is huge.

**This framework closes that gap.** It gives AI agents the structured context they need to build, test, and deploy every layer of a Stellar dApp — and verifies the output against defined evals before declaring it done.

---

## How It Works

```
You describe what you want
        │
        ▼
  Kernel (CLAUDE.md) parses intent
        │
        ├── @stellar-contracts  ─── Rust + soroban-sdk
        ├── @stellar-frontend   ─── Next.js + Wallets Kit
        ├── @stellar-backend    ─── Express + RPC
        ├── @stellar-payments   ─── x402 + MPP
        ├── @stellar-ops        ─── CI/CD + deploy
        └── @stellar-zk         ─── Groth16 + Noir
        │
        ▼
  Each agent gets relevant skills + eval criteria
        │
        ▼
  Output verified against evals (max 3 retries)
        │
        ▼
  E2E test + deploy → report
```

The kernel never writes code. It routes, verifies, and steers. Six specialist agents do the work, each loaded with the skills and evals for their domain — plus 10 bundled knowledge skills (smart-contracts, dapp, data, assets, payments, standards, zk, mcp, frontend-design, graphify).

---

## Option A: Agent Skill

Use this if you work in Claude Code and want AI-assisted development.

### Install

```bash
# Agent Skill
npx skills add rylsherdamz-rgb/stellar-agentic-framework 

#Claude Code
npx skills add rylsherdamz-rgb/stellar-agentic-framework --agent claude-code

# OpenCode
npx skills add rylsherdamz-rgb/stellar-agentic-framework --agent opencode

# Or install from the plugin marketplace (Claude Code only)
/plugin marketplace add rylsherdamz-rgb/stellar-agentic-framework
```

Then in any session:

> _"Build a token contract with a React frontend and x402 payments"_

### What Happens

The kernel spawns up to 6 agents in parallel, each with specialized skills and eval criteria. Every output is checked — if it fails, the agent retries with corrective context (max 3 attempts). After all agents pass, the framework runs e2e tests and reports pass/fail per component.

### Agents

| Agent | Role | Loaded Skills |
|-------|------|---------------|
| `@stellar-contracts` | Rust smart contracts (soroban-sdk) | contracts + assets + zk |
| `@stellar-frontend` | Next.js + Wallets Kit + Tailwind | dapp + data + frontend-design |
| `@stellar-backend` | Express + RPC services | data + agentic-payments |
| `@stellar-payments` | x402 + MPP payment flows | agentic-payments + assets |
| `@stellar-ops` | CI/CD + Docker + deploy | — |
| `@stellar-zk` | Groth16 + Circom + Noir | zk-proofs |

### Agentic Kit Hooks (no raw RPC)

| Hook | Import | Use |
|------|--------|-----|
| `useStellarData()` | `@/hooks/use-stellar-data` | Balances, contract queries, events, transactions |
| `useContract(id)` | `@/hooks/use-contract` | `read()` (simulation) / `write()` (sign+submit) |
| `useStellarWallet()` | `@/hooks/use-stellar-wallet` | Connect, disconnect, sign, getBalances |
| `useWallet()` | `@/providers/wallet-provider` | Context wrapper |

### MCP Integrations (auto-configured)

| Server | Tools | Use For |
|--------|-------|---------|
| stellar-rpc | `get_account`, `get_contract_data`, `simulate_transaction` | Debugging, verification |
| filesystem | `read_file`, `write_file`, `list_directory` | Project access |
| github | `create_or_update_file`, `search_repos`, `create_pull_request` | Repo management |
| playwright | `browser_navigate`, `browser_click`, `browser_screenshot` | E2E testing |

### Eval Criteria

| Eval | What It Checks |
|------|----------------|
| 01-contract | Compiles to WASM, tests pass, auth on privileged fns, TTL on writes, deploy gate |
| 02-frontend | TypeScript compiles, wallet connect/disconnect, contract read/write, no raw RPC |
| 03-backend | Server starts, balance + contract endpoints, CORS |
| 04-payment | x402 rejects unpaid with 402, accepts valid payment |
| 05-framework | All agents produced output, all evals ran, graphify completed |

---

## Option B: Scaffold CLI

Use this to generate a complete Stellar dApp project without Claude Code.

### Install

```bash
npx create-stellar-agentic my-dapp --yes
```

Or install globally:

```bash
npm install -g create-stellar-agentic
stellar-agentic my-dapp --yes
```

### What You Get

```
my-dapp/
├── contracts/          # Rust smart contracts (hello-world + SEP-41 token)
├── frontend/           # Next.js 15 + Tailwind + Wallets Kit
│   ├── hooks/          #   Agentic kit hooks (useStellarData, useContract, useWallet)
│   ├── components/     #   ConnectButton, InvokeContract, SendPayment
│   ├── providers/      #   WalletProvider context
│   └── examples/       #   Dashboard, BalanceViewer, EventList
├── backend/            # Express + x402/MPP payments
├── .github/workflows/  # CI/CD (contract test, frontend deploy, backend deploy, e2e)
├── scripts/            # deploy-contract.sh (test gate → deploy → record)
├── agents/             # 6 specialist agents (for Claude Code)
├── evals/              # Eval criteria per component
├── CLAUDE.md           # Harness kernel
└── SKILL.md            # Orchestration skill
```

If you do use Claude Code, pointing it at this project activates the full multi-agent harness automatically — the CLI installs all skill dependencies to `~/.claude/skills/`.

### CLI Options

| Flag | Description |
|------|-------------|
| `--yes` / `-y` | Skip all prompts |
| `--template <type>` | `full` (default), `contract-only`, `frontend-only`, `backend-only`, `payment-only` |
| `--skill-only <dir>` | Install only the skill files into an existing project |
| `--no-install` | Skip npm install after scaffold |

---

## Contract Deployment

Deployment requires passing the test gate first — `cargo test` must succeed or the deploy aborts.

**First deploy** on a network (no existing `data/deployments/<network>.json`): deploys silently, records contract IDs, updates `.env`.

**Subsequent deploys**: prompts for confirmation before proceeding.

| File | Purpose |
|------|---------|
| `data/deployments/<network>.json` | Contract ID, WASM hash, timestamp |
| `.env` | `NEXT_PUBLIC_<NAME>_CONTRACT_ID` |

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STELLAR_RPC_URL` | No | `https://soroban-testnet.stellar.org` | RPC endpoint |
| `STELLAR_NETWORK_PASSPHRASE` | No | `Test SDF Network ; September 2015` | Network passphrase |
| `STELLAR_SECRET_KEY` | For deploy | — | Deployer account secret |
| `STELLAR_DEPLOYER` | For deploy | `deployer` | Stellar CLI source account |
| `NEXT_PUBLIC_<NAME>_CONTRACT_ID` | After deploy | — | Auto-populated by deploy script |
| `OZ_CHANNEL_ID` | For x402 | — | OZ Channels facilitator ID |
| `OZ_API_KEY` | For x402 | — | OZ Channels API key |

### MCP Configuration (`.mcp.json`)

```json
{
  "mcpServers": {
    "stellar-rpc": {
      "command": "npx",
      "args": ["@stellar/mcp-server"],
      "env": {
        "STELLAR_RPC_URL": "https://soroban-testnet.stellar.org",
        "STELLAR_NETWORK_PASSPHRASE": "Test SDF Network ; September 2015"
      }
    }
  }
}
```

---

## Architecture

```
stellar-agentic-framework/
├── SKILL.md             # Orchestration skill
├── CLAUDE.md            # Harness kernel — identity, routing, Skill Boot
├── agents/              # 6 specialist agent definitions
├── skills/              # 10 bundled skills (auto-installed to ~/.claude/skills/)
│   ├── smart-contracts/ #   Rust + soroban-sdk contract dev
│   ├── dapp/            #   Frontend hooks + examples
│   ├── data/            #   RPC + Horizon queries
│   ├── assets/          #   Classic assets + SAC bridge
│   ├── agentic-payments/#   x402 + MPP
│   ├── standards/       #   SEPs + CAPs
│   ├── zk-proofs/       #   Groth16 + Circom + Noir
│   ├── stellar-mcp/     #   MCP tools guide
│   ├── frontend-design/ #   Tailwind CSS dApp UI patterns
│   └── graphify/        #   Knowledge graphs
├── templates/           # Source code for CLI scaffold
│   ├── contracts/       #   hello-world + SEP-41 token
│   ├── frontend/        #   Next.js + hooks + components
│   ├── backend/         #   Express + RPC + x402
│   └── cicd/            #   GitHub Actions workflows
├── evals/               # 5 eval criteria files
├── data/                # Persistent project memory
├── scripts/             # deploy-contract.sh
├── packages/create-stellar-agentic/  # Published to npm
├── .claude/commands/    # 4 slash commands (scaffold, deploy, test-e2e, graphify)
├── .claude-plugin/      # Claude Code plugin manifest
└── skill.json           # Skills Directory manifest
```

---

## FAQ

**Do I need both the skill and the CLI?**  
No. The skill is for Claude Code users; the CLI scaffolds projects standalone. The CLI auto-installs the skill if you use Claude Code.

**Can I use this without Claude Code?**  
Yes. `npx create-stellar-agentic` works standalone. The harness kernel only activates in Claude Code sessions.

**What networks are supported?**  
Testnet (default), mainnet, and local/testcontainer. All configs default to testnet — mainnet requires explicit env opt-in.

**How do eval retries work?**  
Each agent gets max 3 attempts. On failure, the kernel feeds the eval failure details back as corrective context for the retry.

**How do I add my own agent?**  
Create an agent file in `agents/`, register it in `CLAUDE.md`, and add its eval to `evals/`.

**My contracts don't compile — what SDK version?**  
The template contracts target `soroban-sdk = "27.0.0-rc.1"`. Run `cargo update` if you need a newer patch.

---

## Related

- [Documentation & Demo](https://stellar-agentic-framework.vercel.app)
- [Stellar Documentation](https://developers.stellar.org/docs)
- [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit)
- [Stellar Agentic Kit](https://github.com/stellar/stellar-agentic-kit)
- [OpenZeppelin Stellar Contracts](https://github.com/OpenZeppelin/stellar-contracts)

---

<p align="center">
  <sub>Built with the Stellar Agentic Framework · <a href="https://stellar-agentic-framework.vercel.app">Website</a> · <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework">GitHub</a> · <a href="https://www.npmjs.com/package/create-stellar-agentic">npm</a></sub>
</p>
