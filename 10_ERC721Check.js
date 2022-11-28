//supportsInterface()查询合约标准，下面用ERC721举例

require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_ETH_URL
);

// 合约abi
const abiERC721 = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function supportsInterface(bytes4) public view returns(bool)",
];
// ERC721的合约地址，这里用的BAYC
const addressBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
// 创建ERC721合约实例
const contractERC721 = new ethers.Contract(addressBAYC, abiERC721, provider);

// ERC721接口的ERC165 identifier
const selectorERC721 = "0x80ac58cd";

const main = async () => {
  try {
    // 1. 读取ERC721合约的链上信息
    const nameERC721 = await contractERC721.name();
    const symbolERC721 = await contractERC721.symbol();
    console.log("\n1. 读取ERC721合约信息");
    console.log(`合约地址: ${addressBAYC}`);
    console.log(`名称: ${nameERC721}`);
    console.log(`代号: ${symbolERC721}`);

    // 2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准
    const isERC721 = await contractERC721.supportsInterface(selectorERC721);
    console.log("\n2. 利用ERC165的supportsInterface, 确定合约是否为ERC721标准");
    console.log(`合约是否为ERC721标准: ${isERC721}`);
  } catch (e) {
    // 如果不是ERC721，则会报错
    console.log(e);
  }
};

main();
