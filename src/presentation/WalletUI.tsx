
import React, { useEffect, useState } from 'react';
import { useWallet } from './WalletProvider';

export const WalletUI: React.FC = () => {
  const { address, isConnected, connect, disconnect, isMetaMaskInstalled, network, error, balance } = useWallet();
  const [accountChanged, setAccountChanged] = useState(false);
  let isMetaMaskProvider = false;
  if (typeof window !== 'undefined') {
    const eth = (window as any).ethereum;
    if (eth?.isMetaMask) isMetaMaskProvider = true;
    if (eth?.providers && Array.isArray(eth.providers)) {
      isMetaMaskProvider = !!eth.providers.find((p: any) => p.isMetaMask);
    }
  }

  useEffect(() => {
    const handler = () => {
      setAccountChanged(true);
      setTimeout(() => setAccountChanged(false), 3500);
    };
    window.addEventListener('wallet:accountChanged', handler);
    return () => window.removeEventListener('wallet:accountChanged', handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      {/* Branding and header */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-extrabold tracking-tight">Web3 Wallet</span>
        </div>
        <span className="text-lg text-gray-400 font-medium">Professional integration with MetaMask</span>
      </div>

      {/* User instructions */}
      <div className="max-w-lg w-full mb-8">
        <ul className="list-disc list-inside text-gray-300 text-base space-y-1">
          <li>Connect your MetaMask wallet to access Web3 features.</li>
          <li>Disable other wallet extensions (Uniswap, Coinbase, etc) to avoid conflicts.</li>
          <li>Automatic account and network update support.</li>
        </ul>
      </div>

      {/* Alerts and messages */}
      {!isMetaMaskProvider && (
        <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-lg mb-4 border border-yellow-300 font-semibold shadow">
          Attention: The selected provider is not MetaMask!<br />
          Disable other wallet extensions to ensure correct connection.
        </div>
      )}
      {accountChanged && (
        <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg mb-4 font-semibold border border-blue-300 shadow animate-pulse">
          MetaMask account changed! Address updated in the interface.
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 px-6 py-3 rounded-lg mb-4 font-semibold border border-red-300 shadow">
          {error}
        </div>
      )}

      {/* Main card */}
      <div className="bg-gray-800/80 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        {!isMetaMaskInstalled ? (
          <>
            <p className="mb-4 text-lg font-semibold">MetaMask not detected.</p>
            <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition">Install MetaMask</a>
          </>
        ) : isConnected ? (
          <>
            <p className="text-lg font-semibold mb-2">Wallet connected:</p>
            <p className="font-mono text-xl text-orange-400 break-all mb-2">{address}</p>
            <p className="text-sm text-gray-400 mb-2">Network: <span className="text-orange-400 font-bold">{network}</span></p>
            <p className="text-sm text-green-400 mb-2">Balance: <span className="font-bold">{balance !== null ? balance + ' ETH' : '...'}</span></p>
            <p className="text-xs text-gray-500 mb-4">Switch account or network in MetaMask to see automatic updates.</p>
            <button onClick={disconnect} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg text-base shadow transition mt-2">
              Disconnect
            </button>
          </>
        ) : (
          <button onClick={connect} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow transition">
            Connect MetaMask
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-gray-500 text-xs text-center">
        Web3 test project &mdash; Clean Architecture, SOLID, DDD<br />
        Developed by Guilherme &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
};
