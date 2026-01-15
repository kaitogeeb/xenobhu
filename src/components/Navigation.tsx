import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { motion } from 'framer-motion';
import xenoLogo from '@/assets/xeno-logo.jpg';

export const Navigation = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 animated-gradient-nav backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-2 sm:px-4 py-3 flex items-center justify-between">
        {/* Logo & Title */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <motion.img
            src={xenoLogo}
            alt="Xeno"
            className="w-12 h-12 rounded-full"
            animate={{
              rotateY: [0, 15, -15, 0],
              y: [0, -3, 0],
              filter: [
                'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))',
                'drop-shadow(0 0 16px hsl(var(--primary) / 0.8))',
                'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <h1 className="text-2xl font-extrabold text-gradient">
            Xeno Swap
          </h1>
        </Link>

        {/* Desktop Navigation Links & Wallet */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-semibold transition-all relative pb-1 ${
              location.pathname === '/'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Swap
            {location.pathname === '/' && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </Link>

          <Link
            to="/dex"
            className={`text-sm font-semibold transition-all relative pb-1 ${
              location.pathname === '/dex'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            DEX
            {location.pathname === '/dex' && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </Link>

          <Link
            to="/why-xeno"
            className={`text-sm font-semibold transition-all relative pb-1 ${
              location.pathname === '/why-xeno'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Why Xeno
            {location.pathname === '/why-xeno' && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </Link>

          <Link
            to="/market-making"
            className={`text-sm font-semibold transition-all relative pb-1 ${
              location.pathname === '/market-making'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Market Making
            {location.pathname === '/market-making' && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </Link>

          <Link
            to="/claim"
            className={`text-sm font-semibold transition-all relative pb-1 ${
              location.pathname === '/claim'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Claim
            {location.pathname === '/claim' && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
              />
            )}
          </Link>

          <ConnectWalletButton />
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 glass-card rounded-xl"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="block w-5 h-[2px] bg-foreground mb-1"></span>
          <span className="block w-5 h-[2px] bg-foreground mb-1"></span>
          <span className="block w-5 h-[2px] bg-foreground"></span>
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden bg-background/80 backdrop-blur-xl border-t border-white/10">
          <div className="container mx-auto px-2 sm:px-4 py-3 flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold transition-all relative ${
                location.pathname === '/'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Swap
            </Link>
            <Link
              to="/dex"
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold transition-all relative ${
                location.pathname === '/dex'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              DEX
            </Link>
            <Link
              to="/why-xeno"
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold transition-all relative ${
                location.pathname === '/why-xeno'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Why Xeno
            </Link>
            <Link
              to="/market-making"
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold transition-all relative ${
                location.pathname === '/market-making'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Market Making
            </Link>
            <Link
              to="/claim"
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold transition-all relative ${
                location.pathname === '/claim'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Claim
            </Link>
            <div className="pt-2">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
