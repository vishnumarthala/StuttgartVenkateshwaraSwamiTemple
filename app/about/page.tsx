import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about the Sri Venkateshwara Temple Stuttgart project - from clay to consecration, our mission to build a sacred space in Germany.',
};

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-temple-dark-red mb-4">
            From Clay to Consecration
          </h1>
          <p className="text-lg text-temple-dark-gray">
            The story of bringing Lord Venkateshwara&apos;s divine presence to Stuttgart
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto prose prose-lg">
          {/* Vision Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-temple-dark-red mb-6">
              Our Sacred Vision
            </h2>
            <p className="text-temple-dark-gray leading-relaxed mb-4">
              Sri Venkateshwara Temple Stuttgart represents a dream shared by
              thousands of devotees in Baden-Württemberg — to create a traditional
              temple where the divine presence of Lord Venkateshwara, the Lord of
              Seven Hills, can be worshipped according to ancient Agama Shastra
              traditions.
            </p>
            <p className="text-temple-dark-gray leading-relaxed mb-4">
              For many years, the Indian diaspora in the Stuttgart region has
              yearned for a sacred space that connects them to their spiritual
              roots. This temple will serve not only as a place of worship but as a
              cultural bridge, preserving and sharing the rich traditions of Hindu
              spirituality with future generations.
            </p>
          </section>

          {/* The Legend */}
          <section className="mb-16 bg-temple-cream rounded-xl p-8">
            <h2 className="text-2xl font-serif text-temple-dark-red mb-6">
              The Legend of Lord Venkateshwara
            </h2>
            <blockquote className="border-l-4 border-temple-gold pl-6 italic text-temple-dark-gray mb-4">
              &ldquo;In ancient times, Sage Bhrigu visited Vaikunta to test who among
              the Trinity — Brahma, Vishnu, and Shiva — was the most supreme. When
              he approached Lord Vishnu, the Lord was in meditation. Feeling
              slighted, Bhrigu kicked Lord Vishnu on His chest.&rdquo;
            </blockquote>
            <p className="text-temple-dark-gray leading-relaxed mb-4">
              Rather than showing anger, Lord Vishnu humbly asked if Bhrigu&apos;s foot
              was hurt. This supreme act of humility and grace established Lord
              Vishnu as the most worthy of worship. However, Goddess Lakshmi, who
              resides in the Lord&apos;s chest, felt insulted and left Vaikunta.
            </p>
            <p className="text-temple-dark-gray leading-relaxed">
              Lord Vishnu descended to earth as Srinivasa (Venkateshwara) to the
              Seven Hills of Tirumala, where He eventually won back Lakshmi&apos;s love.
              The debt He incurred for His wedding is symbolically repaid by devotees
              through their offerings — thus the tradition of the Hundi (donation
              vessel) was born.
            </p>
          </section>

          {/* Our Mission */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-temple-dark-red mb-6">
              Our Mission
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-temple-maroon mb-2">
                  Spiritual Sanctuary
                </h3>
                <p className="text-temple-dark-gray text-sm">
                  Create a peaceful environment for daily prayers, meditation, and
                  connecting with the divine.
                </p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-temple-maroon mb-2">
                  Traditional Rituals
                </h3>
                <p className="text-temple-dark-gray text-sm">
                  Perform authentic Vedic ceremonies, festivals, and special pujas
                  following Agama Shastra.
                </p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-temple-maroon mb-2">
                  Cultural Preservation
                </h3>
                <p className="text-temple-dark-gray text-sm">
                  Teach Sanskrit, Vedic chanting, and classical arts to preserve our
                  heritage for future generations.
                </p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-temple-maroon mb-2">
                  Community Building
                </h3>
                <p className="text-temple-dark-gray text-sm">
                  Unite the Indian community and share our traditions with German
                  neighbors through cultural events.
                </p>
              </div>
            </div>
          </section>

          {/* The Organization */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-temple-dark-red mb-6">
              The Organization
            </h2>
            <p className="text-temple-dark-gray leading-relaxed mb-4">
              <strong>Sri Venkateshwara Temple Stuttgart gUG (haftungsbeschränkt)</strong>{' '}
              is a registered non-profit organization (gemeinnützige Unternehmergesellschaft)
              established under German law. As a &ldquo;gUG,&rdquo; we are committed to
              charitable purposes, with all funds dedicated solely to temple
              construction and religious activities.
            </p>
            <p className="text-temple-dark-gray leading-relaxed">
              Our organization operates with full transparency. Regular updates on
              construction progress and financial reports will be shared with the
              community.
            </p>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-serif text-temple-dark-red mb-4">
              Join Us in This Sacred Journey
            </h2>
            <p className="text-temple-dark-gray mb-6">
              Every contribution brings us one step closer to making this dream a
              reality.
            </p>
            <Link href="/donate" className="btn-primary">
              Support the Temple
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
