import { Metadata } from "next";
import TierGrid from "@/components/donation/TierGrid";
import { getDonationTiers, getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support the construction of Sri Venkateshwara Temple Stuttgart. Choose from various donation tiers and receive blessings.",
};

export default function DonatePage() {
  const tiers = getDonationTiers();
  const config = getSiteConfig();

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-temple-dark-red mb-4">
            Support the Temple
          </h1>
          <p className="text-lg text-temple-dark-gray leading-relaxed">
            Your generous contribution will help build a sacred space for Lord
            Venkateshwara in Stuttgart. Every donation, regardless of size, is a
            blessing that brings us closer to our dream.
          </p>
        </div>

        {/* Tier Grid */}
        <div className="mb-16">
          <TierGrid tiers={tiers} />
        </div>

        {/* Important Information */}
        <div className="max-w-3xl mx-auto">
          {/* Tax Receipt Info */}
          <div className="card mb-8">
            <h2 className="text-xl font-serif text-temple-dark-red mb-4">
              Tax Receipts
            </h2>
            <p className="text-temple-dark-gray">
              For donations of <strong>€300 or more</strong>, we will provide a
              tax receipt (Spendenquittung) for German tax purposes. Please
              ensure your billing address is correct during checkout.
            </p>
          </div>

          {/* Gotram Info */}
          <div className="card mb-8">
            <h2 className="text-xl font-serif text-temple-dark-red mb-4">
              Gotram Information
            </h2>
            <p className="text-temple-dark-gray">
              For Tier 2 and above, we will perform Archana in your name. Please
              provide your{" "}
              <strong>family member details with Gotram & Nakshatram</strong>{" "}
              during checkout so we can correctly perform the rituals in your
              honor.
            </p>
          </div>

          {/* Bank Transfer Option */}
          <div className="card bg-temple-maroon text-white">
            <h2 className="text-xl font-serif text-temple-gold mb-4">
              Bank Transfer Option
            </h2>
            <p className="text-gray-200 mb-4">
              If you prefer to donate via direct bank transfer, please use the
              following details:
            </p>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-mono text-lg mb-2">IBAN: {config.iban}</p>
              <p className="text-sm text-gray-300">
                Account Holder: {config.legalName}
              </p>
            </div>
            <p className="text-sm text-gray-300 mt-4">
              Please include your name and email in the transfer reference so we
              can send you a confirmation and tax receipt if applicable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
