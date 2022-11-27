//介绍ethers中的Contract合约类，并创建了WETH和DAI的只读Contract实例
//读取了V神这两个币的持仓，并没有改变区块链的状态

require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_ETH_URL
);

const abiWETH = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "guy", type: "address" },
      { name: "wad", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "src", type: "address" },
      { name: "dst", type: "address" },
      { name: "wad", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "wad", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "dst", type: "address" },
      { name: "wad", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "src", type: "address" },
      { indexed: true, name: "guy", type: "address" },
      { indexed: false, name: "wad", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "src", type: "address" },
      { indexed: true, name: "dst", type: "address" },
      { indexed: false, name: "wad", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "dst", type: "address" },
      { indexed: false, name: "wad", type: "uint256" },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "src", type: "address" },
      { indexed: false, name: "wad", type: "uint256" },
    ],
    name: "Withdrawal",
    type: "event",
  },
];
const addressWETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider);

const abiERC20 = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
];
const addressDAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const contractDAI = new ethers.Contract(addressDAI, abiERC20, provider);

const main = async () => {
  console.log("\n1. WETH Contract Info");
  console.log(`Contract Address: ${addressWETH}`);
  const nameWETH = await contractWETH.name();
  console.log(`Name: ${nameWETH}`);
  const symbolWETH = await contractWETH.symbol();
  console.log(`Symbol: ${symbolWETH}`);
  const totalSupplyWETH = await contractWETH.totalSupply();
  console.log(`TotalSupply: ${ethers.utils.formatEther(totalSupplyWETH)}`);
  const balanceWETH = await contractWETH.balanceOf("vitalik.eth");
  console.log(
    `Vitalik Balance of WETH: ${ethers.utils.formatEther(balanceWETH)}`
  );

  console.log("\n2. DAI Contract Info");
  console.log(`Contract Address: ${addressDAI}`);
  const nameDAI = await contractDAI.name();
  console.log(`Name: ${nameDAI}`);
  const symbolDAI = await contractDAI.symbol();
  console.log(`Symbol: ${symbolDAI}`);
  const totalSupplDAI = await contractDAI.totalSupply();
  console.log(`TotalSupply: ${ethers.utils.formatEther(totalSupplDAI)}`);
  const balanceDAI = await contractDAI.balanceOf("vitalik.eth");
  console.log(
    `Vitalik Balance of DAI: ${ethers.utils.formatEther(balanceDAI)}`
  );
};

main();
