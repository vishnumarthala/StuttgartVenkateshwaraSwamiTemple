import Link from 'next/link';
import Image from 'next/image';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-temple-cream/95 backdrop-blur-sm border-b border-temple-gold/20">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <Image
                src="/images/SVT_Logo_Red.png"
                alt="Sri Venkateshwara Temple Stuttgart"
                fill
                className="object-contain"
                priority
              />
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
