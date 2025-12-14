# **Project Specification: Sri Venkateshwara Temple Stuttgart (Digital Platform)**

Version: 1.0 (Final)  
Date: December 14, 2025  
Legal Entity: Sri Venkateshwara Temple Stuttgart gUG (haftungsbeschränkt) i.G.  
Status: Ready for Development

## **1\. Project Context**

### **1.1 Overview**

We are building a **Serverless Web Application** to serve as the digital "E-Hundi" (Donation Vessel) and information hub for the construction of the Lord Venkateshwara Temple in Stuttgart, Germany.

### **1.2 Objectives**

1. **Fundraising:** Drive donations through a seamless, localized payment experience (Tier-based).
2. **Trust & Transparency:** Showcase construction progress ("Clay to Consecration") and legal legitimacy.
3. **Community Connection:** Allow devotees to perform _Sevas_ (service) remotely via contributions.

### **1.3 Target Audience**

- **Primary:** Indian Diaspora in Germany (Baden-Württemberg).
- **Secondary:** Local German authorities/public (Compliance & Information).

## **2\. Functional Specifications**

### **2.1 The Donation Engine (Core Feature)**

The platform must support a "Tiered" donation strategy as defined in the official brochure.

- **Logic:** Users select a Tier or enter a custom amount. The system must map the amount to the correct Tier benefits.
- **Tier Definitions:**
  - **Tier 1 (€116 \- €250):** Kumkum Prasadam from Kumbhabhishekam.
  - **Tier 2 (€251 \- €500):** Tier 1 \+ Archana on a special day.
  - **Tier 3 (€501 \- €2,000):** Tier 1-2 \+ Ashtotra Archana for 1 year (every Ekhadashi).
  - **Tier 4 (€2,001 \- €5,000):** Tier 1-3 \+ 1 Day Ubhayam during Kumbhabhishekam.
  - **Tier 5 (\> €5,000):** Tier 1-3 \+ Ubhayam for complete 5-Day Event.
- **Data Collection (Checkout):**
  - Name & Email (Required).
  - **Gotram / Family Name:** (Required for Tiers 2-5 for Archana purposes).
  - Billing Address (Required for \>€300 tax receipts).

### **2.2 Content Management (CMS)**

- **Project Updates:** A blog-like section to post images of construction (e.g., "Stone Carving Started").
- **Milestones:** A visual timeline component showing the project roadmap.
- **Gallery:** High-resolution image grid.

### **2.3 Static Informational Pages**

- **Home:** Hero section with Mission Statement ("United by a Sacred Vision") and Agni Purana quote.
- **About:** "From Clay to Consecration" narrative.
- **Contact:** Address map (Wankelstrasse 4/A), Email, Phone, and Legal Entity details.

## **3\. Technical Architecture**

### **3.1 Tech Stack**

- **Frontend:** Next.js 14+ (App Router).
- **Language:** TypeScript (Strict mode).
- **Styling:** Tailwind CSS.
- **CMS:** Sanity.io (Headless).
- **Payments:** Stripe (Checkout Session).
- **Infrastructure:** Vercel (Hosting & Edge Functions).
- **Email:** Resend (Transactional).

### **3.2 Data Models (Schema Contracts)**

**A. Sanity CMS Schemas (TypeScript Interfaces)**

// siteConfig.ts \- Global Settings  
interface SiteConfig {  
 title: string;  
 legalName: string; // "Sri Venkateshwara Temple Stuttgart gUG..."  
 iban: string; // "DE78 6025..."  
 contactEmail: string;  
 announcement?: {  
 isActive: boolean;  
 text: string;  
 };  
}

// donationTier.ts \- Product Definitions  
interface DonationTier {  
 \_id: string;  
 name: string; // "Tier 1"  
 minAmount: number; // 116  
 maxAmount: number; // 250  
 benefits: string\[\]; // \["Kumkum Prasadam..."\]  
 stripePriceId?: string; // Optional: if using fixed price objects  
}

// projectUpdate.ts \- The Blog  
interface ProjectUpdate {  
 title: string;  
 slug: { current: string };  
 publishedAt: string; // ISO Date  
 mainImage: SanityImage;  
 body: PortableText; // Rich Text  
}

**B. Payment API Contract (Next.js API Route)**

// POST /api/checkout  
interface CheckoutRequest {  
 amount: number; // Amount in EUR  
 tierName?: string; // "Tier 1", "Tier 2", etc.  
 donorContext: {  
 fullName: string;  
 gotram?: string; // For Archana  
 email: string;  
 };  
}

### **3.3 Integration Workflow**

1. **CMS:** Content editors publish updates in Sanity Studio \-\> Next.js uses ISR (Incremental Static Regeneration) to build pages.
2. **Donation:** User clicks "Donate" \-\> Calls /api/checkout \-\> Redirects to Stripe \-\> Success Webhook triggers Email via Resend.

## **4\. Legal & Compliance (German Regulations)**

### **4.1 Impressum (Mandatory)**

Must be accessible from every page (Footer).

- **Entity:** Sri Venkateshwara Temple Stuttgart gUG (haftungsbeschränkt) i.G.
- **Address:** Wankelstrasse 4/A, 71272 Renningen.
- **Representative:** Sri Kumaran Sharma.
- **Contact:** \+49 152 55749792, Psvtstuttgart@gmail.com.
- **Register Info:** Must state "in Gründung" (i.G.) until VR number is assigned.

### **4.2 Datenschutz (GDPR)**

- **Privacy Policy:** Explicitly list 3rd party processors:
  - **Stripe:** Payment processing.
  - **Sanity:** Content delivery.
  - **Vercel:** Hosting/Logs.
- **Cookie Strategy:** Strictly necessary cookies only (to avoid complex consent banners if possible).

## **5\. UI/UX Design System**

### **5.1 Color Palette (Brochure Aligned)**

- **Primary (Maroon):** \#6B1C23 (Approximate hex for the Brochure Tier background).
- **Accent (Gold):** \#F4C430 (For borders, buttons, and "SVT" logo accents).
- **Neutral:** \#FDFBF7 (Cream/Off-white background for text readability).
- **Text:** \#1A1A1A (Dark Gray for body), \#4A0404 (Dark Red for Headers).

### **5.2 Typography**

- **Headings:** Serif font (e.g., _Merriweather_ or _Cinzel_) to convey tradition and divinity.
- **Body:** Sans-serif font (e.g., _Inter_ or _Lato_) for modern readability.

## **6\. Development Roadmap**

1. **Scaffolding:** Setup Next.js, Tailwind, and Sanity client.
2. **CMS Integration:** Define Schemas, populate dummy data for Tiers.
3. **UI Construction:** Build Landing Page, About, and Tier Cards.
4. **Payment Integration:** Connect Stripe API, handle Checkout flow.
5. **Legal Pages:** Add static Impressum/Datenschutz.
6. **QA/Launch:** Verify IBAN, Email triggers, and mobile responsiveness.
