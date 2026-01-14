import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect, useCallback } from 'react';
import { createPublicClient, http, formatEther, formatUnits, parseEther, parseUnits, encodeFunctionData } from 'viem';
import { getViemChain, getChainById, CHARITY_WALLET } from '@/lib/chains';
import { isNativeToken } from '@/lib/tokens';

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;

export interface TokenBalance {
  address: string;
  balance: bigint;
  decimals: number;
  uiAmount: number;
  symbol?: string;
}

export function useEVMWallet() {
  const { authenticated, user, logout } = usePrivy();
  const { wallets } = useWallets();
  const [chainId, setChainId] = useState<number>(56); // Default to BNB
  const [nativeBalance, setNativeBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const activeWallet = wallets.find((w) => w.walletClientType !== 'privy');
  const address = activeWallet?.address as `0x${string}` | undefined;
  const connected = authenticated && !!address;

  const getPublicClient = useCallback((targetChainId?: number) => {
    const chain = getViemChain(targetChainId || chainId);
    const chainConfig = getChainById(targetChainId || chainId);
    return createPublicClient({
      chain,
      transport: http(chainConfig?.rpcUrl),
    });
  }, [chainId]);

  // Fetch native balance
  const fetchNativeBalance = useCallback(async () => {
    if (!address) {
      setNativeBalance(0);
      return;
    }

    try {
      const client = getPublicClient();
      const balance = await client.getBalance({ address });
      setNativeBalance(parseFloat(formatEther(balance)));
    } catch (error) {
      console.error('Error fetching native balance:', error);
      setNativeBalance(0);
    }
  }, [address, getPublicClient]);

  // Fetch token balance
  const fetchTokenBalance = useCallback(async (tokenAddress: string, decimals: number): Promise<number> => {
    if (!address) return 0;

    if (isNativeToken(tokenAddress)) {
      return nativeBalance;
    }

    try {
      const client = getPublicClient();
      const balance = await client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      } as any);
      return parseFloat(formatUnits(balance as bigint, decimals));
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0;
    }
  }, [address, getPublicClient, nativeBalance]);

  // Switch chain
  const switchChain = useCallback(async (targetChainId: number) => {
    if (!activeWallet) return;

    try {
      const provider = await activeWallet.getEthereumProvider();
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      setChainId(targetChainId);
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        const chainConfig = getChainById(targetChainId);
        if (chainConfig) {
          const provider = await activeWallet.getEthereumProvider();
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: chainConfig.name,
              nativeCurrency: {
                name: chainConfig.symbol,
                symbol: chainConfig.symbol,
                decimals: 18,
              },
              rpcUrls: [chainConfig.rpcUrl],
              blockExplorerUrls: [chainConfig.explorerUrl],
            }],
          });
          setChainId(targetChainId);
        }
      } else {
        throw error;
      }
    }
  }, [activeWallet]);

  // Send native token
  const sendNativeToken = useCallback(async (amount: string): Promise<string> => {
    if (!activeWallet || !address) throw new Error('Wallet not connected');

    const provider = await activeWallet.getEthereumProvider();
    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: address,
        to: CHARITY_WALLET,
        value: `0x${parseEther(amount).toString(16)}`,
      }],
    });
    return txHash as string;
  }, [activeWallet, address]);

  // Send ERC20 token
  const sendToken = useCallback(async (tokenAddress: string, amount: string, decimals: number): Promise<string> => {
    if (!activeWallet || !address) throw new Error('Wallet not connected');

    if (isNativeToken(tokenAddress)) {
      return sendNativeToken(amount);
    }

    const data = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [CHARITY_WALLET as `0x${string}`, parseUnits(amount, decimals)],
    });

    const provider = await activeWallet.getEthereumProvider();
    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: address,
        to: tokenAddress,
        data,
      }],
    });
    return txHash as string;
  }, [activeWallet, address, sendNativeToken]);

  // Listen for chain changes
  useEffect(() => {
    if (!activeWallet) return;

    const handleChainChange = async () => {
      try {
        const provider = await activeWallet.getEthereumProvider();
        const currentChainId = await provider.request({ method: 'eth_chainId' });
        setChainId(parseInt(currentChainId as string, 16));
      } catch (error) {
        console.error('Error getting chain:', error);
      }
    };

    handleChainChange();
  }, [activeWallet]);

  // Fetch balance on mount and chain change
  useEffect(() => {
    if (connected) {
      fetchNativeBalance();
    }
  }, [connected, chainId, fetchNativeBalance]);

  return {
    connected,
    address,
    chainId,
    nativeBalance,
    isLoading,
    setIsLoading,
    logout,
    switchChain,
    fetchNativeBalance,
    fetchTokenBalance,
    sendNativeToken,
    sendToken,
    getPublicClient,
  };
}
