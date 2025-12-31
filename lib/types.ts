// Site Configuration
export interface SiteConfig {
  title: string;
  legalName: string;
  iban: string;
  contactEmail: string;
  contactPhone: string;
  contactPhone2?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  representative: string;
  announcement?: {
    isActive: boolean;
    text: string;
  };
}

// Donation Tier
export interface DonationTier {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number | null; // null for "unlimited" top tier
  benefits: string[];
  paymentLinks: {
    stripe: string;
    paypal: string;
  };
  highlighted?: boolean;
  isFlexible?: boolean; // true for tiers that allow any amount within range
  suggestedAmounts?: number[]; // optional suggested amounts for flexible tiers
}

// Project Update (Blog Post)
export interface ProjectUpdate {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  image: string;
  content: string;
}

// Milestone (Timeline)
export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  icon?: string;
}

// Gallery Image
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category?: string;
}

// PayPal Donation Types
export interface DonorInfo {
  name: string;
  email: string;
  gotram?: string;
  message?: string;
}

export interface PayPalOrderRequest {
  amount: number;
  tierName: string;
  donorInfo: DonorInfo;
}

export interface PayPalOrderResponse {
  orderId: string;
}

export interface PayPalCaptureResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Database Types
export interface Donation {
  id: string;
  paypal_order_id: string;
  paypal_transaction_id: string | null;
  amount: number;
  currency: string;
  tier_name: string;
  donor_name: string;
  donor_email: string;
  donor_gotram: string | null;
  donor_message: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  tax_receipt_eligible: boolean;
  tax_receipt_sent: boolean;
  tax_receipt_sent_at: string | null;
  created_at: string;
  captured_at: string | null;
  updated_at: string;
}

export interface DonationInsert {
  paypal_order_id: string;
  amount: number;
  currency?: string;
  tier_name: string;
  donor_name: string;
  donor_email: string;
  donor_gotram?: string;
  donor_message?: string;
  status: 'pending' | 'completed' | 'failed';
  tax_receipt_eligible?: boolean;
}

export interface DonationAnalytics {
  tier_name: string;
  donation_count: number;
  total_amount: number;
  avg_amount: number;
  first_donation: string;
  last_donation: string;
}
