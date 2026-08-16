'use client';

import { useEffect, useState } from 'react';
import WalletConnect from '@/components/WalletConnect';

interface Order { id: string; tokenAddress: string; side: string; amount: number; status: string; createdAt: string; }

function short(value: string) { return `${value.slice(0, 6)}…${value.slice(-4)}`; }

export default function PortfolioPage() {
  const [balance, setBalance] = useState<{ eth?: string; address?: string; external?: boolean }>({});
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch('/api/wallet/balance').then((res) => res.json()).then(setBalance).catch(() => undefined);
    fetch('/api/orders').then((res) => res.json()).then((data) => setOrders(data.orders || [])).catch(() => undefined);
  }, []);

  return <div className="space-y-4">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">Wallet desk</p>
      <h2 className="mt-1 text-2xl font-black tracking-tight">Portfolio</h2>
    </div>
    <WalletConnect />
    <section className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.2em] text-muted">Native balance</p><p className="mt-2 text-3xl font-black">{balance.eth || '—'} <span className="text-sm text-muted">ETH</span></p></div><span className="rounded-full bg-brand/10 px-2 py-1 text-[10px] font-bold text-brand">{balance.external ? 'ROBINHOOD WALLET' : 'ERROR404 VAULT'}</span></div>
      {balance.address ? <p className="mt-4 font-mono text-xs text-muted">{short(balance.address)}</p> : <p className="mt-4 text-sm text-muted">Connect Robinhood Wallet to load holdings.</p>}
    </section>
    <section className="rounded-2xl border border-border bg-surface p-4"><div className="flex items-center justify-between"><h3 className="font-bold">Execution tracking</h3><span className="text-xs text-muted">{orders.length} recent</span></div><div className="mt-3 space-y-2">{orders.length ? orders.map((order) => <div key={order.id} className="flex items-center justify-between rounded-xl bg-surface-muted p-3"><div><p className="font-mono text-xs text-muted">{short(order.tokenAddress)}</p><p className="mt-1 text-sm font-bold">{order.side} · {order.amount}</p></div><span className="text-xs font-bold text-brand">{order.status}</span></div>) : <p className="py-5 text-sm leading-6 text-muted">Signed executions and tracked orders will appear here.</p>}</div></section>
  </div>;
}
