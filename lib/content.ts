import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { SiteConfig, DonationTier, Milestone, ProjectUpdate } from './types';

const contentDirectory = path.join(process.cwd(), 'content');
const updatesDirectory = path.join(contentDirectory, 'updates');

// Site Configuration
export function getSiteConfig(): SiteConfig {
  const filePath = path.join(contentDirectory, 'site-config.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// Donation Tiers
export function getDonationTiers(): DonationTier[] {
  const filePath = path.join(contentDirectory, 'tiers.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getDonationTierById(id: string): DonationTier | undefined {
  const tiers = getDonationTiers();
  return tiers.find((tier) => tier.id === id);
}

// Milestones
export function getMilestones(): Milestone[] {
  const filePath = path.join(contentDirectory, 'milestones.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// Project Updates (Blog Posts)
export function getUpdateSlugs(): string[] {
  if (!fs.existsSync(updatesDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(updatesDirectory);
  return fileNames
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
}

export function getUpdateBySlug(slug: string): ProjectUpdate | null {
  const filePath = path.join(updatesDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || '',
    publishedAt: data.publishedAt || '',
    excerpt: data.excerpt || '',
    image: data.image || '/images/swami.jpg',
    content,
  };
}

export function getAllUpdates(): ProjectUpdate[] {
  const slugs = getUpdateSlugs();
  const updates = slugs
    .map((slug) => getUpdateBySlug(slug))
    .filter((update): update is ProjectUpdate => update !== null)
    .sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  return updates;
}

// Utility: Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Utility: Format date
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}
