import React from 'react';
import { WalletProvider } from './presentation/WalletProvider';
import { WalletUI } from './presentation/WalletUI';

function App() {
  return (
    <WalletProvider>
      <WalletUI />
    </WalletProvider>
  );
}

export default App;
