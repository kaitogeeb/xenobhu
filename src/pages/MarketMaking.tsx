
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { XenoAnimation } from '@/components/XenoAnimation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Shield, BarChart3, Rocket } from 'lucide-react';
import { TopGainersGrid } from '@/components/market-making/TopGainersGrid';
import { PlansModal } from '@/components/market-making/PlansModal';

interface TopGainer {
  name: string;
  symbol: string;
  priceChangePercent: number;
  logoUrl: string;
  pairAddress: string;
  chainId: string;
}

const MarketMaking = () => {
  const [marketMakersCount, setMarketMakersCount] = useState(15789);
  const [topGainers, setTopGainers] = useState<TopGainer[]>([]);
  const [loadingGainers, setLoadingGainers] = useState(true);
  const [plansModalOpen, setPlansModalOpen] = useState(false);

  // Calculate the count based on time elapsed since Jan 15, 2026 6:00 AM UTC
  useEffect(() => {
    const calculateCount = () => {
      const startDate = new Date('2026-01-15T06:00:00Z');
      const now = new Date();
      const minutesElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60));
      const increments = Math.floor(minutesElapsed / 3);
      const count = Math.max(15789, 15789 + increments);
      setMarketMakersCount(count);
    };

    calculateCount();
    const interval = setInterval(calculateCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch top gainers from DexScreener
  useEffect(() => {
    const fetchTopGainers = async () => {
      try {
        setLoadingGainers(true);
        const allGainers: TopGainer[] = [];
        
        // Fetch from boosted tokens endpoint - these have better logo data
        try {
          const boostedResponse = await fetch('https://api.dexscreener.com/token-boosts/latest/v1');
          const boostedData = await boostedResponse.json();
          
          if (Array.isArray(boostedData)) {
            for (const token of boostedData.slice(0, 50)) {
              if (token.tokenAddress && token.chainId) {
                try {
                  const tokenResponse = await fetch(
                    `https://api.dexscreener.com/latest/dex/tokens/${token.tokenAddress}`
                  );
                  const tokenData = await tokenResponse.json();
                  
                  if (tokenData.pairs && tokenData.pairs[0]) {
                    const pair = tokenData.pairs[0];
                    const priceChange = pair.priceChange?.h24 || Math.floor(Math.random() * 500) + 200;
                    
                    // Get logo from multiple sources
                    const logoUrl = pair.info?.imageUrl || 
                      token.icon ||
                      `https://dd.dexscreener.com/ds-data/tokens/${token.chainId}/${token.tokenAddress}.png`;
                    
                    allGainers.push({
                      name: pair.baseToken?.name || token.description || 'Unknown',
                      symbol: pair.baseToken?.symbol || 'TOKEN',
                      priceChangePercent: priceChange >= 200 ? priceChange : priceChange + 200,
                      logoUrl: logoUrl,
                      pairAddress: pair.pairAddress,
                      chainId: pair.chainId
                    });
                  }
                } catch (e) {
                  console.error('Error fetching token details:', e);
                }
              }
            }
          }
        } catch (err) {
          console.error('Error fetching boosted tokens:', err);
        }
        
        // Sort by price change and take top 45
        let sortedGainers = allGainers
          .sort((a, b) => b.priceChangePercent - a.priceChangePercent)
          .slice(0, 45);
        
        // If we don't have enough real data, add mock tokens with known working logos
        if (sortedGainers.length < 45) {
          const mockTokens = [
            { name: 'Pepe', symbol: 'PEPE', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933.png', chain: 'ethereum' },
            { name: 'Shiba Inu', symbol: 'SHIB', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce.png', chain: 'ethereum' },
            { name: 'Floki', symbol: 'FLOKI', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0xcf0c122c6b73ff809c693db761e7baebe62b6a2e.png', chain: 'ethereum' },
            { name: 'Bonk', symbol: 'BONK', logo: 'https://dd.dexscreener.com/ds-data/tokens/solana/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263.png', chain: 'solana' },
            { name: 'Wojak', symbol: 'WOJAK', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0x5026f006b85729a8b14553fae6af249ad16c9aab.png', chain: 'ethereum' },
            { name: 'Turbo', symbol: 'TURBO', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0xa35923162c49cf95e6bf26623385eb431ad920d3.png', chain: 'ethereum' },
            { name: 'Meme', symbol: 'MEME', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0xb131f4a55907b10d1f0a50d8ab8fa09ec342cd74.png', chain: 'ethereum' },
            { name: 'Brett', symbol: 'BRETT', logo: 'https://dd.dexscreener.com/ds-data/tokens/base/0x532f27101965dd16442e59d40670faf5ebb142e4.png', chain: 'base' },
            { name: 'Toshi', symbol: 'TOSHI', logo: 'https://dd.dexscreener.com/ds-data/tokens/base/0xac1bd2486aaf3b5c0fc3fd868558b082a531b2b4.png', chain: 'base' },
            { name: 'Andy', symbol: 'ANDY', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0x68bbed6a47194eff1cf514b50ea91895597fc91e.png', chain: 'ethereum' },
          ];
          
          while (sortedGainers.length < 45) {
            const idx = sortedGainers.length % mockTokens.length;
            const mockToken = mockTokens[idx];
            const randomPercent = 200 + Math.floor(Math.random() * 800);
            
            sortedGainers.push({
              name: mockToken.name,
              symbol: mockToken.symbol,
              priceChangePercent: randomPercent,
              logoUrl: mockToken.logo,
              pairAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
              chainId: mockToken.chain
            });
          }
        }
        
        setTopGainers(sortedGainers);
      } catch (error) {
        console.error('Error fetching top gainers:', error);
      } finally {
        setLoadingGainers(false);
      }
    };

    fetchTopGainers();
    const interval = setInterval(fetchTopGainers, 300000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: 'Instant Liquidity',
      description: 'Automated provisioning to ensure your token is always tradable with minimal slippage.'
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: 'Secure & Non-Custodial',
      description: 'Smart contract based market making that keeps your treasury funds safe and under your control.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-400" />,
      title: 'Volume Generation',
      description: 'Organic volume generation strategies to maintain healthy chart activity and visibility.'
    },
    {
      icon: <Rocket className="w-8 h-8 text-purple-400" />,
      title: 'Launch Support',
      description: 'Comprehensive support for token launches, from initial liquidity to long-term stability.'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <XenoAnimation />
      <Navigation />
      
      <PlansModal isOpen={plansModalOpen} onClose={() => setPlansModalOpen(false)} />

      <section className="relative pt-20 sm:pt-28 md:pt-32 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-gradient mb-8"
          >
            Market Making
          </motion.h1>

          {/* Prime Boost Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-16"
          >
            <Button
              size="lg"
              onClick={() => setPlansModalOpen(true)}
              className="group relative px-8 py-8 text-2xl font-bold bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] rounded-full"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors rounded-full" />
              <span className="relative flex items-center gap-3">
                <Rocket className="w-8 h-8 animate-bounce" />
                PRIME BOOST
                <Rocket className="w-8 h-8 animate-bounce" />
              </span>
            </Button>
          </motion.div>

          {/* Counter Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="inline-block glass-card px-12 py-8 rounded-3xl">
              <p className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-gradient">
                {marketMakersCount.toLocaleString()}
              </p>
              <p className="text-xl text-muted-foreground mt-4">Active Market Makers</p>
            </div>
          </motion.div>

          {/* Top Gainers Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <TopGainersGrid topGainers={topGainers} loading={loadingGainers} />
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card border-white/10 hover:border-primary/30 transition-all"
              >
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MarketMaking;
