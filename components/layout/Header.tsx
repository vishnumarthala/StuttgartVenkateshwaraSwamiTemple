import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-temple-cream/95 backdrop-blur-sm border-b border-temple-gold/20">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-temple-maroon rounded-full flex items-center justify-center">
              <span className="text-temple-gold font-serif font-bold text-xl">
                SVT
              </span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-serif text-temple-dark-red leading-tight">
                Sri Venkateshwara Temple
              </h1>
              <p className="text-sm text-temple-dark-gray">Stuttgart</p>
            </div>
          </Link>

          {/* Navigation */}
          <Navigation />
        </div>
      </div>
    </header>
  );
}
