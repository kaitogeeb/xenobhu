import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Newspaper, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const PressReleaseTab = () => {
  const [projectName, setProjectName] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !contractAddress || !headline) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Press release submitted! Will be published within 48 hours.');
    setProjectName('');
    setContractAddress('');
    setHeadline('');
    setDescription('');
  };

  const outlets = [
    'CoinTelegraph',
    'CoinDesk',
    'Decrypt',
    'BeInCrypto',
    'NewsBTC',
    'CryptoSlate',
    'The Block',
    'Bitcoinist',
  ];

  return (
    <div className="space-y-8">
      {/* Press Release Packages */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10 hover:border-primary/50 transition-all">
          <CardHeader>
            <CardTitle className="text-xl">Standard Release</CardTitle>
            <p className="text-3xl font-bold text-gradient">1 ETH</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Published on 5+ crypto news sites
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-400" />
                SEO optimized content
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-400" />
                48-hour turnaround
              </li>
            </ul>
            <Button className="w-full mt-4 bg-gradient-to-r from-primary to-secondary">
              Select Package
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 hover:border-primary/50 transition-all">
          <CardHeader>
            <CardTitle className="text-xl">Premium Release</CardTitle>
            <p className="text-3xl font-bold text-gradient">3 ETH</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Published on 15+ crypto news sites
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Featured on homepage
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Social media amplification
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-400" />
                24-hour turnaround
              </li>
            </ul>
            <Button className="w-full mt-4 bg-gradient-to-r from-primary to-secondary">
              Select Package
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Partner Outlets */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle>Our Partner Outlets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {outlets.map((outlet, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-primary/20 text-primary font-medium"
              >
                {outlet}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Form */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" />
            Submit Press Release
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="Your Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-background/50 border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractPR">Contract Address *</Label>
                <Input
                  id="contractPR"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="bg-background/50 border-white/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline *</Label>
              <Input
                id="headline"
                placeholder="Your press release headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="bg-background/50 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background/50 border-white/20 min-h-[120px]"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
              Submit Press Release
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
