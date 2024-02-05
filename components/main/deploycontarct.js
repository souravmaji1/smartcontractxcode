'use client';
import { useState } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [smartContractSource, setSmartContractSource] = useState('');
  const [network, setNetwork] = useState('mumbai'); // Default to mainnet
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState('');

  const deployContract = async () => {
    try {
      setLoading(true);
      // Compile the Solidity contract on the server
      const response = await fetch('https://smartcontractx.onrender.com/smart-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contractCode: smartContractSource }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      // Deploy the compiled contract using MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a contract factory using the ABI and bytecode
      const factory = new ethers.ContractFactory(data.abi, data.bytecode, signer);

      // Deploy the contract
      const deployedContract = await factory.deploy();
      await deployedContract.deployed();

      setContractAddress(deployedContract.address);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '66rem',
        margin: 'auto',
        border: '2px solid #7042f88b',
        borderRadius: '8px',
        width: '-webkit-fill-available',
        background: 'linear-gradient(45deg, #2a0e61, #010108)',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '20px', color: 'white', fontWeight: 'medium', marginTop: '10px', marginBottom: '15px' }}>
          Smart Contract Source Code:
        </p>
        <textarea
          rows="8"
          value={smartContractSource}
          onChange={(e) => setSmartContractSource(e.target.value)}
          placeholder="Enter your smart contract source code here..."
          style={{
            width: '100%',
            background: 'white',
            border: '2px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
          }}
        />
      </div>
     

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '20px', color: 'white', fontWeight: 'medium', marginTop: '10px', marginBottom: '15px' }}>
          Select Network:
        </p>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          style={{
            width: '100%',
            background: 'white',
            border: '2px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
          }}
        >
          <option value="sepholia">Sepholia</option>
          <option value="mumbai">Mumbai</option>
        </select>
      </div>
   
      <button
        onClick={deployContract}
        style={{
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '16px',
          width: '100%',
          background: '#4109af',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        disabled={loading}
      >
        {loading ? 'Deploying...' : 'Deploy Contract'}
      </button>
      {contractAddress && (
        <div style={{ marginTop: '1rem' }}>
          
          <p style={{ fontSize: '14px', color: 'white' }}>
            Contract Address: {contractAddress}
          </p>
        </div>
      )}
    </div>
  );
}
