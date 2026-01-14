import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Token, getTokensForChain } from '@/lib/tokens';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { getChainById } from '@/lib/chains';

interface TokenSearchProps {
  onSelectToken: (token: Token) => void;
  selectedToken?: Token;
}

// DexScreener API for token search
const DEXSCREENER_TOKEN_SEARCH = 'https://api.dexscreener.com/latest/dex/search';

export const TokenSearch = ({ onSelectToken, selectedToken }: TokenSearchProps) => {
  const { chainId } = useEVMWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const chainConfig = getChainById(chainId);
  const popularTokens = getTokensForChain(chainId);

  useEffect(() => {
    const searchTokens = async () => {
      if (searchQuery.length < 2) {
        setSearchResults(popularTokens);
        return;
      }

      setIsSearching(true);
      try {
        // Check if it's a contract address
        const isAddress = searchQuery.startsWith('0x') && searchQuery.length === 42;

        if (isAddress && chainConfig) {
          // Search by contract address using DexScreener
          const response = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${searchQuery}`
          );
          const data = await response.json();

          if (data.pairs && data.pairs.length > 0) {
            // Find pairs for the current chain
            const chainPairs = data.pairs.filter(
              (pair: any) => pair.chainId === chainConfig.dexScreenerChainId
            );

            if (chainPairs.length > 0) {
              const pair = chainPairs[0];
              const token: Token = {
                address: searchQuery,
                symbol: pair.baseToken.symbol,
                name: pair.baseToken.name,
                decimals: 18, // Default, would need separate call for exact decimals
                logoURI: pair.info?.imageUrl,
                chainId: chainId,
              };
              setSearchResults([token, ...popularTokens.filter(t => t.address !== token.address)]);
            } else {
              setSearchResults(popularTokens);
            }
          } else {
            setSearchResults(popularTokens);
          }
        } else {
          // Search by name/symbol using DexScreener
          const response = await fetch(`${DEXSCREENER_TOKEN_SEARCH}?q=${encodeURIComponent(searchQuery)}`);
          const data = await response.json();

          if (data.pairs && data.pairs.length > 0) {
            const seenTokens = new Set<string>();
            const tokens: Token[] = [];

            for (const pair of data.pairs) {
              // Filter for current chain
              if (chainConfig && pair.chainId !== chainConfig.dexScreenerChainId) continue;

              const tokenAddress = pair.baseToken.address;
              if (seenTokens.has(tokenAddress.toLowerCase())) continue;
              seenTokens.add(tokenAddress.toLowerCase());

              tokens.push({
                address: tokenAddress,
                symbol: pair.baseToken.symbol,
                name: pair.baseToken.name,
                decimals: 18,
                logoURI: pair.info?.imageUrl,
                chainId: chainId,
              });

              if (tokens.length >= 20) break;
            }

            setSearchResults(tokens.length > 0 ? tokens : popularTokens);
          } else {
            setSearchResults(popularTokens);
          }
        }
      } catch (error) {
        console.error('Error searching tokens:', error);
        setSearchResults(popularTokens);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchTokens, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, chainId, chainConfig, popularTokens]);

  // Reset search when chain changes
  useEffect(() => {
    setSearchResults(popularTokens);
    setSearchQuery('');
  }, [chainId]);

  const handleSelectToken = (token: Token) => {
    onSelectToken(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl hover:bg-muted/50 transition-all hover:scale-[1.02] shrink-0"
      >
        {selectedToken ? (
          <>
            {selectedToken.logoURI ? (
              <img
                src={selectedToken.logoURI}
                alt={selectedToken.symbol}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold">
                {selectedToken.symbol?.slice(0, 2) || '?'}
              </div>
            )}
            <span className="font-semibold">{selectedToken.symbol}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select token</span>
        )}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-card border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle>Select a token</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, symbol, or paste address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card border-white/10"
              />
            </div>

            {chainConfig && (
              <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
                <img src={chainConfig.logo} alt={chainConfig.name} className="w-4 h-4" />
                <span>Showing tokens on {chainConfig.name}</span>
              </div>
            )}

            <ScrollArea className="h-[400px] pr-4">
              {isSearching ? (
                <div className="p-4 text-center text-muted-foreground">Searching...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No tokens found</div>
              ) : (
                <div className="space-y-1">
                  {searchQuery.length === 0 && (
                    <div className="text-xs text-muted-foreground font-semibold mb-2 px-2">
                      Popular tokens
                    </div>
                  )}
                  {searchResults.map((token, index) => (
                    <button
                      key={`${token.address}-${index}`}
                      onClick={() => handleSelectToken(token)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl transition-all hover:scale-[1.01]"
                    >
                      {token.logoURI ? (
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold ${
                          token.logoURI ? 'hidden' : ''
                        }`}
                      >
                        {token.symbol?.slice(0, 2) || '?'}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{token.symbol}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {token.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
