const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { parseEther } = require("ethers");

module.exports = buildModule("MusicNadGame", (m) => {
  const musicNadGame = m.contract("MusicNadGame");

  // After deployment, fund the contract with ALL MON tokens
  // This transfers all 11 MON from Account 1 to the contract
  const fundingAmount = parseEther("11"); // Fund with ALL 11 MON tokens
  
  m.call(musicNadGame, "depositFunds", [], {
    value: fundingAmount,
  });

  return { musicNadGame };
}); 