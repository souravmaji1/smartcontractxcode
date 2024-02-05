'use client'
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CodeExample = () => {
  const [isCopied, setCopied] = useState(false);

  const codeString = ` <iframe
  src="https://blue-bonus-3931.on.fleek.co/"
  width="600px"
  height="600px"
  style={{ maxWidth: '100%' }}
></iframe>;`;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex justify-center items-center"
    style={{
      
      border: '2px solid #7042f88b',
      borderRadius: '8px',
     
      background: 'linear-gradient(45deg, #2a0e61, #010108)',
    }}
    >
      <div className="bg-white p-6 rounded-md shadow-md relative">
        <h2 className="text-2xl font-semibold mb-4">Widget Code</h2>
        <CopyToClipboard text={codeString} onCopy={handleCopy}>
          <button
            className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none"
            title="Copy to Clipboard"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </CopyToClipboard>
        <SyntaxHighlighter language="javascript" style={solarizedlight}>
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeExample;
