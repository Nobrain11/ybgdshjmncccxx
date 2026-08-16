'use client';
import { useState } from 'react';

export default function TradePage() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');

  const handleTrade = async () => {
    const res = await fetch(`/api/trade/${side}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenAddress, amount }),
    });
    const data = await res.json();
    alert(data.txHash || data.error);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Trade</h2>
      <div className="bg-surface p-4 rounded-xl border border-border space-y-4">
        <input
          type="text"
          placeholder="Token Address (0x...)"
          value={tokenAddress}
          onChange={e => setTokenAddress(e.target.value)}
          className="w-full p-3 bg-[#1c1c1e] rounded-lg text-white border border-border"
        />
        <input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full p-3 bg-[#1c1c1e] rounded-lg text-white border border-border"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setSide('buy')}
            className={`flex-1 py-2 rounded-lg ${side === 'buy' ? 'bg-green text-black' : 'bg-surface text-text2'}`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`flex-1 py-2 rounded-lg ${side === 'sell' ? 'bg-red text-white' : 'bg-surface text-text2'}`}
          >
            Sell
          </button>
        </div>
        <button
          onClick={handleTrade}
          className="w-full bg-green text-black font-bold py-3 rounded-lg hover:opacity-90"
        >
          Execute {side === 'buy' ? 'Buy' : 'Sell'}
        </button>
      </div>
    </div>
  );
}
