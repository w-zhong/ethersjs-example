//事件过滤器监听与币安交易所热钱包相关的USDT交易

require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_ETH_URL
);

const addressUSDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const accountBinance = "0x28c6c06298d514db089934071355e5743bf21d60";

const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)",
  "function balanceOf(address) public view returns(uint)",
];

const contractUSDT = new ethers.Contract(addressUSDT, abi, provider);

const main = async () => {
  const balanceUSDT = await contractUSDT.balanceOf(accountBinance);
  console.log("\n1. USDT balance of Binance account #14:");
  console.log(ethers.utils.formatUnits(ethers.BigNumber.from(balanceUSDT), 6));

  console.log("\n2. All the USDT outgoing Tx from Binance #14");
  let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
  console.log("Filter Info:");
  console.log(filterBinanceIn);
  contractUSDT
    .on(filterBinanceIn, (from, to, value) => {
      console.log("--------USDT Tx out from Binance--------");
      console.log(
        `${from} -> ${to} ${ethers.utils.formatUnits(
          ethers.BigNumber.from(value),
          6
        )}`
      );
    })
    .on("error", (error) => {
      console.log(error);
    });
};

main();
