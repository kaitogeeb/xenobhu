import SwapInterface from "@/components/SwapInterface";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";

const Dex = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-6">
          <SwapInterface />
          <div className="glass-card p-4 h-[600px]">
            <iframe
              src="https://dexscreener.com/solana?embed=1&theme=dark"
              className="w-full h-full rounded-lg"
              title="DexScreener"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dex;
