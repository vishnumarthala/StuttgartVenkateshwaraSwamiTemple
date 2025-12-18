import { Metadata } from "next";
import DonateClient from "@/components/donation/DonateClient";
import { getDonationTiers, getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support the construction of Sri Venkateshwara Temple Stuttgart. Choose from various donation tiers and receive blessings.",
};

export default function DonatePage() {
  const tiers = getDonationTiers();
  const config = getSiteConfig();

  return <DonateClient tiers={tiers} config={config} />;
}
