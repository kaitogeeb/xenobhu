import { motion } from "framer-motion";
import SwapInterface from "@/components/SwapInterface";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Pegasus</span> Swap
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              The fastest way to swap your Solana tokens. Secure, reliable, and lightning fast.
            </p>
          </motion.div>

          {/* Swap Interface */}
          <SwapInterface />
        </div>
      </main>
    </div>
  );
};

export default Index;
