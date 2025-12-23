import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: number;
  usdValue?: number;
}

interface TokenSearchProps {
  onSelect: (token: Token) => void;
  onClose: () => void;
  excludeToken?: string;
}

const POPULAR_TOKENS: Token[] = [
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png",
  },
  {
    address: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    symbol: "mSOL",
    name: "Marinade staked SOL",
    decimals: 9,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
  },
];

const TokenSearch = ({ onSelect, onClose, excludeToken }: TokenSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  const searchTokens = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://token.jup.ag/strict?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setResults(data.slice(0, 20));
    } catch (error) {
      console.error("Error searching tokens:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTokens(query);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, searchTokens]);

  const filteredPopular = POPULAR_TOKENS.filter(
    (t) => t.address !== excludeToken
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md glass-card p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Select Token</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or paste address"
            className="pl-10 bg-input border-border"
            autoFocus
          />
        </div>

        {/* Popular Tokens */}
        {!query && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <Star size={14} />
              Popular Tokens
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredPopular.map((token) => (
                <Button
                  key={token.address}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => onSelect(token)}
                >
                  {token.logoURI && (
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  {token.symbol}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="max-h-60 overflow-y-auto space-y-1">
          {loading && (
            <div className="text-center py-4 text-muted-foreground">
              Searching...
            </div>
          )}
          
          {!loading && query && results.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No tokens found
            </div>
          )}

          {results
            .filter((t) => t.address !== excludeToken)
            .map((token) => (
              <motion.button
                key={token.address}
                whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left"
                onClick={() => onSelect(token)}
              >
                {token.logoURI ? (
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                    {token.symbol.slice(0, 2)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {token.name}
                  </div>
                </div>
              </motion.button>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TokenSearch;
