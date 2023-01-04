//介绍ethers.js的Provider类，并用Alchemy的节点API Key创建了jsonRpcProvider，读取了ETH主网和Goerli测试网的链上信息

require("dotenv").config();
const ethers = require("ethers");

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
    `\n1. Vitalik在主网的ETH余额: ${ethers.utils.formatEther(balanceETH)} ETH`
  );
  //2. 读取连接到的主网信息
  const networkETH = await providerETH.getNetwork();
  console.log("\n2. 主网信息");
  console.log(networkETH);
  //3. 查询区块高度
  console.log("\n3. 区块高度");
  const blockNumberETH = await providerETH.getBlockNumber();
  console.log(blockNumberETH);
  //4. 查询gas price
  console.log("\n4. Gas Price");
  const gasPriceETH = await providerETH.getGasPrice();
  console.log(gasPriceETH);
  //5. 查询建议gas设置
  console.log("\n5. Gas Fee设置");
  const feeDataETH = await providerETH.getFeeData();
  console.log(feeDataETH);
  //6. 查询区块信息
  console.log("\n6. 区块信息");
  const blockETH = await providerETH.getBlock();
  console.log(blockETH);
  //6. 查询区块信息，并列出此区块所有交易的细节
  console.log("\n6. 区块信息，包含所有交易");
  const blockETHWithTx = await providerETH.getBlockWithTransactions();
  console.log(blockETHWithTx);
  //7. 查询WETH合约字节码
  console.log("\n7. WETH主网合约字节码");
  const codeETH = await providerETH.getCode(
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  );
  console.log(codeETH);
  //8. 查询储存在storage第三个位置的变量值，private/internal变量都可以查询，WETH合约第三个位置存储的是decimal=18,16进制返回值为0x12
  console.log("\n8. WETH主网合约第三个存储位置变量值");
  const varETH = await providerETH.getStorageAt(
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    2
  );
  console.log(varETH);
  //9. 查询交易信息
  console.log(
    "\n9. 哈希0x4162e7ad06f8e34acdc713439c979cddbb36fd7fe5e6bb00c081de20def3d3bb的交易信息"
  );
  const transactionETH = await providerETH.getTransaction(
    "0x4162e7ad06f8e34acdc713439c979cddbb36fd7fe5e6bb00c081de20def3d3bb"
  );
  console.log(transactionETH);
  //10. 查询交易收据
  console.log(
    "\n10. 哈希0x4162e7ad06f8e34acdc713439c979cddbb36fd7fe5e6bb00c081de20def3d3bb的交易收据"
  );
  const transactionReceiptETH = await providerETH.getTransactionReceipt(
    "0x4162e7ad06f8e34acdc713439c979cddbb36fd7fe5e6bb00c081de20def3d3bb"
  );
  console.log(transactionReceiptETH);

  console.log("\n\n");

  //   ////测试网Goerli内容////
  //   //1. 读取Vitalik在以太坊测试网账户ETH余额
  //   const balanceGOE = await providerGOE.getBalance(`vitalik.eth`);
  //   console.log(
  //     `1. Vitalik在Goerli测试网的ETH余额: ${ethers.utils.formatEther(
  //       balanceGOE
  //     )} ETH`
  //   );
  //   //2. 读取连接到的测试网信息
  //   const networkGOE = await providerGOE.getNetwork();
  //   console.log("\n2. 测试网信息");
  //   console.log(networkGOE);
  //   //3. 查询区块高度
  //   console.log("\n3. 区块高度");
  //   const blockNumberGOE = await providerGOE.getBlockNumber();
  //   console.log(blockNumberGOE);
  //   //4. 查询gas price
  //   console.log("\n4. Gas Price");
  //   const gasPriceGOE = await providerGOE.getGasPrice();
  //   console.log(gasPriceGOE);
  //   //5. 查询建议gas设置
  //   console.log("\n5. Gas Fee设置");
  //   const feeDataGOE = await providerGOE.getFeeData();
  //   console.log(feeDataGOE);
  //   //6. 查询区块信息
  //   console.log("\n6. 区块信息");
  //   const blockGOE = await providerGOE.getBlock();
  //   console.log(blockGOE);
  //   //7. 查询WETH合约字节码
  //   console.log("\n7. WETH在测试网Goerli的合约字节码");
  //   const codeGOE = await providerGOE.getCode(
  //     "0x9BCfCF38F277f37B1Bc7505a9f58ce1AA84708a5"
  //   );
  //   console.log(codeGOE);
  //   //8. 查询交易信息
  //   console.log(
  //     "\n8. 哈希0x457ce7372f67ae264e7731b4304f921b95e9e7b1f2dc28e35feb713a7f0533a8的交易信息"
  //   );
  //   const transactionGOE = await providerGOE.getTransaction(
  //     "0x457ce7372f67ae264e7731b4304f921b95e9e7b1f2dc28e35feb713a7f0533a8"
  //   );
  //   console.log(transactionGOE);
  //   //9. 查询交易收据
  //   console.log(
  //     "\n9. 哈希0x457ce7372f67ae264e7731b4304f921b95e9e7b1f2dc28e35feb713a7f0533a8的交易收据"
  //   );
  //   const transactionReceiptGOE = await providerGOE.getTransactionReceipt(
  //     "0x457ce7372f67ae264e7731b4304f921b95e9e7b1f2dc28e35feb713a7f0533a8"
  //   );
  //   console.log(transactionReceiptGOE);
};

main();
