import { Metadata } from 'next';
import { getSiteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Privacy policy for Sri Venkateshwara Temple Stuttgart website.',
};

export default function DatenschutzPage() {
  const config = getSiteConfig();

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif text-temple-dark-red mb-8">
            Datenschutzerklärung
          </h1>

          <div className="prose prose-lg text-temple-dark-gray">
            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                1. Datenschutz auf einen Blick
              </h2>

              <h3 className="text-lg font-semibold mt-4 mb-2">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was
                mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
                besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
                persönlich identifiziert werden können.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">
                Datenerfassung auf dieser Website
              </h3>
              <p>
                <strong>Wer ist verantwortlich für die Datenerfassung?</strong>
                <br />
                Die Datenverarbeitung auf dieser Website erfolgt durch den
                Websitebetreiber:
              </p>
              <p>
                {config.legalName}
                <br />
                {config.address.street}, {config.address.postalCode}{' '}
                {config.address.city}
                <br />
                E-Mail: {config.contactEmail}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                2. Hosting
              </h2>
              <p>
                Diese Website wird bei Vercel Inc. gehostet. Vercel ist ein Anbieter
                aus den USA. Beim Besuch unserer Website werden durch Vercel
                automatisch Informationen erfasst, die Ihr Browser übermittelt
                (Server-Logs). Dies umfasst insbesondere Ihre IP-Adresse,
                Browsertyp, Betriebssystem, Referrer URL, Hostname des zugreifenden
                Rechners und Uhrzeit der Serveranfrage.
              </p>
              <p>
                Weitere Informationen finden Sie in der Datenschutzerklärung von
                Vercel:{' '}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-temple-maroon hover:underline"
                >
                  https://vercel.com/legal/privacy-policy
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                3. Zahlungsabwicklung
              </h2>

              <h3 className="text-lg font-semibold mt-4 mb-2">Stripe</h3>
              <p>
                Für Online-Spenden nutzen wir den Zahlungsdienstleister Stripe.
                Anbieter ist Stripe Payments Europe Ltd., 1 Grand Canal Street
                Lower, Grand Canal Dock, Dublin, Irland.
              </p>
              <p>
                Wenn Sie per Stripe bezahlen, werden die von Ihnen eingegebenen
                Zahlungsdaten an Stripe übermittelt. Die Übermittlung erfolgt auf
                Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsabwicklung).
              </p>
              <p>
                Weitere Informationen:{' '}
                <a
                  href="https://stripe.com/de/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-temple-maroon hover:underline"
                >
                  https://stripe.com/de/privacy
                </a>
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">PayPal</h3>
              <p>
                Alternativ bieten wir PayPal als Zahlungsmethode an. Anbieter ist
                PayPal (Europe) S.à.r.l. et Cie, S.C.A., 22-24 Boulevard Royal,
                L-2449 Luxembourg.
              </p>
              <p>
                Wenn Sie per PayPal bezahlen, werden die von Ihnen eingegebenen
                Zahlungsdaten an PayPal übermittelt.
              </p>
              <p>
                Weitere Informationen:{' '}
                <a
                  href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-temple-maroon hover:underline"
                >
                  https://www.paypal.com/de/webapps/mpp/ua/privacy-full
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                4. Cookies
              </h2>
              <p>
                Diese Website verwendet ausschließlich technisch notwendige Cookies.
                Diese sind erforderlich, um die grundlegenden Funktionen der Website
                zu gewährleisten. Da diese Cookies für den Betrieb der Website
                unbedingt erforderlich sind, können Sie sie nicht ablehnen.
              </p>
              <p>
                Wir verwenden keine Tracking-Cookies oder Analyse-Tools wie Google
                Analytics.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                5. Ihre Rechte
              </h2>
              <p>Sie haben jederzeit das Recht:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Auskunft über Ihre gespeicherten Daten zu erhalten</li>
                <li>Berichtigung unrichtiger Daten zu verlangen</li>
                <li>Löschung Ihrer Daten zu verlangen</li>
                <li>Einschränkung der Verarbeitung zu verlangen</li>
                <li>Widerspruch gegen die Verarbeitung einzulegen</li>
                <li>Datenübertragbarkeit zu verlangen</li>
              </ul>
              <p className="mt-4">
                Bei Fragen zum Datenschutz kontaktieren Sie uns unter:{' '}
                {config.contactEmail}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                6. Beschwerderecht
              </h2>
              <p>
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
                über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
