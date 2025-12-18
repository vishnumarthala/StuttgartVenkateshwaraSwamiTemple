'use client';

import { useState, FormEvent } from 'react';
import { DonationTier, DonorInfo } from '@/lib/types';
import PayPalButton from './PayPalButton';
import { X } from 'lucide-react';

interface DonationFormProps {
  tier: DonationTier;
  onClose: () => void;
}

export default function DonationForm({ tier, onClose }: DonationFormProps) {
  const [donorInfo, setDonorInfo] = useState<DonorInfo>({
    name: '',
    email: '',
    gotram: '',
    message: '',
  });

  const [amount, setAmount] = useState<string>(tier.minAmount.toString());

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    gotram?: string;
    amount?: string;
  }>({});

  const [isFormValid, setIsFormValid] = useState(false);

  // Check if Gotram is required (Tier 2+, which means minAmount >= 201)
  const isGotramRequired = tier.minAmount >= 201;

  // Check if eligible for tax receipt (€300+)
  const parsedAmount = parseFloat(amount) || 0;
  const isTaxReceiptEligible = parsedAmount >= 300;

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!donorInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!donorInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(donorInfo.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (isGotramRequired && !donorInfo.gotram?.trim()) {
      newErrors.gotram = 'Gotram is required for this tier';
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (numAmount < tier.minAmount) {
      newErrors.amount = `Minimum amount for this tier is €${tier.minAmount}`;
    } else if (tier.maxAmount && numAmount > tier.maxAmount) {
      newErrors.amount = `Maximum amount for this tier is €${tier.maxAmount}`;
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange = (
    field: keyof DonorInfo,
    value: string
  ) => {
    setDonorInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = () => {
    validateForm();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    validateForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Complete Your Donation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Tier Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-amber-900 mb-2">{tier.name}</h3>
            <p className="text-amber-800 text-sm mb-3">
              Amount: €{tier.minAmount}
              {tier.maxAmount && ` - €${tier.maxAmount}`}
            </p>
            <div className="space-y-1">
              {tier.benefits.map((benefit, index) => (
                <p key={index} className="text-sm text-amber-900 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{benefit}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Notices */}
          {isGotramRequired && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> For {tier.name}, we require your Gotram
                information for temple records.
              </p>
            </div>
          )}

          {isTaxReceiptEligible && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-900">
                <strong>Tax Receipt Eligible:</strong> Your donation qualifies for
                a tax receipt as it is €300 or more.
              </p>
            </div>
          )}

          {/* Donor Information Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount Field */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Donation Amount (€) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={handleBlur}
                min={tier.minAmount}
                max={tier.maxAmount || undefined}
                step="0.01"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Enter amount (€${tier.minAmount} - €${tier.maxAmount || '∞'})`}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Range: €{tier.minAmount} - €{tier.maxAmount || '∞'}
              </p>
            </div>

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={donorInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={donorInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Gotram Field */}
            <div>
              <label
                htmlFor="gotram"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gotram {isGotramRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                id="gotram"
                value={donorInfo.gotram}
                onChange={(e) => handleInputChange('gotram', e.target.value)}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.gotram ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your gotram"
              />
              {errors.gotram && (
                <p className="mt-1 text-sm text-red-600">{errors.gotram}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                value={donorInfo.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Any message or special requests..."
              />
            </div>

            {/* PayPal Button */}
            <div className="pt-4">
              {isFormValid ? (
                <PayPalButton
                  amount={parsedAmount}
                  tierName={tier.name}
                  donorInfo={donorInfo}
                  onSuccess={() => {
                    // Success handled in PayPalButton component
                  }}
                  onError={(error) => {
                    console.error('Payment error:', error);
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => validateForm()}
                  className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-medium cursor-not-allowed"
                  disabled
                >
                  Please fill all required fields
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
