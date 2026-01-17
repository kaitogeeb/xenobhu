import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Repeat, Users, Activity, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const WashTradeTab = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [chain, setChain] = useState('');
  const [walletCount, setWalletCount] = useState([10]);
  const [tradeVolume, setTradeVolume] = useState([1000]);
  const [duration, setDuration] = useState('24');

  const handleStart = () => {
    if (!contractAddress || !chain) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Wash trading initiated! Volume will appear on aggregators within minutes.');
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="glass-card border-white/10">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">5,432</p>
            <p className="text-sm text-muted-foreground">Active Wallets</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">$8.7M</p>
            <p className="text-sm text-muted-foreground">24h Wash Volume</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10 col-span-2 md:col-span-1">
          <CardContent className="p-4 text-center">
            <Repeat className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">324</p>
            <p className="text-sm text-muted-foreground">Tokens Using Service</p>
          </CardContent>
        </Card>
      </div>

      {/* Warning */}
      <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-500">Disclaimer</p>
            <p className="text-sm text-muted-foreground">
              This service is for educational and demonstration purposes only. Use at your own discretion and in compliance with local regulations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="w-6 h-6 text-primary" />
            Wash Trade Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractWash">Contract Address *</Label>
              <Input
                id="contractWash"
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
              <Label>Number of Wallets: {walletCount[0]}</Label>
              <Slider
                value={walletCount}
                onValueChange={setWalletCount}
                min={5}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">More wallets = more natural-looking activity</p>
            </div>

            <div className="space-y-2">
              <Label>Target Daily Volume: ${tradeVolume[0].toLocaleString()}</Label>
              <Slider
                value={tradeVolume}
                onValueChange={setTradeVolume}
                min={100}
                max={50000}
                step={100}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Total volume to generate per day</p>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="bg-background/50 border-white/20">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 Hours - 1 ETH</SelectItem>
                  <SelectItem value="72">72 Hours - 2.5 ETH</SelectItem>
                  <SelectItem value="168">7 Days - 5 ETH</SelectItem>
                  <SelectItem value="720">30 Days - 15 ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleStart} className="w-full bg-gradient-to-r from-primary to-secondary text-lg py-6">
            Start Wash Trading
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
