import Hero from '@/components/home/Hero';
import MissionStatement from '@/components/home/MissionStatement';
import ProgressTimeline from '@/components/home/ProgressTimeline';
import { getMilestones, getDonationTiers } from '@/lib/content';
import Link from 'next/link';

export default function HomePage() {
  const milestones = getMilestones();
  const tiers = getDonationTiers();
  const highlightedTier = tiers.find((t) => t.highlighted) || tiers[2];

  return (
    <>
      <Hero />
      <MissionStatement />
      <ProgressTimeline milestones={milestones} />

      {/* Quick Donation CTA */}
      <section className="py-16 md:py-24 bg-temple-cream">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-heading">Be Part of This Sacred Mission</h2>
            <p className="text-lg text-temple-dark-gray mb-8">
              Your contribution, no matter the size, brings us closer to our dream.
              Every donation is a blessing that will be remembered in the temple&apos;s
              history forever.
            </p>

            {/* Featured Tier */}
            <div className="card max-w-md mx-auto mb-8 border-2 border-temple-gold">
              <div className="bg-temple-gold text-temple-dark-gray text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                Most Popular
              </div>
              <h3 className="text-2xl font-serif text-temple-dark-red mb-2">
                {highlightedTier.name}
              </h3>
              <p className="text-3xl font-bold text-temple-maroon mb-4">
                €{highlightedTier.minAmount} - €{highlightedTier.maxAmount}
              </p>
              <ul className="text-left text-temple-dark-gray space-y-2 mb-6">
                {highlightedTier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-temple-gold mr-2 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/donate" className="btn-primary text-lg px-8 py-4">
              View All Donation Tiers
            </Link>
          </div>
        </div>
      </section>

      {/* Bank Transfer Info */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-serif text-temple-dark-red mb-4">
              Direct Bank Transfer
            </h3>
            <p className="text-temple-dark-gray mb-4">
              You can also donate directly via bank transfer:
            </p>
            <div className="bg-temple-cream rounded-lg p-6 inline-block">
              <p className="font-mono text-lg text-temple-maroon">
                IBAN: DE78 6025 0010 0015 0155 65
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Sri Venkateshwara Temple Stuttgart gUG
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
