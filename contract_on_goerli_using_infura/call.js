const Web3 = require('web3')

const fs = require('fs')

const { abi } = JSON.parse(fs.readFileSync('Demo.json'))

async function main(){
  const network = process.env.ETHEREUM_NETWORK

  // step1. 初始化web3 实例，增加json rpc server
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    )
  )

  // step2. 创建signer
  const signer = web3.eth.accounts.privateKeyToAccount(  process.env.SIGNER_PRIVATE_KEY)
  web3.eth.accounts.wallet.add(signer)

  // step3. 创建contract, abi是关键
 // const contract = new web3.eth.Contract( abi, process.env.Demo)
  const contract = new web3.eth.Contract( abi, '0x455ca8C1FDF8172f6E708A57c3720043D6539A37')

  // step4. 发起tx , 这里用到了签名
  const tx = contract.methods.echo(" Hi hihihi ")
  const receipt = await tx
    .send({ from: signer.address, gas: await tx.estimateGas() })
    .once("transactionHash" , (txHash) => {
      console.info("mining transaction...", txHash)
    })

  console.info("mined in block: ", receipt.blockNumber)
}

require('dotenv').config()
main()
