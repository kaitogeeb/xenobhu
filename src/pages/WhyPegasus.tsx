import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Zap, Shield, Route, Eye, CheckCircle, Lock, Gauge, Smartphone } from 'lucide-react';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import pegasusLogo from '@/assets/pegasus-logo.png';

const WhyPegasus = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />

      <section className="relative pt-24 md:pt-32 pb-14 md:pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-8">
            <motion.img src={pegasusLogo} alt="Pegasus" className="w-32 h-32 mx-auto" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
            <h1 className="text-4xl md:text-6xl font-extrabold text-gradient">Why Pegasus Swap</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Blazing-fast Solana swaps with a wallet-first, transparent experience.</p>
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
              { icon: Zap, title: "Speed & Low Fees", desc: "Solana's high throughput enables sub-second quotes and low transaction costs." },
              { icon: Shield, title: "Wallet-First UX", desc: "Connect with popular Solana wallets and swap seamlessly." },
              { icon: Route, title: "Transparent Routes", desc: "Preview best-available routes, see expected output, fees, and slippage." },
              { icon: Eye, title: "Safety & Reliability", desc: "Client-side validation catches errors early." },
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
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">You maintain control of your assets at all times.</p>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          © Pegasus Swap. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default WhyPegasus;
