import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Megaphone, Twitter, MessageCircle, Globe } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const GetAdsTab = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [website, setWebsite] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractAddress) {
      toast.error('Please enter a contract address');
      return;
    }
    toast.success('Ad request submitted! Our team will contact you within 24 hours.');
    setContractAddress('');
    setTelegramHandle('');
    setTwitterHandle('');
    setWebsite('');
  };

  const adPackages = [
    { name: 'Starter', price: '0.5 ETH', features: ['Banner ads for 7 days', 'Homepage placement', '50K impressions'] },
    { name: 'Growth', price: '1.5 ETH', features: ['Banner ads for 30 days', 'Premium placement', '200K impressions', 'Social media boost'] },
    { name: 'Premium', price: '3 ETH', features: ['Banner ads for 60 days', 'All placements', '500K impressions', 'Full social package', 'Dedicated support'] },
  ];

  return (
    <div className="space-y-8">
      {/* Ad Packages */}
      <div className="grid md:grid-cols-3 gap-6">
        {adPackages.map((pkg, index) => (
          <Card key={index} className="glass-card border-white/10 hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle className="text-xl text-center">{pkg.name}</CardTitle>
              <p className="text-3xl font-bold text-center text-gradient">{pkg.price}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <Megaphone className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-4 bg-gradient-to-r from-primary to-secondary">
                Select Package
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submission Form */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" />
            Submit Your Token for Advertising
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract">Contract Address *</Label>
                <Input
                  id="contract"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="bg-background/50 border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Website
                </Label>
                <Input
                  id="website"
                  placeholder="https://yourtoken.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="bg-background/50 border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Telegram
                </Label>
                <Input
                  id="telegram"
                  placeholder="@yourtelegram"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  className="bg-background/50 border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" /> Twitter/X
                </Label>
                <Input
                  id="twitter"
                  placeholder="@yourtwitter"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  className="bg-background/50 border-white/20"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
              Submit Ad Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
