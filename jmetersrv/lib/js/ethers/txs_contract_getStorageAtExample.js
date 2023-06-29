const ethers = require('ethers');

(async () => {

    const varName = process.argv[2];
    const url = process.argv[3];
    const privateKey = process.argv[4];
    const contractAddress = process.argv[5];
    const sampleVal = parseInt(process.argv[6]);
    const gasLimit = parseInt(process.argv[7]);
    const gasPrice = parseInt(process.argv[8]);

    const provider = new ethers.providers.JsonRpcProvider(url);
    const abi = [{
            "inputs": [],
            "name": "sampleVar",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "_sampleValue",
                "type": "uint256"
            }],
            "name": "setSampleVar",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    const overrideOject = {
        gasLimit: gasLimit,
        gasPrice: gasPrice
    };

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const sendPromise = contract.setSampleVar(sampleVal, overrideOject);

    sendPromise.then(function (transaction) {
        console.log(transaction);
        if (transaction && transaction.hash) {
            console.log(varName + "=" + transaction.hash);
        } else {
            console.log(varName + "=" + "");
        }
    });

})();