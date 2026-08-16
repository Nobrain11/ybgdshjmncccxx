import { Home, BarChart3, Wallet, Bell, Settings } from 'lucide-react';

export default function BottomNav({ active, onChange }: { active: string; onChange: (tab: string) => void }) {
  const tabs = [
    { key: 'discover', label: 'Discover', icon: Home },
    { key: 'trade', label: 'Trade', icon: BarChart3 },
    { key: 'portfolio', label: 'Portfolio', icon: Wallet },
    { key: 'alerts', label: 'Alerts', icon: Bell },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0b] border-t border-border flex justify-around py-2 max-w-[430px] mx-auto">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className="flex flex-col items-center gap-0.5"
        >
          <tab.icon className={`w-5 h-5 ${active === tab.key ? 'text-green' : 'text-text2'}`} />
          <span className={`text-[10px] ${active === tab.key ? 'text-green' : 'text-text2'}`}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
