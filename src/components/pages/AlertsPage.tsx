'use client';
import { useState, useEffect } from 'react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [token, setToken] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('PRICE_ABOVE');

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(setAlerts);
  }, []);

  const createAlert = async () => {
    const res = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenAddress: token, type, triggerValue: parseFloat(price) }),
    });
    const data = await res.json();
    if (data.id) {
      setAlerts([...alerts, data]);
      setToken('');
      setPrice('');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Alerts</h2>
      <div className="bg-surface p-4 rounded-xl border border-border mb-4">
        <input
          type="text"
          placeholder="Token Address"
          value={token}
          onChange={e => setToken(e.target.value)}
          className="w-full p-2 bg-[#1c1c1e] rounded-lg text-white border border-border mb-2"
        />
        <input
          type="number"
          placeholder="Trigger Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full p-2 bg-[#1c1c1e] rounded-lg text-white border border-border mb-2"
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full p-2 bg-[#1c1c1e] rounded-lg text-white border border-border mb-2"
        >
          <option value="PRICE_ABOVE">Price Above</option>
          <option value="PRICE_BELOW">Price Below</option>
        </select>
        <button onClick={createAlert} className="w-full bg-green text-black font-bold py-2 rounded-lg">
          Add Alert
        </button>
      </div>
      <div className="space-y-2">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-surface p-3 rounded-xl border border-border flex justify-between">
            <span>{alert.tokenAddress.slice(0, 6)}...{alert.tokenAddress.slice(-4)}</span>
            <span>{alert.type.replace('_', ' ')} ${alert.triggerValue}</span>
            <span className={alert.active ? 'text-green' : 'text-text2'}>{alert.active ? 'Active' : 'Triggered'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
