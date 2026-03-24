import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';

interface WalletContextProps {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  isMetaMaskInstalled: boolean;
  network: string | null;
  error: string | null;
  balance: string | null;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

// this just try get the MetaMask thing, hope it works lol
const getMetaMaskProvider = () => {
  if (typeof window === 'undefined') return null;

  const ethereum = (window as any).ethereum;
  if (!ethereum) return null;

  // like, sometimes there's a bunch of providers, so let's find MetaMask
  if (ethereum.providers && Array.isArray(ethereum.providers)) {
    const metamaskProvider = ethereum.providers.find((provider: any) => {
      return provider.isMetaMask && !provider.isCoinbaseWallet;
    });
    return metamaskProvider || null;
  }

  // fallback if just one
  if (ethereum.isMetaMask && !ethereum.isCoinbaseWallet) {
    return ethereum;
  }

  return null;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [network, setNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  // just disconnect everything, like, bye wallet
  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setNetwork(null);
    setError(null);
  };

  // Fetch balance whenever address or network changes
  useEffect(() => {
    const fetchBalance = async () => {
      const ethereum = getMetaMaskProvider();
      if (ethereum && address) {
        try {
          const result = await ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
          });
          // Convert from hex to ETH
          setBalance((parseInt(result, 16) / 1e18).toFixed(4));
        } catch (e) {
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    };
    fetchBalance();
  }, [address, network]);

  useEffect(() => {
    const ethereum = getMetaMaskProvider();
    if (ethereum) {
      setIsMetaMaskInstalled(true);
      // try get accounts, hope it works
      ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        setAddress(accounts[0] || null);
        setIsConnected(accounts.length > 0);
      });
      ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => setNetwork(chainId));
      const handleAccountsChanged = (accounts: string[]) => {
        setAddress(accounts[0] || null);
        setIsConnected(accounts.length > 0);
        setError(null); // clear errors, maybe
        window.dispatchEvent(new CustomEvent('wallet:accountChanged'));
      };
      const handleChainChanged = (chainId: string) => {
        setNetwork(chainId);
        // get accounts again, idk
        ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
          setAddress(accounts[0] || null);
          setIsConnected(accounts.length > 0);
        });
      };
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      // cleanup, I guess
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    } else {
      setIsMetaMaskInstalled(false);
    }
  }, []);

  // connect, or at least try lol
  const connect = async () => {
    setError(null);
    const ethereum = getMetaMaskProvider() as MetaMaskInpageProvider;
    if (!ethereum) {
      setIsMetaMaskInstalled(false);
      setError("MetaMask ain't installed or like, not found. Try reload or turn off other wallet stuff.");
      return;
    }
    try {
      if (ethereum.isMetaMask !== true) {
        setError("This provider ain't MetaMask. Maybe turn off other wallet extensions and reload?");
        setIsConnected(false);
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        setError("No account found in MetaMask. That's weird.");
        setIsConnected(false);
        return;
      }
      setAddress(accounts[0]);
      setIsConnected(true);
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      setNetwork(chainId);
    } catch (err: any) {
      setIsConnected(false);
      if (err && err.message) {
        setError("Oops, error: " + err.message);
      } else {
        setError("Something went wrong connecting MetaMask. idk");
      }
    }
  };

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect, isMetaMaskInstalled, network, error, balance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
