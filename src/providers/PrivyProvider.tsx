import { FC, ReactNode } from 'react';
import { PrivyProvider as PrivyAuthProvider } from '@privy-io/react-auth';
import { base, mainnet, polygon, bsc } from 'viem/chains';

interface PrivyProviderProps {
  children: ReactNode;
}

export const PrivyProvider: FC<PrivyProviderProps> = ({ children }) => {
  return (
    <PrivyAuthProvider
      appId="cmkddcb3600e9la0cg81otzu7"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#e81123',
          logo: '/favicon.png',
          showWalletLoginFirst: true,
          walletList: ['metamask', 'detected_wallets', 'rainbow', 'wallet_connect', 'coinbase_wallet', 'phantom'],
        },
        loginMethods: ['wallet'],
        defaultChain: bsc,
        supportedChains: [bsc, mainnet, polygon, base],
      }}
    >
      {children}
    </PrivyAuthProvider>
  );
};
