const { ethers } = require("ethers");
require("dotenv").config();

/**
 * @title AgentNS Live ENS Resolution Script
 * @dev Queries actual ENS records on Ethereum Mainnet using ethers.js.
 * This reads real ENS text records if they exist.
 */

async function resolveAgent({ name }) {
  console.log(`🔍 Resolving Agent: ${name}`);
  console.log("⏳ Connecting to real Ethereum Mainnet RPC...");
  
  // Public RPC for demo (Use Alchemy/Infura for production)
  const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");

  try {
    const resolver = await provider.getResolver(name);
    
    if (!resolver) {
      console.log(`\n❌ Live Network Error: No ENS resolver found for ${name}.`);
      console.log(`(This means ${name} is not actually registered on Ethereum Mainnet yet!)`);
      return;
    }

    console.log(`⏳ Fetching actual address for ${name}...`);
    const address = await provider.resolveName(name);

    if (!address) {
       console.log(`❌ Name exists but does not resolve to an address.`);
       return;
    }

    console.log(`✅ Live Address: ${address}`);
    console.log("⏳ Fetching live ENS Text Records...");
    
    // Fetch specifically the text records needed by AgentNS
    const capabilities = await resolver.getText("capabilities");
    const selfIdRaw = await resolver.getText("self-id");
    const erc8004Raw = await resolver.getText("erc8004");
    const delegationRaw = await resolver.getText("delegation-rules");

    // Live display
    console.log(`\n=== 🔴 LIVE NETWORK PROFILE ===`);
    console.log(`Name:        ${name}`);
    console.log(`Address:     ${address}`);
    console.log(`ZK Self-ID:  ${selfIdRaw || "No 'self-id' text record found"}`);
    console.log(`Capabilities:${capabilities || "No 'capabilities' text record found"}`);
    console.log(`ERC-8004 CID:${erc8004Raw || "No 'erc8004' text record found"}`);
    console.log(`Delegation:  ${delegationRaw || "No 'delegation-rules' text record found"}`);
    console.log(`================================`);

    return { address, capabilities, selfIdRaw, erc8004Raw, delegationRaw };
    
  } catch (error) {
     console.error("\n❌ Error resolving ENS name on live network:");
     console.error(error.message);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  // Default to vitalik.eth if nothing provided, just to show it reads real data
  const name = args[1] || "vitalik.eth"; 
  resolveAgent({ name }).catch(console.error);
}

module.exports = { resolveAgent };
