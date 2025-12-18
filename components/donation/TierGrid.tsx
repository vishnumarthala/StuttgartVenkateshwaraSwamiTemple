import { DonationTier } from '@/lib/types';
import TierCard from './TierCard';

interface TierGridProps {
  tiers: DonationTier[];
  onPayPalClick?: (tier: DonationTier) => void;
}

export default function TierGrid({ tiers, onPayPalClick }: TierGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tiers.map((tier) => (
        <TierCard key={tier.id} tier={tier} onPayPalClick={onPayPalClick} />
      ))}
    </div>
  );
}
