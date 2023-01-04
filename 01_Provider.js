//介绍ethers.js的Provider类，并用Alchemy的节点API Key创建了jsonRpcProvider，读取了ETH主网和Goerli测试网的链上信息

require("dotenv").config();
const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_ETH_URL
);

const main = async () => {
  //1. Accounts相关方法
  // 读取Vitalik以太坊主网的ETH余额，Ether.js接受ENS作为地址
  console.log("\n1.1 Vitalik在主网的ETH余额:");
  console.log(
    ethers.utils.formatEther(await provider.getBalance(`vitalik.eth`))
  );
  // 查询WETH合约字节码
  console.log("\n1.2 WETH主网合约字节码");
  console.log(
    await provider.getCode("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
  );
  // 查询储存在storage第三个位置的变量值，private/internal变量都可以查询，WETH合约第三个位置存储的是decimal=18,16进制返回值为0x12
  console.log("\n1.3 WETH主网合约第三个存储位置变量值");
  console.log(
    await provider.getStorageAt("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 2)
  );
  // 读取vitalik.eth在主网的交易次数
  console.log("\n1.4 vitalik.eth主网交易次数");
  console.log(await provider.getTransactionCount(`vitalik.eth`));

  // 2. Blocks相关方法
  // 查询区块信息, 只显示交易哈希
  console.log("\n2.1 区块信息");
  console.log(await provider.getBlock());
  // 查询区块信息，并列出此区块所有交易的细节
  console.log("\n2.2 区块信息, 包含所有交易");
  console.log(await provider.getBlockWithTransactions());

  // 3. ENS相关方法
  // 读取地址上的ENS
  console.log(
    "\n3.1 查询地址0xd8da6bf26964af9d7eed9e03e53415d37aa96045后面的ENS:"
  );
  console.log(
    await provider.lookupAddress("0xd8da6bf26964af9d7eed9e03e53415d37aa96045")
  );
  // 读取vitalik.eth背后的地址
  console.log("\n3.2 vitalik.eth背后的地址:");
  console.log(await provider.resolveName("vitalik.eth"));
  // 读取vitalik.eth的设定头像，返回值为null若没有设定
  console.log("\n3.3 vitalik.eth的设定头像:");
  console.log(await provider.getAvatar(`vitalik.eth`));
  // 读取ricmoo.eth的resolver对象
  console.log("\n3.4 读取ricmoo.eth的resolver对象");
  const resolver = await provider.getResolver("ricmoo.eth");
  console.log(resolver.name);
  console.log(resolver.address);
  console.log(await resolver.getAddress(0));
  console.log(await resolver.getAvatar());
  console.log(await resolver.getContentHash());
  console.log(await resolver.getText("email"));
  console.log(await resolver.getText("url"));
  console.log(await resolver.getText("com.twitter"));

  // 4. Networks相关方法
  // 读取连接到的主网信息
  console.log("\n4.1 主网信息");
  console.log(await provider.getNetwork());
  // 当节点准备好时返回主网信息，否则会暂停脚本运行并忽略错误信息，可用来测试和控制节点运行状态
  console.log("\n4.2 若节点已经准备好, 则返回主网信息");
  console.log(await provider.ready);
  // 查询区块高度
  console.log("\n4.3区块高度");
  console.log(await provider.getBlockNumber());
  // 查询gas price
  console.log("\n4.4 Gas Price");
  console.log(await provider.getGasPrice());
  // 查询建议gas设置
  console.log("\n4.5 Gas Fee设置");
  console.log(await provider.getFeeData());

  // 5. 交易相关方法
  // 查询交易信息
  console.log(
    "\n5.1 哈希0x4162e7ad06f8e34acdc713439c979cddbb36fd7fe5e6bb00c081de20def3d3bb的交易信息"
  );
  console.log(
    await provider.getTransaction(
      "0x4162e7ad06f8e34acdc713439c979cddbb36fd7fe5e6bb00c081de20def3d3bb"
    )
  );
  // 查询交易收据
  console.log(
    "\n5.2 哈希0x4162e7ad06f8e34acdc713439c979cddbb36fd7fe5e6bb00c081de20def3d3bb的交易收据"
  );
  console.log(
    await provider.getTransactionReceipt(
      "0x4162e7ad06f8e34acdc713439c979cddbb36fd7fe5e6bb00c081de20def3d3bb"
    )
  );
  // call方法可以调用getter function，不改变区块链状态，不需要gas
  console.log("\n5.3 调用ENS resolver地址, 返回ricmoo.eth背后的地址");
  console.log(
    await provider.call({
      // ENS solver地址
      to: "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41",
      // function addr(namehash("ricmoo.eth")) view returns (address)
      data: "0x3b3b57debf074faa138b72c65adbdcfb329847e4f2c04bde7f7dd7fcad5a52d2f395a558",
      // '0x0000000000000000000000005555763613a12d8f3e73be831dff8598089d3dca'
    })
  );
  // 预估交易需要的gas
  console.log("\n5.4 预估向WETH合约存入1ETH所需要的gas");
  console.log(
    await provider.estimateGas({
      // Wrapped ETH address
      to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      // `function deposit() payable`
      data: "0xd0e30db0",
      // 1 ether
      value: ethers.utils.parseEther("1.0"),
      // { BigNumber: "0x6d22" }
    })
  );
  // 等待特定交易完成
  console.log(
    "\n5.5 等待哈希为0x4162e7ad06f8e34acdc713439c979cddbb36fd7fe5e6bb00c081de20def3d3bb的交易完成, 完成后返回交易收据"
  );
  console.log(
    await provider.waitForTransaction(
      "0x4162e7ad06f8e34acdc713439c979cddbb36fd7fe5e6bb00c081de20def3d3bb"
    )
  );

  // 将已经签好名的交易广播上链，下面的例子会报错，因为该地址的nonce已经变化，所以无法重复广播
  // const signedTx =
  //   "0x02f874820539048459682f00845dee13e4825208945555763613a12d8f3e73be831dff8598089d3dca882b992b75cbeb600080c080a0f2fb46c2a66e45c4f53b9dbc18cbefdeffa9834f8d47a7c2efd1b9e3845096f3a07581142f88602012e7b5b79a2f7c338ffcd0a3af6312c6fd687f3836ea246b68";
  // console.log(await provider.sendTransaction(signedTx));
  // 初次上链打包成功后的返回值
  // {
  //   accessList: [],
  //   chainId: 1337,
  //   confirmations: 0,
  //   data: '0x',
  //   from: '0x4342bf02BDe4A21Da695E8e82D3d79E85F3dFAD1',
  //   gasLimit: { BigNumber: "21000" },
  //   gasPrice: null,
  //   hash: '0x9e33d5359a9157ffbe4118b0dce7ff220e42064f775eadef8de0f79d5b6b48e6',
  //   maxFeePerGas: { BigNumber: "1575883748" },
  //   maxPriorityFeePerGas: { BigNumber: "1500000000" },
  //   nonce: 4,
  //   r: '0xf2fb46c2a66e45c4f53b9dbc18cbefdeffa9834f8d47a7c2efd1b9e3845096f3',
  //   s: '0x7581142f88602012e7b5b79a2f7c338ffcd0a3af6312c6fd687f3836ea246b68',
  //   to: '0x5555763613a12D8F3e73be831DFf8598089d3dCa',
  //   type: 2,
  //   v: 0,
  //   value: { BigNumber: "3141590000000000000" },
  //   wait: [Function (anonymous)]
  // }
};

main();
