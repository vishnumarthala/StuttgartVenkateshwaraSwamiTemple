'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/donate', label: 'Donate' },
  { href: '/updates', label: 'Updates' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-temple-dark-gray hover:text-temple-maroon transition-colors font-medium"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/donate" className="btn-primary">
            Donate Now
          </Link>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-temple-dark-gray"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute top-full right-0 w-64 mt-2 py-2 bg-white rounded-lg shadow-xl md:hidden z-50">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-temple-dark-gray hover:bg-temple-cream hover:text-temple-maroon transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="px-4 py-3">
              <Link
                href="/donate"
                className="btn-primary block text-center"
                onClick={() => setIsOpen(false)}
              >
                Donate Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
