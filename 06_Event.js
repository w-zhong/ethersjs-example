//事件检索contract.quereyfilter("eventName", 起始区块, 结束区块)
//事件监听contract.on("eventName", function), 单次事件监听contract.once("eventName", function)

require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_GOE_URL
);

const abiWETH = [
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

const addressWETH = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider);

const main = async () => {
  const block = await provider.getBlockNumber();
  console.log(`\n1. Current Block: ${block}`);
  console.log("Event Info for Past 2 Blocks:");
  const transferEvents = await contractWETH.queryFilter(
    "Transfer",
    block - 1,
    block
  );
  console.log(transferEvents[0]);

  console.log("\n2. Event Parsing");
  const amount = ethers.utils.formatUnits(
    ethers.BigNumber.from(transferEvents[0].args["amount"]),
    "ether"
  );
  console.log(
    `Address ${transferEvents[0].args["from"]} Transfer ${amount} WETH to Address ${transferEvents[0].args["to"]}`
  );

  console.log("\n3. Event Listener Once");
  contractWETH.once("Transfer", (from, to, amount) => {
    console.log(
      `${from} -> ${to} ${ethers.utils.formatUnits(
        ethers.BigNumber.from(amount),
        18
      )}`
    );
  });

  console.log("\n4. Event Listener");
  contractWETH.on("Transfer", (from, to, amount) => {
    console.log(
      `${from} -> ${to} ${ethers.utils.formatUnits(
        ethers.BigNumber.from(amount),
        18
      )}`
    );
  });
};

main();
