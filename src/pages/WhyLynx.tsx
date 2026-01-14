import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Route, Eye, Lock } from 'lucide-react';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { LynxAnimation } from '@/components/LynxAnimation';
import lynxLogo from '@/assets/lynx-logo.jpg';

const WhyLynx = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <LynxAnimation />
      <Navigation />

      <section className="relative pt-24 md:pt-32 pb-14 md:pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-8">
            <motion.img 
              src={lynxLogo} 
              alt="Lynx" 
              className="w-32 h-32 mx-auto rounded-full" 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
            />
            <h1 className="text-4xl md:text-6xl font-extrabold text-gradient">Why Lynx Swap</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Multi-chain EVM swaps with the best rates. Trade on BNB, Ethereum, Polygon, and Base with a wallet-first, transparent experience.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <ConnectWalletButton />
              <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">Explore Routes</Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Zap, title: "Multi-Chain Support", desc: "Trade seamlessly across BNB, Ethereum, Polygon, and Base networks with unified experience." },
              { icon: Shield, title: "Wallet-First UX", desc: "Connect with MetaMask, WalletConnect, and other popular EVM wallets." },
              { icon: Route, title: "LYNX Token Bonus", desc: "Get 10% bonus when selling LYNX tokens - more value for your swaps." },
              { icon: Eye, title: "Real-Time Pricing", desc: "LYNX tracks PEPE price in real-time via DexScreener API." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-card h-full hover:glow-effect transition-all">
                  <CardHeader>
                    <item.icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle className="text-xl md:text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent><CardDescription>{item.desc}</CardDescription></CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          <Lock className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl font-bold text-gradient mb-6">Non-Custodial by Design</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">You maintain control of your assets at all times across all supported chains.</p>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          © Lynx Swap. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default WhyLynx;
