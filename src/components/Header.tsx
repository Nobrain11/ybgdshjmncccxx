export default function Header({ user }: { user: any }) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border">
      <h1 className="text-xl font-bold text-green">ERROR404</h1>
      <div className="flex items-center gap-2">
        <span className="text-sm text-text2">{user?.email || 'Guest'}</span>
        <button
          onClick={() => {
            document.cookie = 'token=; path=/; max-age=0';
            window.location.href = '/login';
          }}
          className="text-xs text-red hover:opacity-80"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
