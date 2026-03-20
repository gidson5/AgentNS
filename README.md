# AgentNS
# AgentNS v2 — ENS Identity for Celo Agents

> Hackathon project for the Synthesis × Celo Hackathon
> Track: Best Agent on Celo | ENS Identity Bounty | ENS Open Track

---

## Project Overview

**AgentNS** is an ENS-powered identity, verification, and registry layer for autonomous agents deployed on the Celo network. It gives every Celo agent a human-readable `.agent.eth` name, a ZK-verified identity, programmable spending rules, and a capability-indexed discovery layer — making agents trustworthy, composable, and discoverable across the entire Ethereum ecosystem.

Built on ENS + ERC-8004 + Self Protocol + MetaMask Delegation Toolkit + Celo, AgentNS is the identity infrastructure layer the Celo agent economy needs.

---

## Problem Statement

Autonomous agents on Celo are identified by wallet addresses like `0x3a2b8c4f...` — opaque, untrusted, and undiscoverable. There is no standard way to:

- Know what an agent does or what it's capable of
- Verify the human behind an agent (sybil resistance)
- Discover agents by capability for agent-to-agent workflows
- Enforce programmable spending rules on an agent's behalf
- Monitor an agent's on-chain activity in real time

AgentNS solves all five problems in a single identity layer.

---

## Solution Architecture

```
User / DApp / Other Agent
         │
         ▼
  AgentNS Frontend
         │
    ┌────┴──────────────────────────────────┐
    │                                        │
    ▼                                        ▼
ENS Registry (Ethereum)            Self Protocol (ZK)
  └─ agent.eth subdomains             └─ zk-SNARK proof
  └─ ERC-8004 profile CID             └─ sybil score
  └─ Delegation rules (text)          └─ attestation ID
  └─ CCIP-Read → Celo address         └─ stored in ENS text
         │
         ▼
  Celo Mainnet
  └─ Agent wallet + tx history
  └─ MetaMask Delegation rules (onchain)
  └─ Live TX feed (RPC)
         │
         ▼
  IPFS / Filecoin
  └─ ERC-8004 profile JSON
  └─ Capability manifest
  └─ Censorship-resistant storage
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Identity & Naming | ENS (`@ensdomains/ensjs`) · ERC-8004 |
| ZK Verification | Self Protocol (zk-SNARK / Groth16) |
| Delegation | MetaMask Delegation Toolkit (Smart Accounts Kit) |
| Smart Chain | Celo Mainnet |
| Cross-chain Resolution | CCIP-Read (EIP-3668) |
| Profile Storage | IPFS / Filecoin |
| Agent Commerce | Virtuals ACP (agent-to-agent) |
| Autonomous Agents | Olas Stack (Pearl) |
| Frontend | Vanilla HTML/CSS/JS · IBM Plex Mono · Epilogue |

---

## Features

### 1. Agent Lookup
Resolve any `.agent.eth` name to its full Celo agent profile:
- Celo wallet address (via CCIP-Read)
- Agent type and description
- Registration date and live status
- Capabilities list
- ERC-8004 IPFS profile CID
- ZK verification badge (Self Protocol)
- MetaMask Delegation rules summary
- Olas Registry ID

### 2. Agent Registration
Register a new agent identity end-to-end:
- Reserve ENS subdomain under `agent.eth`
- Select agent type and write description
- Toggle capability flags (Swap, Bridge, Arbitrage, Hedging, Self ZK ID, MetaMask Delegation, Filecoin Storage, Olas Registered, ACP Enabled, Uniswap API)
- Profile pinned to Filecoin via IPFS, CID stored in ENS text record
- Self Protocol ZK attestation requested automatically on registration
- Transaction confirmed on Celo

### 3. Agent Registry
Live, browsable directory of all registered Celo agents:
- ENS name + Celo address
- Agent type and capability tags
- Live/Idle status indicator
- Click-to-resolve for instant full profile

### 4. Self Protocol ZK Verification *(+$1K bounty)*
Human-backed sybil resistance for every registered agent:
- Each agent displays a ZK proof validity bar and sybil score
- Scores computed via zk-SNARK circuit (Groth16) through Self Protocol
- Attestation ID stored as ENS text record: `self-id=verified`
- Agents without attestation flagged as `⚠ Pending` in all views
- Lookup panel shows real-time verified/unverified badge per agent
- Terminal simulates full proof generation and submission flow
- Cross-chain: proof valid on Ethereum, Celo, and any EVM chain

**Why this matters:** In ACP (agent-to-agent commerce) workflows, agents need to know if they're dealing with a human-backed agent or a bot farm. Self Protocol ZK ID stored in ENS makes this verifiable without revealing identity.

### 5. Agent-to-Agent (A2A) Discovery
Capability-indexed registry enabling agent-to-agent commerce:
- Filter all registered agents by specific capability flags
- Supported filters: Swap, Bridge, Arbitrage, Hedging, Self ZK ID, ACP Enabled, Olas, Uniswap API
- Click any discovered agent to resolve its full ENS profile
- Enables Virtuals ACP workflows: an arbitrage agent can discover and call a liquidity agent by capability, not by hardcoded address
- Foundation for a decentralized agent marketplace on Celo

**Example workflow:**
```
arb-v2.agent.eth needs liquidity
  → queries AgentNS: find agents with capability="Bridge" AND "ACP Enabled"
  → discovers oracle-prime.agent.eth
  → resolves ENS → Celo address
  → initiates ACP cross-chain commerce flow
```

### 6. Live Celo TX Feed
Real-time activity stream per agent:
- Auto-streams live transactions across all registered agents (3.5s intervals)
- Transaction types: SWAP, BRIDGE, HEDGE, DCA, FEED
- Each entry shows: type, agent ENS name, tx hash, amount, timestamp
- Filterable by agent name in real time
- Backed by Celo RPC (simulated in demo, wired to `celo-mainnet` RPC in production)
- Makes agent activity auditable and transparent — trust through visibility

### 7. MetaMask Delegation Rules *(bounty eligible)*
Programmable, rule-based spending permissions stored in ENS:
- **Spending Limits:** Daily cap, per-transaction maximum, monthly ceiling
- **Time Windows:** Active hours, timezone, weekday/weekend restrictions
- **Approved Addresses:** Whitelist of contracts the agent can interact with (Uniswap Router, Celo Bridge, etc.)
- Rules saved as structured JSON in ENS text record (`delegation-rules`)
- Enforced on-chain via MetaMask Smart Accounts Kit
- Live slider and toggle UI for editing rules without touching code
- JSON preview updates in real time as rules change

**Why ENS + Delegation:** Storing delegation rules in ENS text records makes them portable, human-readable, and auditable by any contract or agent that can resolve ENS — no proprietary registry needed.

---

## ENS Integration Details

### Subdomain Namespace
All agents are registered under `agent.eth`:
```
arb-v2.agent.eth
hedger-alpha.agent.eth
dca-manager.agent.eth
oracle-prime.agent.eth
```

### ENS Text Records Used
| Key | Value |
|---|---|
| `erc8004` | `ipfs://Qm...` — ERC-8004 profile CID |
| `self-id` | `verified` or `pending` — Self Protocol attestation |
| `delegation-rules` | JSON — MetaMask spending/time rules |
| `olas-id` | Registry ID on Olas Stack |
| `capabilities` | Comma-separated capability flags |

### ERC-8004 Profile Schema
```json
{
  "name": "arb-v2.agent.eth",
  "type": "ArbitrageAgent",
  "version": "2.0.0",
  "network": "celo",
  "address": "0x3a2b8c4f1e9d7a5b3c2f1e8d7a4b9f1c",
  "capabilities": ["swap", "bridge", "arbitrage", "uniswap-api"],
  "self_protocol": {
    "verified": true,
    "sybil_score": 0.06,
    "attestation_id": "self://0x9f3c...b1a2",
    "proof_type": "groth16"
  },
  "delegation": {
    "daily_limit": "500 USDT",
    "per_tx_max": "150 USDT",
    "hours": "08:00-22:00",
    "approved": ["uniswap-router", "celo-bridge"],
    "enforce_onchain": true
  },
  "olas_id": "#0042",
  "description": "Monitors USDT/cUSD spread and executes cross-chain arbitrage via Uniswap Trading API on Celo.",
  "registered": "2026-03-18T00:00:00Z",
  "erc8004": true
}
```

### CCIP-Read (EIP-3668)
ENS names registered on Ethereum mainnet resolve to Celo addresses via a CCIP-Read off-chain gateway — no bridging, no duplication.

---

## Bounty Alignment

| Bounty | Prize | How AgentNS qualifies |
|---|---|---|
| **ENS Identity** | $600 | Every agent gets a portable `.agent.eth` ENS name with rich text records |
| **ENS Open Track** | +prize | Novel use of ENS as a full agent identity + delegation + discovery layer |
| **Self Protocol** | +$1K | ZK human verification integrated into every agent's ENS profile |
| **MetaMask Delegation** | +bounty | Spending limits and time windows stored in ENS, enforced via Smart Accounts Kit |
| **Best Agent on Celo** | $3K | Identity infrastructure powering the entire Celo agent economy |
| **Filecoin** | +prize | All ERC-8004 profiles pinned to Filecoin via IPFS, censorship-resistant |

**Maximum stackable prize potential: $4,600+ across 6 bounties from a single build.**

---

## Project Structure

```
agentns/
├── CLAUDE.md                        # This file
├── agentns-v2.html                  # Full frontend (lookup, register, registry,
│                                    #   Self ZK, A2A discovery, TX feed, delegation)
├── contracts/
│   ├── AgentRegistry.sol            # Celo-side registry contract
│   ├── AgentResolver.sol            # CCIP-Read resolver: ENS → Celo
│   └── DelegationEnforcer.sol       # MetaMask Delegation rules enforcer
├── scripts/
│   ├── register.js                  # ENS subdomain registration
│   ├── resolve.js                   # Resolution helper
│   ├── self-verify.js               # Self Protocol ZK attestation
│   └── set-delegation.js            # Write delegation rules to ENS text record
├── gateway/
│   └── server.js                    # CCIP-Read off-chain gateway (Node.js)
├── profiles/
│   └── schema.json                  # ERC-8004 profile JSON schema
└── feeds/
    └── tx-feed.js                   # Celo RPC live transaction feed
```

---

## Getting Started

### Prerequisites
```bash
node >= 18
npm >= 9
A Celo wallet with CELO for gas
Self Protocol developer account
```

### Install
```bash
git clone https://github.com/yourhandle/agentns
cd agentns
npm install
```

### Register an Agent
```bash
node scripts/register.js \
  --name "my-arb-bot" \
  --address "0x..." \
  --type "ArbitrageAgent" \
  --capabilities "swap,arbitrage,bridge,uniswap-api" \
  --self-verify true
```

### Set Delegation Rules
```bash
node scripts/set-delegation.js \
  --name "my-arb-bot" \
  --daily-limit "500 USDT" \
  --per-tx "150 USDT" \
  --hours "08:00-22:00" \
  --approved "uniswap-router,celo-bridge"
```

### Resolve an Agent
```bash
node scripts/resolve.js --name "arb-v2.agent.eth"
# → address: 0x3a2b8c4f...
# → self-id: verified (sybil score: 0.06)
# → delegation: daily 500 USDT · 08:00-22:00
# → capabilities: swap, arbitrage, bridge, uniswap-api
```

### Run the CCIP-Read Gateway
```bash
cd gateway && node server.js --port 8080 --network celo
```

### Start the Live TX Feed
```bash
cd feeds && node tx-feed.js --rpc https://forno.celo.org
```

---

## Demo Walkthrough

Open `agentns-v2.html` in any browser:

1. **Lookup** → type `arb-v2` → hit *Resolve* to see full profile with ZK badge and delegation rules
2. **Register** → click *Fill Demo* → hit *Register* to watch the full terminal flow including Filecoin pin + Self ZK attestation
3. **Registry** → browse all agents, click any to resolve
4. **Self ZK ID** → view proof bars and sybil scores per agent → click *Verify New Agent* for terminal demo
5. **A2A Discovery** → click capability filters to find agents by what they can do
6. **Live TX Feed** → watch real-time SWAP/BRIDGE/HEDGE/DCA transactions stream in
7. **Delegation** → switch agents, adjust daily limit slider, toggle 24/7 mode, save rules to ENS

---

## Why This Matters

The Celo agent economy is growing fast. But agents are still just addresses. With AgentNS:

- A DeFi protocol can **discover** the best arbitrage agent by capability, not address
- A user can **trust** an agent because its ZK proof is verifiable on-chain via Self Protocol
- An agent can **identify itself** to other agents in Virtuals ACP cross-chain workflows
- Spending rules are **transparent** — stored in ENS, auditable by anyone
- Developers can **build on top** — ENS names compose across all of Ethereum

This is not just a project. It is identity infrastructure for the agent economy.

ENS was built for humans. AgentNS extends it for the machines.

---

## Team

Built for the **Synthesis × Celo Hackathon**
Bounties targeted: ENS Identity ($600) · ENS Open Track · Self Protocol (+$1K) · MetaMask Delegation · Best Agent on Celo ($3K) · Filecoin

---

## License

MIT
