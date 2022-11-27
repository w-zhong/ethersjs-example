//

require("dotenv").config();
const { _nameprepTableA1 } = require("@ethersproject/strings/lib/idna");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_GOE_URL
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const main = async () => {};

main();
