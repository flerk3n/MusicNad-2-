const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MusicNadGame", (m) => {
  const musicNadGame = m.contract("MusicNadGame");

  // No auto-funding - owner will fund manually later
  return { musicNadGame };
}); 