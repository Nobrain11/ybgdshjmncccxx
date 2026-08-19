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
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-[430px] justify-around border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          aria-label={tab.label}
          className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition ${active === tab.key ? 'bg-brand/10 text-brand' : 'text-muted'}`}
        >
          <tab.icon className="h-5 w-5" />
          <span className="text-[10px] font-semibold">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
