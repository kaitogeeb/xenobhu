import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Droplets, Lock, Shield, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const LiquidityTab = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [chain, setChain] = useState('');
  const [liquidityAmount, setLiquidityAmount] = useState([5]);
  const [lockPeriod, setLockPeriod] = useState('30');

  const handleProvide = () => {
    if (!contractAddress || !chain) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Liquidity provision started! Your LP tokens will be locked.');
  };

  const features = [
    { icon: <Lock className="w-6 h-6 text-primary" />, title: 'Auto-Lock LP', desc: 'LP tokens automatically locked for security' },
    { icon: <Shield className="w-6 h-6 text-green-400" />, title: 'Rug-Proof', desc: 'Smart contract prevents early withdrawal' },
    { icon: <TrendingUp className="w-6 h-6 text-blue-400" />, title: 'Fee Earnings', desc: 'Earn trading fees from your liquidity' },
  ];

  return (
    <div className="space-y-8">
      {/* Features */}
      <div className="grid md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Panel */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-6 h-6 text-primary" />
            Liquidity Provision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractLiquidity">Contract Address *</Label>
              <Input
                id="contractLiquidity"
                placeholder="0x..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="bg-background/50 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label>Blockchain *</Label>
              <Select value={chain} onValueChange={setChain}>
                <SelectTrigger className="bg-background/50 border-white/20">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="bsc">BNB Chain</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Liquidity Amount: {liquidityAmount[0]} ETH</Label>
              <Slider
                value={liquidityAmount}
                onValueChange={setLiquidityAmount}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Amount of ETH to provide as liquidity</p>
            </div>

            <div className="space-y-2">
              <Label>Lock Period</Label>
              <Select value={lockPeriod} onValueChange={setLockPeriod}>
                <SelectTrigger className="bg-background/50 border-white/20">
                  <SelectValue placeholder="Select lock period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="180">6 Months</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                  <SelectItem value="forever">Forever (Burned)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">Note:</strong> Liquidity will be automatically paired with your token and locked for the selected period. You will receive LP tokens that represent your share of the pool.
            </p>
          </div>

          <Button onClick={handleProvide} className="w-full bg-gradient-to-r from-primary to-secondary text-lg py-6">
            Provide Liquidity
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
