const { ethers } = require("ethers");

/**
 * @title AgentNS Live Celo TX Feed (Live Mainnet Version)
 * @dev Real-time activity stream reading actual blocks from Celo Mainnet.
 */

async function streamTransactions() {
    console.log(`🚀 Starting live activity stream reading blocks from Celo Mainnet...`);
    console.log(`🔗 RPC: https://forno.celo.org\n`);

    // Connect to the actual Celo Mainnet RPC
    const provider = new ethers.JsonRpcProvider("https://forno.celo.org");

    console.log("Listening for new blocks and transactions... (this may take a few seconds)\n");

    const txTypes = ["SWAP", "TRANSFER", "CONTRACT_CALL", "BRIDGE"];

    // Listen for every new block created on Celo
    provider.on("block", async (blockNumber) => {
        try {
            // Fetch the block with all transaction details
            const block = await provider.getBlock(blockNumber, true); 
            if (!block || !block.prefetchedTransactions) return;

            // For the feed, we'll grab up to 4 transactions from the block
            const txs = block.prefetchedTransactions.slice(0, 4);
            
            for (const tx of txs) {
                // Determine a pseudo-random tag based on the transaction data presence
                let type = "TRANSFER";
                if (tx.data !== "0x") type = "CONTRACT_CALL";
                if (tx.value === 0n && tx.data.length > 100) type = "SWAP"; // Rough heuristic
                
                // Real live transaction data
                const txHash = tx.hash;
                const value = ethers.formatEther(tx.value);
                const fromAddress = tx.from.slice(0, 6) + "..." + tx.from.slice(-4);
                const timestamp = new Date().toLocaleTimeString();

                // ANSI Color styling
                const color = (t) => {
                    switch(t) {
                        case "SWAP": return "\x1b[32m"; // Green
                        case "BRIDGE": return "\x1b[34m"; // Blue
                        case "CONTRACT_CALL": return "\x1b[35m"; // Magenta
                        case "TRANSFER": return "\x1b[33m"; // Yellow
                        default: return "\x1b[0m";
                    }
                };

                console.log(`[${timestamp}] \x1b[90mBlock ${blockNumber}\x1b[0m | ${color(type)}${type}\x1b[0m | Sender: ${fromAddress} | TX: ${txHash.slice(0, 10)}... | ${parseFloat(value).toFixed(4)} CELO`);
            }
        } catch (error) {
            console.error("Error reading block:", error.message);
        }
    });
}

// CLI usage
if (require.main === module) {
  streamTransactions();
}

module.exports = { streamTransactions };
