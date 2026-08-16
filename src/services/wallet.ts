import { ethers } from 'ethers';
import { encrypt, decrypt } from '@/lib/encryption';
import { prisma } from '@/lib/prisma';

let provider: ethers.JsonRpcProvider | null = null;

export function getProvider() {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!);
  }
  return provider;
}

export async function createWallet(userId: string) {
  const wallet = ethers.Wallet.createRandom();
  const encrypted = encrypt(wallet.privateKey, process.env.WALLET_ENCRYPTION_KEY!);
  const dbWallet = await prisma.wallet.create({
    data: {
      userId,
      address: wallet.address,
      encryptedKey: encrypted,
      isDefault: true,
    },
  });
  return { address: wallet.address, id: dbWallet.id };
}

export async function getWallet(userId: string) {
  const wallet = await prisma.wallet.findFirst({ where: { userId, isDefault: true } });
  if (!wallet || !wallet.encryptedKey) return null;
  const privateKey = decrypt(wallet.encryptedKey, process.env.WALLET_ENCRYPTION_KEY!);
  return new ethers.Wallet(privateKey, getProvider());
}

export async function importWallet(userId: string, mnemonicOrPrivateKey: string) {
  let wallet: ethers.Wallet;
  if (mnemonicOrPrivateKey.includes(' ')) {
    // fromPhrase returns HDNodeWallet, but it's compatible with Wallet
    wallet = ethers.Wallet.fromPhrase(mnemonicOrPrivateKey) as ethers.Wallet;
  } else {
    wallet = new ethers.Wallet(mnemonicOrPrivateKey);
  }
  const encrypted = encrypt(wallet.privateKey, process.env.WALLET_ENCRYPTION_KEY!);
  const dbWallet = await prisma.wallet.create({
    data: {
      userId,
      address: wallet.address,
      encryptedKey: encrypted,
      isDefault: true,
    },
  });
  return { address: wallet.address, id: dbWallet.id };
}

export async function getBalance(address: string) {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}
