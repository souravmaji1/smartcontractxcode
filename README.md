'use client';
import { useState } from 'react';
import OpenAI from 'openai';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [chatCompletion, setChatCompletion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const openai = new OpenAI({
        apiKey, // Use the user-provided API key
        dangerouslyAllowBrowser: true,
      });

      const response = await openai.chat.completions.create({
        messages: [
          { role: 'user', content: `You are an expert smart contract developer, and I want you to write a smart contract based on this detail: ${userInput}` },
        ],
        model: 'gpt-3.5-turbo', // Adjust the model based on your needs
      });

      setChatCompletion(response.choices[0]?.message?.content || 'No result');
    } catch (error) {
      console.error('Error fetching chat completion:', error);
      setChatCompletion('Error fetching result');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      className="flex flex-row items-center justify-center px-20  w-full z-[20]"
      style={{ marginBottom: '76px' }}
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
        <div style={{ marginBottom: '1.5rem' }}>
          <p
            style={{
              fontSize: '20px',
              color: 'white',
              fontWeight: 'medium',
              marginTop: '10px',
              marginBottom: '15px',
            }}
          >
            Write Your Smart Contract Specification:
          </p>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your question or message here..."
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
          Enter Your OpenAI API Key:
        </p>
        <input
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your API key here..."
          style={{
            width: '100%',
            background: 'white',
            border: '2px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
          }}
        />
      </div>

        <button
          onClick={handleSubmit}
          style={{
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '16px',
            width: '100%',
            background: '#4109af',
            cursor: 'pointer',
          }}
        >
          Generate
        </button>

        {/* Display the loader while loading */}
        {isLoading && <div style={{ marginTop: '1.5rem', color: 'white' }}>Loading...</div>}

        {/* Display the result */}
        {!isLoading && (
          <div style={{ marginTop: '1.5rem', color: 'white' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Result:</p>
            <div
              style={{
                background: 'black',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                border: '2px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                whiteSpace: 'pre-wrap',
                overflowX: 'auto',
              }}
            >
              {chatCompletion}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
