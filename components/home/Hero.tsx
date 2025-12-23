import Image from 'next/image';
import OmSymbol from '@/components/icons/OmSymbol';
import ScrollArrow from '@/components/icons/ScrollArrow';

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      {/* Temple Background Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #2d1810 0%, #4a1010 35%, #6b2020 60%, #1a0a00 100%)'
        }}
      />

      {/* Background Image Layer */}
      <div className="absolute inset-0">
        <Image
          src="/images/swami.jpg"
          alt="Lord Venkateshwara"
          fill
          priority
          className=" object-contain object-center"
          quality={85}
          sizes="100vw"
        />
      </div>

      {/* Subtle Overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.5) 100%)'
        }}
      />

      {/* Divine Light Rays */}
      <div className="absolute inset-0 divine-rays opacity-40" />
      
      {/* Golden Glow Effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at center, rgba(218, 165, 32, 0.15) 0%, transparent 50%)',
          mixBlendMode: 'screen'
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 pb-24">
        {/* Om Symbol with gentle pulse */}
        <div className="animate-gentle-pulse mb-8">
          <OmSymbol className="w-16 h-16 md:w-20 md:h-20" />
        </div>

        {/* Temple Name with gold foil effect */}
        <h1 className="temple-title text-4xl md:text-6xl lg:text-7xl text-center mb-6 animate-fade-in-up px-4 font-serif">
          Sri Venkateshwara Temple Stuttgart
        </h1>

        {/* Sacred Mantra */}
        <p className="text-temple-gold text-2xl md:text-3xl lg:text-4xl text-center animate-fade-in-delayed golden-glow font-serif mb-4">
          ॐ नमो वेंकटेशाय
        </p>

        <p className="text-white/90 text-lg md:text-xl text-center animate-fade-in-delayed italic mb-16 md:mb-0">
          Om Namo Venkateshaya
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 animate-float cursor-pointer">
          <ScrollArrow className="w-10 h-10" />
          <p className="text-temple-gold text-sm mt-2 text-center">Scroll</p>
        </div>
      </div>
    </section>
  );
}
