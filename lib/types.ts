// Site Configuration
export interface SiteConfig {
  title: string;
  legalName: string;
  iban: string;
  contactEmail: string;
  contactPhone: string;
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
