import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Autocomplete from '../../components/ui/Autocomplete';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const PurchaseSharesPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    farmerId: '',
    shareCount: '5',
    paymentMode: 'DEDUCTION',
    purchaseDate: dayjs().format('YYYY-MM-DD'),
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const shareValue = 1000; // Fixed share value

  // Mock farmers data
  const farmers = [
    { id: 'F-001', name: 'Rajesh Kumar', currentShares: 10 },
    { id: 'F-002', name: 'Amit Patel', currentShares: 8 },
    { id: 'F-003', name: 'Vijay Singh', currentShares: 15 },
    { id: 'F-004', name: 'Ramesh Sharma', currentShares: 5 },
    { id: 'F-005', name: 'Suresh Verma', currentShares: 12 },
  ];

  // Calculate total whenever share count changes
  useEffect(() => {
    const count = parseInt(formData.shareCount) || 0;
    setTotalAmount(count * shareValue);
  }, [formData.shareCount]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const count = parseInt(formData.shareCount);
    if (count < 5) {
      toast.error('Minimum purchase is 5 shares');
      return;
    }
    if (count > 50) {
      toast.error('Maximum purchase is 50 shares');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Share purchase successful!');
      navigate('/dashboard/shares');
    } catch (error) {
      toast.error('Failed to purchase shares');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFarmer = farmers.find((f) => f.id === formData.farmerId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/shares')}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Purchase Shares
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Buy cooperative shares for farmer
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Farmer Selection */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Farmer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Farmer *
                  </label>
                  <Autocomplete
                    options={farmers.map((f) => ({
                      value: f.id,
                      label: `${f.name} (${f.id}) - ${f.currentShares} shares`,
                    }))}
                    value={formData.farmerId}
                    onChange={(value) => handleChange('farmerId', value)}
                    placeholder="Search farmer..."
                  />
                </div>
                {selectedFarmer && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900 dark:text-blue-100">
                        <p className="font-medium mb-1">Current Holdings</p>
                        <p className="text-xs">
                          {selectedFarmer.name} currently holds{' '}
                          <span className="font-semibold">
                            {selectedFarmer.currentShares} shares
                          </span>{' '}
                          worth ₹
                          {(selectedFarmer.currentShares * shareValue).toLocaleString()}
                        </p>
                        <p className="text-xs mt-1">
                          After this purchase: {selectedFarmer.currentShares + parseInt(formData.shareCount || '0')} shares
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Share Details */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Share Purchase Details
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Par Value per Share
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{shareValue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Input
                  label="Number of Shares"
                  type="number"
                  min="5"
                  max="50"
                  step="1"
                  value={formData.shareCount}
                  onChange={(e) => handleChange('shareCount', e.target.value)}
                  helperText="Minimum: 5 shares | Maximum: 50 shares per transaction"
                  required
                />
                <Input
                  label="Purchase Date"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleChange('purchaseDate', e.target.value)}
                  required
                />
              </div>
            </Card>

            {/* Payment Details */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Method
              </h2>
              <Select
                label="Payment Mode"
                value={formData.paymentMode}
                onChange={(e) => handleChange('paymentMode', e.target.value)}
                options={[
                  {
                    value: 'DEDUCTION',
                    label: 'Milk Payment Deduction (Installments)',
                  },
                  { value: 'CASH', label: 'Cash Payment' },
                  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                ]}
                required
              />
              {formData.paymentMode === 'DEDUCTION' && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-900 dark:text-yellow-100">
                    <span className="font-medium">Payment Plan:</span> Amount will be
                    deducted from farmer's monthly milk payments over the next 6 months.
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                    Monthly Deduction: ₹{Math.round(totalAmount / 6).toLocaleString()}
                  </p>
                </div>
              )}
            </Card>

            {/* Terms & Conditions */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Terms & Conditions
              </h2>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>
                    Shares represent ownership in the cooperative and entitle holders to
                    dividends and voting rights.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>
                    Share certificates will be issued within 30 days of purchase
                    completion.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>
                    Shares can be transferred to other members or redeemed as per
                    cooperative bylaws.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>
                    Dividend distribution is based on annual profits and board decisions.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Purchase Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="sticky top-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Purchase Summary
                    </h3>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Share Count
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formData.shareCount} shares
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Price per Share
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ₹{shareValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Payment Mode
                    </span>
                    <Badge variant="info" size="sm">
                      {formData.paymentMode === 'DEDUCTION'
                        ? 'Installment'
                        : formData.paymentMode === 'CASH'
                          ? 'Cash'
                          : 'Bank Transfer'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Complete Purchase
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/dashboard/shares')}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Share Guidelines */}
            <Card>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Share Purchase Guidelines
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Eligibility
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Active cooperative members only
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Lock-in Period
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    1 year from purchase date
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Dividend Policy
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Annual distribution based on profits
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Certificate
                  </p>
                  <Badge variant="success" size="sm">
                    Issued in 30 days
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PurchaseSharesPage;
