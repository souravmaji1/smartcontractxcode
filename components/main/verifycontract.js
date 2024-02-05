'use client'

// ContractExplorer.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ContractExplorer = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [contractABI, setContractABI] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionInputs, setFunctionInputs] = useState([]);
  const [functionResult, setFunctionResult] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedWriteFunction, setSelectedWriteFunction] = useState(null);
  const [writeFunctionInputs, setWriteFunctionInputs] = useState([]);
  const [scheduleTime, setCronExpression] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  
  

  const presetButtonStyle = {
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '16px',
    background: '#4109af',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    marginRight: '10px',
  };



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

    // Reset function inputs
    setFunctionInputs(Array(selectedFunc.inputs.length).fill(''));
    setFunctionResult(null);

    // Generate API endpoint for the selected function
    const apiEndpoint = `https://smartcontractx.onrender.com/execute-contract/${contractAddress}/${selectedFunc.name}`;
    setApiEndpoint(apiEndpoint);
  };

  const handleInputChange = (index, value) => {
    const updatedInputs = [...functionInputs];
    updatedInputs[index] = value;
    setFunctionInputs(updatedInputs);


    // Update API endpoint with input values
    if (selectedFunction) {
      const apiEndpoint = `https://smartcontractx.onrender.com/execute-contract/${contractAddress}/${selectedFunction.name}?${selectedFunction.inputs.map((input, i) => `${input.name}=${encodeURIComponent(updatedInputs[i])}`).join('&')}`;
      setApiEndpoint(apiEndpoint);
    }
  };

  const handleWriteFunctionSelect = (functionName) => {
    const selectedFunc = contractABI.find((func) => func.name === functionName);
    setSelectedWriteFunction(selectedFunc);

    // Reset write function inputs and cron expression
    setWriteFunctionInputs(Array(selectedFunc.inputs.length).fill(''));
    setCronExpression('');
  };

  // ... (previous code)

  const handleInputChangeWriteFunction = (index, value) => {
    const updatedInputs = [...writeFunctionInputs];
    updatedInputs[index] = value;
    setWriteFunctionInputs(updatedInputs);
  };

  const handleTestFunction = async () => {
    try {
      if (!selectedFunction) {
        console.error('No function selected.');
        return;
      }

      const response = await axios.post(`https://smartcontractx.onrender.com/test-contract/${contractAddress}`, {
        functionName: selectedFunction.name,
        inputValues: functionInputs,
      });
      console.log(response);

      setFunctionResult(response.data.result);
    } catch (error) {
      console.error('Error testing contract function:', error);
    }
  };

  const presetCronExpressions = {
    everySecond: '* * * * * *',
    everyMinute: '* * * * *',
    everyHour: '* */1 * * *',
    everyDay: '0 0 * * *',
  };

  const handlePresetSchedule = (scheduleTime) => {
    // Set the selected cron expression
    setCronExpression(scheduleTime);
    setSelectedSchedule(scheduleTime);
  };


  const handleScheduleWriteFunction = async () => {
    try {
      setLoading(true);
      if (!selectedWriteFunction) {
        console.error('No write function selected.');
        return;
      }
  
      // Prepare input data for the write function
      const inputData = {};
      selectedWriteFunction.inputs.forEach((input, index) => {
        inputData[input.name] = writeFunctionInputs[index];
      });

      // Log the request payload
    console.log('Request Payload:', {
      contractAddress,
      functionName: selectedWriteFunction.name,
      inputValues: inputData,
      scheduleTime: scheduleTime,
    });
  
      // Make a POST request with input data
      const response = await axios.post(`http://localhost:5000/schedule-function`, {
        contractAddress,
        functionName: selectedWriteFunction.name,
        inputValues: inputData,
        scheduleTime: scheduleTime,
      });

     
      // Handle the response as needed
    } catch (error) {
      console.error('Error scheduling contract function:', error);
    }
    finally {
      setLoading(false);
    }
  };

 


  const getReadFunctionDataExample = () => {
    if (selectedFunction && selectedFunction.stateMutability === 'view') {
      const axiosGetCode = `
import axios from 'axios';

const apiEndpoint = '${apiEndpoint}';

axios.get(apiEndpoint)
  .then((response) => {
    console.log('Read Function Data:', response.data);
  })
  .catch((error) => {
    console.error('Error making GET request:', error);
  });
      `;
      return axiosGetCode;
    }
    return null;
  };

  // Example function to make a POST request for write functions
  const postWriteFunctionDataExample = () => {
    if (selectedFunction && selectedFunction.stateMutability !== 'view') {
      const inputData = {
        // Replace with the actual input data for the write function
      };

      const axiosPostCode = `
import axios from 'axios';

const apiEndpoint = '${apiEndpoint}';
const inputData = ${JSON.stringify(inputData, null, 2)};

axios.post(apiEndpoint, inputData)
  .then((response) => {
    console.log('Write Function Data:', response.data);
  })
  .catch((error) => {
    console.error('Error making POST request:', error);
  });
      `;
      return axiosPostCode;
    }
    return null;
  };

  

  useEffect(() => {
    // Clear selected function, result, and API endpoint when the contract ABI changes
    setSelectedFunction(null);
    setFunctionResult(null);
    setApiEndpoint('');
  }, [contractABI]);

  const events = contractABI ? contractABI.filter((item) => item.type === 'event') : [];
  const readFunctions = contractABI ? contractABI.filter((item) => item.stateMutability === 'view') : [];
  const writeFunctions = contractABI ? contractABI.filter((item) => item.stateMutability !== 'view') : [];

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
 <h1 style={{ color: 'white', marginBottom: '1rem', textAlign: 'center' ,fontSize:'30px',fontWeight:'700',fontFamily:'sans-serif', color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            width: '100%',
            background: '#4109af' }}>Automate Your Smart Contract</h1>
        <label style={{ color: 'white' }}>
          Contract Address:
          <input
            style={{
              color: 'black',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginBottom:'20px',
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
            display:'flex',
            margin:'auto',
            outline: 'none',
          }}
          disabled={loading}
        >
         {loading ? 'Fetching...' : 'Fetch Contract'}
        </button>

     



{selectedFunction && (
  <div style={{ marginTop: '20px', border: '1px solid #7042f88b', borderRadius: '8px', padding: '20px', background: '#151515' }}>
    <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Selected Function: {selectedFunction.name}</h2>

    {selectedFunction.inputs.map((input, index) => (
      <div key={index} style={{ marginBottom: '15px' }}>
        <label style={{ color: '#ffffff', display: 'block', marginBottom: '5px' }}>
          {input.name} ({input.type}):
        </label>
        <input
          type="text"
          value={functionInputs[index]}
          onChange={(e) => handleInputChange(index, e.target.value)}
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
    ))}
  </div>
)}



{apiEndpoint && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>API Endpoint:</h3>
                <p style={{ color: '#ffffff', background: '#282c34', padding: '15px', borderRadius: '8px' }}>{apiEndpoint}</p>
                {selectedFunction.stateMutability === 'view' && (
                  <div style={{ marginTop: '10px' }}>
                    <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Axios GET Request Example:</h3>
                    <pre style={{ color: '#ffffff', background: '#282c34', padding: '15px', borderRadius: '8px', overflowX: 'auto' }}>
                      {getReadFunctionDataExample()}
                    </pre>
                  </div>
                )}
                {selectedFunction.stateMutability !== 'view' && (
                  <div style={{ marginTop: '10px' }}>
                    <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Axios POST Request Example:</h3>
                    <pre style={{ color: '#ffffff', background: '#282c34', padding: '15px', borderRadius: '8px', overflowX: 'auto' }}>
                      {postWriteFunctionDataExample()}
                    </pre>
                  </div>
                )}
              </div>
            )}


{writeFunctions.length > 0 && (
        <div style={{ marginTop: '20px', border: '1px solid #7042f88b', borderRadius: '8px', padding: '20px', background: '#151515' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Schedule Write Function:</h2>

          {/* Contract address input */}
          <label style={{ color: '#ffffff', display: 'block', marginBottom: '15px' }}>
            Contract Address:
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
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
          </label>

          {/* Select write function */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#ffffff', display: 'block', marginBottom: '5px' }}>Select Write Function:</label>
            <select
              value={selectedWriteFunction ? selectedWriteFunction.name : ''}
              onChange={(e) => handleWriteFunctionSelect(e.target.value)}
              style={{
                width: '100%',
                background: '#282c34',
                border: '2px solid #777',
                color: '#ffffff',
                borderRadius: '4px',
                padding: '8px',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select a function...</option>
              {writeFunctions.map((func) => (
                <option key={func.name} value={func.name}>
                  {func.name}
                </option>
              ))}
            </select>
          </div>

          {/* Input fields for write function */}
          {selectedWriteFunction &&
            selectedWriteFunction.inputs.map((input, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '5px' }}>
                  {input.name} ({input.type}):
                </label>
                <input
                  type="text"
                  value={writeFunctionInputs[index]}
                  onChange={(e) => handleInputChangeWriteFunction(index, e.target.value)}
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
            ))}

          {/* Cron expression input */}
          <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#ffffff', display: 'block', marginBottom: '5px' }}>Select Schedule:</label>
            <button
              onClick={() => handlePresetSchedule(presetCronExpressions.everySecond)}
              style={{ ...presetButtonStyle, background: selectedSchedule === presetCronExpressions.everySecond ? 'green' : '#4109af' }}
            >
              Every Second
            </button>
            <button
              onClick={() => handlePresetSchedule(presetCronExpressions.everyMinute)}
              style={{ ...presetButtonStyle, background: selectedSchedule === presetCronExpressions.everyMinute ? 'green' : '#4109af' }}
            >
              Every Minute
            </button>
            <button
              onClick={() => handlePresetSchedule(presetCronExpressions.everyHour)}
              style={{ ...presetButtonStyle, background: selectedSchedule === presetCronExpressions.everyHour ? 'green' : '#4109af' }}
            >
              Every Hour
            </button>
            <button
              onClick={() => handlePresetSchedule(presetCronExpressions.everyDay)}
              style={{ ...presetButtonStyle, background: selectedSchedule === presetCronExpressions.everyDay ? 'green' : '#4109af' }}
            >
              Every Day
            </button>
          </div>
        </div>

          <label style={{ color: '#ffffff', display: 'block', marginBottom: '5px' }}>Final Step:</label>
          {/* Schedule button */}
          <button
            onClick={handleScheduleWriteFunction}
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
            disabled={loading}
          >
             {loading ? 'Automating...' : 'Start Automation'}
          </button>
        </div>
      )}




      </div>
      
     
      
    </div>
  );
};

export default ContractExplorer;

