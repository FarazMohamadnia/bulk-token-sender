import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useCallback } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// You may want to move this to a config file
const SOLANA_RPC = 'https://go.getblock.us/499c36d44d3d44989ca51f53ec0e18b9';
const connection = new Connection(SOLANA_RPC, 'confirmed');

interface Recipient {
    address: string;
    amount: number;
  }

export const useSVM = () => {
  const { publicKey, connected, disconnect, signTransaction } = useWallet();
  const { setVisible } = useWalletModal();

  // Open wallet modal to connect
  const connect = useCallback(() => {
    if (!connected) {
      setVisible(true);
    }
  }, [connected, setVisible]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (connected) {
      await disconnect();
    }
  }, [connected, disconnect]);


  const address = publicKey ? publicKey.toBase58() : undefined;
  const isConnected = connected;

  /**
   * Send native SOL to a recipient
   * @param recipientAddress string (base58)
   * @param amount number (in SOL, e.g. 0.1)
   * @returns Promise<string> signature
   */
  const sendSolTransaction = async (amount: number , address: string): Promise<string> => {
    if (!publicKey || !signTransaction) throw new Error('Wallet not connected');
    const recipient = new PublicKey(address);
    const lamports = amount * LAMPORTS_PER_SOL;
    const { blockhash} = await connection.getLatestBlockhash();
    console.log({
      fromPubkey: publicKey.toBase58(),
      toPubkey: address,
      lamports,
    });
    
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipient,
        lamports,
      })
    );
    tx.feePayer = publicKey;
    tx.recentBlockhash = blockhash;
    const signedTx = await signTransaction(tx);
    const sig = await connection.sendRawTransaction(signedTx.serialize());
    return sig;
  };

  /**
   * Send SPL token (like USDT) to a recipient
   * @param mintAddress string (token mint address)
   * @param recipientAddress string (base58)
   * @param amount number (in smallest unit, e.g. 1000000 for 1 USDT with 6 decimals)
   * @returns Promise<string> signature
   */
  const sendSplTokenTransaction = async (
    mintAddress: string,
    amount: number,
    address: string
  ): Promise<string> => {
    if (!publicKey || !signTransaction) throw new Error('Wallet not connected');
    const mint = new PublicKey(mintAddress);
    const recipient = new PublicKey(address);
    const senderATA = await getAssociatedTokenAddress(mint, publicKey);
    const recipientATA = await getAssociatedTokenAddress(mint, recipient);
    // Create transfer instruction
    const transferIx = createTransferInstruction(
      senderATA,
      recipientATA,
      publicKey,
      amount,
      [],
      TOKEN_PROGRAM_ID
    );
    const { blockhash} = await connection.getLatestBlockhash();
    const tx = new Transaction().add(transferIx);
    tx.feePayer = publicKey;
    tx.recentBlockhash = blockhash;
    const signedTx = await signTransaction(tx);
    const sig = await connection.sendRawTransaction(signedTx.serialize());
    return sig;
  };

  const sendSplBatchTokenTransaction = async (
    mintAddress: string,
    recipients: Recipient[], // آرایه‌ای از آدرس‌ها و مقادی
  ): Promise<string[]> => {
    if (!publicKey || !signTransaction) throw new Error('Wallet not connected');
  
    const mint = new PublicKey(mintAddress);
    const signatures: string[] = [];
    const maxInstructionsPerTx = 10; // حداکثر تعداد دستورالعمل‌ها در هر تراکنش (برای بهینه‌سازی)
  
    // تقسیم گیرنده‌ها به دسته‌های کوچک‌تر
    for (let i = 0; i < recipients.length; i += maxInstructionsPerTx) {
      const batch = recipients.slice(i, i + maxInstructionsPerTx);
      const transaction = new Transaction();
  
      // برای هر گیرنده در دسته
      for (const { address, amount } of batch) {
        const recipient = new PublicKey(address);
        const senderATA = await getAssociatedTokenAddress(mint, publicKey);
        const recipientATA = await getAssociatedTokenAddress(mint, recipient);
  
        // ایجاد دستور انتقال
        const transferIx = createTransferInstruction(
          senderATA,
          recipientATA,
          publicKey,
          amount,
          [],
          TOKEN_PROGRAM_ID
        );
        transaction.add(transferIx);
      }
  
      // تنظیم blockhash و feePayer
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = blockhash;
  
      // امضای تراکنش
      const signedTx = await signTransaction(transaction);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      signatures.push(sig);
    }
  
    return signatures;
  }

  return {
    connect,
    disconnectWallet,
    address,
    isConnected,
    sendSolTransaction,
    sendSplTokenTransaction,
    sendSplBatchTokenTransaction,
  };
};