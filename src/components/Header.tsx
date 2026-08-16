import WalletConnect from '@/components/WalletConnect';

export default function Header({ user }: { user: any }) {
  return (
    <header className="border-b border-border bg-background px-4 pb-4 pt-5 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-xl font-black text-black" aria-hidden="true">↗</div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black tracking-tight">ERROR<span className="text-brand">404</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted">Terminal</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <WalletConnect compact />
          <button onClick={() => { document.cookie = 'token=; path=/; max-age=0'; window.location.href = '/login'; }} className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted transition hover:border-brand/40 hover:text-foreground" aria-label={`Log out ${user?.email || 'user'}`}>Log out</button>
        </div>
      </div>
    </header>
  );
}
