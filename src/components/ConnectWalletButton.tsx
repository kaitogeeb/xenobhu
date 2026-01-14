import { FC, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { SUPPORTED_CHAINS, getChainById } from '@/lib/chains';
import { ChevronDown, Wallet, LogOut, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export const ConnectWalletButton: FC = () => {
  const { login, authenticated } = usePrivy();
  const { connected, address, chainId, nativeBalance, logout, switchChain } = useEVMWallet();
  const [chainSelectorOpen, setChainSelectorOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const currentChain = getChainById(chainId);

  const handleChainSelect = async (newChainId: number) => {
    if (newChainId === chainId) {
      setChainSelectorOpen(false);
      return;
    }

    setIsSwitching(true);
    try {
      await switchChain(newChainId);
      setChainSelectorOpen(false);
    } catch (error) {
      console.error('Failed to switch chain:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!connected || !authenticated) {
    return (
      <>
        <Button
          onClick={() => setChainSelectorOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl h-10 px-4 hover:scale-105 transition-all shadow-lg hover:shadow-primary/50"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>

        <Dialog open={chainSelectorOpen} onOpenChange={setChainSelectorOpen}>
          <DialogContent className="glass-card border-white/10 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">Select Network</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-4">
              {SUPPORTED_CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  onClick={async () => {
                    setChainSelectorOpen(false);
                    await login();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-muted/50 transition-all hover:scale-[1.02] border border-white/5"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${chain.color}20` }}
                  >
                    <img
                      src={chain.logo}
                      alt={chain.name}
                      className="w-8 h-8"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-foreground">{chain.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Connect with {chain.symbol}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Chain Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="glass-card border-white/10 h-10 px-3 gap-2"
            disabled={isSwitching}
          >
            {currentChain && (
              <img
                src={currentChain.logo}
                alt={currentChain.name}
                className="w-5 h-5"
              />
            )}
            <span className="hidden sm:inline">{currentChain?.name || 'Unknown'}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass-card border-white/10 bg-card z-50">
          {SUPPORTED_CHAINS.map((chain) => (
            <DropdownMenuItem
              key={chain.id}
              onClick={() => handleChainSelect(chain.id)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img src={chain.logo} alt={chain.name} className="w-5 h-5" />
              <span>{chain.name}</span>
              {chain.id === chainId && <Check className="w-4 h-4 ml-auto text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Wallet Info */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl h-10 px-4">
            <span className="hidden sm:inline mr-2">
              {nativeBalance.toFixed(4)} {currentChain?.symbol}
            </span>
            <span>{formatAddress(address || '')}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass-card border-white/10 bg-card z-50">
          <DropdownMenuItem className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            <span className="font-mono text-sm">{formatAddress(address || '')}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout()}
            className="flex items-center gap-2 text-destructive cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
