import { useState, useEffect, useCallback } from 'react';
import { ArrowDownUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TokenSearch } from './TokenSearch';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { Token, getTokensForChain, isNativeToken } from '@/lib/tokens';
import { getChainById } from '@/lib/chains';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface SwapInterfaceProps {
  defaultFromToken?: Token;
  defaultToToken?: Token;
  onFromTokenChange?: (token: Token) => void;
}

export const SwapInterface = ({
  defaultFromToken,
  defaultToToken,
  onFromTokenChange
}: SwapInterfaceProps = {}) => {
  const { connected, address, chainId, nativeBalance, fetchTokenBalance, sendToken, sendNativeToken } = useEVMWallet();
  
  const chainTokens = getTokensForChain(chainId);
  const chainConfig = getChainById(chainId);
  
  const [fromToken, setFromToken] = useState<Token | undefined>(defaultFromToken || chainTokens[0]);
  const [toToken, setToToken] = useState<Token | undefined>(defaultToToken || chainTokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isSwapping, setIsSwapping] = useState(false);
  const [fromBalance, setFromBalance] = useState<number>(0);

  // Update tokens when chain changes
  useEffect(() => {
    const tokens = getTokensForChain(chainId);
    setFromToken(tokens[0]);
    setToToken(tokens[1]);
  }, [chainId]);

  // Fetch token balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !fromToken) {
        setFromBalance(0);
        return;
      }

      if (isNativeToken(fromToken.address)) {
        setFromBalance(nativeBalance);
      } else {
        const balance = await fetchTokenBalance(fromToken.address, fromToken.decimals);
        setFromBalance(balance);
      }
    };

    fetchBalance();
  }, [connected, fromToken, nativeBalance, fetchTokenBalance]);

  // Simple price estimation (1:1 for demo)
  useEffect(() => {
    if (fromAmount) {
      setToAmount(fromAmount);
    } else {
      setToAmount('');
    }
  }, [fromAmount]);

  const handleFromTokenSelect = (token: Token) => {
    if (toToken && token.address === toToken.address) {
      setToToken(fromToken);
    }
    setFromToken(token);
    onFromTokenChange?.(token);
  };

  const handleToTokenSelect = (token: Token) => {
    if (fromToken && token.address === fromToken.address) {
      setFromToken(toToken);
    }
    setToToken(token);
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    if (toToken) {
      onFromTokenChange?.(toToken);
    }
  };

  const handlePercentageClick = (percentage: number) => {
    if (fromBalance > 0) {
      const amount = fromBalance * percentage;
      setFromAmount(amount.toFixed(6));
    }
  };

  const handleSwap = async () => {
    if (!connected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!fromToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter an amount');
      return;
    }

    try {
      setIsSwapping(true);
      toast.info('Please confirm the transaction in your wallet...');

      const txHash = await sendToken(fromToken.address, fromAmount, fromToken.decimals);
      
      toast.success(`Transaction sent! Hash: ${txHash.slice(0, 10)}...`);
    } catch (error: any) {
      console.error('Swap error:', error);
      toast.error(error?.message || 'Transaction failed');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-3xl border border-white/10 max-w-lg w-full relative overflow-hidden"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl opacity-20 blur-xl animate-pulse-glow" />

      <div className="relative z-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gradient">Swap</h2>
          </div>
          <ConnectWalletButton />
        </div>

        {/* From Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Selling</label>
            {connected && fromToken && (
              <div className="text-xs font-medium">
                <span className="text-muted-foreground">Balance: </span>
                <span className="text-foreground">{fromBalance.toFixed(6)} {fromToken.symbol}</span>
              </div>
            )}
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
              <TokenSearch selectedToken={fromToken} onSelectToken={handleFromTokenSelect} />
              <div className="flex-1 min-w-0 text-left sm:text-right w-full">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="w-full text-2xl sm:text-3xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-left sm:text-right"
                />
              </div>
            </div>
            {connected && fromBalance > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[0.25, 0.5, 0.75, 1].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handlePercentageClick(pct)}
                    className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      pct === 1
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    {pct === 1 ? 'MAX' : `${pct * 100}%`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-20">
          <button
            onClick={handleSwapTokens}
            className="p-3 glass-card rounded-xl hover:bg-muted/50 transition-all hover:scale-110 border border-white/10"
          >
            <ArrowDownUp className="w-5 h-5" />
          </button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Buying</label>
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
              <TokenSearch selectedToken={toToken} onSelectToken={handleToTokenSelect} />
              <div className="flex-1 min-w-0 text-left sm:text-right w-full">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="w-full text-2xl sm:text-3xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-left sm:text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Swap Action Button */}
        <Button
          className="w-full mt-6 h-14 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
          onClick={handleSwap}
          disabled={!connected || isSwapping || !fromToken || !toToken || !fromAmount}
        >
          {isSwapping ? 'Swapping...' : !connected ? 'Connect Wallet' : 'Swap Tokens'}
        </Button>

        {chainConfig && (
          <div className="mt-4 text-center text-xs text-muted-foreground">
            Trading on {chainConfig.name}
          </div>
        )}
      </div>
    </motion.div>
  );
};
