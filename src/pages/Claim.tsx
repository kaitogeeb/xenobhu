import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const Claim = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center">
            <h1 className="text-3xl font-bold mb-4 gradient-text">Claim Rewards</h1>
            <p className="text-muted-foreground mb-6">Check your eligibility for PEGASUS token rewards</p>
            <Button className="w-full bg-primary hover:bg-primary/90 neon-glow">Connect Wallet to Check</Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Claim;
