const ethers = require("ethers");

(async () => {
    const varName = process.argv[2];
    const url = process.argv[3];
    const chainId = parseInt(process.argv[4]);
    const privateKey = process.argv[5];
    const toAddress = process.argv[6];
    const gasLimit = parseInt(process.argv[7]);
    const gasPrice = parseInt(process.argv[8]);
    const transValInEther = process.argv[9];
    const numIterations = parseInt(process.argv[10]);
    const nonceOffset = parseInt(process.argv[11]);

    const walletPrivateKey = new ethers.Wallet(privateKey);
    console.log("jmeter wallet address: " + walletPrivateKey.address);

    const provider = new ethers.providers.JsonRpcProvider(url);
    const wallet = walletPrivateKey.connect(provider);
    const nonce = await wallet.getTransactionCount();
    // console.log("jmeter wallet transaction count: " + nonce);

    let tx = [], 
        signedTx = [],
        iterativeNonce = nonce + nonceOffset;
    for (let i = 0; i < numIterations; i++) {
        tx[i] = {
            to: toAddress,
            value: ethers.utils.parseEther(transValInEther),
            gasLimit: gasLimit, //80000000,
            nonce: iterativeNonce,
            gasPrice: gasPrice, //1000000000,
            chainId: chainId
        };
        signedTx[i] = await wallet.signTransaction(tx[i]);

        if (numIterations > 1) {
            console.log(varName + "_" + i + "=" + signedTx[i]);
        } else {
            console.log(varName + "=" + signedTx[i]);
        }
        iterativeNonce++;
    }
})();