const ethers = require("ethers");

(async () => {
    const varName = process.argv[2];
    const privateKey = process.argv[3];

    const walletPrivateKey = new ethers.Wallet(privateKey);
    console.log(varName + "=" + walletPrivateKey.address);

})();