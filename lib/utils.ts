// Combine class names (simple implementation)
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// Format amount range for display
export function formatAmountRange(min: number, max: number | null): string {
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (max === null) {
    return `${formatter.format(min)}+`;
  }
  return `${formatter.format(min)} - ${formatter.format(max)}`;
}

// Generate Google Maps embed URL
export function getGoogleMapsEmbedUrl(address: string): string {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`;
}

// Simple Google Maps embed without API key (uses iframe)
export function getGoogleMapsIframeUrl(address: string): string {
  const encodedAddress = encodeURIComponent(address);
  return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
