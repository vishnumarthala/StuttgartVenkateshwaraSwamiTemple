'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Donation } from '@/lib/types';
import Link from 'next/link';
import { 
  FileText, 
  Send, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Mail
} from 'lucide-react';

export default function TaxReceiptsPage() {
  const searchParams = useSearchParams();
  const preSelectedDonationId = searchParams.get('donation');
  
  const [eligibleDonations, setEligibleDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchEligibleDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('status', 'completed')
          .eq('tax_receipt_eligible', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching donations:', error);
          return;
        }

        setEligibleDonations(data || []);

        // If there's a pre-selected donation, select it
        if (preSelectedDonationId && data) {
          const donation = data.find(d => d.id === preSelectedDonationId);
          if (donation) {
            setSelectedDonation(donation);
          }
        }
      } catch (err) {
        console.error('Error loading donations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEligibleDonations();
  }, [preSelectedDonationId, supabase]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const generatePreview = async (donation: Donation) => {
    setIsGenerating(true);
    setMessage(null);
    
    try {
      const response = await fetch(`/api/admin/tax-receipt?donationId=${donation.id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate preview');
      }

      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setIsGenerating(false);
    }
  };

  const markAsSent = async (donation: Donation) => {
    setIsSending(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/tax-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId: donation.id,
          sendEmail: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update status');
      }

      // Update local state
      setEligibleDonations(prev =>
        prev.map(d =>
          d.id === donation.id
            ? { ...d, tax_receipt_sent: true, tax_receipt_sent_at: new Date().toISOString() }
            : d
        )
      );

      setMessage({ type: 'success', text: 'Tax receipt marked as sent' });
      setSelectedDonation(null);
      setPreviewUrl(null);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setIsSending(false);
    }
  };

  const downloadReceipt = () => {
    if (!previewUrl || !selectedDonation) return;
    
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `Spendenbescheinigung_${selectedDonation.donor_name.replace(/\s+/g, '_')}_${formatDate(selectedDonation.created_at).replace(/\./g, '-')}.html`;
    link.click();
  };

  const pendingReceipts = eligibleDonations.filter(d => !d.tax_receipt_sent);
  const sentReceipts = eligibleDonations.filter(d => d.tax_receipt_sent);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tax Receipts (Spendenbescheinigungen)</h1>
        <p className="text-gray-600">Manage and issue German tax receipts for eligible donations (€300+)</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-gray-900">{pendingReceipts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sent</p>
              <p className="text-lg font-semibold text-gray-900">{sentReceipts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Eligible</p>
              <p className="text-lg font-semibold text-gray-900">{eligibleDonations.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Receipts List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Tax Receipts</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
            {pendingReceipts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p>All tax receipts have been sent!</p>
              </div>
            ) : (
              pendingReceipts.map((donation) => {
                const hasAddress = donation.donor_street && donation.donor_city;
                return (
                  <div
                    key={donation.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedDonation?.id === donation.id ? 'bg-amber-50' : ''
                    }`}
                    onClick={() => setSelectedDonation(donation)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{donation.donor_name}</p>
                        <p className="text-sm text-gray-500">{donation.donor_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(donation.amount)}</p>
                        <p className="text-sm text-gray-500">{formatDate(donation.created_at)}</p>
                      </div>
                    </div>
                    {!hasAddress && (
                      <div className="mt-2 flex items-center text-amber-600 text-sm">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Address missing
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Preview/Action Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Receipt Preview & Actions</h2>
          </div>
          <div className="p-6">
            {selectedDonation ? (
              <div>
                {/* Selected Donation Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{selectedDonation.donor_name}</p>
                    <p className="font-bold text-amber-600">{formatCurrency(selectedDonation.amount)}</p>
                  </div>
                  <p className="text-sm text-gray-600">{selectedDonation.donor_email}</p>
                  {selectedDonation.donor_street && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedDonation.donor_street}, {selectedDonation.donor_postal_code} {selectedDonation.donor_city}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {selectedDonation.donor_street && selectedDonation.donor_city ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => generatePreview(selectedDonation)}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      <Eye className="w-5 h-5" />
                      <span>{isGenerating ? 'Generating...' : 'Preview Receipt'}</span>
                    </button>

                    {previewUrl && (
                      <>
                        <button
                          onClick={downloadReceipt}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-5 h-5" />
                          <span>Download HTML</span>
                        </button>

                        <button
                          onClick={() => markAsSent(selectedDonation)}
                          disabled={isSending}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>{isSending ? 'Processing...' : 'Mark as Sent'}</span>
                        </button>
                      </>
                    )}

                    {/* Preview iframe */}
                    {previewUrl && (
                      <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                        <iframe
                          src={previewUrl}
                          className="w-full h-[400px]"
                          title="Receipt Preview"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                    <p className="text-gray-700 font-medium">Address Required</p>
                    <p className="text-sm text-gray-500 mt-1">
                      This donor has not provided their address.
                      A complete address is required for German tax receipts.
                    </p>
                    <Link
                      href={`/admin/donations/${selectedDonation.id}`}
                      className="inline-flex items-center mt-4 text-amber-600 hover:text-amber-700"
                    >
                      View Donation Details →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a donation from the list to preview or generate a tax receipt</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sent Receipts Section */}
      {sentReceipts.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Sent Tax Receipts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donation Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sentReceipts.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{donation.donor_name}</p>
                        <p className="text-sm text-gray-500">{donation.donor_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(donation.created_at)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {donation.tax_receipt_sent_at ? formatDate(donation.tax_receipt_sent_at) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/donations/${donation.id}`}
                        className="text-amber-600 hover:text-amber-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
