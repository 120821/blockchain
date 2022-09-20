const fs = require('fs').promises;

const solc = require('solc');

// 这个方法需要修改， 入口文件名称 Demo.sol   和 生成的文件名称 Demo.json
async function main(){
  const sourceCode = await fs.readFile('Demo.sol', 'utf8');
  const {abi, bytecode} = compile(sourceCode, 'Demo');
  const artifact = JSON.stringify({ abi, bytecode}, null, 2);
  await fs.writeFile('Demo.json', artifact);
}

// 这个方法不用改。拿过来用就好了
function compile(sourceCode, contractName){
  const input = {
    language: 'Solidity',
    sources: { main: { content: sourceCode} },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode']
        }
      },
    },
  }

  const output = solc.compile(JSON.stringify(input));
  const artifact = JSON.parse(output).contracts.main[contractName];
  return {
    abi: artifact.abi,
    bytecode: artifact.evm.bytecode.object
  };
}

main().then( () => process.exit(0) )
