<template>
  <div>助记词</div>
  <p>{{mnemonic}}</p>
  <div>路径</div>
  <p>m/44'/60'/0'/0/1</p>
  <div>账号地址</div>
  <p> 0x9143d949d0d3085c52ed3189caed31717f53f01f</p>
  <div>账号私钥</div>
  <p> ca01150045d5d61b2a46bd8f4878a21de5ba5a299ae17f74c04101a2f894bcd6</p>
</template>

<script setup>
import { ref } from "vue";
import Web3 from "web3";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";

import ethwallet, { hdkey}  from 'ethereumjs-wallet'
// 创建助记词
// const mnemonic = bip39.generateMnemonic();
// console.log("mnemonic",mnemonic)
const mnemonic = ref("dose before matter problem leg target glory thunder ahead dawn elegant ethics");
getMnemonic();

// 生成私钥
async function getMnemonic() {
  // 生成密钥对 keypair
  let send =  mnemonicToSeedSync(mnemonic.value)
  console.log("send", send);

  const hdWallet = hdkey.fromMasterSeed(send)
  console.log("hdWallet", hdWallet);

  const keypair = hdWallet.derivePath(`m/44'/60'/0'/0/1`)
  console.log("keypair", keypair);
  // 获取私钥
  // 1. 获取钱包对象
  const wallet = keypair.getWallet()
  console.log("wallet", wallet);
  // 2. 获取钱包地址
  const lowercaseAddress = wallet.getAddressString()
  console.log("lowercaseAddress", lowercaseAddress);
  // 3. 获取钱包校验地址
  const checksumAddress = wallet.getChecksumAddressString()
  console.log("checksumAddress", checksumAddress);
  // 4. 获取私钥
  const priKey = wallet.getPrivateKey().toString('hex')
  console.log("priKey", priKey);

  // 导出keystore
  // 1. web3js实例
  const web3 = new Web3(Web3.givenProvider || 'https://linea-sepolia.infura.io/v3/638355f30f124b0daf4131933304abd0');
  const keystore =  web3.eth.accounts.encrypt(priKey, '123456')
  console.log("keystore", JSON.stringify(keystore))

  // 2. wallet实例
  const keystore2 = await wallet.toV3("123456")
  console.log("keystore2", JSON.stringify(keystore2))

  // 通过keystore获取私钥
  // 1. web3
  const res = web3.eth.accounts.decrypt(keystore, '123456')
  console.log("res", res)

  // 2. wallet
  const wallet2 = await ethwallet.fromV3(keystore2, '123456')
  console.log("wallet2", wallet2)

  const key = wallet2.getPrivateKey().toString('hex')
  console.log("key",key)

  // 通过私钥获取地址
  const priKey2 = Buffer(priKey, 'hex')
  console.log("priKey2", priKey2)

  let wallet3 = ethwallet.fromPrivateKey(priKey2)
  console.log("wallet3", wallet3)
  const lowerCaseAddress = wallet3.getAddressString()
  console.log("lowerCaseAddress", lowerCaseAddress)


}





</script>

<style lang="less">

</style>
      