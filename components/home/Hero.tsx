import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-temple-maroon overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F4C430' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-custom relative">
        <div className="py-20 md:py-32 text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-temple-gold mb-6 leading-tight">
            United by a Sacred Vision
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join us in building Lord Venkateshwara&apos;s divine abode in Stuttgart —
            a beacon of spirituality for devotees across Germany.
          </p>

          {/* Quote */}
          <blockquote className="max-w-2xl mx-auto mb-10 px-6 py-4 border-l-4 border-temple-gold bg-white/5 rounded-r-lg">
            <p className="text-white/80 italic text-lg">
              &ldquo;When a person constructs a temple for Lord Vishnu, he is freed
              from the sins of a thousand births.&rdquo;
            </p>
            <footer className="text-temple-gold mt-2 text-sm">
              — Agni Purana
            </footer>
          </blockquote>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="btn-primary text-lg px-8 py-4"
            >
              Support the Temple
            </Link>
            <Link
              href="/about"
              className="bg-white/10 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition-colors"
            >
              Learn Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
            fill="#FDFBF7"
          />
        </svg>
      </div>
    </section>
  );
}
