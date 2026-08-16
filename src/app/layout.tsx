import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ERROR404 Terminal',
  description: 'Trading terminal on Robinhood Chain',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0b] text-[#f2f2f7] min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
