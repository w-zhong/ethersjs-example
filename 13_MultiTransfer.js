require("dotenv").config();
const { ethers, utils } = require("ethers");

// 1. 创建HD钱包
console.log("\n1. 创建HD钱包");
// 通过助记词生成HD钱包
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`;
const hdNode = utils.HDNode.fromMnemonic(mnemonic);
console.log(hdNode);

// 2. 获得20个钱包的地址
console.log("\n2. 通过HD钱包派生20个钱包");
const numWallet = 20;
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包
let basePath = "m/44'/60'/0'/0";
let addresses = [];
for (let i = 0; i < numWallet; i++) {
  let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
  let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
  addresses.push(walletNew.address);
}
console.log(addresses);
const amounts = Array(20).fill(utils.parseEther("0.0001"));
console.log(`发送数额：${amounts}`);

// 3. 创建provider和wallet，发送代币用
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_GOE_URL
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 4. 声明Airdrop合约
// Airdrop的ABI
const abiAirdrop = [
  "function multiTransferToken(address,address[],uint256[]) external",
  "function multiTransferETH(address[],uint256[]) public payable",
];
// Airdrop合约地址（Goerli测试网）
const addressAirdrop = "0x71C2aD976210264ff0468d43b198FD69772A25fa"; // Airdrop Contract
// 声明Airdrop合约
const contractAirdrop = new ethers.Contract(addressAirdrop, abiAirdrop, wallet);

// 5. 声明WETH合约
// WETH的ABI
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns (bool)",
  "function approve(address, uint256) public returns (bool)",
];
// WETH合约地址（Goerli测试网）
const addressWETH = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; // WETH Contract
// 声明WETH合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);

const main = async () => {
  // 6. 读取一个地址的ETH和WETH余额
  console.log("\n3. 读取一个地址的ETH和WETH余额");
  //读取WETH余额
  const balanceWETH = await contractWETH.balanceOf(addresses[10]);
  console.log(`WETH持仓: ${ethers.utils.formatEther(balanceWETH)}`);
  //读取ETH余额
  const balanceETH = await provider.getBalance(addresses[10]);
  console.log(`ETH持仓: ${ethers.utils.formatEther(balanceETH)}`);

  const myETH = await wallet.getBalance();
  const myToken = await contractWETH.balanceOf(wallet.getAddress());
  // 如果钱包ETH足够和WETH足够
  if (
    ethers.utils.formatEther(myETH) > 0.002 &&
    ethers.utils.formatEther(myToken) >= 0.002
  ) {
    // 7. 调用multiTransferETH()函数，给每个钱包转 0.0001 ETH
    console.log("\n4. 调用multiTransferETH()函数，给每个钱包转 0.0001 ETH");
    // 发起交易
    const tx = await contractAirdrop.multiTransferETH(addresses, amounts, {
      value: ethers.utils.parseEther("0.002"),
    });
    // 等待交易上链
    await tx.wait();
    // console.log(`交易详情：`)
    // console.log(tx)
    const balanceETH2 = await provider.getBalance(addresses[10]);
    console.log(
      `发送后该钱包ETH持仓: ${ethers.utils.formatEther(balanceETH2)}`
    );

    // 8. 调用multiTransferToken()函数，给每个钱包转 0.0001 WETH
    console.log("\n5. 调用multiTransferToken()函数，给每个钱包转 0.0001 WETH");
    // 先approve WETH给Airdrop合约
    const txApprove = await contractWETH.approve(
      addressAirdrop,
      utils.parseEther("1")
    );
    await txApprove.wait();
    // 发起交易
    const tx2 = await contractAirdrop.multiTransferToken(
      addressWETH,
      addresses,
      amounts
    );
    // 等待交易上链
    await tx2.wait();
    // console.log(`交易详情：`)
    // console.log(tx2)
    // 读取WETH余额
    const balanceWETH2 = await contractWETH.balanceOf(addresses[10]);
    console.log(
      `发送后该钱包WETH持仓: ${ethers.utils.formatEther(balanceWETH2)}\n`
    );
  } else {
    // 如果ETH和WETH不足
    console.log("ETH不足, 去水龙头领一些Goerli ETH, 并兑换一些WETH");
    console.log("1. chainlink水龙头: https://faucets.chain.link/goerli");
    console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/");
  }
};

main();
