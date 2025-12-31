import { Metadata } from 'next';
import { getSiteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Legal information and imprint for Sri Venkateshwara Temple Stuttgart gUG.',
};

export default function ImpressumPage() {
  const config = getSiteConfig();

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif text-temple-dark-red mb-8">Impressum</h1>

          <div className="prose prose-lg text-temple-dark-gray">
            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                Angaben gemäß § 5 TMG
              </h2>
              <p>
                <strong>{config.legalName}</strong>
                <br />
                {config.address.street}
                <br />
                {config.address.postalCode} {config.address.city}
                <br />
                {config.address.country}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                Vertreten durch
              </h2>
              <p>{config.representative}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">Kontakt</h2>
              <p>
                Telefon: {config.contactPhone}
                <br />
                E-Mail: {config.contactEmail}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                Registereintrag
              </h2>
              <p>
                Gesellschaft mit beschränkter Haftung
                <br />
                <em>
                  Die Registernummer wird nach Abschluss der Eintragung ergänzt.
                </em>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p>
                {config.representative}
                <br />
                {config.address.street}
                <br />
                {config.address.postalCode} {config.address.city}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                Haftungsausschluss
              </h2>

              <h3 className="text-lg font-semibold mt-4 mb-2">Haftung für Inhalte</h3>
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
                die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können
                wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir
                gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
                als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach Umständen
                zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Haftung für Links</h3>
              <p>
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren
                Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
                fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
                der Seiten verantwortlich.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Urheberrecht</h3>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
