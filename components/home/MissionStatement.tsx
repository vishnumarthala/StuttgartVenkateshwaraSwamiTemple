export default function MissionStatement() {
  return (
    <section className="py-16 md:py-24 bg-temple-cream">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-heading">From Clay to Consecration</h2>

          <p className="text-lg text-temple-dark-gray leading-relaxed mb-8">
            Sri Venkateshwara Temple Stuttgart is more than a construction project —
            it is a sacred mission to create a spiritual home for the Hindu community
            in Baden-Württemberg. Following ancient Agama Shastra traditions, we are
            committed to building a temple that honors Lord Venkateshwara while
            serving as a cultural bridge between India and Germany.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Mission Point 1 */}
            <div className="card text-center">
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
            <div className="card text-center">
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
            <div className="card text-center">
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
      </div>
    </section>
  );
}
