'use client'
import { Socials } from "@/constants";
import Image from "next/image";
import React from "react";
import { useState } from "react";


const Navbar = () => {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('Not Connected');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
        window.ethereum.on('accountsChanged', handleAccountsChanged);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setStatus('Not Connected');
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
      disconnectWallet();
    } else if (accounts[0] !== account) { // Check if the new account is different
      setAccount(accounts[0]);
      setStatus('Connected');
    }
  };
  

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[10px]">
        <a
          href="/"
          className="h-auto w-auto flex flex-row items-center"
        >
          <Image
            src="/NavLogo.png"
            alt="logo"
            width={70}
            height={70}
            className="cursor-pointer hover:animate-slowspin"
          />

          <span className="font-bold ml-[10px] hidden md:block text-gray-300">
            SmartContractX
          </span>
        </a>

        <div className="w-[500px] h-full flex flex-row items-center justify-between md:mr-20">
          <div className="flex items-center justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200">
            <a href="/" className="cursor-pointer">
              Deploy
            </a>
            <a href="/code" className="cursor-pointer">
              Write
            </a>
            <a href="/verify" className="cursor-pointer">
              Automate
            </a>
            <a href="/mindmap" className="cursor-pointer">
              Mindmap
            </a>
            <a href="/notification" className="cursor-pointer">
              Track
            </a>
            <a href="/readwrite" className="cursor-pointer">
              Test
            </a>
          </div>
        </div>

        <div className="flex flex-row gap-5">
        {status !== 'Connected' && (
            <button
            style={{ border: '2px solid #7042f88b',background: 'linear-gradient(45deg, #2a0e61, #010108)'}}
              onClick={connectWallet}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
              Connect Wallet
            </button>
          )}
          {status === 'Connected' && (
            <button
            style={{ border: '2px solid #7042f88b',background: 'linear-gradient(45deg, #2a0e61, #010108)'}}
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline-red active:bg-red-800"
            >
              Disconnect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
