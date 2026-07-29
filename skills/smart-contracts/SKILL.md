---
name: smart-contracts
description: "Stellar smart contract development (Rust, soroban-sdk). Entry point with project setup, contract anatomy, and build/deploy workflow."
version: 0.2.0
---

# Smart Contracts (Soroban)

## Source Files (published with this skill)

| File | Contents |
|------|----------|
| `contracts/hello-world/src/lib.rs` | Minimal contract — `__check_auth`, `hello`, `try_at` |
| `contracts/hello-world/src/test.rs` | Unit test for hello-world |
| `contracts/token/src/lib.rs` | SEP-41 token (name, symbol, decimals, balance_of, transfer, mint, burn) |
| `contracts/token/src/test.rs` | Token unit tests |

## Patterns

- `contracts/hello-world/` — minimal scaffold for new contracts (start here)
- `contracts/token/` — full SEP-41 token implementation (reference for storage, auth, events)
