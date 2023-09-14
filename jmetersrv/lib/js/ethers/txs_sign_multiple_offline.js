const ethers = require("ethers");


(async () => {
    const returnValueName = process.argv[2];
    const url = process.argv[3];
    const chainId = parseInt(process.argv[4]);
    const privateKey = process.argv[5];
    const toAddress = process.argv[6];
    const gasLimit = parseInt(process.argv[7]);
    const gasPrice = parseInt(process.argv[8]);
    const numTx = parseInt(process.argv[9]);
    const nonce = parseInt(process.argv[10]);

    const walletPrivateKey = new ethers.Wallet(privateKey);
    const provider = new ethers.providers.JsonRpcProvider(url);
    const wallet = walletPrivateKey.connect(provider);

    let tx = [], signedTx = [], sampleVal, dataBase, data
    for (let i = 0; i < numTx; i++) {
        sampleVal = i.toString(16);
        dataBase = "0xcbacafd20000000000000000000000000000000000000000000000000000000000000000";
        data = dataBase.slice(0, -(sampleVal.length)) + sampleVal
        tx[i] = {
            to: toAddress,
            gasLimit: gasLimit,
            nonce: nonce+i,
            gasPrice: gasPrice,
            chainId: chainId,
            data: data,
        };
        signedTx[i] = await wallet.signTransaction(tx[i]);
    }

    return console.log(returnValueName + "=" + signedTx.join(","));
})();

