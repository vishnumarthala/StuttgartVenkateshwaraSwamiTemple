'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Donation } from '@/lib/types';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  FileText
} from 'lucide-react';

type FilterStatus = 'all' | 'completed' | 'pending' | 'failed' | 'refunded';
type FilterTaxReceipt = 'all' | 'eligible' | 'sent' | 'pending';

export default function DonationsListPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [taxReceiptFilter, setTaxReceiptFilter] = useState<FilterTaxReceipt>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching donations:', error);
          return;
        }

        setDonations(data || []);
        setFilteredDonations(data || []);
      } catch (err) {
        console.error('Error loading donations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [supabase]);

  // Apply filters
  useEffect(() => {
    let result = [...donations];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.donor_name.toLowerCase().includes(term) ||
          d.donor_email.toLowerCase().includes(term) ||
          d.paypal_order_id?.toLowerCase().includes(term) ||
          d.paypal_transaction_id?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((d) => d.status === statusFilter);
    }

    // Tax receipt filter
    if (taxReceiptFilter !== 'all') {
      if (taxReceiptFilter === 'eligible') {
        result = result.filter((d) => d.tax_receipt_eligible);
      } else if (taxReceiptFilter === 'sent') {
        result = result.filter((d) => d.tax_receipt_eligible && d.tax_receipt_sent);
      } else if (taxReceiptFilter === 'pending') {
        result = result.filter((d) => d.tax_receipt_eligible && !d.tax_receipt_sent);
      }
    }

    setFilteredDonations(result);
    setCurrentPage(1);
  }, [donations, searchTerm, statusFilter, taxReceiptFilter]);

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

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Donor Name',
      'Email',
      'Amount',
      'Tier',
      'Status',
      'Tax Receipt Eligible',
      'Tax Receipt Sent',
      'Date',
      'Street',
      'Postal Code',
      'City',
      'Country',
    ];

    const csvData = filteredDonations.map((d) => [
      d.id,
      d.donor_name,
      d.donor_email,
      d.amount,
      d.tier_name,
      d.status,
      d.tax_receipt_eligible ? 'Yes' : 'No',
      d.tax_receipt_sent ? 'Yes' : 'No',
      formatDate(d.created_at),
      d.donor_street || '',
      d.donor_postal_code || '',
      d.donor_city || '',
      d.donor_country || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `donations_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
        <p className="text-gray-600">Manage and track all donations</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Tax Receipt Filter */}
          <div>
            <select
              value={taxReceiptFilter}
              onChange={(e) => setTaxReceiptFilter(e.target.value as FilterTaxReceipt)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Tax Receipts</option>
              <option value="eligible">Eligible (€300+)</option>
              <option value="sent">Receipt Sent</option>
              <option value="pending">Receipt Pending</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {paginatedDonations.length} of {filteredDonations.length} donations
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Receipt
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedDonations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No donations found
                  </td>
                </tr>
              ) : (
                paginatedDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{donation.donor_name}</p>
                        <p className="text-sm text-gray-500">{donation.donor_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{donation.tier_name}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          donation.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : donation.status === 'refunded'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {donation.tax_receipt_eligible ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donation.tax_receipt_sent
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {donation.tax_receipt_sent ? 'Sent' : 'Pending'}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      {formatDate(donation.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/donations/${donation.id}`}
                          className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        {donation.tax_receipt_eligible && !donation.tax_receipt_sent && (
                          <Link
                            href={`/admin/tax-receipts?donation=${donation.id}`}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Generate Tax Receipt"
                          >
                            <FileText className="w-5 h-5" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border ${
                  currentPage === 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border ${
                  currentPage === totalPages
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
