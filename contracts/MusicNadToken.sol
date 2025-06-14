// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MusicNadToken is ERC20, Ownable, ReentrancyGuard {
    mapping(address => uint256) public playerScores;
    mapping(address => uint256) public gamesPlayed;
    mapping(address => string) public favoriteGenres;
    
    uint256 public totalTokensRewarded;
    uint256 public totalGamesPlayed;
    
    event TokensRewarded(address indexed player, uint256 amount, uint256 score, string genre);
    event GameCompleted(address indexed player, uint256 score, string genre);
    
    constructor() ERC20("MusicNadToken", "MNAD") {
        _transferOwnership(msg.sender);
        _mint(msg.sender, 1000000 * 10 ** decimals()); // 1M initial supply
    }
    
    function rewardPlayer(
        address player, 
        uint256 score, 
        string memory genre
    ) public onlyOwner nonReentrant {
        require(player != address(0), "Invalid player address");
        require(score > 0, "Score must be positive");
        require(bytes(genre).length > 0, "Genre required");
        
        // Calculate token amount based on score (1 token per point)
        uint256 tokenAmount = score * 10 ** decimals();
        
        // Update player stats
        playerScores[player] += score;
        gamesPlayed[player] += 1;
        favoriteGenres[player] = genre; // Store latest genre played
        
        // Update global stats
        totalTokensRewarded += tokenAmount;
        totalGamesPlayed += 1;
        
        // Transfer tokens
        _transfer(owner(), player, tokenAmount);
        
        emit TokensRewarded(player, tokenAmount, score, genre);
        emit GameCompleted(player, score, genre);
    }
    
    function getPlayerStats(address player) external view returns (
        uint256 totalScore, 
        uint256 totalGames, 
        string memory favoriteGenre,
        uint256 tokenBalance
    ) {
        return (
            playerScores[player], 
            gamesPlayed[player], 
            favoriteGenres[player],
            balanceOf(player)
        );
    }
    
    function getGlobalStats() external view returns (
        uint256 totalRewards,
        uint256 totalGames,
        uint256 totalSupply_,
        uint256 remainingSupply
    ) {
        return (
            totalTokensRewarded,
            totalGamesPlayed,
            totalSupply(),
            balanceOf(owner())
        );
    }
    
    // Function to add more tokens if needed (only owner)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
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
} 