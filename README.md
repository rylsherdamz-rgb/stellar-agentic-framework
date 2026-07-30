<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/stellar-agentic--framework-7B3FE4?style=for-the-badge&logo=stellar&logoColor=white&labelColor=1a1a2e">
  <img alt="Stellar Agentic Framework" src="https://img.shields.io/badge/stellar-agentic--framework-7B3FE4?style=for-the-badge&logo=stellar&logoColor=white&labelColor=ffffff">
</picture>

[![GitHub](https://img.shields.io/badge/repo-v0.1.0-7B3FE4?logo=github)](https://github.com/rylsherdamz-rgb/stellar-agentic-framework)
[![npm](https://img.shields.io/npm/v/create-stellar-agentic?color=cb3837&logo=npm)](https://www.npmjs.com/package/create-stellar-agentic)
[![Claude Code Skill](https://img.shields.io/badge/skill-claude--code-7B3FE4?logo=anthropic)](https://github.com/rylsherdamz-rgb/stellar-agentic-framework)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

An **eval-driven multi-agent coding harness** for building production Stellar dApps.
Two products in one repo:

| | |
|---|---|
| **🧠 Claude Code Skill** | 6 parallel specialist agents for contracts, frontend, backend, payments, ops, ZK — with structured eval verification |
| **📦 Scaffold CLI** | `npx create-stellar-agentic` — generate full dApp projects with contracts, Next.js frontend, Express backend, and CI/CD |

---

## Quick Start

### 🧠 Claude Code Skill

```bash
npx skills add rylsherdamz-rgb/stellar-agentic-framework --agent claude-code
```

Then in any Claude Code session:

> _"Build a token contract with a React frontend and x402 payments"_

The kernel spawns 6 agents in parallel, verifies every output against evals, steers on failure, and reports results.

### 📦 Scaffold CLI

```bash
npx create-stellar-agentic my-dapp --yes
```

Scaffolds a full project with contracts, Next.js frontend (+ Tailwind + Wallets Kit), Express backend, CI/CD, and deploy scripts.

---

## Features

| | |
|---|---|
| **🧠 6 Specialist Agents** | Contracts, frontend, backend, payments, ops, ZK — run in parallel |
| **✅ Eval-Driven Quality** | Structured pass/fail criteria, max 3 retries, pass@k metrics |
| **🔗 Agentic Kit Hooks** | `useStellarData()`, `useContract()`, `useStellarWallet()` — no raw RPC |
| **🎨 Frontend Design** | Tailwind CSS-first dApp UI patterns — wallet UX, tx flows, dark mode |
| **🚀 Contract Deploy** | Test gate → auto-deploy → record ID to `.env` + deploy tracker |
| **⚡ MCP Tools** | Stellar RPC, filesystem, GitHub, Playwright — direct from Claude |
| **📦 One-Command Scaffold** | `npx create-stellar-agentic` — full dApp in seconds |
| **📊 Knowledge Graphs** | Auto-graphify every project — navigate, query, explain architecture |
| **🧩 10 Bundled Skills** | smart-contracts, dapp, data, assets, agentic-payments, standards, zk-proofs, stellar-mcp, frontend-design, graphify |

---

## Part 1: Claude Code Skill

### Installation

```bash
# From the skills registry (recommended)
npx skills add rylsherdamz-rgb/stellar-agentic-framework --agent claude-code

# From the Claude Code plugin marketplace
/plugin marketplace add rylsherdamz-rgb/stellar-agentic-framework

# From a local clone
git clone https://github.com/rylsherdamz-rgb/stellar-agentic-framework.git
cd stellar-agentic-framework
npx skills add ./ --agent claude-code
```

All 10 dependency skills auto-install to `~/.claude/skills/`.

### Available on Marketplaces

| Marketplace | URL |
|-------------|-----|
| Skills Directory | [skillsdirectory.com](https://www.skillsdirectory.com/)
| Claude Code Plugins | [claude-codes.com](https://claude-codes.com/)
| NPXSkills | [npxskills.xyz](https://npxskills.xyz/)

### How It Works

```
User Request → Kernel (CLAUDE.md) → 6 Parallel Agents → Verify with Evals → Report
```

| Phase | What Happens |
|-------|-------------|
| **1. Intent Capture** | Kernel maps your request to agents + evals |
| **2. Spawn Agents** | Up to 6 agents run in parallel, each with loaded skills |
| **3. Verify & Steer** | Every output checked against evals — max 3 retries on failure |
| **4. E2E Test** | Playwright browser tests + x402 payment flow tests |
| **5. Report** | Eval report with per-agent pass/fail + overall verdict |

### Agent Registry

| Agent | Role | Skills |
|-------|------|--------|
| `@stellar-contracts` | Rust smart contracts (soroban-sdk) | contracts + assets + zk |
| `@stellar-frontend` | Next.js + Wallets Kit + Tailwind | dapp + data + frontend-design |
| `@stellar-backend` | Express + RPC services | data + payments |
| `@stellar-payments` | x402 + MPP payment flows | payments + assets |
| `@stellar-ops` | CI/CD + Docker + deploy | — |
| `@stellar-zk` | Groth16 + Circom + Noir | zk-proofs |

### Agentic Kit Hooks

All blockchain queries use typed hooks — never raw RPC or curl.

| Hook | Import | Use |
|------|--------|-----|
| `useStellarData()` | `@/hooks/use-stellar-data` | Balances, contract queries, events, transactions |
| `useContract(id)` | `@/hooks/use-contract` | `read()` (simulation) / `write()` (sign+submit) |
| `useStellarWallet()` | `@/hooks/use-stellar-wallet` | Connect, disconnect, sign, getBalances |
| `useWallet()` | `@/providers/wallet-provider` | Context — same as `useStellarWallet()` |

### MCP Integrations

| Server | Tools | Use For |
|--------|-------|---------|
| `stellar-rpc` | `get_account`, `get_contract_data`, `simulate_transaction`, etc. | Debugging, contract verification |
| `filesystem` | `read_file`, `write_file`, `list_directory` | Project file access |
| `github` | `create_or_update_file`, `search_repos`, `create_pull_request` | Repository management |
| `playwright` | `browser_navigate`, `browser_click`, `browser_screenshot` | E2E testing |

### Eval Criteria

| Eval | Checks |
|------|--------|
| `01-contract-eval` | Compiles to WASM, tests pass, auth on privileged fns, TTL on writes, deploy gate |
| `02-frontend-eval` | TypeScript compiles, wallet connect/disconnect, contract read/write, no raw RPC |
| `03-backend-eval` | Server starts, balance + contract endpoints, CORS |
| `04-payment-eval` | x402 rejects unpaid with 402, accepts valid payment |
| `05-framework-eval` | All agents produced output, all evals ran, graphify completed |

---

## Part 2: Scaffold CLI

### Installation

```bash
# Run directly (no install needed)
npx create-stellar-agentic my-dapp --yes

# Or install globally
npm install -g create-stellar-agentic
create-stellar-agentic my-dapp --yes
# or: stellar-agentic my-dapp --yes
```

### What You Get

```
my-dapp/
├── contracts/          # Rust smart contracts (hello-world + SEP-41 token)
├── frontend/           # Next.js 15 + Tailwind + Wallets Kit
│   ├── hooks/          #   useStellarData, useContract, useWallet
│   ├── components/     #   ConnectButton, InvokeContract, SendPayment
│   ├── providers/      #   WalletProvider context
│   └── examples/       #   Dashboard, BalanceViewer, EventList
├── backend/            # Express + x402/MPP payments
├── .github/            # CI/CD workflows
├── data/deployments/   # Contract deploy tracker
├── scripts/            # deploy-contract.sh (test gate → deploy → record)
├── agents/             # 6 specialist agents (for Claude Code)
├── evals/              # Eval criteria
├── CLAUDE.md           # Harness kernel
└── SKILL.md            # Orchestration skill
```

### CLI Reference

| Flag | Description |
|------|-------------|
| `--yes` / `-y` | Skip all prompts |
| `--template <type>` | Scaffold type: `full`, `contract`, `frontend`, `backend`, `minimal` |
| `--skill-only` | Install only the skill files into an existing project |
| `--no-install` | Skip npm install after scaffold |

---

## Contract Deployment

Deployment runs through a test gate — `cargo test` must pass before deploying.

### Auto-Deploy (First Time)

If `data/deployments/testnet.json` doesn't exist (no prior deploy on that network), the agent deploys silently. On subsequent deploys it asks for confirmation.

### Tracking

| Location | Purpose |
|----------|---------|
| `data/deployments/<network>.json` | Deploy tracker — contract ID, WASM hash, timestamp |
| `.env` | `NEXT_PUBLIC_<NAME>_CONTRACT_ID=<contract-id>` |
| Deploy script | `scripts/deploy-contract.sh` — test gate → deploy → record |

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

### MCP Config (`.mcp.json`)

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

## Project Structure

```
stellar-agentic-framework/
├── SKILL.md                        # Orchestration skill (skillsdirectory.com format)
├── CLAUDE.md                       # Harness kernel — identity, routing, Skill Boot
├── agents/                         # 6 specialist agent definitions
├── references/                     # Reference docs (agents, evals, agentic-kit, templates)
├── skills/                         # 10 bundled dependency skills (auto-installed)
│   ├── smart-contracts/            #   Rust + soroban-sdk
│   ├── dapp/                       #   Frontend hooks + examples
│   ├── data/                       #   RPC + Horizon queries
│   ├── assets/                     #   Classic assets + SAC bridge
│   ├── agentic-payments/           #   x402 + MPP
│   ├── standards/                  #   SEPs + CAPs
│   ├── zk-proofs/                  #   Groth16 + Circom
│   ├── stellar-mcp/                #   MCP tools guide
│   ├── frontend-design/            #   Tailwind CSS dApp UI patterns
│   └── graphify/                   #   Knowledge graphs
├── templates/                      # Scaffold source code
│   ├── contracts/                  #   hello-world + SEP-41 token
│   ├── frontend/                   #   Next.js + hooks + components
│   ├── backend/                    #   Express + RPC + x402
│   └── cicd/                       #   GitHub Actions
├── evals/                          # 5 eval definitions
├── data/                           # Persistent memory (projects, decisions, deployments, logs)
├── scripts/                        # Utility scripts (deploy-contract.sh)
├── packages/create-stellar-agentic # npm publishable CLI package
├── .claude/commands/               # 4 slash commands
├── .mcp.json                       # MCP server config
├── .claude-plugin/                 # Claude Code marketplace listing
├── skill.json                      # Skills Directory marketplace listing
└── .env.example                    # All env vars documented
```

---

## FAQ

**Q: Do I need both the skill and the CLI?**  
No. Use the **skill** if you work in Claude Code and want AI-assisted development. Use the **CLI** to scaffold projects manually. The skill auto-installs when you run `npx create-stellar-agentic`.

**Q: Can I use this without Claude Code?**  
Yes. The scaffold CLI works standalone. The harness kernel (CLAUDE.md) only activates in Claude Code.

**Q: What Stellar networks are supported?**  
Testnet (default), mainnet/pubnet, and local/testcontainer. All network configs default to testnet — mainnet requires explicit env var opt-in.

**Q: How do eval retries work?**  
Each agent gets max 3 attempts. On failure, the kernel provides eval failure details as corrective context for the retry.

**Q: How do I add my own agents?**  
Create an agent file in `agents/`, add it to the registry in CLAUDE.md, and define the associated eval in `evals/`.

---

## Related

- [Stellar Documentation](https://developers.stellar.org/docs)
- [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit)
- [Stellar Agentic Kit](https://github.com/stellar/stellar-agentic-kit)
- [OpenZeppelin Stellar Contracts](https://github.com/OpenZeppelin/stellar-contracts)
- [Skills Directory](https://www.skillsdirectory.com/)
- [Claude Code Plugins](https://claude-codes.com/)
- [NPXSkills](https://npxskills.xyz/)

---

<p align="center">
  <sub>Built with the Stellar Agentic Framework · <a href="https://github.com/rylsherdamz-rgb/stellar-agentic-framework">GitHub</a> · <a href="https://www.npmjs.com/package/create-stellar-agentic">npm</a></sub>
</p>
