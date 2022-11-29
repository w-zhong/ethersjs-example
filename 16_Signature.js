require("dotenv").config();
const { ethers, utils } = require("ethers");

// 1. 创建provider和wallet
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_GOE_URL
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const main = async () => {
  // 2. 根据allowlist地址和tokenId生成msgHash，并签名
  console.log("\n1. 生成签名");
  const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
  const tokenId = "0";
  const msgHash = utils.solidityKeccak256(
    ["address", "uint256"],
    [account, tokenId]
  );
  console.log(`msgHash: ${msgHash}`);
  // 签名
  const messageHashBytes = ethers.utils.arrayify(msgHash);
  const signature = await wallet.signMessage(messageHashBytes);
  console.log(`签名: ${signature}`);

  // 3. 创建合约工厂
  const abiNFT = [
    "constructor(string memory _name, string memory _symbol, address _signer)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function mint(address _account, uint256 _tokenId, bytes memory _signature) external",
    "function ownerOf(uint256) view returns (address)",
    "function balanceOf(address) view returns (uint256)",
  ];
  const bytecodeNFT = process.env.BYTECODE_NFT2;
  const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

  const balanceETH = await wallet.getBalance();

  // 如果钱包ETH足够
  if (ethers.utils.formatEther(balanceETH) > 0.002) {
    // 4. 利用contractFactory部署NFT合约
    console.log("\n2. 利用contractFactory部署NFT合约");
    // 部署合约，填入constructor的参数
    const contractNFT = await factoryNFT.deploy(
      "WTF Signature",
      "WTF",
      wallet.address
    );
    console.log(`合约地址: ${contractNFT.address}`);
    await contractNFT.deployed();
    console.log("合约已上链");

    // 5. 调用mint()函数，利用签名验证白名单，给account地址铸造NFT
    console.log(
      "\n3. 调用mint()函数, 利用merkle tree验证白名单, 给第一个地址铸造NFT"
    );
    console.log(`NFT名称: ${await contractNFT.name()}`);
    console.log(`NFT代号: ${await contractNFT.symbol()}`);
    let tx = await contractNFT.mint(account, tokenId, signature);
    await tx.wait();
    console.log(
      `mint成功, 地址${account} 的NFT余额: ${await contractNFT.balanceOf(
        account
      )}\n`
    );
  } else {
    // 如果ETH不足
    console.log("ETH不足, 去水龙头领一些Goerli ETH");
  }
};

main();
