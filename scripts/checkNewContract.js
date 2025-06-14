const hre = require("hardhat");

async function main() {
  // New contract address
  const CONTRACT_ADDRESS = "0xeb510c04BAB32b540378211D93E37134db04d04b";
  
  console.log("🎮 MusicNad Game Status Check");
  console.log("==============================");
  
  // Check contract balance
  const balance = await hre.ethers.provider.getBalance(CONTRACT_ADDRESS);
  console.log("💰 Contract balance:", hre.ethers.formatEther(balance), "MON");
  
  // Check if contract has enough for at least one game
  const minReward = hre.ethers.parseEther("0.5"); // 5 points * 0.1 MON
  
  if (balance >= minReward) {
    console.log("✅ Contract is funded! Ready to play!");
    console.log("🎯 Can reward up to", Math.floor(Number(balance) / Number(minReward)), "perfect games");
  } else if (balance > 0) {
    console.log("⚠️  Contract has some funds but may need more for full games");
  } else {
    console.log("❌ Contract not funded yet - send MON tokens to start playing");
  }
  
  console.log("\n🌐 Game URL: http://localhost:3000");
  console.log("📍 Contract: " + CONTRACT_ADDRESS);
}

main().catch(console.error); 