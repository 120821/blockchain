const Web3 = require('web3')

const fs = require('fs')

async function main(file_name_without_suffix, contract_address){
  const { abi } = JSON.parse(fs.readFileSync(file_name_without_suffix+'.json'))
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
  const contract = new web3.eth.Contract( abi, contract_address)

  const tx = await contract.methods.doSum(300,4234234).call()
  console.info("== tx: ", tx)
}

require('dotenv').config()

console.info("== 使用方式: $ node call.js TestContract 0xa1b2..z9   (该TestContract.json 和  必须存在)")
main(process.argv[2], process.argv[3]).then( () => process.exit(0) )
