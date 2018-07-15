var AuditorCoin = artifacts.require("AuditorCoin");
var DFX = artifacts.require("DFX");

module.exports = function(deployer) {
  deployer.deploy(AuditorCoin);
  deployer.deploy(DFX);
};
