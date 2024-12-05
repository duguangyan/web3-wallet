<template>
  <div>助记词</div>
  <p>{{mnemonic}}</p>
</template>

<script setup>
import { ref } from "vue";
import Web3 from "web3";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { hdkey } from 'ethereumjs-wallet';
// 创建助记词
// const mnemonic = bip39.generateMnemonic();
// console.log("mnemonic",mnemonic)
const mnemonic = ref("dose before matter problem leg target glory thunder ahead dawn elegant ethics");
// 生成密钥对 keypair
let xx =  mnemonicToSeedSync(mnemonic.value,"123456")
console.log(xx);
</script>

<style lang="less">

</style>
      