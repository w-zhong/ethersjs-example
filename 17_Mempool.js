// provider.on("pending", listener)
const { ethers } = require("ethers");

// 1. 创建provider，监听事件时候推荐用wss连接而不是http
console.log("\n1. 连接 wss RPC");
// const provider = new ethers.providers.WebSocketProvider(
//   process.env.ALCHEMY_ETH_WSSURL
// );
// let network = provider.getNetwork();
// network.then((res) =>
//   console.log(
//     `[${new Date().toLocaleTimeString()}] 连接到 chain ID ${res.chainId}`
//   )
// );

// 2. 限制访问rpc速率，不然调用频率会超出限制，报错。
console.log("\n2. 限制调用rpc接口速率");
function throttle(fn, delay) {
  let timer;
  return function () {
    if (!timer) {
      fn.apply(this, arguments);
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}

const main = async () => {
  // 3. 监听pending交易，获取txHash
  let i = 0;
  console.log("\n3. 监听pending交易, 打印txHash。");
  provider.on("pending", async (txHash) => {
    if (txHash && i < 100) {
      // 打印txHash
      console.log(
        `[${new Date().toLocaleTimeString()}] 监听Pending交易 ${i}: ${txHash} \r`
      );
      i++;
    }
  });

  // 4. 监听pending交易，并获取交易详情
  console.log("\n4. 监听pending交易, 获取txHash, 并输出交易详情。");
  let j = 0;
  provider.on(
    "pending",
    throttle(async (txHash) => {
      if (txHash && i >= 100) {
        // 获取tx详情
        let tx = await provider.getTransaction(txHash);
        console.log(
          `\n[${new Date().toLocaleTimeString()}] 监听Pending交易 ${j}: ${txHash} \r`
        );
        console.log(tx);
        j++;
      }
    }, 1000)
  );
};

main();
