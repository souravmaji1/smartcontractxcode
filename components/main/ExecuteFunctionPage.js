import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ExecuteFunctionPage = () => {
  const { contractAddress, functionName } = useParams();

  const [writeFunctionInputs, setWriteFunctionInputs] = useState([]);
  const [functionResult, setFunctionResult] = useState(null);

  useEffect(() => {
    // Fetch function details or perform any initialization here

    // Example: Fetch function details based on contractAddress and functionName
     const fetchData = async () => {
       const response = await axios.get(`https://smartcontractx.onrender.com/function-details/${contractAddress}/${functionName}`);
       // Set input fields or other necessary data
       setWriteFunctionInputs(response.data.inputs);
     };
     fetchData();
  }, [contractAddress, functionName]);

  const handleInputChange = (index, value) => {
    const updatedInputs = [...writeFunctionInputs];
    updatedInputs[index] = value;
    setWriteFunctionInputs(updatedInputs);
  };

  const handleExecuteFunction = async () => {
    try {
      // Perform validation on writeFunctionInputs if needed

      // Prepare input data for the write function
      const inputData = {};
      writeFunctionInputs.forEach((input, index) => {
        inputData[input.name] = writeFunctionInputs[index];
      });

      // Make a POST request with input data
      const response = await axios.post(`https://smartcontractx.onrender.com/execute-write-function/${contractAddress}/${functionName}`, {
        inputValues: inputData,
      });

      console.log(response.data);
      // Handle the response as needed
      setFunctionResult(response.data.result);
    } catch (error) {
      console.error('Error executing write function:', error);
    }
  };

  return (
    <div>
      <h2>Execute Write Function: {functionName}</h2>
      {writeFunctionInputs.map((input, index) => (
        <div key={index}>
          <label>{input.name}</label>
          <input type="text" value={writeFunctionInputs[index]} onChange={(e) => handleInputChange(index, e.target.value)} />
        </div>
      ))}
      <button onClick={handleExecuteFunction}>Execute Write Function</button>
      {functionResult && <p>Write Function Result: {functionResult}</p>}
    </div>
  );
};

export default ExecuteFunctionPage;
