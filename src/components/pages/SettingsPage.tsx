export default function SettingsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="bg-surface p-4 rounded-xl border border-border">
        <p className="text-text2">Theme: Dark (default)</p>
        <p className="text-text2">Network: Robinhood Chain</p>
        <button className="mt-4 w-full bg-red text-white font-bold py-2 rounded-lg">Export Wallet</button>
      </div>
    </div>
  );
}
