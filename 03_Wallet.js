//Wallet类继承自Signer类，使用钱包实例获取了地址、助记词、私钥、链上交互次数，并发送ETH

require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_GOE_URL
);

const walletRANDOM = ethers.Wallet.createRandom();
const walletRandom = walletRANDOM.connect(provider);
const mnemonic = walletRandom.mnemonic;

const walletDev = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const walletRecovery = ethers.Wallet.fromMnemonic(mnemonic.phrase);

const main = async () => {
  const address1 = await walletRandom.getAddress();
  const address2 = await walletDev.getAddress();
  const address3 = await walletRecovery.getAddress();

  console.log("\n1. Get Addresses");
  console.log(`Address #1: ${address1}`);
  console.log(`Address #2: ${address2}`);
  console.log(`Address #3: ${address3}`);
  console.log(`If Address #1 = #3: ${address1 === address3}`);

  console.log("\n2. Get Mnemonic");
  console.log(`walletRandom: ${walletRandom.mnemonic.phrase}`);

  console.log("\n3. Get Private Key");
  console.log(`walletDev: ${walletDev.privateKey}`);

  const txCountWalletRandom = await walletRandom.getTransactionCount();
  const txCountWalletDev = await walletDev.getTransactionCount();
  console.log("\n4. Get Tx Count");
  console.log(`walletRandom: ${txCountWalletRandom}`);
  console.log(`walletDev: ${txCountWalletDev}`);

  console.log(`\n5. Send ETH from walletDev to walletRandom`);
  console.log(`i. Balances before Tx`);
  console.log(
    `walletRandom: ${ethers.utils.formatEther(
      await walletRandom.getBalance()
    )} ETH`
  );
  console.log(
    `walletDev: ${ethers.utils.formatEther(await walletDev.getBalance())} ETH`
  );

  const tx = {
    to: address1,
    value: ethers.utils.parseEther("0.001"),
  };

  console.log(`ii. Wait for the Tx to complete`);
  const receipt = await walletDev.sendTransaction(tx);
  await walletDev.sendTransaction(tx);
  await receipt.wait();
  console.log(receipt);

  console.log(`iii. Balances after Tx`);
  console.log(
    `walletRandom: ${ethers.utils.formatEther(
      await walletRandom.getBalance()
    )} ETH`
  );
  console.log(
    `walletDev: ${ethers.utils.formatEther(await walletDev.getBalance())} ETH`
  );
};

main();
