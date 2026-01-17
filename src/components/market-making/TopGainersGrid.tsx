import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface TopGainer {
  name: string;
  symbol: string;
  priceChangePercent: number;
  logoUrl: string;
  pairAddress: string;
  chainId: string;
}

interface TopGainersGridProps {
  topGainers: TopGainer[];
  loading: boolean;
}

// Helper function to get the best logo URL
const getLogoUrl = (gainer: TopGainer): string => {
  // If logoUrl is already a valid URL, use it
  if (gainer.logoUrl && gainer.logoUrl.startsWith('http')) {
    return gainer.logoUrl;
  }
  
  // Try DexScreener's direct token image endpoint
  if (gainer.chainId && gainer.pairAddress) {
    return `https://dd.dexscreener.com/ds-data/tokens/${gainer.chainId}/${gainer.pairAddress}.png`;
  }
  
  // Fallback to ui-avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(gainer.symbol)}&background=8B5DFF&color=fff&bold=true`;
};

export const TopGainersGrid = ({ topGainers, loading }: TopGainersGridProps) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading top gainers...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {topGainers.map((gainer, index) => (
        <Card key={index} className="glass-card border-white/10 hover:border-primary/50 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0">
                <img
                  src={getLogoUrl(gainer)}
                  alt={gainer.symbol}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    // Prevent infinite loop by checking if we already tried fallback
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(gainer.symbol)}&background=8B5DFF&color=fff&bold=true&size=128`;
                    }
                  }}
                />
              </div>
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
  );
};
