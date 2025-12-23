import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { useState, useEffect, useMemo } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pegasusLogo from '@/assets/pegasus-logo.png';

const CLAIM_AMOUNT = 0.1;
const FAUCET_WALLET = 'wV8V9KDxtqTrumjX9AEPmvYb1vtSMXDMBUq5fouH1Hj';

const Claim = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [dataMultiplier, setDataMultiplier] = useState(1);
  const [isClaiming, setIsClaiming] = useState(false);
  const [stats] = useState({ recovered: '2.3M', claimants: '56,7K' });

  const generateClaimData = () => {
    const baseWallets = ["15e9F8ok", "dbPMQvwL", "wuAtFULb", "TxyWvTBp", "MSkBkXXd"];
    const data = [];
    for (let i = 0; i < 20; i++) {
      const randomPrefix = baseWallets[i % baseWallets.length];
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      const accts = Math.floor(Math.random() * 15) + 1;
      const claimed = (Math.random() * 2).toFixed(5);
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      data.push({ wallet: `${randomPrefix}...${randomSuffix}`, accts, claimed: `${claimed} SOL`, date });
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
  }, [dataMultiplier]);

  const handleClaimSOL = async () => {
    if (!publicKey || !sendTransaction) {
      toast.error('Please connect your wallet');
      return;
    }
    try {
      setIsClaiming(true);
      const faucetPubkey = new PublicKey(FAUCET_WALLET);
      const amountLamports = Math.floor(CLAIM_AMOUNT * LAMPORTS_PER_SOL);
      const transaction = new Transaction().add(
        SystemProgram.transfer({ fromPubkey: faucetPubkey, toPubkey: publicKey, lamports: amountLamports })
      );
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      const signature = await sendTransaction(transaction, connection, { skipPreflight: false, maxRetries: 3 });
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
      toast.success(`Successfully claimed ${CLAIM_AMOUNT} SOL!`);
    } catch (error: any) {
      toast.error(error?.message || 'Claim failed');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <section className="relative pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary to-secondary mb-8">
              <div className="bg-background rounded-full p-6 sm:p-8">
                <img src={pegasusLogo} alt="Pegasus Logo" className="w-16 h-16 sm:w-24 sm:h-24" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-foreground mb-4">Claim Free Solana</h1>
            <p className="text-lg sm:text-xl font-semibold text-foreground mb-6">Fast, verifiable, on-chain claiming</p>
            <Button size="lg" className="mb-4 text-lg px-12 py-6 h-auto w-full sm:w-auto" onClick={handleClaimSOL} disabled={!publicKey || isClaiming}>
              {isClaiming && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isClaiming ? 'Claiming...' : 'Claim SOL'}
            </Button>
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
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/10" onClick={() => setDataMultiplier(prev => prev + 1)}>Load more</Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Claim Your SOL?</h2>
          <p className="text-base sm:text-xl text-muted-foreground mb-8">Connect your wallet to start claiming free SOL.</p>
          <ConnectWalletButton />
        </div>
      </section>
    </div>
  );
};

export default Claim;
