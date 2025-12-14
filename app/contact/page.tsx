import { Metadata } from 'next';
import { getSiteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Sri Venkateshwara Temple Stuttgart. Find our address, phone number, and email.',
};

export default function ContactPage() {
  const config = getSiteConfig();
  const fullAddress = `${config.address.street}, ${config.address.postalCode} ${config.address.city}, ${config.address.country}`;

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-temple-dark-red mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-temple-dark-gray">
            We would love to hear from you. Reach out with any questions about the
            temple project or how you can get involved.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              {/* Address Card */}
              <div className="card">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-temple-maroon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-temple-dark-red mb-1">
                      Address
                    </h3>
                    <address className="not-italic text-temple-dark-gray">
                      <p>{config.address.street}</p>
                      <p>
                        {config.address.postalCode} {config.address.city}
                      </p>
                      <p>{config.address.country}</p>
                    </address>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="card">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-temple-maroon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-temple-dark-red mb-1">
                      Phone
                    </h3>
                    <a
                      href={`tel:${config.contactPhone.replace(/\s/g, '')}`}
                      className="text-temple-dark-gray hover:text-temple-maroon transition-colors"
                    >
                      {config.contactPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="card">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-temple-maroon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-temple-dark-red mb-1">
                      Email
                    </h3>
                    <a
                      href={`mailto:${config.contactEmail}`}
                      className="text-temple-dark-gray hover:text-temple-maroon transition-colors"
                    >
                      {config.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Representative */}
              <div className="card bg-temple-cream">
                <h3 className="text-lg font-semibold text-temple-dark-red mb-2">
                  Representative
                </h3>
                <p className="text-temple-dark-gray">{config.representative}</p>
                <p className="text-sm text-gray-500 mt-1">{config.legalName}</p>
              </div>
            </div>

            {/* Map */}
            <div className="card p-0 overflow-hidden h-[400px] md:h-auto">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Temple Location Map"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
