'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return alert('Passwords do not match');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const { token } = await res.json();
      document.cookie = `token=${token}; path=/; max-age=604800`;
      router.push('/terminal');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-surface p-6 rounded-xl border border-border">
        <h1 className="text-2xl font-bold text-green">Create Account</h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 bg-[#1c1c1e] rounded-lg text-white border border-border focus:outline-none focus:border-green"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 bg-[#1c1c1e] rounded-lg text-white border border-border focus:outline-none focus:border-green"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full p-3 bg-[#1c1c1e] rounded-lg text-white border border-border focus:outline-none focus:border-green"
            required
          />
          <button type="submit" className="w-full bg-green text-black font-bold py-3 rounded-lg hover:opacity-90 transition">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-text2">
          Already have an account? <a href="/login" className="text-green">Login</a>
        </p>
      </div>
    </div>
  );
}
