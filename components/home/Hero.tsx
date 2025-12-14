import Image from 'next/image';
import OmSymbol from '@/components/icons/OmSymbol';
import ScrollArrow from '@/components/icons/ScrollArrow';

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0">
        <Image
          src="/images/swami.jpg"
          alt="Lord Venkateshwara"
          fill
          priority
          className="object-cover object-center"
          quality={85}
          sizes="100vw"
        />
      </div>

      {/* Gradient Overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)'
        }}
      />

      {/* Divine Light Rays */}
      <div className="absolute inset-0 divine-rays" />

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
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

        <p className="text-white/90 text-lg md:text-xl text-center animate-fade-in-delayed italic">
          Om Namo Venkateshaya
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-float cursor-pointer">
          <ScrollArrow className="w-10 h-10" />
          <p className="text-temple-gold text-sm mt-2 text-center">Scroll</p>
        </div>
      </div>
    </section>
  );
}
