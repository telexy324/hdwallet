const ethers = require('ethers')

const accont1 = "m/44'/60'/0'/0/0"
const accont2 = "m/44'/60'/0'/0/1"

console.log("随机=========")
var wallet = ethers.Wallet.createRandom()
console.log("随机生成的account", wallet.address)

console.log("私钥创建=======")
var pk1 = "7c70eaea87e3d568bfcc8758ef9038b2ec640bc86130742a9a5154c5487bb033"
var pk2 = "7591240850e02d42f00f967aa836bf80c85a8022549a3a37fdc45efdc07db310"
var wallet1 = new ethers.Wallet(pk1)
var wallet2 = new ethers.Wallet(pk2)

console.log("account1:", wallet1.address)
console.log("account2:", wallet2.address)


console.log("助记词=========")
//随机gen助记词
var random = ethers.utils.randomBytes(16) //eth 128位
var mmic = ethers.utils.HDNode.entropyToMnemonic(random)
console.log("生成的助记词：", mmic)

mmic = "disorder timber among submit tell early claw certain sadness embark neck salad"
console.log("导入巧克力助记词：", mmic)

//创建账号
wallet1 = ethers.Wallet.fromMnemonic(mmic, accont1)
wallet2 = ethers.Wallet.fromMnemonic(mmic, accont2)

console.log("account1:", wallet1.address)
console.log("account2:", wallet2.address)

// console.log(wallet1)
