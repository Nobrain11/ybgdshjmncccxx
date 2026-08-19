'use client';

import { useState } from 'react';
import WalletConnect from '@/components/WalletConnect';

export default function TradePage() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [message, setMessage] = useState('');

  const handleTrade = async () => {
    setMessage('Preparing a protected execution…');
    const res = await fetch(`/api/trade/${side}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: tokenAddress, amount }) });
    const data = await res.json();
    setMessage(data.txHash ? `Submitted ${data.txHash}` : data.error || 'Execution unavailable');
  };

  return <div className="space-y-4">
    <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">Execution desk</p><h2 className="mt-1 text-2xl font-black tracking-tight">Trade</h2></div>
    <WalletConnect />
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-4 flex rounded-xl bg-surface-muted p-1"><button onClick={() => setSide('buy')} className={`flex-1 rounded-lg py-2 text-sm font-bold ${side === 'buy' ? 'bg-brand text-black' : 'text-muted'}`}>Buy</button><button onClick={() => setSide('sell')} className={`flex-1 rounded-lg py-2 text-sm font-bold ${side === 'sell' ? 'bg-danger text-white' : 'text-muted'}`}>Sell</button></div>
      <div className="space-y-3"><label className="block text-xs font-bold uppercase tracking-[0.18em] text-muted">Token contract<input aria-label="Token address" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder="0x…" className="mt-2 w-full rounded-xl border border-border bg-surface-muted p-3 font-mono text-sm text-foreground outline-none focus:border-brand" /></label><label className="block text-xs font-bold uppercase tracking-[0.18em] text-muted">Amount in ETH<input aria-label="Amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="mt-2 w-full rounded-xl border border-border bg-surface-muted p-3 text-sm text-foreground outline-none focus:border-brand" /></label></div>
      <button onClick={handleTrade} className={`mt-4 w-full rounded-xl py-3 font-black ${side === 'buy' ? 'bg-brand text-black' : 'bg-danger text-white'}`}>Review {side === 'buy' ? 'Buy' : 'Sell'}</button>
      {message ? <p role="status" className="mt-3 break-all text-xs leading-5 text-muted">{message}</p> : null}
    </div>
    <p className="text-center text-xs leading-5 text-muted">Transactions are reviewed before signing. ERROR404 never asks for your seed phrase or private key.</p>
  </div>;
}
