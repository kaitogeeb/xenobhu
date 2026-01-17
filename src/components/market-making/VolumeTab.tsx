import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BarChart3, Zap, TrendingUp, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const VolumeTab = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [chain, setChain] = useState('');
  const [tradeSize, setTradeSize] = useState([50]);
  const [frequency, setFrequency] = useState([30]);
  const [duration, setDuration] = useState('24');

  const handleStart = () => {
    if (!contractAddress || !chain) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Volume generation started! Monitor your token on DexScreener.');
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">$2.5M</p>
            <p className="text-sm text-muted-foreground">24h Volume Generated</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">12,459</p>
            <p className="text-sm text-muted-foreground">Active Bots</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">847</p>
            <p className="text-sm text-muted-foreground">Tokens Boosted</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">99.9%</p>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Panel */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Volume Bot Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractVolume">Contract Address *</Label>
              <Input
                id="contractVolume"
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
                  <SelectItem value="avalanche">Avalanche</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Trade Size: ${tradeSize[0]} - ${tradeSize[0] * 2}</Label>
              <Slider
                value={tradeSize}
                onValueChange={setTradeSize}
                min={10}
                max={500}
                step={10}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Random trade sizes between these values</p>
            </div>

            <div className="space-y-2">
              <Label>Trade Frequency: Every {frequency[0]} seconds</Label>
              <Slider
                value={frequency}
                onValueChange={setFrequency}
                min={10}
                max={300}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">How often trades are executed</p>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="bg-background/50 border-white/20">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 Hours - 0.5 ETH</SelectItem>
                  <SelectItem value="72">72 Hours - 1.2 ETH</SelectItem>
                  <SelectItem value="168">7 Days - 3 ETH</SelectItem>
                  <SelectItem value="720">30 Days - 10 ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleStart} className="w-full bg-gradient-to-r from-primary to-secondary text-lg py-6">
            Start Volume Generation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
