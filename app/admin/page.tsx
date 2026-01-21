'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { Donation } from '@/lib/types';
import { 
  Euro, 
  Users, 
  TrendingUp, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalDonations: number;
  totalAmount: number;
  completedDonations: number;
  pendingDonations: number;
  taxReceiptsEligible: number;
  taxReceiptsSent: number;
  taxReceiptsPending: number;
  averageDonation: number;
}

interface RecentDonation {
  id: string;
  donor_name: string;
  amount: number;
  tier_name: string;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all donations for statistics
        const { data: donations, error } = await supabase
          .from('donations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching donations:', error);
          return;
        }

        // Calculate statistics
        const allDonations = donations || [];
        const completedDonations = allDonations.filter(d => d.status === 'completed');
        const pendingDonations = allDonations.filter(d => d.status === 'pending');
        const taxEligible = completedDonations.filter(d => d.tax_receipt_eligible);
        const taxSent = taxEligible.filter(d => d.tax_receipt_sent);

        const totalAmount = completedDonations.reduce((sum, d) => sum + Number(d.amount), 0);

        setStats({
          totalDonations: allDonations.length,
          totalAmount,
          completedDonations: completedDonations.length,
          pendingDonations: pendingDonations.length,
          taxReceiptsEligible: taxEligible.length,
          taxReceiptsSent: taxSent.length,
          taxReceiptsPending: taxEligible.length - taxSent.length,
          averageDonation: completedDonations.length > 0 
            ? totalAmount / completedDonations.length 
            : 0,
        });

        // Set recent donations (top 10)
        setRecentDonations(allDonations.slice(0, 10).map(d => ({
          id: d.id,
          donor_name: d.donor_name,
          amount: d.amount,
          tier_name: d.tier_name,
          status: d.status,
          created_at: d.created_at,
        })));
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of donations and tax receipts</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Amount */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.totalAmount) : '€0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Euro className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Completed Donations */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Donations</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.completedDonations || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Average Donation */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Donation</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.averageDonation) : '€0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tax Receipts Pending */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tax Receipts Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.taxReceiptsPending || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-gray-900">{stats?.pendingDonations || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Receipts Sent</p>
              <p className="text-lg font-semibold text-gray-900">{stats?.taxReceiptsSent || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donors</p>
              <p className="text-lg font-semibold text-gray-900">{stats?.totalDonations || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
          <Link
            href="/admin/donations"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentDonations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No donations yet
                  </td>
                </tr>
              ) : (
                recentDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/donations/${donation.id}`}
                        className="text-gray-900 font-medium hover:text-amber-600"
                      >
                        {donation.donor_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {donation.tier_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          donation.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {formatDate(donation.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
