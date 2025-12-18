'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, Home, Mail } from 'lucide-react';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { Donation } from '@/lib/types';

function SuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonation() {
      if (!transactionId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('paypal_transaction_id', transactionId)
          .single();

        if (error) {
          console.error('Failed to fetch donation:', error);
        } else {
          setDonation(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDonation();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="py-12 md:py-20">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-temple-dark-gray">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Use donation data if available, fallback to URL params
  const displayData = {
    transactionId: donation?.paypal_transaction_id || transactionId,
    amount: donation?.amount || parseFloat(searchParams.get('amount') || '0'),
    tierName: donation?.tier_name || searchParams.get('tierName'),
    donorName: donation?.donor_name,
    donorEmail: donation?.donor_email,
  };

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-temple-dark-red mb-2">
              Thank You{displayData.donorName ? `, ${displayData.donorName}` : ''}!
            </h1>
            <p className="text-lg text-temple-dark-gray">
              Your generous contribution has been received successfully.
            </p>
          </div>

          {/* Transaction Details */}
          <div className="card mb-8">
            <h2 className="text-xl font-serif text-temple-dark-red mb-4">
              Transaction Details
            </h2>
            <div className="space-y-3">
              {displayData.transactionId && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-temple-dark-gray font-medium">
                    Transaction ID:
                  </span>
                  <span className="text-temple-dark-gray font-mono text-sm">
                    {displayData.transactionId}
                  </span>
                </div>
              )}
              {displayData.amount > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-temple-dark-gray font-medium">Amount:</span>
                  <span className="text-temple-maroon font-semibold text-xl">
                    €{displayData.amount}
                  </span>
                </div>
              )}
              {displayData.tierName && (
                <div className="flex justify-between items-center">
                  <span className="text-temple-dark-gray font-medium">Tier:</span>
                  <span className="text-temple-dark-gray">{displayData.tierName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="card mb-8 bg-amber-50 border border-amber-200">
            <h2 className="text-xl font-serif text-temple-dark-red mb-4">
              What Happens Next?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-temple-dark-gray">
                    <strong>Email Confirmation:</strong> You will receive a
                    confirmation email shortly with your donation details.
                  </p>
                </div>
              </li>
              {displayData.amount >= 300 && (
                <li className="flex items-start">
                  <Download className="w-5 h-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-temple-dark-gray">
                      <strong>Tax Receipt:</strong> As your donation is €300 or
                      more, you will receive a tax receipt (Spendenquittung) for
                      German tax purposes within 2-3 business days.
                    </p>
                  </div>
                </li>
              )}
              {displayData.tierName && displayData.tierName !== 'Tier 1' && (
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-temple-dark-gray">
                      <strong>Temple Services:</strong> We will perform the
                      rituals and services associated with your donation tier as
                      per the schedule. You will be notified about the dates.
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Blessings Message */}
          <div className="text-center mb-8 py-6 px-4 bg-gradient-to-r from-temple-gold/10 to-temple-maroon/10 rounded-lg">
            <p className="text-lg text-temple-dark-red font-serif italic">
              "May Lord Venkateshwara bless you and your family with health,
              prosperity, and happiness."
            </p>
            <p className="text-sm text-temple-dark-gray mt-2">
              - Sri Venkateshwara Temple Stuttgart Team
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-temple-maroon text-white rounded-lg hover:bg-temple-dark-red transition-colors font-medium"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-6 py-3 bg-temple-gold text-temple-dark-gray rounded-lg hover:bg-temple-gold/80 transition-colors font-medium"
            >
              Make Another Donation
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-8 text-center">
            <p className="text-sm text-temple-dark-gray">
              If you have any questions or need assistance, please contact us at{' '}
              <a
                href="mailto:info@svtstuttgart.de"
                className="text-temple-maroon hover:underline font-medium"
              >
                info@svtstuttgart.de
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="py-12 md:py-20">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-temple-dark-gray">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
