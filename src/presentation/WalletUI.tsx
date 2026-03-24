
import React, { useEffect, useState } from 'react';
import { useWallet } from './WalletProvider';

export const WalletUI: React.FC = () => {
  const { address, isConnected, connect, disconnect, isMetaMaskInstalled, network, error } = useWallet();
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
      {/* lol, header and stuff */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-extrabold tracking-tight">Web3 Wallet</span>
        </div>
        <span className="text-lg text-gray-400 font-medium">MetaMask, hope it works</span>
      </div>

      {/* some instructions, maybe? */}
      <div className="max-w-lg w-full mb-8">
        <ul className="list-disc list-inside text-gray-300 text-base space-y-1">
          <li>Click connect for MetaMask. If not work, idk.</li>
          <li>Maybe turn off other wallet things (Uniswap, Coinbase, etc) if weird stuff happens.</li>
          <li>It should update when you change account or network, I think.</li>
        </ul>
      </div>

      {/* Alerts and messages, whatever */}
      {!isMetaMaskProvider && (
        <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-lg mb-4 border border-yellow-300 font-semibold shadow">
          Yo, this ain't MetaMask!<br />
          Try disable other wallet extensions, maybe helps.
        </div>
      )}
      {accountChanged && (
        <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg mb-4 font-semibold border border-blue-300 shadow animate-pulse">
          You changed MetaMask account! UI should update now (I hope).
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 px-6 py-3 rounded-lg mb-4 font-semibold border border-red-300 shadow">
          {error}
        </div>
      )}

      {/* Main card, looks cool */}
      <div className="bg-gray-800/80 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        {!isMetaMaskInstalled ? (
          <>
            <p className="mb-4 text-lg font-semibold">MetaMask not found, bro.</p>
            <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition">Go install MetaMask</a>
          </>
        ) : isConnected ? (
          <>
            <p className="text-lg font-semibold mb-2">Wallet is connected, yay:</p>
            <p className="font-mono text-xl text-orange-400 break-all mb-2">{address}</p>
            <p className="text-sm text-gray-400 mb-2">Network: <span className="text-orange-400 font-bold">{network}</span></p>
            <p className="text-xs text-gray-500 mb-4">Change account or network in MetaMask, should update here (maybe).</p>
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

      {/* Footer, whatever */}
      <footer className="mt-10 text-gray-500 text-xs text-center">
        Web3 test thing &mdash; Clean Architecture, SOLID, DDD (I guess)<br />
        Made by Guilherme &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
};
