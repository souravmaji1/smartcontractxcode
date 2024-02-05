'use client'

// ContractExplorer.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ContractExplorer = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [contractABI, setContractABI] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
 

  const [loading, setLoading] = useState(false);

  const [userEmailInput, setUserEmail] = useState('');




  const fetchContractABI = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://smartcontractx.onrender.com/contract-info/${contractAddress}`);
      setContractABI(response.data.contractABI);
    } catch (error) {
      console.error('Error fetching contract ABI:', error);
    }
    finally{
      setLoading(false);
    }
  };


  const handleFunctionSelect = (functionName) => {
    const selectedFunc = contractABI.find((func) => func.name === functionName);
    setSelectedFunction(selectedFunc);
  };

 


  const trackevent = async () => {
    try {

      // Call the backend configure endpoint
      const response = await axios.post('http://localhost:4000/configure', {
        contract: contractAddress,
        event: selectedFunction.name,
        email: userEmailInput,
      });

      console.log(response.data);  // Log the response from the backend (for debugging)

    } catch (error) {
      console.error('Error handling function selection:', error);
    }
  };



  useEffect(() => {
    // Clear selected function, result, and API endpoint when the contract ABI changes
    setSelectedFunction(null);
  //  setFunctionResult(null);
    //setApiEndpoint('');
  }, [contractABI]);

  const events = contractABI ? contractABI.filter((item) => item.type === 'event') : [];

  return (
    <div className="flex flex-col items-center justify-center px-20 mt-40 w-full z-[20]">
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
        <h1 style={{ color: 'white', marginBottom: '1rem', textAlign: 'center', fontSize: '30px', fontWeight: '700', fontFamily: 'sans-serif', color: 'white', padding: '8px 16px', borderRadius: '8px', width: '100%', background: '#4109af' }}>Track Your Smart Contract</h1>
        <label style={{ color: 'white' }}>
          Contract Address:
          <input
            style={{
              color: 'black',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginBottom: '20px',
              width: '100%',
            }}
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </label>

        <button
          onClick={fetchContractABI}
          style={{
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '16px',
            background: '#4109af',
            cursor: 'pointer',
            border: 'none',
            display: 'flex',
            margin: 'auto',
            outline: 'none',
          }}
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Fetch Contract'}
        </button>

        {contractABI && (
          <div style={{ display: 'flex', marginTop: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: 'white' }}>Events:</h2>
              <table style={{ width: '100%', border: '1px solid white', color: 'white' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid white' }}>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={index} style={{ border: '1px solid white' }}>
                      <td
                        style={{ border: '1px solid white', cursor: 'pointer' }}
                        onClick={() => handleFunctionSelect(event.name)}
                      >
                        {event.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedFunction && (
          <div style={{ marginTop: '20px', border: '1px solid #7042f88b', borderRadius: '8px', padding: '20px', background: '#151515' }}>
            <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Selected Function: {selectedFunction.name}</h2>

           
              <div  style={{ marginBottom: '15px' }}>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '5px' }}>
                  Enter Your Email
                </label>
                <input
                  type="text"
                  value={userEmailInput}
                  onChange={(e) => setUserEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#282c34',
                    border: '2px solid #777',
                    color: '#ffffff',
                    borderRadius: '4px',
                    padding: '8px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            

            <button
              onClick={trackevent}
              style={{
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '16px',
                background: '#4109af',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
              }}
            >
              Track Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractExplorer;
