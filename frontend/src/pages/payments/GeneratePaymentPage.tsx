import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  BanknotesIcon,
  CalculatorIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';
import Autocomplete from '../../components/ui/Autocomplete';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const GeneratePaymentPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    farmerId: '',
    period: dayjs().subtract(1, 'month').format('MMMM YYYY'),
    totalQuantity: '',
    totalAmount: '',
    bonusAmount: '',
    bonusReason: '',
    deductionAmount: '',
    deductionReason: '',
    notes: '',
  });

  const [netAmount, setNetAmount] = useState(0);

  // Mock farmers data
  const farmers = [
    { id: 'F-001', name: 'Rajesh Kumar', avgQuantity: 42 },
    { id: 'F-002', name: 'Amit Patel', avgQuantity: 38 },
    { id: 'F-003', name: 'Vijay Singh', avgQuantity: 45 },
    { id: 'F-004', name: 'Ramesh Sharma', avgQuantity: 35 },
    { id: 'F-005', name: 'Suresh Verma', avgQuantity: 40 },
  ];

  // Calculate net amount whenever amounts change
  useEffect(() => {
    const total = parseFloat(formData.totalAmount) || 0;
    const bonus = parseFloat(formData.bonusAmount) || 0;
    const deduction = parseFloat(formData.deductionAmount) || 0;
    setNetAmount(total + bonus - deduction);
  }, [formData.totalAmount, formData.bonusAmount, formData.deductionAmount]);

  // Auto-calculate when farmer is selected
  useEffect(() => {
    if (formData.farmerId && formData.period) {
      // Simulate fetching milk collection data
      const avgRate = 48; // KSh 48 per liter
      const daysInMonth = 30;
      const avgDailyQuantity = 40;
      const estimatedQuantity = avgDailyQuantity * daysInMonth;
      const estimatedAmount = estimatedQuantity * avgRate;

      setFormData((prev) => ({
        ...prev,
        totalQuantity: estimatedQuantity.toString(),
        totalAmount: estimatedAmount.toString(),
      }));
    }
  }, [formData.farmerId, formData.period]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    toast.success('Payment calculated successfully!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Payment generated successfully!');
      navigate('/dashboard/payments');
    } catch (error) {
      toast.error('Failed to generate payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/payments')}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Generate Payment
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create payment record for farmer
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Farmer *
                  </label>
                  <Autocomplete
                    options={farmers.map((f) => ({
                      value: f.id,
                      label: `${f.name} (${f.id})`,
                    }))}
                    value={formData.farmerId}
                    onChange={(value) => handleChange('farmerId', value)}
                    placeholder="Search farmer..."
                  />
                </div>
                <Input
                  label="Payment Period"
                  value={formData.period}
                  onChange={(e) => handleChange('period', e.target.value)}
                  placeholder="e.g., January 2024"
                  required
                />
                <Input
                  label="Total Quantity (Liters)"
                  type="number"
                  step="0.01"
                  value={formData.totalQuantity}
                  onChange={(e) => handleChange('totalQuantity', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </Card>

            {/* Amount Calculation */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Amount Calculation
                </h2>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCalculate}
                >
                  <CalculatorIcon className="h-4 w-4 mr-2" />
                  Recalculate
                </Button>
              </div>
              <div className="space-y-4">
                <Input
                  label="Total Amount (KSh )"
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => handleChange('totalAmount', e.target.value)}
                  placeholder="0.00"
                  helperText="Base payment for milk supplied"
                  required
                />
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <label className="block text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                    Bonus Amount (KSh )
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.bonusAmount}
                    onChange={(e) => handleChange('bonusAmount', e.target.value)}
                    placeholder="0.00"
                    className="mb-3"
                  />
                  <Textarea
                    placeholder="Reason for bonus (e.g., Quality bonus, Festival bonus)"
                    value={formData.bonusReason}
                    onChange={(e) => handleChange('bonusReason', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <label className="block text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                    Deduction Amount (KSh )
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.deductionAmount}
                    onChange={(e) => handleChange('deductionAmount', e.target.value)}
                    placeholder="0.00"
                    className="mb-3"
                  />
                  <Textarea
                    placeholder="Reason for deduction (e.g., Loan EMI, Feed purchase, Advance)"
                    value={formData.deductionReason}
                    onChange={(e) => handleChange('deductionReason', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </Card>

            {/* Additional Notes */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Additional Notes
              </h2>
              <Textarea
                label="Internal Notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional information or remarks..."
                rows={4}
              />
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="sticky top-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <BanknotesIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Payment Summary
                    </h3>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Period
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formData.period || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formData.totalQuantity ? `${formData.totalQuantity} L` : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Base Amount
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      KSh {parseFloat(formData.totalAmount || '0').toLocaleString()}
                    </span>
                  </div>
                  {parseFloat(formData.bonusAmount || '0') > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Bonus
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        +KSh {parseFloat(formData.bonusAmount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {parseFloat(formData.deductionAmount || '0') > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-red-600 dark:text-red-400">
                        Deduction
                      </span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        -KSh {parseFloat(formData.deductionAmount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      Net Amount
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      KSh {netAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Generate Payment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/dashboard/payments')}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Quick Info */}
            <Card>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Payment Cycle Info
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Calculation Period
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Full month milk collection
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Auto-Calculated
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Based on daily collection records
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Status</p>
                  <Badge variant="warning" size="sm">
                    Pending Approval
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

export default GeneratePaymentPage;
