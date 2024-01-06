import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChain, networkConfig } from "../helper-hardhat-config";
import { network } from "hardhat";
import verify from "../utils/verify";
import dotenv from "dotenv";
dotenv.config();

const deployTodoList: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId as keyof typeof networkConfig;
  const args: any[] = [];
  const todoList = await deploy("TodoList", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: networkConfig[chainId].waitConfirmations, // min 6 for verification to run
  });
  if (
    !developmentChain.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(todoList.address, args);
  }
};

export default deployTodoList;
deployTodoList.tags = ["all", "todolist"];
