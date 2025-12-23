import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { SwapInterface } from '@/components/SwapInterface';
import { PegasusAnimation } from '@/components/PegasusAnimation';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

const Dex = () => {
  const defaultFromToken: Token = {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  };

  const defaultToToken: Token = {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  };

  const [dexScreenerToken, setDexScreenerToken] = useState('So11111111111111111111111111111111111111112');

  const handleFromTokenChange = (token: Token) => {
    setDexScreenerToken(token.address);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PegasusAnimation />
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
              Trade and analyze tokens in real-time
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
                    src={`https://dexscreener.com/solana/${dexScreenerToken}?embed=1&theme=dark&trades=0&info=0`}
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
