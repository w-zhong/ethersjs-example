//介绍ethers.js的Provider类，并用Alchemy的节点API Key创建了jsonRpcProvider，读取了ETH主网和Goerli测试网的链上信息

require("dotenv").config();
const { ethers } = require("ethers");

const providerETH = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_ETH_URL
);
const providerGOE = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_GOE_URL
);

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
  //6. 查询区块信息
  console.log("\n6. Block Info");
  const blockETH = await providerETH.getBlock();
  console.log(blockETH);
  //7. 查询WETH合约字节码
  console.log("\n7. WETH Contract Bytecode");
  const codeETH = await providerETH.getCode(
    "0xc778417e063141139fce010982780140aa0cd5ab"
  );
  console.log(codeETH);

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
  //6. 查询区块信息
  console.log("\n6. Block Info");
  const blockGOE = await providerGOE.getBlock();
  console.log(blockGOE);
  //7. 查询WETH合约字节码
  console.log("\n7. WETH Contract Bytecode");
  const codeGOE = await providerGOE.getCode(
    "0x9BCfCF38F277f37B1Bc7505a9f58ce1AA84708a5"
  );
  console.log(codeGOE);
};

main();
