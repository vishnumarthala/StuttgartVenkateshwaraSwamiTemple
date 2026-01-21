'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Donation } from '@/lib/types';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Euro, 
  Calendar, 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Save
} from 'lucide-react';

export default function DonationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const supabase = createBrowserSupabaseClient();

  const donationId = params.id as string;

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('id', donationId)
          .single();

        if (error) {
          console.error('Error fetching donation:', error);
          return;
        }

        setDonation(data);
        setAdminNotes(data.admin_notes || '');
      } catch (err) {
        console.error('Error loading donation:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (donationId) {
      fetchDonation();
    }
  }, [donationId, supabase]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const saveAdminNotes = async () => {
    if (!donation) return;
    
    setIsSaving(true);
    setSaveMessage('');

    try {
      const { error } = await supabase
        .from('donations')
        .update({ admin_notes: adminNotes })
        .eq('id', donation.id);

      if (error) {
        setSaveMessage('Error saving notes');
        console.error('Error saving notes:', error);
      } else {
        setSaveMessage('Notes saved successfully');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      setSaveMessage('Error saving notes');
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Donation not found</p>
        <Link href="/admin/donations" className="text-amber-600 hover:text-amber-700 mt-4 inline-block">
          ← Back to Donations
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/donations"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Donations
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Donation Details</h1>
            <p className="text-gray-600">ID: {donation.id}</p>
          </div>
          {donation.tax_receipt_eligible && !donation.tax_receipt_sent && (
            <Link
              href={`/admin/tax-receipts?donation=${donation.id}`}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Generate Tax Receipt</span>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donor Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{donation.donor_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a
                  href={`mailto:${donation.donor_email}`}
                  className="font-medium text-amber-600 hover:text-amber-700 flex items-center"
                >
                  {donation.donor_email}
                  <Mail className="w-4 h-4 ml-1" />
                </a>
              </div>
              {donation.donor_gotram && (
                <div>
                  <p className="text-sm text-gray-500">Gotram</p>
                  <p className="font-medium text-gray-900">{donation.donor_gotram}</p>
                </div>
              )}
              {donation.donor_message && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="font-medium text-gray-900">{donation.donor_message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address (if available) */}
          {(donation.donor_street || donation.donor_city) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                Address (for Tax Receipt)
              </h2>
              <div className="space-y-1">
                {donation.donor_street && (
                  <p className="text-gray-900">{donation.donor_street}</p>
                )}
                <p className="text-gray-900">
                  {donation.donor_postal_code} {donation.donor_city}
                </p>
                {donation.donor_country && (
                  <p className="text-gray-900">{donation.donor_country}</p>
                )}
              </div>
            </div>
          )}

          {/* Payment Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">PayPal Order ID</p>
                <p className="font-mono text-sm text-gray-900">{donation.paypal_order_id}</p>
              </div>
              {donation.paypal_transaction_id && (
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-mono text-sm text-gray-900">{donation.paypal_transaction_id}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="text-gray-900">{formatDate(donation.created_at)}</p>
              </div>
              {donation.captured_at && (
                <div>
                  <p className="text-sm text-gray-500">Captured At</p>
                  <p className="text-gray-900">{formatDate(donation.captured_at)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Add internal notes about this donation..."
            />
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={saveAdminNotes}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Notes'}</span>
              </button>
              {saveMessage && (
                <span className={`text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Amount Card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <Euro className="w-6 h-6" />
              <span className="text-amber-100">Amount</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(donation.amount)}</p>
            <p className="text-amber-100 mt-1">{donation.tier_name}</p>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon(donation.status)}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  donation.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : donation.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Tax Receipt Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Tax Receipt</h3>
            {donation.tax_receipt_eligible ? (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-900">
                    {donation.tax_receipt_sent ? 'Sent' : 'Pending'}
                  </span>
                </div>
                {donation.tax_receipt_sent && donation.tax_receipt_sent_at && (
                  <p className="text-sm text-gray-500">
                    Sent on {formatDate(donation.tax_receipt_sent_at)}
                  </p>
                )}
                {!donation.donor_street && (
                  <p className="text-sm text-amber-600 mt-2">
                    ⚠️ Address missing - cannot generate receipt
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Not eligible (below €300)</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${donation.donor_email}`}
                className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email Donor</span>
              </a>
              {donation.tax_receipt_eligible && !donation.tax_receipt_sent && donation.donor_street && (
                <Link
                  href={`/admin/tax-receipts?donation=${donation.id}`}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Receipt</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
