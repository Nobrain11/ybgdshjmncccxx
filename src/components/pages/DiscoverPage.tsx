'use client';

import { useEffect, useMemo, useState } from 'react';

const categories = ['Trending', 'New', 'Top Vol', 'Gainers', 'Losers'];

function money(value: unknown, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  if (number >= 1_000_000) return `$${(number / 1_000_000).toFixed(2)}M`;
  if (number >= 1_000) return `$${(number / 1_000).toFixed(1)}K`;
  return `$${number.toFixed(digits)}`;
}

function TokenCard({ token }: { token: any }) {
  const change = Number(token.priceChange?.h24 ?? 0);
  const symbol = token.baseToken?.symbol || 'TOKEN';
  const name = token.baseToken?.name || 'Unknown token';
  const initials = symbol.slice(0, 2).toUpperCase();

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-full border border-brand/40 bg-brand/10 font-bold text-brand">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold">{name}</h3>
            <p className="truncate text-sm text-muted">{symbol} · {token.dexId || 'ROBINHOOD'}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold">{money(token.priceUsd, 6)}</p>
          <p className={change >= 0 ? 'text-sm font-semibold text-brand' : 'text-sm font-semibold text-danger'}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mx-4 h-10 border-y border-brand/30 bg-gradient-to-b from-brand/15 to-transparent">
        <div className="h-full border-t-2 border-brand" />
      </div>

      <div className="grid grid-cols-4 divide-x divide-border border-b border-border text-center">
        <div className="p-2.5"><p className="text-[10px] font-bold text-muted">MCAP</p><p className="mt-1 text-sm font-semibold">{money(token.marketCap)}</p></div>
        <div className="p-2.5"><p className="text-[10px] font-bold text-muted">LIQ</p><p className="mt-1 text-sm font-semibold">{money(token.liquidity?.usd)}</p></div>
        <div className="p-2.5"><p className="text-[10px] font-bold text-muted">VOL</p><p className="mt-1 text-sm font-semibold">{money(token.volume?.h24)}</p></div>
        <div className="p-2.5"><p className="text-[10px] font-bold text-muted">AGE</p><p className="mt-1 text-sm font-semibold">{token.pairCreatedAt ? `${Math.max(1, Math.floor((Date.now() - token.pairCreatedAt) / 86400000))}d` : '—'}</p></div>
      </div>

      <div className="grid grid-cols-4 divide-x divide-border border-b border-border text-center">
        <div className="p-3"><p className="text-[11px] font-bold text-muted">MCAP</p><p className="mt-1 font-semibold">{money(token.marketCap)}</p></div>
        <div className="p-3"><p className="text-[11px] font-bold text-muted">LIQ</p><p className="mt-1 font-semibold">{money(token.liquidity?.usd)}</p></div>
        <div className="p-3"><p className="text-[11px] font-bold text-muted">VOL</p><p className="mt-1 font-semibold">{money(token.volume?.h24)}</p></div>
        <div className="p-3"><p className="text-[11px] font-bold text-muted">AGE</p><p className="mt-1 font-semibold">{token.pairCreatedAt ? `${Math.max(1, Math.floor((Date.now() - token.pairCreatedAt) / 86400000))}d` : '—'}</p></div>
      </div>

      <div className="p-3">
        <div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold text-brand">B {Math.round(token.txns?.h24?.buys || 0).toLocaleString()}</span><span className="text-muted">24h pressure</span><span className="font-semibold text-danger">S {Math.round(token.txns?.h24?.sells || 0).toLocaleString()}</span></div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-danger/20"><div className="h-full w-2/3 rounded-full bg-brand" /></div>
        <button className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-110">Quick Buy</button>
      </div>
    </article>
  );
}

export default function DiscoverPage() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [category, setCategory] = useState('Trending');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/market/trending')
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Market unavailable')))
      .then(setTokens)
      .catch(() => setTokens([]))
      .finally(() => setLoading(false));
  }, []);

  const visibleTokens = useMemo(() => {
    const filtered = tokens.filter((token) => `${token.baseToken?.name || ''} ${token.baseToken?.symbol || ''}`.toLowerCase().includes(query.toLowerCase()));
    if (category === 'Gainers') return [...filtered].sort((a, b) => Number(b.priceChange?.h24 || 0) - Number(a.priceChange?.h24 || 0));
    if (category === 'Losers') return [...filtered].sort((a, b) => Number(a.priceChange?.h24 || 0) - Number(b.priceChange?.h24 || 0));
    if (category === 'Top Vol') return [...filtered].sort((a, b) => Number(b.volume?.h24 || 0) - Number(a.volume?.h24 || 0));
    return filtered;
  }, [category, query, tokens]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">Live</p><p className="mt-1 text-sm text-muted">Robinhood Chain · #4663 · 12 pairs</p></div>
        <p className="text-xs text-muted">Updated just now</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Market categories">
        {categories.map((item) => <button key={item} onClick={() => setCategory(item)} role="tab" aria-selected={category === item} className={`shrink-0 rounded-xl border px-4 py-3 text-sm font-semibold ${category === item ? 'border-brand bg-brand/10 text-brand' : 'border-border bg-surface-muted text-muted'}`}>{item}</button>)}
      </div>
      <label className="flex items-center gap-3 rounded-xl bg-surface-muted px-4 py-3 text-muted"><span aria-hidden="true">⌕</span><span className="sr-only">Search tokens</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted" placeholder="Search token name, symbol or paste CA..." /></label>
      {loading ? <div className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">Loading live markets...</div> : visibleTokens.length ? <div className="space-y-4">{visibleTokens.map((token) => <TokenCard key={token.pairAddress} token={token} />)}</div> : <div className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">No Robinhood Chain markets found.</div>}
    </section>
  );
}
