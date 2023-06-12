import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const randomSeed = await deploy("RandomSeed", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log(`RandomSeed contract: `, randomSeed.address);
};
export default func;
func.id = "deploy_randomSeed"; // id required to prevent reexecution
func.tags = ["RandomSeed"];
