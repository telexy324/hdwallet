const bip39 = require('bip39')
const ethers = require('ethers')
const ctypto = require('crypto')
// const eth_util = require('ethereumjs-util')

var wordList = bip39.wordlists.chinese_simplified

// 生成助记词
var mmic = bip39.generateMnemonic(128, ctypto.randomBytes, wordList)
console.log("生成的助记词为：", mmic)

var mmicHex = bip39.mnemonicToSeedHex(mmic)
console.log("生成的助记词为：", mmicHex)

// 通过助记词生成种子
var seed = bip39.mnemonicToSeed(mmic, "your password")
console.log("随机种子：", seed)

var validate = bip39.validateMnemonic(mmic,wordList)
console.log("合法？", validate)
console.log("修改后合法？", bip39.validateMnemonic(mmic + " ",wordList))

// 助记词转换
if (validate) {
    var hex = bip39.mnemonicToEntropy(mmic,wordList);
    console.log("加密后的助记词：", hex)
    mmic = bip39.entropyToMnemonic(hex,wordList)
    console.log("转换后的助记词：", mmic)
}




