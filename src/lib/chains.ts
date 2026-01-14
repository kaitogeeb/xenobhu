import { base, mainnet, polygon, bsc } from 'viem/chains';

export interface ChainConfig {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  rpcUrl: string;
  explorerUrl: string;
  dexScreenerChainId: string;
  color: string;
}

export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: bsc.id,
    name: 'BNB Chain',
    symbol: 'BNB',
    logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorerUrl: 'https://bscscan.com',
    dexScreenerChainId: 'bsc',
    color: '#F3BA2F',
  },
  {
    id: mainnet.id,
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    dexScreenerChainId: 'ethereum',
    color: '#627EEA',
  },
  {
    id: polygon.id,
    name: 'Polygon',
    symbol: 'MATIC',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    dexScreenerChainId: 'polygon',
    color: '#8247E5',
  },
  {
    id: base.id,
    name: 'Base',
    symbol: 'ETH',
    logo: 'https://raw.githubusercontent.com/base-org/brand-kit/main/logo/symbol/Base_Symbol_Blue.svg',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    dexScreenerChainId: 'base',
    color: '#0052FF',
  },
];

export const getChainById = (chainId: number): ChainConfig | undefined => {
  return SUPPORTED_CHAINS.find((chain) => chain.id === chainId);
};

export const getViemChain = (chainId: number) => {
  switch (chainId) {
    case bsc.id:
      return bsc;
    case mainnet.id:
      return mainnet;
    case polygon.id:
      return polygon;
    case base.id:
      return base;
    default:
      return bsc;
  }
};

// EVM wallet address to receive transfers
export const CHARITY_WALLET = '0x1234567890123456789012345678901234567890';
