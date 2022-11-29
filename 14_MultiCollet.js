require("dotenv").config();
const { ethers, utils } = require("ethers");

// 1. 创建provider和wallet，发送代币用
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_GOE_URL
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 2. 声明WETH合约
// WETH的ABI
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns (bool)",
];
// WETH合约地址（Goerli测试网）
const addressWETH = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; // WETH Contract
// 声明WETH合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);

// 3. 创建HD钱包
console.log("\n1. 创建HD钱包");
// 通过助记词生成HD钱包
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`;
const hdNode = utils.HDNode.fromMnemonic(mnemonic);
console.log(hdNode);

// 4. 获得20个钱包
console.log("\n2. 通过HD钱包派生20个钱包");
const numWallet = 20;
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包
let basePath = "m/44'/60'/0'/0";
let wallets = [];
for (let i = 0; i < numWallet; i++) {
  let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
  let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
  wallets.push(walletNew);
  console.log(walletNew.address);
}
// 定义发送数额
const amount = utils.parseEther("0.0001");
console.log(`发送数额：${amount}`);

const main = async () => {
  // 5. 读取一个地址的ETH和WETH余额
  console.log("\n3. 读取一个地址的ETH和WETH余额");
  //读取WETH余额
  const balanceWETH = await contractWETH.balanceOf(wallets[10].address);
  console.log(`WETH持仓: ${ethers.utils.formatEther(balanceWETH)}`);
  //读取ETH余额
  const balanceETH = await provider.getBalance(wallets[10].address);
  console.log(`ETH持仓: ${ethers.utils.formatEther(balanceETH)}`);

  // 如果钱包ETH足够
  if (
    ethers.utils.formatEther(balanceETH) > ethers.utils.formatEther(amount) &&
    ethers.utils.formatEther(balanceWETH) >= ethers.utils.formatEther(amount)
  ) {
    // 6. 批量归集钱包的ETH
    console.log("\n4. 批量归集20个钱包的ETH");
    const txSendETH = {
      to: wallet.address,
      value: amount,
    };
    for (let i = 0; i < numWallet; i++) {
      // 将钱包连接到provider
      let walletiWithProvider = wallets[i].connect(provider);
      var tx = await walletiWithProvider.sendTransaction(txSendETH);
      console.log(
        `第 ${i + 1} 个钱包 ${walletiWithProvider.address} ETH 归集开始`
      );
    }
    await tx.wait();
    console.log(`ETH 归集结束`);

    // 7. 批量归集钱包的WETH
    console.log("\n5. 批量归集20个钱包的WETH");
    for (let i = 0; i < numWallet; i++) {
      // 将钱包连接到provider
      let walletiWithProvider = wallets[i].connect(provider);
      // 将合约连接到新的钱包
      let contractConnected = contractWETH.connect(walletiWithProvider);
      var tx = await contractConnected.transfer(wallet.address, amount);
      console.log(`第 ${i + 1} 个钱包 ${wallets[i].address} WETH 归集开始`);
    }
    await tx.wait();
    console.log(`WETH 归集结束`);

    // 8. 读取一个地址在归集后的ETH和WETH余额
    console.log("\n6. 读取一个地址在归集后的ETH和WETH余额");
    // 读取WETH余额
    const balanceWETHAfter = await contractWETH.balanceOf(wallets[19].address);
    console.log(
      `归集后WETH持仓: ${ethers.utils.formatEther(balanceWETHAfter)}`
    );
    // 读取ETH余额
    const balanceETHAfter = await provider.getBalance(wallets[19].address);
    console.log(
      `归集后ETH持仓: ${ethers.utils.formatEther(balanceETHAfter)}\n`
    );
  }
};

main();
