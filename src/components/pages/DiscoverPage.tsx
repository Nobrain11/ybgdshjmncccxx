'use client';
import { useState, useEffect } from 'react';

export default function DiscoverPage() {
  const [tokens, setTokens] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/market/trending')
      .then(res => res.json())
      .then(setTokens);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🔥 Trending</h2>
      <div className="space-y-3">
        {tokens.map(token => (
          <div key={token.pairAddress} className="bg-surface p-3 rounded-xl border border-border">
            <div className="flex justify-between items-center">
              <span className="font-medium">{token.baseToken?.symbol} / ETH</span>
              <span className={token.priceChange?.h24 > 0 ? 'text-green' : 'text-red'}>
                ${parseFloat(token.priceUsd).toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-text2 mt-1">
              <span>MCap: ${token.marketCap?.toLocaleString() || 'N/A'}</span>
              <span>Liq: ${token.liquidity?.usd?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
