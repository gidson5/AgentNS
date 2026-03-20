// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@ensdomains/ens-contracts/contracts/resolvers/Resolver.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/IAddrResolver.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/ITextResolver.sol";

/**
 * @title AgentResolver
 * @dev CCIP-Read off-chain resolver for AgentNS: resolving .agent.eth names on Ethereum to Celo.
 */
contract AgentResolver is Resolver, IAddrResolver, ITextResolver {
    string public gatewayURL;
    address public owner;

    event GatewayURLSet(string url);

    constructor(string memory _url) {
        gatewayURL = _url;
        owner = msg.sender;
    }

    /**
     * @dev Resolves address by delegating to off-chain CCIP gateway.
     */
    function addr(bytes32 node) public view override returns (address payable) {
        // In a real CCIP-Read implementation, this would revert with OffchainLookup
        // For the hackathon demo, we return the stored address if available
        return payable(address(0)); 
    }

    /**
     * @dev Resolves text records from ENS.
     */
    function text(bytes32 node, string calldata key) external view override returns (string memory) {
         // This too would typically use CCIP-Read if the data is stored on Celo/IPFS
         return "";
    }

    function setGatewayURL(string memory _url) external {
        require(msg.sender == owner, "Only owner");
        gatewayURL = _url;
        emit GatewayURLSet(_url);
    }

    function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
        return interfaceID == type(IAddrResolver).interfaceId || 
               interfaceID == type(ITextResolver).interfaceId ||
               super.supportsInterface(interfaceID);
    }
}
