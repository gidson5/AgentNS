// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DelegationEnforcer
 * @dev On-chain enforcer for MetaMask Delegation rules (spending limits, time windows).
 */
contract DelegationEnforcer {

    struct Rules {
        uint256 dailyLimit;
        uint256 currentDailySpent;
        uint256 startHour;
        uint256 endHour;
        uint256 lastResetTimestamp;
        bool isActive;
    }

    mapping(address => Rules) public rules;

    event RuleUpdated(address indexed agent, uint256 dailyLimit, uint256 startHour, uint256 endHour);
    event TransactionExecuted(address indexed agent, address indexed recipient, uint256 amount);

    function setRules(
        uint256 _dailyLimit,
        uint256 _startHour,
        uint256 _endHour
    ) external {
        rules[msg.sender] = Rules({
            dailyLimit: _dailyLimit,
            currentDailySpent: 0,
            startHour: _startHour,
            endHour: _endHour,
            lastResetTimestamp: block.timestamp,
            isActive: true
        });

        emit RuleUpdated(msg.sender, _dailyLimit, _startHour, _endHour);
    }

    /**
     * @dev Checks if the execution is valid based on stored rules.
     */
    function validateAndExecute(
        address _agent,
        uint256 _amount,
        address _recipient
    ) external returns (bool) {
        Rules storage r = rules[_agent];
        require(r.isActive, "No rules set for this agent");

        // Daily limit reset (24h period)
        if (block.timestamp > r.lastResetTimestamp + 1 days) {
            r.currentDailySpent = 0;
            r.lastResetTimestamp = block.timestamp;
        }

        require(r.currentDailySpent + _amount <= r.dailyLimit, "Daily spending limit exceeded");
        
        // Time window check (simplified hour check)
        uint256 hour = (block.timestamp / 3600) % 24;
        require(hour >= r.startHour && hour < r.endHour, "Outside allowed active hours");

        r.currentDailySpent += _amount;
        emit TransactionExecuted(_agent, _recipient, _amount);
        return true;
    }
}
