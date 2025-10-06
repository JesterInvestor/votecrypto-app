'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import WalletConnection from './WalletConnection';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/get-started', label: 'Get Started' },
  { href: '/learn-more', label: 'Learn More' },
  { href: '/register', label: 'Register' },
  { href: '/rewards', label: 'Rewards' },
  { href: '/elections', label: 'Elections' },
  { href: '/election-news', label: 'Election News' },
  { href: '/crypto-politicians', label: 'Crypto Politicians' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <nav className="border-b sticky top-0 z-50" style={{ background: 'color-mix(in oklab, var(--brand-blue) 4%, white)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--brand-blue)' }}>VoteCrypto</Link>
            <span className="ml-2 text-xs sm:text-sm text-gray-500">.app</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm ${isActive(link.href) ? 'font-semibold' : 'text-gray-700 hover:opacity-90'} underline-offset-4`}
                style={isActive(link.href) ? { color: 'var(--brand-blue)' } : {}}
              >
                {link.label}
              </Link>
            ))}
            <WalletConnection />
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(o => !o)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-2 py-2 rounded ${isActive(link.href) ? 'font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                style={isActive(link.href) ? { backgroundColor: 'color-mix(in oklab, var(--brand-blue) 12%, white)', color: 'var(--brand-blue)' } : {}}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t">
              <WalletConnection />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
