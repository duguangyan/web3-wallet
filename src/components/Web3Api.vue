<template>
<div>
    <h1>账户信息</h1>
    <p>地址: {{ address }}</p>
    <p>私钥: {{ privateKey }}</p>
    <p>余额: {{ mount}} </p>
    <h1>转账操作</h1>
    <button @click="send">开始转账</button>
</div>
</template>

<script setup>
import { ref } from "vue";
import Web3 from "web3";
import Tx from "ethereumjs-tx";
var web3 = new Web3(Web3.givenProvider || 'https://linea-sepolia.infura.io/v3/638355f30f124b0daf4131933304abd0');
console.log(web3)
// 创建账号
// let account = web3.eth.accounts.create("123")
// console.log("account", account)
let address = ref('0x6641dADEa1849e19d0432140e903fE1AD6E0a10f');
let privateKey = ref('b617d692e1b5783c0ecdb590ed07f4cd76650b1aa8f54a13999929fbb5e37a20')
let mount = ref(-1)
web3.eth.getBalance(address.value).then(res=>{
    mount.value = web3.utils.fromWei(res,"ether") 
    console.log("mount",mount.value)
})

// 转账
const send = async() => {

    // 1.构建转账参数
    // 获取转账次数
    const nonce = await web3.eth.getTransactionCount(address.value)
    console.log('nonce',nonce)
    // 获取预计转账gas费用
    const gasPrice = await web3.eth.getGasPrice()
    console.log('gasPrice',gasPrice)

    // 转账金额： 以wei作为单位
    const value = web3.utils.toWei('0.0001', 'ether')
    console.log('value',value)
    // 构建转账对象
    const rawTx = {
        from: address.value,
        to:"0xCA685B7805CCF8d8335DC26adA43D24eC85a4Fbf",
        nonce,
        gasPrice,
        value,
        data: "0x0000",
    }

    console.log("rawTx", rawTx)

    // 2.生成serializedTx
    // 转为私钥
    const pKey = Buffer.from(privateKey.value, 'hex')

    console.log("pKey", pKey)
    // gas 估算
    const gas = await web3.eth.estimateGas(rawTx)
    console.log("gas", gas)
    rawTx.gas = gas
    console.log('rawTx',rawTx)
    // 签名
    const tx = new Tx(rawTx)
    tx.sign(pKey)
    const serializedTx = '0x'+ tx.serialize().toString('hex')
    console.log("serializedTx", serializedTx)

    // 3.发送交易
    const trans = web3.eth.sendSignedTransaction(serializedTx)
    console.log("trans", trans)
    trans.on('transactionHash',(txid) => {
        console.log("交易txid", txid)
        console.log(`https://sepolia.lineascan.build/tx/${txid}`)
    })

    trans.on("receipt",(res=>{
        console.log("第一个节点确认", res)
    }))

    trans.on("confirmation",((confirmationNumber, receipt)=>{
        console.log("第N个节点确认", receipt,confirmationNumber)
    }))

    trans.on("error",(err=>{
        console.log("错误", err)
    }))
}

</script>

<style lang="less">

</style>
  