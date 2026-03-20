// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgentRegistry
 * @dev Celo-side registry tracking agent metadata and capability flags.
 */
contract AgentRegistry {
    struct Agent {
        string name;
        address wallet;
        string profileCID;
        string capabilities;
        bool active;
    }

    mapping(address => Agent) public agents;
    address[] public agentAddresses;

    event AgentRegistered(address indexed wallet, string name, string profileCID);
    event CapabilityUpdated(address indexed wallet, string newCapabilities);

    function registerAgent(
        string memory _name,
        string memory _profileCID,
        string memory _capabilities
    ) external {
        if (agents[msg.sender].wallet == address(0)) {
            agentAddresses.push(msg.sender);
        }
        
        agents[msg.sender] = Agent({
            name: _name,
            wallet: msg.sender,
            profileCID: _profileCID,
            capabilities: _capabilities,
            active: true
        });

        emit AgentRegistered(msg.sender, _name, _profileCID);
    }

    function getAgentCount() external view returns (uint256) {
        return agentAddresses.length;
    }

    function deactivate() external {
        agents[msg.sender].active = false;
    }
}
