const Web3 = require('web3');

const fs = require('fs')
const {abi, bytecode} = JSON.parse(fs.readFileSync('Demo.json'))

async function main(){
  // step1. 初始化web3 , 根据某个rpc server endpoint
  const network = process.env.ETHEREUM_NETWORK
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    )
  )

  // step2. 创建签名用的东东
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  )
  web3.eth.accounts.wallet.add(signer)

  // step3. 初始化contract
  const contract = new web3.eth.Contract(abi)
  contract.options.data = bytecode

  // step4. 发布该 contract
  const deployTx = contract.deploy()
  const deployedContract = await deployTx
    .send({
      from: signer.address, // 这里用到了signer的address
      gas: await deployTx.estimateGas()
    })
    .once('transactionHash', (txhash) => {
      console.log("Mining deployment transaction ... ", txhash)
      console.log(`https://${network}.etherscan.io/tx/${txhash}`)
    })

}

require('dotenv').config()
main()
