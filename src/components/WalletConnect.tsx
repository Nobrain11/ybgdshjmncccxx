'use client';

import { useEffect, useState } from 'react';

interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window { ethereum?: EthereumProvider; }
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function WalletConnect({ compact = false }: { compact?: boolean }) {
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'error'>('idle');
  const [error, setError] = useState('');

  const connect = async () => {
    if (!window.ethereum) {
      setError('Open this terminal in Robinhood Wallet or install its browser extension.');
      setStatus('error');
      return;
    }
    setStatus('connecting');
    setError('');
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const nextChainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      const nextAddress = accounts[0];
      const res = await fetch('/api/wallet/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: nextAddress, chainId: nextChainId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save wallet connection');
      setAddress(nextAddress);
      setChainId(nextChainId);
      setStatus('idle');
    } catch (connectionError) {
      setError(connectionError instanceof Error ? connectionError.message : 'Wallet connection failed');
      setStatus('error');
    }
  };

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider?.on) return;
    const onAccountsChanged = (...args: unknown[]) => {
      const next = args[0] as string[] | undefined;
      if (!next?.[0]) {
        setAddress('');
        return;
      }
      setAddress(next[0]);
    };
    const onChainChanged = (...args: unknown[]) => setChainId(String(args[0] || ''));
    provider.on('accountsChanged', onAccountsChanged);
    provider.on('chainChanged', onChainChanged);
    return () => {
      provider.removeListener?.('accountsChanged', onAccountsChanged);
      provider.removeListener?.('chainChanged', onChainChanged);
    };
  }, []);

  if (address) {
    return <div className={compact ? 'rounded-xl border border-brand/30 bg-brand/10 px-3 py-2 text-xs font-bold text-brand' : 'space-y-2'}>
      <div className="flex items-center justify-between gap-3"><span>{shortAddress(address)}</span><span className="text-[10px] text-muted">{chainId ? `CHAIN ${parseInt(chainId, 16)}` : 'CONNECTED'}</span></div>
    </div>;
  }

  return <div className={compact ? '' : 'space-y-2'}>
    <button onClick={connect} disabled={status === 'connecting'} className="w-full rounded-xl bg-brand px-4 py-3 font-black text-black transition hover:brightness-110 disabled:opacity-50">
      {status === 'connecting' ? 'Connecting…' : 'Connect Robinhood Wallet'}
    </button>
    {error ? <p role="alert" className="text-xs leading-5 text-danger">{error}</p> : null}
  </div>;
}
