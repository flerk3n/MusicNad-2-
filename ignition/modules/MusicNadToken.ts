import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MusicNadToken", (m) => {
  const musicNadToken = m.contract("MusicNadToken");

  return { musicNadToken };
}); 