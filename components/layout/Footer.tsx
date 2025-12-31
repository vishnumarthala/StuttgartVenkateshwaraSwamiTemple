import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-temple-maroon text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Column */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-temple-gold rounded-full flex items-center justify-center">
                <span className="text-temple-maroon font-serif font-bold">
                  SVT
                </span>
              </div>
              <h3 className="text-lg font-serif text-temple-gold">
                Sri Venkateshwara Temple Stuttgart
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              United by a Sacred Vision — Building Lord Venkateshwara&apos;s divine
              abode in Stuttgart to serve the spiritual needs of devotees across
              Baden-Württemberg.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-temple-gold font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-temple-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-300 hover:text-temple-gold transition-colors text-sm">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/updates" className="text-gray-300 hover:text-temple-gold transition-colors text-sm">
                  Updates
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-temple-gold transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-temple-gold font-semibold mb-4">Contact</h4>
            <address className="not-italic text-sm text-gray-300 space-y-2">
              <p>Wankelstrasse 4/A</p>
              <p>71272 Renningen, Germany</p>
              <p className="mt-3">
                <a href="tel:+4915255749792" className="hover:text-temple-gold transition-colors">
                  +49 152 55749792
                </a>
              </p>
              <p>
                <a href="tel:+4915119489119" className="hover:text-temple-gold transition-colors">
                  +49 1511 9489119
                </a>
              </p>
              <p>
                <a href="mailto:svtstuttgart@gmail.com" className="hover:text-temple-gold transition-colors">
                  svtstuttgart@gmail.com
                </a>
              </p>
            </address>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-temple-gold font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-gray-300">
              <a
                href="https://chat.whatsapp.com/HdvSNeSXWux6hGZwJ8Vh48"
                target="_blank"
                rel="noreferrer"
                className="hover:text-temple-gold transition-colors"
              >
                <span className="sr-only">WhatsApp Group</span>
                <MessageCircle className="w-5 h-5" aria-hidden />
              </a>
              <a
                href="https://www.instagram.com/svt_stuttgart"
                target="_blank"
                rel="noreferrer"
                className="hover:text-temple-gold transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="w-5 h-5" aria-hidden />
              </a>
              <a
                href="https://www.youtube.com/@svtstuttgart"
                target="_blank"
                rel="noreferrer"
                className="hover:text-temple-gold transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <Youtube className="w-5 h-5" aria-hidden />
              </a>
              <a
                href="https://www.facebook.com/people/Sri-Venkateshwara-Temple/61568532123940/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-temple-gold transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="w-5 h-5" aria-hidden />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Sri Venkateshwara Temple Stuttgart gUG (haftungsbeschränkt) i.G.
            </p>
            <div className="flex space-x-6">
              <Link href="/impressum" className="text-sm text-gray-400 hover:text-temple-gold transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-sm text-gray-400 hover:text-temple-gold transition-colors">
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
