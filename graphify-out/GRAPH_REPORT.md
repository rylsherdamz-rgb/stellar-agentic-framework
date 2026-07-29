# Graph Report - .  (2026-07-29)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 189 nodes · 211 edges · 24 communities (21 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Env
- package.json
- dependencies
- package.json
- compilerOptions
- dependencies
- devDependencies
- lib.rs
- index.ts
- package.json
- setup
- stellar-config.ts
- wallet-provider.tsx
- invoke-contract.tsx
- use-stellar-wallet.ts

## God Nodes (most connected - your core abstractions)
1. `Token` - 13 edges
2. `compilerOptions` - 11 edges
3. `extend_balance_ttl()` - 8 edges
4. `setup()` - 8 edges
5. `scripts` - 6 edges
6. `scripts` - 5 edges
7. `scripts` - 5 edges
8. `extend_instance_ttl()` - 5 edges
9. `workspaces` - 4 edges
10. `HelloWorld` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (24 total, 3 thin omitted)

### Community 0 - "Env"
Cohesion: 0.23
Nodes (9): String, Symbol, DataKey, extend_balance_ttl(), extend_instance_ttl(), Address, Env, Token (+1 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (18): devDependencies, tsx, @types/express, @types/node, typescript, @types/node, typescript, name (+10 more)

### Community 2 - "dependencies"
Cohesion: 0.12
Nodes (17): dotenv, express, mppx, @stellar/mpp, dependencies, dotenv, express, mppx (+9 more)

### Community 3 - "package.json"
Cohesion: 0.12
Nodes (15): description, engines, node, name, private, scripts, graphify, lint (+7 more)

### Community 4 - "compilerOptions"
Cohesion: 0.14
Nodes (13): src/**/*, compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, resolveJsonModule (+5 more)

### Community 5 - "dependencies"
Cohesion: 0.15
Nodes (13): @creit.tech/stellar-wallets-kit, next, react, react-dom, @stellar/freighter-api, dependencies, @creit.tech/stellar-wallets-kit, next (+5 more)

### Community 6 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint, tailwindcss, devDependencies, eslint, tailwindcss, @types/node, @types/react, @types/react-dom (+5 more)

### Community 7 - "lib.rs"
Cohesion: 0.25
Nodes (7): Result, DataKey, Error, HelloWorld, Incremented, Address, Env

### Community 8 - "index.ts"
Cohesion: 0.27
Nodes (6): app, PORT, x402Middleware(), configs, horizon, rpc

### Community 9 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, start, typecheck (+1 more)

### Community 10 - "setup"
Cohesion: 0.33
Nodes (8): Address, Env, setup(), test_approve_and_transfer_from(), test_metadata(), test_mint_and_balance(), test_transfer(), TokenClient

### Community 11 - "stellar-config.ts"
Cohesion: 0.33
Nodes (4): configs, horizon, NetworkConfig, rpc

## Knowledge Gaps
- **76 isolated node(s):** `name`, `version`, `private`, `description`, `templates/frontend` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._