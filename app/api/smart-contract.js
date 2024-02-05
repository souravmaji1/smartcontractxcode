// pages/api/smart-contract.js
import solc from 'solc';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { contractCode } = req.body;

      if (!contractCode) {
        return res.status(400).json({ error: 'Contract code is required in the request body.' });
      }

      const input = {
        language: 'Solidity',
        sources: {
          'SmartContract.sol': {
            content: contractCode,
          },
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['abi', 'evm.bytecode'],
            },
          },
        },
      };

      const output = JSON.parse(solc.compile(JSON.stringify(input)));

      if (output.errors) {
        return res.status(400).json({ errors: output.errors });
      }

      // Your compiled contract ABI and bytecode from the compilation output
      const contractInfo = Object.values(output.contracts['SmartContract.sol'])[0];
      const contractABI = contractInfo.abi;
      const contractBytecode = contractInfo.evm.bytecode.object;

      res.status(200).json({ abi: contractABI, bytecode: contractBytecode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
