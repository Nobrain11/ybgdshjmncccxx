'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DiscoverPage from '@/components/pages/DiscoverPage';
import TradePage from '@/components/pages/TradePage';
import PortfolioPage from '@/components/pages/PortfolioPage';
import AlertsPage from '@/components/pages/AlertsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import { useRouter } from 'next/navigation';

export default function Terminal() {
  const [activeTab, setActiveTab] = useState('discover');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then((res) => res.json()).then((data) => {
      if (data.error) router.push('/login');
      else setUser(data.user);
    }).catch(() => router.push('/login'));
  }, [router]);

  const renderPage = () => {
    switch (activeTab) {
      case 'trade': return <TradePage />;
      case 'portfolio': return <PortfolioPage />;
      case 'alerts': return <AlertsPage />;
      case 'settings': return <SettingsPage />;
      default: return <DiscoverPage />;
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-background pb-24">
      <Header user={user} />
      <main className="px-4 py-4">{renderPage()}</main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
