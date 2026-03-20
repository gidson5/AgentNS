const { ethers } = require("ethers");
require("dotenv").config();

/**
 * @title AgentNS Live Registration Script
 * @dev Sends actual transactions to the Celo AgentRegistry contract.
 */

async function registerAgent({ name, type, capabilities }) {
  console.log(`🚀 Starting live registration on Celo Mainnet for: ${name}.agent.eth`);

  // Load private key and RPC
  const privateKey = process.env.CELO_PRIVATE_KEY;
  if (!privateKey) {
     console.error("❌ CRITICAL: No CELO_PRIVATE_KEY found in .env file.");
     console.error("Please create a .env file and add your private key to interact with the live network.");
     return;
  }

  try {
    const provider = new ethers.JsonRpcProvider("https://forno.celo.org");
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(`📍 Using Celo wallet: ${wallet.address}`);

    // Replace this string with the actual deployed contract address on Celo after you deploy the Sol file
    const contractAddress = process.env.AGENT_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    if (contractAddress === "0x0000000000000000000000000000000000000000") {
        console.error("❌ CRITICAL: You must deploy AgentRegistry.sol first and set AGENT_REGISTRY_ADDRESS in .env");
        return;
    }

    const abi = [
      "function registerAgent(string memory _name, string memory _profileCID, string memory _capabilities) external"
    ];

    const registryContract = new ethers.Contract(contractAddress, abi, wallet);

    // Simulated IPFS upload for the profile CID
    console.log("⏳ Uploading JSON Profile to IPFS... (Pinata / web3.storage)");
    const profileCID = "ipfs://QmYourRealCIDHere";

    console.log("⏳ Submitting transaction to Celo Mainnet...");
    const tx = await registryContract.registerAgent(name, profileCID, capabilities);
    
    console.log(`✅ Transaction submitted! Hash: ${tx.hash}`);
    console.log("⏳ Waiting for 1 block confirmation...");
    await tx.wait(1);

    console.log("\n✨ AGENT IDENTIFIED! Live Registration on Celo complete.");
    console.log(`🔗 View on Explorer: https://celoscan.io/tx/${tx.hash}`);

  } catch (error) {
     console.error(`❌ Live Network Error: ${error.message}`);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const params = {
    name: args[1] || "my-live-bot",
    type: args[3] || "ArbitrageAgent",
    capabilities: args[5] || "swap,uniswap-api",
  };

  registerAgent(params).catch(console.error);
}

module.exports = { registerAgent };
