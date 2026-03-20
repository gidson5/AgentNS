const express = require('express');
const app = express();
const port = 8080;

/**
 * @title AgentNS CCIP-Read Off-chain Gateway
 * @dev Node.js server to resolve .agent.eth subdomains off-chain.
 */

app.use(express.json());

// Mock Registry for .agent.eth subdomains
// In production, this would query a Celo/IPFS database
const registry = {
    'arb-v2.agent.eth': {
        address: '0x3a2b8c4f1e9d7a5b3c2f1e8d7a4b9f1c',
        self_id: 'verified',
        capabilities: 'swap,arbitrage,bridge,uniswap-api'
    },
    'hedger-alpha.agent.eth': {
        address: '0x9f3c...b1a2',
        self_id: 'verified',
        capabilities: 'hedging,swap'
    },
    'dca-manager.agent.eth': {
        address: '0x7e4a...c3f4',
        self_id: 'pending',
        capabilities: 'dca,swap'
    }
};

/**
 * @dev CCIP-Read endpoint (EIP-3668)
 * Ethereum contract reverts with OffchainLookup which redirects here.
 */
app.get('/resolve/:name', (req, res) => {
    const { name } = req.params;
    console.log(`🔍 [CCIP-Read] Request for name: ${name}`);

    const profile = registry[name.toLowerCase()];
    if (profile) {
        console.log(`✅ [CCIP-Read] Resolved ${name} to ${profile.address}`);
        res.json({
            data: Buffer.from(profile.address.replace('0x', ''), 'hex').toString('hex'),
            ttl: 3600
        });
    } else {
        console.log(`❌ [CCIP-Read] Name not found: ${name}`);
        res.status(404).json({ error: 'Name not found' });
    }
});

// Mock ERC-8004 gateway
app.get('/profile/:cid', (req, res) => {
    const { cid } = req.params;
    console.log(`📦 [IPFS-Gateway] Requesting CID: ${cid}`);
    res.json({
        name: "Mock Agent",
        type: "ArbitrageAgent",
        network: "celo",
        cid: cid
    });
});

app.listen(port, () => {
    console.log(`🚀 CCIP-Read Gateway running at http://localhost:${port}`);
    console.log(`🚀 Off-chain resolver for .agent.eth subdomains active.`);
});
