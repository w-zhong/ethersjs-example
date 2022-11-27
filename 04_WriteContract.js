//介绍ethers中的Contract合约类，并创建了WETH的可写Contract实例
//通过deposit（）和transfer（）实现了合约写入/区块链状态更改

require("dotenv").config();
const { _nameprepTableA1 } = require("@ethersproject/strings/lib/idna");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_GOE_URL
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function deposit() public payable",
  "function transfer(address, uint) public returns (bool)",
  "function withdraw(uint) public",
];

const addressWETH = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);

const main = async () => {
  console.log("\n1. Read WETH Balance");
  const address = await wallet.getAddress();
  const balanceWETH = await contractWETH.balanceOf(address);
  console.log(ethers.utils.formatEther(balanceWETH));

  console.log("\n2. Deposit 0.001 WETH");
  const tx = await contractWETH.deposit({
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();
  console.log("i Deposit Tx Info");
  console.log(tx);
  const balanceWETH_deposit = await contractWETH.balanceOf(address);
  console.log(
    `ii WETH Balance After Deposit: ${ethers.utils.formatEther(
      balanceWETH_deposit
    )}`
  );

  console.log("\n3. Transfer 0.001 WETH to Vitalik");
  const tx2 = await contractWETH.transfer(
    "vitalik.eth",
    ethers.utils.parseEther("0.001")
  );
  await tx2.wait();
  console.log("i Transfer Tx Info");
  console.log(tx2);
  const balanceWETH_transfer = await contractWETH.balanceOf(address);
  console.log(
    `ii WETH Balance After Transfer: ${ethers.utils.formatEther(
      balanceWETH_transfer
    )}\n`
  );
};

main();
