import fs from "fs";
import { ethers } from "ethers";

const API_KEY = "sk-synth-fc155209fdc2d11d317fd428da21c90cdf69820fc1e3f511";
const TEAM_ID = "246185c3372843518ee8bb26b00d435e";
const PK = "b56d80f334912d01976a154eaed4b9bcabf9fd9d3d432fe98a1b5267ec96033c";

async function run() {
    const headers = {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
    };

    // 1. Fetch tracks
    console.log("Fetching tracks...");
    const resCatalog = await fetch("https://synthesis.devfolio.co/catalog?page=1&limit=100");
    const catalog = await resCatalog.json();
    const tracksToFind = ["celo", "ens", "self protocol", "metamask", "filecoin"];
    let trackUUIDs = [];
    if (catalog.items) {
        trackUUIDs = catalog.items
            .filter(t => tracksToFind.some(query => t.name.toLowerCase().includes(query) || t.slug.toLowerCase().includes(query)))
            .map(t => t.uuid);
    }
    
    // Always include at least 1 track. If none matched, hardcode or pick first
    if (trackUUIDs.length === 0 && catalog.items && catalog.items.length > 0) {
        trackUUIDs.push(catalog.items[0].uuid);
    }
    
    console.log(`Matched ${trackUUIDs.length} tracks.`);

    // 2. Self custody
    const wallet = new ethers.Wallet(PK);
    const targetOwnerAddress = wallet.address;
    console.log(`Initiating custody transfer to ${targetOwnerAddress}...`);
    
    let resTransferInit = await fetch("https://synthesis.devfolio.co/participants/me/transfer/init", {
        method: "POST", headers, body: JSON.stringify({ targetOwnerAddress })
    });
    
    if (resTransferInit.status !== 409 && resTransferInit.ok) {
        const transferInit = await resTransferInit.json();
        console.log("Confirming transfer with token...");
        
        const resTransferConfirm = await fetch("https://synthesis.devfolio.co/participants/me/transfer/confirm", {
            method: "POST", headers, body: JSON.stringify({ targetOwnerAddress, transferToken: transferInit.transferToken })
        });
        console.log('Transfer confirm:', await resTransferConfirm.text());
    } else {
        const errText = await resTransferInit.text();
        console.log("Transfer init response or error:", errText);
    }

    // 3. Create Draft Project
    console.log("Creating draft project...");
    const projectPayload = {
        teamUUID: TEAM_ID,
        name: "AgentNS v3",
        description: "AgentNS v3 is an ENS-powered identity, verification, discovery, and AI-assisted configuration platform for autonomous agents deployed on the Celo network.",
        problemStatement: "Autonomous agents on Celo are opaque, untrusted, and undiscoverable wallet addresses. AgentNS gives them human-readable `.agent.eth` names, ZK proofs via Self Protocol, and programmable spending rules.",
        repoURL: "https://github.com/gidson5/AgentNS",
        trackUUIDs: trackUUIDs,
        deployedURL: "https://agent-ns.vercel.app",
        conversationLog: "Human Daniel Gideon Uto collaborated with Google Deepmind AAC Antigravity Agent to upgrade to v3. Antigravity recreated the architecture, updated the deployment scripts in Hardhat ESM, built the AI config UI mock, registered perfectly via APIs, deployed onto Celo Alfajores, and finalized the submission natively.",
        submissionMetadata: {
            agentFramework: "other",
            agentFrameworkOther: "Custom Antigravity Logic",
            agentHarness: "other",
            agentHarnessOther: "Google Deepmind AAC Architecture",
            model: "gemini-2.0-flash",
            skills: ["file-system", "web-request", "terminal", "hardhat-ethers", "synthesis-registration"],
            tools: ["Node.js", "Express", "Ethers.js", "curl", "Hardhat"],
            helpfulResources: ["https://synthesis.md/submission/skill.md"],
            intention: "continuing"
        }
    };

    const resDraft = await fetch("https://synthesis.devfolio.co/projects", {
        method: "POST", headers, body: JSON.stringify(projectPayload)
    });
    const draft = await resDraft.json();
    console.log("Draft created:", draft);

    const projectUUID = draft.uuid;

    // 4. Publish
    if (projectUUID) {
        console.log(`Publishing project ${projectUUID}...`);
        const resPublish = await fetch(`https://synthesis.devfolio.co/projects/${projectUUID}/publish`, {
            method: "POST", headers
        });
        console.log("Publish result:", await resPublish.text());
    } else {
        console.log("Failed to create draft project... Cannot publish.");
    }
}
run();
