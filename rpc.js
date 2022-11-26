// 导入ethers包
const { ethers } = require("ethers");

// 利用Alchemy的rpc节点连接以太坊网络
const ALCHEMY_MAINNET_URL =
  "https://eth-mainnet.g.alchemy.com/v2/Wv3h9M-14iJEM8_doF9a4UuBRWinz3_P";
// 连接以太坊主网
const providerETH = new ethers.providers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

const main = async () => {
  // 利用provider读取链上信息
  // 1. 查询某个账户的ETH余额
  console.log("\n1. 查询ETH余额");
  const balance = await providerETH.getBalance(
    `0x621EaaF719894BD0FDbFCA20B4946533162C1b2a`
  );
  // 将余额输出在console（主网）
  console.log(`ETH Balance: ${ethers.utils.formatEther(balance)} ETH`);

  // 2. 查询provider连接到了哪条链
  console.log("\n2. 查询provider连接到了哪条链");
  const network = await providerETH.getNetwork();
  console.log(network);

  // 3. 查询区块高度
  console.log("\n3. 查询区块高度");
  const blockNumber = await providerETH.getBlockNumber();
  console.log(blockNumber);

  // 4. 查询当前gas price
  console.log("\n4. 查询当前gas price");
  const gasPrice = await providerETH.getGasPrice();
  console.log(gasPrice);

  // 5. 查询当前建议的gas设置
  console.log("\n5. 查询当前建议的gas设置");
  const feeData = await providerETH.getFeeData();
  console.log(feeData);

  // 6. 查询区块信息
  console.log("\n6. 查询区块信息");
  const block = await providerETH.getBlock(blockNumber);
  console.log(block);

  // 7. 给定合约地址查询合约bytecode，例子用的WETH地址
  console.log("\n7. 给定合约地址查询合约bytecode");
  const code = await providerETH.getCode(
    "0xc778417e063141139fce010982780140aa0cd5ab"
  );
  console.log(code);
};

main();
