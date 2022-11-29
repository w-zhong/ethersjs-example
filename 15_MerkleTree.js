require("dotenv").config();
const { ethers, utils } = require("ethers");
const { MerkleTree } = require("merkletreejs");

// 1. 生成merkle tree
console.log("\n1. 生成merkle tree");
// 白名单地址
const addresss = [
  "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
  "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
  "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
  "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
];
// leaf, merkletree, proof
const leaf = addresss.map((x) => utils.keccak256(x));
const merkletree = new MerkleTree(leaf, utils.keccak256, { sortPairs: true });
const proof = merkletree.getHexProof(leaf[0]);
const root = merkletree.getHexRoot();
console.log("Leaf:");
console.log(leaf);
console.log("\nMerkleTree:");
console.log(merkletree.toString());
console.log("\nProof:");
console.log(proof);
console.log("\nRoot:");
console.log(root);

// 2. 创建provider和wallet
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_GOE_URL
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 3. 创建合约工厂
const abiNFT = [
  "constructor(string memory name, string memory symbol, bytes32 merkleroot)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function mint(address account, uint256 tokenId, bytes32[] calldata proof) external",
  "function ownerOf(uint256) view returns (address)",
  "function balanceOf(address) view returns (uint256)",
];
const bytecodeNFT = process.env.BYTECODE_NFT;
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

const main = async () => {
  const balanceETH = await wallet.getBalance();

  // 如果钱包ETH足够
  if (ethers.utils.formatEther(balanceETH) > 0.002) {
    // 4. 利用contractFactory部署NFT合约
    console.log("\n2. 利用contractFactory部署NFT合约");
    // 部署合约，填入constructor的参数
    const contractNFT = await factoryNFT.deploy("WTF Merkle Tree", "WTF", root);
    console.log(`合约地址: ${contractNFT.address}`);
    await contractNFT.deployed();
    console.log("合约已上链");

    // 5. 调用mint()函数，利用merkle tree验证白名单，给第0个地址铸造NFT
    console.log(
      "\n3. 调用mint()函数, 利用merkle tree验证白名单, 给第一个地址铸造NFT"
    );
    console.log(`NFT名称: ${await contractNFT.name()}`);
    console.log(`NFT代号: ${await contractNFT.symbol()}`);
    let tx = await contractNFT.mint(addresss[0], "0", proof);
    await tx.wait();
    console.log(
      `mint成功, 地址${addresss[0]} 的NFT余额: ${await contractNFT.balanceOf(
        addresss[0]
      )}\n`
    );
  } else {
    // 如果ETH不足
    console.log("ETH不足, 去水龙头领一些Goerli ETH");
  }
};

main();
