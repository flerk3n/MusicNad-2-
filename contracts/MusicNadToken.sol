// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MusicNadGame is Ownable, ReentrancyGuard {
    mapping(address => uint256) public playerScores;
    mapping(address => uint256) public gamesPlayed;
    mapping(address => string) public favoriteGenres;
    
    uint256 public totalTokensRewarded;
    uint256 public totalGamesPlayed;
    
    event TokensRewarded(address indexed player, uint256 amount, uint256 score, string genre);
    event GameCompleted(address indexed player, uint256 score, string genre);
    event FundsDeposited(address indexed sender, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor() {
        _transferOwnership(msg.sender);
    }
    
    // Allow owner to deposit MON tokens to fund rewards
    function depositFunds() external payable onlyOwner {
        require(msg.value > 0, "Must deposit some MON tokens");
        emit FundsDeposited(msg.sender, msg.value);
    }
    
    // Reward player with MON tokens
    function rewardPlayer(
        address player, 
        uint256 score, 
        string memory genre
    ) public onlyOwner nonReentrant {
        require(player != address(0), "Invalid player address");
        require(score > 0, "Score must be positive");
        require(bytes(genre).length > 0, "Genre required");
        
        // Calculate reward amount (0.1 MON per point)
        // This gives reasonable rewards: 5 points = 0.5 MON
        uint256 rewardAmount = (score * 1 ether) / 10; // 0.1 MON per point
        
        require(address(this).balance >= rewardAmount, "Insufficient contract balance");
        
        // Update player stats
        playerScores[player] += score;
        gamesPlayed[player] += 1;
        favoriteGenres[player] = genre; // Store latest genre played
        
        // Update global stats
        totalTokensRewarded += rewardAmount;
        totalGamesPlayed += 1;
        
        // Transfer MON tokens to player
        (bool success, ) = payable(player).call{value: rewardAmount}("");
        require(success, "Token transfer failed");
        
        emit TokensRewarded(player, rewardAmount, score, genre);
        emit GameCompleted(player, score, genre);
    }
    
    function getPlayerStats(address player) external view returns (
        uint256 totalScore, 
        uint256 totalGames, 
        string memory favoriteGenre,
        uint256 monBalance
    ) {
        return (
            playerScores[player], 
            gamesPlayed[player], 
            favoriteGenres[player],
            player.balance
        );
    }
    
    function getGlobalStats() external view returns (
        uint256 totalRewards,
        uint256 totalGames,
        uint256 contractBalance,
        uint256 ownerBalance
    ) {
        return (
            totalTokensRewarded,
            totalGamesPlayed,
            address(this).balance,
            owner().balance
        );
    }
    
    // Emergency withdraw function for owner
    function withdrawFunds(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= address(this).balance, "Insufficient balance");
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), amount);
    }
    
    // Withdraw all funds
    function withdrawAllFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    // Emergency pause functionality
    bool public gamesPaused;
    
    function pauseGames() external onlyOwner {
        gamesPaused = true;
    }
    
    function unpauseGames() external onlyOwner {
        gamesPaused = false;
    }
    
    modifier whenNotPaused() {
        require(!gamesPaused, "Games are paused");
        _;
    }
    
    function rewardPlayerWhenActive(
        address player, 
        uint256 score, 
        string memory genre
    ) external onlyOwner whenNotPaused {
        rewardPlayer(player, score, genre);
    }
    
    // Get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Fallback function to receive MON tokens
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
} 