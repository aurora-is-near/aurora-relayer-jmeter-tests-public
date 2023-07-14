const ethers = require('ethers');
const fs = require('fs')
const crypto = require('crypto');
const os = require("os");

const returnValueName = process.argv[2];
const numberOfEOAs = parseInt(process.argv[3]);
const privateKeysFile = process.argv[4];

let privateKey = "";
let numberOfPrivateKeys = 0
let privateKeys = []

if (fs.existsSync(privateKeysFile)) {
    const allFileContents = fs.readFileSync(privateKeysFile, 'utf-8');
    allFileContents.split(/\r?\n/).forEach(line =>  {
        numberOfPrivateKeys++
        privateKeys.push(line)
    });
    if (numberOfPrivateKeys >= numberOfEOAs) {
        return console.log(returnValueName + "=" + privateKeys.slice(0, numberOfEOAs).join(","));
    }
}

for (let i = 0; i < numberOfEOAs; i++) {
    privateKey = "0x" + crypto.randomBytes(32).toString('hex');
    fs.appendFile(privateKeysFile, privateKey + os.EOL,   function (err) {
        if (err) {
            return 1
        }})
    privateKeys.push(privateKey)
}

return console.log(returnValueName + "=" + privateKeys.join(","));

