import { DonationTier } from '@/lib/types';
import { formatAmountRange } from '@/lib/utils';

interface TierCardProps {
  tier: DonationTier;
}

export default function TierCard({ tier }: TierCardProps) {
  const isHighlighted = tier.highlighted;

  return (
    <div
      className={`card relative flex flex-col h-full ${
        isHighlighted ? 'border-2 border-temple-gold ring-2 ring-temple-gold/20' : ''
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-temple-gold text-temple-dark-gray text-xs font-bold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-xl font-serif text-temple-dark-red">{tier.name}</h3>
        <p className="text-2xl font-bold text-temple-maroon mt-2">
          {formatAmountRange(tier.minAmount, tier.maxAmount)}
        </p>
      </div>

      <ul className="flex-grow space-y-3 mb-6">
        {tier.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start text-sm text-temple-dark-gray">
            <svg
              className="w-5 h-5 text-temple-gold mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {/* Payment Buttons */}
      <div className="space-y-3">
        <a
          href={tier.paymentLinks.stripe}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-center block"
        >
          Pay with Card
        </a>
        <a
          href={tier.paymentLinks.paypal}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center block bg-[#0070ba] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#005ea6] transition-colors"
        >
          Pay with PayPal
        </a>
      </div>
    </div>
  );
}
