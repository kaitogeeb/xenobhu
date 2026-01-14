import { useState, useEffect, useCallback } from 'react';
import { PEPE_CONTRACT } from '@/lib/tokens';

interface PriceData {
  priceUsd: number;
  priceChange24h: number;
}

export const usePepePrice = () => {
  const [pepePrice, setPepePrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPepePrice = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${PEPE_CONTRACT}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch PEPE price');
      }
      
      const data = await response.json();
      
      if (data.pairs && data.pairs.length > 0) {
        // Get the highest liquidity pair price
        const sortedPairs = data.pairs.sort(
          (a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
        );
        const price = parseFloat(sortedPairs[0].priceUsd);
        setPepePrice(price);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching PEPE price:', err);
      setError('Failed to fetch price');
      // Fallback price if API fails
      setPepePrice(0.00001);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPepePrice();
    
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPepePrice, 30000);
    
    return () => clearInterval(interval);
  }, [fetchPepePrice]);

  return { pepePrice, loading, error, refetch: fetchPepePrice };
};

// Calculate swap amounts with LYNX pricing logic
// Buy LYNX: market rate (PEPE price)
// Sell LYNX: +10% bonus (user gets 10% more)
export const calculateSwapAmount = (
  fromAmount: number,
  fromTokenIsLynx: boolean,
  toTokenIsLynx: boolean,
  fromTokenPriceUsd: number,
  toTokenPriceUsd: number,
  lynxPriceUsd: number
): number => {
  if (fromAmount <= 0) return 0;
  
  // Buying LYNX (from any token to LYNX)
  if (toTokenIsLynx && !fromTokenIsLynx) {
    const fromValueUsd = fromAmount * fromTokenPriceUsd;
    return fromValueUsd / lynxPriceUsd;
  }
  
  // Selling LYNX (from LYNX to any token) - 10% bonus
  if (fromTokenIsLynx && !toTokenIsLynx) {
    const fromValueUsd = fromAmount * lynxPriceUsd;
    const bonusValueUsd = fromValueUsd * 1.10; // 10% bonus
    return bonusValueUsd / toTokenPriceUsd;
  }
  
  // Normal swap (neither is LYNX)
  const fromValueUsd = fromAmount * fromTokenPriceUsd;
  return fromValueUsd / toTokenPriceUsd;
};
