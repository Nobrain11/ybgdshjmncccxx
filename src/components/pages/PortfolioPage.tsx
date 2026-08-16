'use client';
import { useState, useEffect } from 'react';

export default function PortfolioPage() {
  const [balances, setBalances] = useState<any>({});
  useEffect(() => {
    fetch('/api/wallet/balance')
      .then(res => res.json())
      .then(setBalances);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
      <div className="bg-surface p-4 rounded-xl border border-border">
        <p className="text-text2">ETH Balance: {balances.eth || '0'} ETH</p>
        {/* Add more token balances */}
        <button
          onClick={async () => {
            const res = await fetch('/api/wallet/create', { method: 'POST' });
            const data = await res.json();
            alert(`Wallet created: ${data.address}`);
          }}
          className="mt-4 w-full bg-green text-black font-bold py-2 rounded-lg"
        >
          Create New Wallet
        </button>
      </div>
    </div>
  );
}
