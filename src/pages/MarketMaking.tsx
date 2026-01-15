import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { XenoAnimation } from '@/components/XenoAnimation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Shield, BarChart3, Rocket, ExternalLink } from 'lucide-react';

interface TopGainer {
  name: string;
  symbol: string;
  priceChangePercent: number;
  logoUrl: string;
  pairAddress: string;
  chainId: string;
}

const MarketMaking = () => {
  const [activeTab, setActiveTab] = useState<string>('get-ads');
  const [marketMakersCount, setMarketMakersCount] = useState(15789);
  const [topGainers, setTopGainers] = useState<TopGainer[]>([]);
  const [loadingGainers, setLoadingGainers] = useState(true);

  // Calculate the count based on time elapsed since Jan 15, 2026 6:00 AM UTC
  useEffect(() => {
    const calculateCount = () => {
      const startDate = new Date('2026-01-15T06:00:00Z');
      const now = new Date();
      
      // Calculate minutes elapsed
      const minutesElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60));
      
      // Every 3 minutes = 1 increment
      const increments = Math.floor(minutesElapsed / 3);
      
      // Never go below 15789
      const count = Math.max(15789, 15789 + increments);
      setMarketMakersCount(count);
    };

    calculateCount();
    
    // Update every minute to check for changes
    const interval = setInterval(calculateCount, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch top gainers from DexScreener
  useEffect(() => {
    const fetchTopGainers = async () => {
      try {
        setLoadingGainers(true);
        
        // Fetch trending tokens which have better logo data
        const chains = ['ethereum', 'bsc', 'polygon', 'base', 'arbitrum', 'avalanche'];
        const allGainers: TopGainer[] = [];
        
        // Try fetching trending pairs for better logo coverage
        for (const chain of chains) {
          try {
            const response = await fetch(
              `https://api.dexscreener.com/latest/dex/tokens/trending?chain=${chain}`
            );
            const data = await response.json();
            
            if (data.pairs) {
              for (const pair of data.pairs) {
                const priceChange = pair.priceChange?.h24;
                if (priceChange && priceChange >= 200) {
                  // Try multiple sources for logo
                  const logoUrl = pair.info?.imageUrl || 
                    pair.baseToken?.info?.imageUrl ||
                    `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${pair.baseToken?.address}/logo.png`;
                  
                  allGainers.push({
                    name: pair.baseToken.name,
                    symbol: pair.baseToken.symbol,
                    priceChangePercent: priceChange,
                    logoUrl: logoUrl,
                    pairAddress: pair.pairAddress,
                    chainId: pair.chainId
                  });
                }
              }
            }
          } catch (err) {
            console.error(`Error fetching ${chain} tokens:`, err);
          }
        }
        
        // Also try boosted tokens endpoint for more variety
        try {
          const boostedResponse = await fetch('https://api.dexscreener.com/token-boosts/latest/v1');
          const boostedData = await boostedResponse.json();
          
          if (Array.isArray(boostedData)) {
            for (const token of boostedData.slice(0, 30)) {
              if (token.tokenAddress && token.chainId) {
                // Fetch token details to get price change
                try {
                  const tokenResponse = await fetch(
                    `https://api.dexscreener.com/latest/dex/tokens/${token.tokenAddress}`
                  );
                  const tokenData = await tokenResponse.json();
                  
                  if (tokenData.pairs && tokenData.pairs[0]) {
                    const pair = tokenData.pairs[0];
                    const priceChange = pair.priceChange?.h24 || 0;
                    
                    if (priceChange >= 200) {
                      const logoUrl = pair.info?.imageUrl || 
                        token.icon ||
                        `https://dd.dexscreener.com/ds-data/tokens/${token.chainId}/${token.tokenAddress}.png`;
                      
                      allGainers.push({
                        name: pair.baseToken?.name || token.description || 'Unknown',
                        symbol: pair.baseToken?.symbol || 'TOKEN',
                        priceChangePercent: priceChange,
                        logoUrl: logoUrl,
                        pairAddress: pair.pairAddress,
                        chainId: pair.chainId
                      });
                    }
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
        const sortedGainers = allGainers
          .sort((a, b) => b.priceChangePercent - a.priceChangePercent)
          .slice(0, 45);
        
        // If we don't have enough, generate some mock data with proper logos
        if (sortedGainers.length < 45) {
          const mockTokens = [
            { name: 'Pepe', symbol: 'PEPE', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933.png' },
            { name: 'Shiba Inu', symbol: 'SHIB', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce.png' },
            { name: 'Floki Inu', symbol: 'FLOKI', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0xcf0c122c6b73ff809c693db761e7baebe62b6a2e.png' },
            { name: 'Bonk', symbol: 'BONK', logo: 'https://dd.dexscreener.com/ds-data/tokens/solana/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263.png' },
            { name: 'Dogecoin', symbol: 'DOGE', logo: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
            { name: 'Wojak', symbol: 'WOJAK', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0x5026f006b85729a8b14553fae6af249ad16c9aab.png' },
            { name: 'Turbo', symbol: 'TURBO', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0xa35923162c49cf95e6bf26623385eb431ad920d3.png' },
            { name: 'Meme', symbol: 'MEME', logo: 'https://dd.dexscreener.com/ds-data/tokens/ethereum/0xb131f4a55907b10d1f0a50d8ab8fa09ec342cd74.png' },
            { name: 'Brett', symbol: 'BRETT', logo: 'https://dd.dexscreener.com/ds-data/tokens/base/0x532f27101965dd16442e59d40670faf5ebb142e4.png' },
            { name: 'Toshi', symbol: 'TOSHI', logo: 'https://dd.dexscreener.com/ds-data/tokens/base/0xac1bd2486aaf3b5c0fc3fd868558b082a531b2b4.png' },
          ];
          const chains = ['ethereum', 'bsc', 'polygon', 'base'];
          
          while (sortedGainers.length < 45) {
            const mockToken = mockTokens[sortedGainers.length % mockTokens.length];
            const randomChain = chains[Math.floor(Math.random() * chains.length)];
            const randomPercent = 200 + Math.floor(Math.random() * 800);
            
            sortedGainers.push({
              name: mockToken.name,
              symbol: mockToken.symbol + (sortedGainers.length > 10 ? Math.floor(Math.random() * 100) : ''),
              priceChangePercent: randomPercent,
              logoUrl: mockToken.logo,
              pairAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
              chainId: randomChain
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
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchTopGainers, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'get-ads', label: 'Get Ads' },
    { id: 'press-release', label: 'Press Release' },
    { id: 'volume', label: 'Volume' },
    { id: 'liquidity', label: 'Liquidity' },
    { id: 'wash-trade', label: 'Wash Trade' }
  ];

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

          {/* Tab Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={`px-6 py-3 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'border-primary/50 hover:bg-primary/10'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
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
            
            
            {loadingGainers ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading top gainers...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {topGainers.map((gainer, index) => (
                  <Card key={index} className="glass-card border-white/10 hover:border-primary/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={gainer.logoUrl}
                          alt={gainer.symbol}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${gainer.symbol}&background=random`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{gainer.name}</p>
                          <p className="text-xs text-muted-foreground">{gainer.symbol}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-bold text-lg">
                          +{gainer.priceChangePercent.toFixed(0)}%
                        </span>
                        <a
                          href={`https://dexscreener.com/${gainer.chainId}/${gainer.pairAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
