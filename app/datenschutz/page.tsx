import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Privacy policy for Sri Venkateshwara Temple Stuttgart website.',
};

export default function DatenschutzPage() {
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
                Wer ist verantwortlich für die Datenerfassung?
              </h3>
              <p>
                Die Datenverarbeitung auf dieser Website erfolgt durch den
                Websitebetreiber:
              </p>
              <p>
                Sri Venkateshwara Temple Stuttgart gUG (haftungsbeschränkt)
                <br />
                Wankelstrasse 4/A, 71272 Renningen
                <br />
                E-Mail: svtstuttgart@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                2. Besonderer Schutz religiöser Daten
              </h2>
              <p>
                Da wir ein Hindu-Tempel sind, kann die Übermittlung von Daten (z. B. bei
                Spenden oder Anfragen) Rückschlüsse auf Ihre religiöse Überzeugung
                zulassen. Diese Daten gelten als „besondere Kategorien personenbezogener
                Daten" und unterliegen einem besonderen Schutz nach Art. 9 DSGVO. Mit der
                freiwilligen Übermittlung dieser Daten erklären Sie sich mit deren
                Verarbeitung zum Zweck der Bearbeitung Ihres Anliegens einverstanden.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                3. Hosting
              </h2>
              <p>
                Diese Website wird bei Vercel gehostet. Anbieter ist die Vercel Inc.,
                440 N Barranca Ave #4133, Covina, CA 91723, USA. Beim Besuch unserer
                Website werden durch Vercel automatisch Server-Logfiles erfasst
                (IP-Adresse, Browsertyp, Betriebssystem, Referrer URL, Hostname und
                Uhrzeit). Vercel ist unter dem EU-US Data Privacy Framework zertifiziert,
                was ein angemessenes Datenschutzniveau garantiert.
              </p>
              <p>
                Weitere Informationen:{' '}
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
                4. Cookies und Einwilligung (Consent)
              </h2>
              <p>
                Diese Website verwendet technisch notwendige Cookies. Für die Einbindung
                externer Inhalte (z. B. Google Maps, YouTube) nutzen wir ein
                Consent-Management-Tool (Cookie-Banner). Damit können Sie entscheiden,
                welche Dienste Sie zulassen möchten. Externe Dienste werden erst nach
                Ihrer ausdrücklichen Einwilligung geladen (Art. 6 Abs. 1 lit. a DSGVO).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                5. Externe Inhalte und Drittanbieter
              </h2>

              <h3 className="text-lg font-semibold mt-4 mb-2">Google Maps</h3>
              <p>
                Wir planen die Einbindung von Google Maps, um Ihnen die Anfahrt zum
                Tempel zu erleichtern. Dabei wird Ihre IP-Adresse an Google (USA)
                übertragen. Dies geschieht erst, wenn Sie die Karte im Cookie-Banner
                oder direkt am Platzhalter aktivieren. Details:{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-temple-maroon hover:underline"
                >
                  Google Privacy Policy
                </a>
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">YouTube (Erweiterter Datenschutzmodus)</h3>
              <p>
                Wir binden Videos von YouTube ein. Wir nutzen dabei den „erweiterten
                Datenschutzmodus", sodass YouTube keine Informationen über die Besucher
                speichert, bevor diese das Video abspielen. Mit dem Klick auf „Play"
                willigen Sie in die Datenübermittlung an Google/YouTube ein.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Social Media (Facebook/Instagram)</h3>
              <p>
                Auf unserer Website werden Links oder Plugins zu sozialen Netzwerken
                eingesetzt. Wenn Sie diese nutzen, werden Daten an die jeweiligen
                Anbieter übertragen. Wir nutzen hierbei datenschutzfreundliche Lösungen
                (z. B. Shariff oder erst Laden nach Klick), um eine automatische
                Datenübertragung beim bloßen Seitenaufruf zu verhindern.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                6. Zahlungsabwicklung für Spenden
              </h2>

              <h3 className="text-lg font-semibold mt-4 mb-2">Stripe</h3>
              <p>
                Für Online-Spenden nutzen wir Stripe. Anbieter ist Stripe Payments
                Europe Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin,
                Irland. Die Datenübermittlung erfolgt auf Grundlage von Art. 6 Abs. 1
                lit. b DSGVO (Vertrags-/Spendenabwicklung). Stripe kann Daten an die
                Stripe Inc. in die USA übertragen.
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
                Alternativ bieten wir PayPal an. Anbieter ist PayPal (Europe) S.à.r.l.
                et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg. Bei der
                Nutzung werden Ihre Zahlungsdaten an PayPal übermittelt.
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
                7. Ihre Rechte
              </h2>
              <p>Sie haben jederzeit das Recht auf:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung (Art. 16 DSGVO) oder Löschung (Art. 17 DSGVO) Ihrer Daten</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              </ul>
              <p className="mt-4">
                Kontaktieren Sie uns hierzu einfach unter: svtstuttgart@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-serif text-temple-dark-red mb-4">
                8. Beschwerderecht
              </h2>
              <p>
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
                beschweren. Für uns zuständig ist der Landesbeauftragte für den
                Datenschutz und die Informationsfreiheit Baden-Württemberg.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
