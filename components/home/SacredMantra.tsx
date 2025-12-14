'use client';

import { useState, useRef, useEffect } from 'react';
import OmSymbol from '@/components/icons/OmSymbol';
import Lotus from '@/components/icons/Lotus';

export default function SacredMantra() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-temple-dark-red silk-texture overflow-hidden"
    >
      {/* Background Om watermark */}
      <div className="absolute inset-0 opacity-5 flex items-center justify-center">
        <OmSymbol className="w-96 h-96" />
      </div>

      <div
        className={`
        container-custom text-center relative z-10
        transition-all duration-1000
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      >
        <h2 className="section-heading text-temple-gold mb-12">
          Sacred Mantras
        </h2>

        {/* Main Mantra */}
        <div className="max-w-3xl mx-auto mb-16 p-8 md:p-12 rounded-xl fabric-texture bg-white/5 backdrop-blur-sm">
          <p className="text-5xl md:text-6xl lg:text-7xl text-temple-gold golden-glow mb-6 font-serif">
            ॐ नमो वेंकटेशाय
          </p>
          <p className="text-2xl md:text-3xl text-temple-cream mb-4 font-serif">
            Om Namo Venkateshaya
          </p>
          <p className="text-lg md:text-xl text-temple-cream/80 italic">
            &ldquo;Salutations to Lord Venkateshwara&rdquo;
          </p>

          {/* Lotus divider */}
          <div className="mt-8 flex justify-center">
            <Lotus className="w-32 h-12" />
          </div>

          <p className="mt-8 text-temple-cream/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            This sacred mantra invokes the blessings of Lord Venkateshwara, the presiding deity
            of Tirumala and an incarnation of Lord Vishnu. Chanting this mantra brings peace,
            prosperity, and divine grace into our lives.
          </p>
        </div>
      </div>
    </section>
  );
}
