import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sri Venkateshwara Temple Stuttgart',
    template: '%s | Sri Venkateshwara Temple Stuttgart',
  },
  description:
    'Support the construction of Lord Venkateshwara Temple in Stuttgart, Germany. Join us in building a sacred space for devotees in Baden-Württemberg.',
  keywords: [
    'Venkateshwara Temple',
    'Stuttgart',
    'Hindu Temple Germany',
    'Balaji Temple',
    'Indian Temple Stuttgart',
    'Kumbhabhishekam',
  ],
  authors: [{ name: 'Sri Venkateshwara Temple Stuttgart gUG' }],
  openGraph: {
    title: 'Sri Venkateshwara Temple Stuttgart',
    description:
      'Support the construction of Lord Venkateshwara Temple in Stuttgart, Germany.',
    url: 'https://svtstuttgart.de',
    siteName: 'Sri Venkateshwara Temple Stuttgart',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
