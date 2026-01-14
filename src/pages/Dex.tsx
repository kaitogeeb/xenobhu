import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { SwapInterface } from '@/components/SwapInterface';
import { LynxAnimation } from '@/components/LynxAnimation';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { getChainById } from '@/lib/chains';
import { Token, getTokensForChain } from '@/lib/tokens';

const Dex = () => {
  const { chainId } = useEVMWallet();
  const chainConfig = getChainById(chainId);
  const chainTokens = getTokensForChain(chainId);

  const defaultFromToken: Token = chainTokens[0] || {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    chainId: 1,
  };

  const defaultToToken: Token = chainTokens[1] || {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    chainId: 1,
  };

  const [dexScreenerToken, setDexScreenerToken] = useState(defaultFromToken.address);

  const handleFromTokenChange = (token: Token) => {
    setDexScreenerToken(token.address);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <LynxAnimation />
      <Navigation />

      <div className="relative z-10 pt-20 md:pt-24 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-extrabold text-gradient">DEX Trading</h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Trade and analyze tokens on {chainConfig?.name || 'EVM'} in real-time
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 flex justify-center order-2 lg:order-1"
            >
              <SwapInterface
                defaultFromToken={defaultFromToken}
                defaultToToken={defaultToToken}
                onFromTokenChange={handleFromTokenChange}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-8 order-1 lg:order-2"
            >
              <div className="relative min-h-[360px] sm:min-h-[400px] lg:min-h-[600px]">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl opacity-20 blur-xl animate-pulse-glow" />
                <div className="relative glass-card rounded-2xl overflow-hidden h-[360px] sm:h-[400px] lg:h-[600px]">
                  <iframe
                    key={dexScreenerToken}
                    src={`https://dexscreener.com/${chainConfig?.dexScreenerId || 'ethereum'}/${dexScreenerToken}?embed=1&theme=dark&trades=0&info=0`}
                    className="w-full h-full border-0"
                    title="DEXScreener Chart"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dex;
