var FileUpload = artifacts.require("./FileUpload.sol");

module.exports = function(deployer) {
  deployer.deploy(FileUpload);
};
