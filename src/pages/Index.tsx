import { SwapInterface } from '@/components/SwapInterface';
import { XenoAnimation } from '@/components/XenoAnimation';
import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { getChainById } from '@/lib/chains';

const Index = () => {
  const { chainId } = useEVMWallet();
  const chain = getChainById(chainId);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <XenoAnimation />
      <Navigation />

      <div className="relative z-10 container mx-auto px-2 sm:px-4 pt-24 md:pt-32 pb-8">
        {/* Main Swap Interface */}
        <div className="flex justify-center items-center px-2 sm:px-0">
          <SwapInterface />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 sm:mt-16 text-center text-xs sm:text-sm text-muted-foreground"
        >
          <p>Built with ⚡ on {chain?.name || 'EVM'}</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
