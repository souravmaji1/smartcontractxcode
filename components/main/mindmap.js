'use client';
// pages/index.js
import React, { useState } from 'react';
import axios from 'axios';
import { Tree } from 'react-d3-tree';
import './custom-tree.css';


const ContractExplorer = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [contractInfo, setContractInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchContractInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/contract-info/${contractAddress}`);

      if (response.data.contractABI) {
        setContractInfo(response.data.contractABI);
      } else {
        console.error('Error fetching contract ABI:', response.data.error);
        setContractInfo(null);
      }
    } catch (error) {
      console.error('Error fetching contract information:', error);
      setContractInfo(null);
    }
    finally {
      setLoading(false);
    }
  };

  const generateTreeData = () => {
    if (!contractInfo || !Array.isArray(contractInfo)) return null;

    const treeData = {
      name: 'Contract',
      attributes: {},
      children: contractInfo.map((item, index) => {
        if (item.type === 'constructor') {
          return {
            name: 'Constructor',
            attributes: { stateMutability: item.stateMutability },
            children: item.inputs.map((input, i) => ({
              name: `${input.name}: ${input.type}`,
              attributes: {},
              children: [],
            })),
          };
        } else if (item.type === 'event' || item.type === 'function') {
          return {
            name: `${item.type}: ${item.name || `Unnamed_${index}`}`,
            attributes: {},
            children: item.inputs.map((input, i) => ({
              name: `${input.name}: ${input.type}`,
              attributes: {},
              children: [],
            })),
          };
        } else {
          return null;
        }
      }),
    };

    return treeData;
  };

  const straightPathFunc = (linkDatum, orientation) => {
    const { source, target } = linkDatum;
    return orientation === 'horizontal'
      ? `M${source.y},${source.x}L${target.y},${target.x}`
      : `M${source.x},${source.y}L${target.x},${target.y}`;
  };

 


  return (
    <div
      className="flex flex-row items-center justify-center px-20 mt-40 w-full z-[20]"
      style={{ marginBottom: '76px', marginTop: '140px' }}
    >
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
        <h1
          style={{
            color: 'white',
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '30px',
            fontWeight: '700',
            fontFamily: 'sans-serif',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            width: '100%',
            background: '#4109af',
          }}
        >
          Smart Contract MindMap
        </h1>
        <label style={{color:'white'}}>
          Contract Address:
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            style={{
              width: '100%',
              background: 'white',
              border: '2px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              color:'black',
              marginBottom: '1.5rem',
            }}
          />
        </label>
        <button
          onClick={fetchContractInfo}
          style={{
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '16px',
            width: '100%',
            background: '#4109af',
            cursor: 'pointer',
            marginBottom: '1.5rem',
          }}
          disabled={loading}
        >
        {loading ? 'Generating MindMap...' : 'View'}
        </button>

        {contractInfo ? (
          <div style={{ width: '100%', height: '500px',background:'grey',borderRadius:'10px' }}>
            <Tree data={[generateTreeData()]}
              pathFunc={straightPathFunc}
             rootNodeClassName="node__root"
             branchNodeClassName="node__branch"
             leafNodeClassName="node__leaf"
            />
           
          </div>
        ) : (
          <p style={{ color: 'white' }}>No contract information available.</p>
        )}
      </div>
    </div>
  );
};

export default ContractExplorer;
