/**
 * 利用contract对象的callStatic()来调用以太坊节点的eth_call。如果调用成功，则返回ture；如果失败，则报错并返回失败原因。方法：
 * const tx = await contract.callStatic.函数名( 参数, {override})
 * console.log(`交易会成功吗？：`, tx)
 * * 函数名：为模拟调用的函数名。
 * * 参数：调用函数的参数。
 * * {override}：选填，可包含一下参数：
 * * * from：执行时的msg.sender，也就是你可以模拟任何一个人的调用，比如V神。
 * * * value：执行时的msg.value。
 * * * blockTag：执行时的区块高度。
 * * * gasPrice
 * * * gasLimit
 * * * nonce
 */

require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_ETH_URL
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// DAI的ABI
const abiDAI = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns (bool)",
];
// DAI合约地址（主网）
const addressDAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI Contract

// 创建DAI合约实例
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider);

const main = async () => {
  try {
    const address = await wallet.getAddress();
    // 1. 读取DAI合约的链上信息
    console.log("\n1. 读取测试钱包的DAI余额");
    const balanceDAI = await contractDAI.balanceOf(address);
    console.log(`DAI持仓: ${ethers.utils.formatEther(balanceDAI)}\n`);

    // 2. 用callStatic尝试调用transfer转账10000 DAI，msg.sender为V神，to为测试钱包地址，交易将成功
    console.log(
      "\n2.  用callStatic尝试调用transfer转账1 DAI, msg.sender为V神地址"
    );
    // 发起交易
    const tx = await contractDAI.callStatic.transfer(
      address,
      ethers.utils.parseEther("10000"),
      { from: "vitalik.eth" }
    );
    console.log(`交易会成功吗？：`, tx);

    // 3. 用callStatic尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，交易将失败
    console.log(
      "\n3.  用callStatic尝试调用transfer转账1 DAI, msg.sender为测试钱包地址"
    );
    const tx2 = await contractDAI.callStatic.transfer(
      "vitalik.eth",
      ethers.utils.parseEther("10000"),
      { from: address } //默认值，可省略
    );
    console.log(`交易会成功吗？：`, tx);
  } catch (e) {
    console.log(e);
  }
};

main();
