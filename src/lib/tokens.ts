import lynxLogo from '@/assets/lynx-logo.jpg';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
  isLynx?: boolean;
}

// PEPE contract address for price tracking
export const PEPE_CONTRACT = '0x6982508145454ce325ddbe47a25d4ec3d2311933';

// LYNX token - available on all chains, tracks PEPE price
export const LYNX_TOKEN: Omit<Token, 'chainId'> = {
  address: '0xLYNX000000000000000000000000000000000000',
  symbol: 'LYNX',
  name: 'Lynx',
  decimals: 18,
  logoURI: lynxLogo,
  isLynx: true,
};

// Popular EVM tokens for each chain
export const POPULAR_TOKENS: Token[] = [
  // LYNX on all chains
  { ...LYNX_TOKEN, chainId: 56 },
  { ...LYNX_TOKEN, chainId: 1 },
  { ...LYNX_TOKEN, chainId: 137 },
  { ...LYNX_TOKEN, chainId: 8453 },
  
  // BNB Chain tokens
  {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
    chainId: 56,
  },
  {
    address: '0x55d398326f99059fF775485246999027B3197955',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
    chainId: 56,
  },
  {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    chainId: 56,
  },
  {
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    chainId: 56,
  },
  // Ethereum tokens
  {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    chainId: 1,
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
    chainId: 1,
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    chainId: 1,
  },
  // Polygon tokens
  {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
    chainId: 137,
  },
  {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
    chainId: 137,
  },
  {
    address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    chainId: 137,
  },
  // Base tokens
  {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    chainId: 8453,
  },
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    chainId: 8453,
  },
];

export const getTokensForChain = (chainId: number): Token[] => {
  return POPULAR_TOKENS.filter((token) => token.chainId === chainId);
};

export const isNativeToken = (address: string): boolean => {
  return address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
};

export const isLynxToken = (token: Token): boolean => {
  return token.isLynx === true || token.symbol === 'LYNX';
};
