const TronWeb = require('tronweb');

let runCount = 0;

async function main() {
  const fullNode = new TronWeb.providers.HttpProvider("https://api.trongrid.io");
  const solidityNode = new TronWeb.providers.HttpProvider("https://api.trongrid.io");
  const eventServer = new TronWeb.providers.HttpProvider("https://api.trongrid.io");
  const privateKey = "你的私钥"; // 替换为实际的私钥
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

  const blackHole = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"; // 黑洞地址
  const memo = 'data:,{"p":"trc-20","op":"mint","tick":"trxi","amt":"1000"}';

  try {
    const unSignedTxn = await tronWeb.transactionBuilder.sendTrx(blackHole, 1); // 0.000001 TRX 是最小转账金额
    const unSignedTxnWithNote = await tronWeb.transactionBuilder.addUpdateData(unSignedTxn, memo, 'utf8');
    const signedTxn = await tronWeb.trx.sign(unSignedTxnWithNote);
    const ret = await tronWeb.trx.sendRawTransaction(signedTxn);
    if (ret.result) {
      console.log("broadcast =>", ret);
      runCount++;
    }
  } catch (err) {
  }
}

const mintCount = 10000;

async function batchmint() {
  while (runCount < mintCount) {
    await main();
  }
  console.log("Batch minting completed.");
  process.exit(0); // 停止进程运行
}

batchmint();