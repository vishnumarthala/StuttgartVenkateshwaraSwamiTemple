export default function MissionStatement() {
  return (
    <section className="relative py-20 md:py-28 bg-temple-cream overflow-hidden">
      {/* Divine Light Rays Background */}
      <div className="absolute inset-0 light-rays opacity-30" />

      <div className="container-custom relative z-10">
        {/* Narrative Introduction */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="section-heading mb-8">Our Sacred Journey</h2>

          <div className="space-y-6 text-lg text-temple-dark-gray leading-relaxed">
            <p>
              In the heart of Stuttgart, a divine vision is taking shape. Our community of
              devoted souls is coming together to build a sacred home for Lord Venkateshwara—a
              spiritual sanctuary that will serve generations to come.
            </p>
            <p>
              Sri Venkateshwara Temple Stuttgart is more than a construction project. It is
              a sacred mission to create a spiritual haven for the Hindu community in
              Baden-Württemberg. Following ancient Agama Shastra traditions, we are committed
              to building a temple that honors Lord Venkateshwara while serving as a cultural
              bridge between India and Germany.
            </p>
            <p className="text-temple-maroon font-serif italic text-xl">
              This temple will be a beacon of our shared values, traditions, and unwavering faith.
            </p>
          </div>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-8">
            {/* Mission Point 1 */}
            <div className="card fabric-texture hover-elevate animate-gentle-scale text-center">
              <div className="w-16 h-16 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-temple-maroon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-temple-dark-red mb-2">
                Devotion
              </h3>
              <p className="text-temple-dark-gray">
                A sacred space for prayer, meditation, and connecting with the divine
                presence of Lord Venkateshwara.
              </p>
            </div>

            {/* Mission Point 2 */}
            <div className="card fabric-texture hover-elevate animate-gentle-scale text-center" style={{ animationDelay: '150ms' }}>
              <div className="w-16 h-16 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-temple-maroon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-temple-dark-red mb-2">
                Community
              </h3>
              <p className="text-temple-dark-gray">
                A gathering place for festivals, cultural events, and bringing the
                Indian diaspora together.
              </p>
            </div>

            {/* Mission Point 3 */}
            <div className="card fabric-texture hover-elevate animate-gentle-scale text-center" style={{ animationDelay: '300ms' }}>
              <div className="w-16 h-16 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-temple-maroon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-temple-dark-red mb-2">
                Tradition
              </h3>
              <p className="text-temple-dark-gray">
                Preserving and sharing ancient Vedic traditions, rituals, and
                spiritual wisdom for future generations.
              </p>
            </div>
          </div>
        </div>
    </section>
  );
}
