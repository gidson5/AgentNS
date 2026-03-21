# AgentNS v3 — ENS Identity, Discovery & AI Configuration for Celo Agents

> Hackathon project for the Synthesis × Celo Hackathon · March 2026
> Track: Best Agent on Celo | ENS Identity | ENS Open Track | Self Protocol | MetaMask Delegation | Filecoin

---

## Project Overview

**AgentNS v3** is an ENS-powered identity, verification, discovery, and AI-assisted configuration platform for autonomous agents deployed on the Celo network.

It gives every Celo agent:
- A human-readable `.agent.eth` ENS name resolvable across all of Ethereum
- A structured ERC-8004 profile stored on Filecoin/IPFS
- A ZK human-verification badge via Self Protocol (sybil-resistant)
- Programmable spending rules stored in ENS text records via MetaMask Delegation
- Capability flags for agent-to-agent (A2A) discovery in Virtuals ACP workflows
- A live Celo RPC transaction feed
- **An AI assistant powered by Claude** that configures all of the above via natural language

AgentNS v3 is the identity infrastructure layer the Celo agent economy needs — now with an AI brain that makes it accessible to any builder, not just Web3 experts.

---

## Problem Statement

Autonomous agents on Celo are identified by wallet addresses like `0x3a2b8c4f...` — opaque, untrusted, and undiscoverable. There is no standard way to:

1. Give an agent a human-readable, memorable name
2. Verify the human behind an agent (sybil farms are trivial to spin up)
3. Discover agents by capability for agent-to-agent workflows
4. Enforce portable, auditable spending rules on a delegated agent wallet
5. Monitor an agent's on-chain activity in real time
6. Configure all of the above without deep Web3 expertise

AgentNS v3 solves all six problems.

---

## What's New in v3

v3 adds a fully functional **AI Agent Assistant** powered by Claude (claude-sonnet-4-20250514):

- Chat with the assistant in plain English to describe your agent
- The assistant recommends an ENS name, agent type, capability flags, and delegation rules
- Suggestions are rendered as a structured config card
- One click applies the entire config directly to the registration form
- Multi-turn conversation with full chat history
- 6 pre-built prompt chips for instant demo

This transforms AgentNS from an infrastructure tool into an **AI-powered agent onboarding platform** — directly targeting the Best Agent on Celo track.

---

## Live Demo

🌐 **https://agent-ns.vercel.app/**

---

## Architecture

```
User / DApp / Other Agent
        │
        ▼
   AgentNS v3 (Frontend + AI)
        │
   ┌────┴──────────────────────────────────────┐
   │                                            │
   ▼                                            ▼
Claude AI (Anthropic API)             ENS Registry (Ethereum)
  └─ Natural language config            └─ agent.eth subdomains
  └─ Agent type recommendation          └─ ERC-8004 profile CID
  └─ Capability suggestions             └─ Delegation rules (text)
  └─ Delegation rule generation         └─ CCIP-Read → Celo address
        │                                            │
        └──────────────┬─────────────────────────────┘
                       │
                       ▼
                 Celo Network
                 └─ Alfajores Testnet (dev)
                 └─ Mainnet (production)
                 └─ Agent wallets + tx history
                 └─ MetaMask Delegation (onchain rules)
                 └─ Live TX feed via Celo RPC
                       │
                       ▼
               IPFS / Filecoin
               └─ ERC-8004 profile JSON
               └─ Capability manifest
               └─ Censorship-resistant storage
                       │
                       ▼
             Self Protocol (ZK)
             └─ zk-SNARK / Groth16 proof
             └─ Sybil score
             └─ Attestation ID → ENS text record
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI Assistant | Claude claude-sonnet-4-20250514 (Anthropic API) |
| Identity & Naming | ENS · `@ensdomains/ensjs` · ERC-8004 |
| ZK Verification | Self Protocol · zk-SNARK / Groth16 |
| Delegation | MetaMask Delegation Toolkit · Smart Accounts Kit |
| Blockchain | Celo Alfajores (testnet) / Celo Mainnet |
| Cross-chain Resolution | CCIP-Read · EIP-3668 |
| Decentralized Storage | IPFS · Filecoin |
| Agent Commerce | Virtuals ACP |
| Agent Framework | Olas Stack · Pearl |
| RPC Provider | Alchemy (Celo Alfajores) |
| Hosting | Vercel |
| Frontend | HTML · CSS · JS · IBM Plex Mono · Epilogue |

---

## Features

### 1. Agent Lookup
Resolve any `.agent.eth` name to its full Celo agent profile via CCIP-Read:
- Celo wallet address
- Agent type and description
- Registration date and live status
- Capabilities list
- ERC-8004 IPFS profile CID
- Self Protocol ZK verification badge
- MetaMask Delegation rules summary
- Olas Registry ID

### 2. Agent Registration
Register a new agent identity end-to-end:
- Reserve ENS subdomain under `agent.eth`
- Select agent type, description, and capability flags
- Profile pinned to Filecoin via IPFS, CID stored in ENS text record
- Self Protocol ZK attestation requested automatically
- Transaction confirmed on Celo Alfajores / Mainnet

### 3. Agent Registry
Live browsable directory of all registered Celo agents with status indicators.

### 4. Self Protocol ZK Verification *(+$1K bounty)*
- ZK proof validity bars and sybil scores per agent
- zk-SNARK circuit (Groth16) via Self Protocol SDK
- Attestation stored as ENS text record: `self-id=verified`
- Cross-chain: valid on Ethereum, Celo, and all EVM chains

### 5. Agent-to-Agent (A2A) Discovery
- Filter registry by capability flags
- Enables Virtuals ACP cross-chain agent commerce
- Agents discover each other by name, not hardcoded address

**Example:**
```
arb-v2.agent.eth needs a bridge
  → queries AgentNS: capability="Bridge" AND "ACP Enabled"
  → discovers oracle-prime.agent.eth
  → resolves ENS → Celo address
  → initiates ACP commerce flow
```

### 6. Live Celo TX Feed
- Real-time transaction stream via Celo RPC
- Types: SWAP, BRIDGE, HEDGE, DCA, FEED
- Filterable by agent ENS name
- Full auditability and transparency

### 7. MetaMask Delegation Rules *(bounty eligible)*
- Daily spending caps, per-TX limits, monthly ceilings
- Time windows and timezone configuration
- Approved contract address whitelist
- Rules stored as JSON in ENS `delegation-rules` text record
- Enforced on-chain via MetaMask Smart Accounts Kit

### 8. AI Agent Assistant *(Best Agent on Celo)*
Powered by Claude claude-sonnet-4-20250514:
- Natural language agent configuration
- Recommends ENS name, type, capabilities, delegation rules
- Renders structured config card with one-click form fill
- Multi-turn conversation with full context
- 6 prompt chips for instant demo:
  - "I want to build an FX hedging bot on Celo"
  - "What ENS name should I pick for an arbitrage agent?"
  - "Suggest delegation rules for a $500/day trading bot"
  - "Explain ERC-8004 and why my agent needs it"
  - "How do I make my agent sybil-resistant?"
  - "What capabilities should a DCA agent have?"

---

## ENS Integration Details

### Subdomain Namespace
```
arb-v2.agent.eth
hedger-alpha.agent.eth
dca-manager.agent.eth
oracle-prime.agent.eth
```

### ENS Text Records
| Key | Value |
|---|---|
| `erc8004` | `ipfs://Qm...` — ERC-8004 profile CID (Filecoin) |
| `self-id` | `verified` or `pending` — Self Protocol attestation |
| `delegation-rules` | JSON — MetaMask spending/time rules |
| `olas-id` | Registry ID on Olas Stack |
| `capabilities` | Comma-separated capability flags |
| `ai-configured` | `true` — configured via AgentNS AI assistant |

### ERC-8004 Profile Schema
```json
{
  "name": "arb-v2.agent.eth",
  "type": "ArbitrageAgent",
  "version": "3.0.0",
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
  "ai_configured": true,
  "olas_id": "#0042",
  "description": "Monitors USDT/cUSD spread and executes cross-chain arbitrage via Uniswap Trading API on Celo.",
  "registered": "2026-03-21T00:00:00Z",
  "erc8004": true
}
```

### CCIP-Read (EIP-3668)
ENS names on Ethereum mainnet resolve to Celo addresses via a CCIP-Read off-chain gateway — no bridging required.

---

## Bounty Alignment

| Bounty | Prize | Qualification |
|---|---|---|
| **ENS Identity** | $600 | Every agent gets a `.agent.eth` ENS name with rich text records |
| **ENS Open Track** | +prize | Novel use of ENS as agent identity + delegation + AI configuration layer |
| **Self Protocol** | +$1K | ZK attestation integrated into every agent profile |
| **MetaMask Delegation** | +bounty | Spending rules stored in ENS, enforced via Smart Accounts Kit |
| **Best Agent on Celo** | $3K | AI-powered identity infrastructure for the Celo agent economy |
| **Filecoin** | +prize | All ERC-8004 profiles pinned to Filecoin via IPFS |

**Total stackable prize potential: $4,600+ across 6 bounties.**

---

## Project Structure

```
agentns/
├── CLAUDE.md                        # This file
├── index.html                       # agentns-v3 — full frontend
├── contracts/
│   ├── AgentRegistry.sol            # Celo-side registry contract
│   ├── AgentResolver.sol            # CCIP-Read resolver: ENS → Celo
│   └── DelegationEnforcer.sol       # MetaMask Delegation rules enforcer
├── scripts/
│   ├── deploy.js                    # Deploy contracts to Celo Alfajores
│   ├── register.js                  # ENS subdomain registration
│   ├── resolve.js                   # Resolution helper
│   ├── self-verify.js               # Self Protocol ZK attestation
│   └── set-delegation.js            # Write delegation rules to ENS text record
├── gateway/
│   └── server.js                    # CCIP-Read off-chain gateway (Node.js)
├── api/
│   └── claude.js                    # Claude API proxy (server-side, hides API key)
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
Celo wallet with CELO (get from faucet.celo.org for Alfajores)
Alchemy account → create app for "Celo Alfajores"
Anthropic API key (for AI assistant)
Self Protocol developer account
```

### Install
```bash
git clone https://github.com/yourhandle/agentns
cd agentns
npm install
```

### Environment Variables
```bash
cp .env.example .env
# Fill in:
ALCHEMY_URL=https://celo-alfajores.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### Deploy Contracts to Celo Alfajores
```bash
node scripts/deploy.js
# → AgentRegistry deployed: 0x...
# → AgentResolver deployed: 0x...
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
# → ai-configured: true
```

### Run the CCIP-Read Gateway
```bash
cd gateway && node server.js --port 8080 --network celo-alfajores
```

---

## AI Assistant — Claude Integration

The AI assistant uses the Anthropic Messages API with a custom system prompt that makes Claude an expert in ENS, ERC-8004, Self Protocol, MetaMask Delegation, and the Celo ecosystem.

### System Prompt Summary
Claude is instructed to:
- Act as AgentNS Assistant
- Respond to agent descriptions with concrete ENS name, type, capability, and delegation recommendations
- Output structured `<agentconfig>` JSON blocks that the frontend parses and renders as one-click config cards
- Keep responses concise and Web3-practical

### API Proxy (Production)
For production deployment, the Claude API call is proxied through `/api/claude.js` to keep the API key server-side. The frontend calls your own backend, which calls Anthropic.

```javascript
// api/claude.js (Vercel serverless function)
export default async function handler(req, res) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
}
```

---

## Demo Walkthrough

Visit **https://agent-ns.vercel.app/** and:

1. **Lookup** → type `arb-v2` → hit Resolve → see full profile with ZK badge and delegation rules
2. **Register** → click Fill Demo → hit Register → watch the terminal flow
3. **Registry** → browse all agents, click any to resolve
4. **Delegation** → adjust daily limit, toggle 24/7 mode, save to ENS
5. **A2A Discovery** → filter agents by capability
6. **Live TX Feed** → watch real-time SWAP/BRIDGE/HEDGE stream in
7. **✦ Agent AI** → type *"I want to build an FX hedging bot with a $500 daily limit"* → watch Claude configure everything → click Apply to form

---

## Why AgentNS v3 Wins

**vs. other ENS projects:** AgentNS is not just resolving names — it stores capability manifests, delegation rules, ZK attestations, and Olas IDs in ENS text records, making ENS the single source of truth for the entire agent identity.

**vs. Self Agent ID:** AgentNS is not competing with Self Agent ID — it is the naming and discovery layer that sits on top of it. Self Agent ID answers "is this agent human-backed?" AgentNS answers "what is this agent called, what can it do, and how do other agents find it?"

**vs. other Celo agents:** Most submissions are individual agents. AgentNS is the infrastructure that makes all Celo agents more trustworthy and discoverable — a multiplier on the entire ecosystem.

**The AI angle:** The Claude-powered assistant is not decorative. It solves a real onboarding problem — most builders don't know what ENS text records to set, what capabilities to enable, or what delegation limits are reasonable. The AI removes that friction entirely.

ENS was built for humans. AgentNS extends it for the machines — and now has an AI to help the humans configure the machines.

---

## Deployed Contracts (Celo Alfajores)

| Contract | Address |
|---|---|
| AgentRegistry | *[Insert after deployment]* |
| AgentResolver | *[Insert after deployment]* |
| DelegationEnforcer | *[Insert after deployment]* |

---

## Team
Built solo for the **Synthesis × Celo Hackathon** · March 2026

---

## Links
- 🌐 Live App: https://agent-ns.vercel.app/
- 💻 GitHub: *[Insert GitHub URL]*
- 📄 Docs: This file
- 🔗 Celo Explorer: *[Insert Alfajores contract link]*

---

## License
MIT
