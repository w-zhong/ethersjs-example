//介绍ethers.js的Provider类，并用Alchemy的节点API Key创建了jsonRpcProvider，读取了ETH主网和Goerli测试网的链上信息

const { ethers } = require("ethers");

const ALCHEMY_ETH_URL =
  "https://eth-mainnet.g.alchemy.com/v2/eWZN5QXcUQ1EqAM4Y_U7dQRUjqzQIpxq";
const ALCHEMY_GOE_URL =
  "https://eth-goerli.g.alchemy.com/v2/QHuK_UWQFN2WsF4XmO5DRYtqHDrp8ENm";
const providerETH = new ethers.providers.JsonRpcProvider(ALCHEMY_ETH_URL);
const providerGOE = new ethers.providers.JsonRpcProvider(ALCHEMY_GOE_URL);

const main = async () => {
  ////主网Mainnet内容////
  //1. 读取Vitalik的ETH余额
  const balanceETH = await providerETH.getBalance(`vitalik.eth`);
  console.log(
    `1. ETH Balance of Vitalik on Mainnet: ${ethers.utils.formatEther(
      balanceETH
    )} ETH`
  );
  //2. 读取连接到的主网信息
  const networkETH = await providerETH.getNetwork();
  console.log("\n2. Network Info");
  console.log(networkETH);
  //3. 查询区块高度
  console.log("\n3. Block Number");
  const blockNumberETH = await providerETH.getBlockNumber();
  console.log(blockNumberETH);
  //4. 查询gas price
  console.log("\n4. Gas Price");
  const gasPriceETH = await providerETH.getGasPrice();
  console.log(gasPriceETH);
  //5. 查询建议gas设置
  console.log("\n5. Gas Fee");
  const feeDataETH = await providerETH.getFeeData();
  console.log(feeDataETH);

  console.log("\n\n");

  ////测试网Goerli内容////
  //1. 读取Vitalik在以太坊测试网账户ETH余额
  const balanceGOE = await providerGOE.getBalance(`vitalik.eth`);
  console.log(
    `1. ETH Balance of Vitalik on Goerli: ${ethers.utils.formatEther(
      balanceGOE
    )} ETH`
  );
  //2. 读取连接到的测试网信息
  const networkGOE = await providerGOE.getNetwork();
  console.log("\n2. Network Info");
  console.log(networkGOE);
  //3. 查询区块高度
  console.log("\n3. Block Number");
  const blockNumberGOE = await providerGOE.getBlockNumber();
  console.log(blockNumberGOE);
  //4. 查询gas price
  console.log("\n4. Gas Price");
  const gasPriceGOE = await providerGOE.getGasPrice();
  console.log(gasPriceGOE);
  //5. 查询建议gas设置
  console.log("\n5. Gas Fee");
  const feeDataGOE = await providerGOE.getFeeData();
  console.log(feeDataGOE);
};

main();
