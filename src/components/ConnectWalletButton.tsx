import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

const ConnectWalletButton = () => {
  const { publicKey, disconnect, connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    setVisible(true);
  };

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      toast.success("Address copied to clipboard");
    }
  };

  const handleViewExplorer = () => {
    if (publicKey) {
      window.open(`https://solscan.io/account/${publicKey.toBase58()}`, "_blank");
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (connected && publicKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="gap-2 border-primary/50 hover:border-primary hover:bg-primary/10"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {formatAddress(publicKey.toBase58())}
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopyAddress} className="gap-2 cursor-pointer">
            <Copy size={16} />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewExplorer} className="gap-2 cursor-pointer">
            <ExternalLink size={16} />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={disconnect}
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut size={16} />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow"
      >
        <Wallet size={18} />
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    </motion.div>
  );
};

export default ConnectWalletButton;
