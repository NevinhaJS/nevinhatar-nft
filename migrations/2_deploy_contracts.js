// const ConvertLib = artifacts.require("ConvertLib");
const Nevinhatar = artifacts.require("Nevinhatar");

module.exports = function(deployer) {
  deployer.deploy(Nevinhatar, "ipfs://hfiyaduhasdj/", 20);
  // deployer.link(ConvertLib, MetaCoin);
  // deployer.deploy(MetaCoin);
};
