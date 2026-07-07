import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  BanknotesIcon,
  CalculatorIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';
import Autocomplete from '../../components/ui/Autocomplete';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const ApplyLoanPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    farmerId: '',
    amount: '',
    interestRate: '8.5',
    tenure: '12',
    purpose: '',
    guarantorName: '',
    guarantorPhone: '',
    collateralDetails: '',
  });

  const [emiAmount, setEmiAmount] = useState(0);

  // Mock farmers data
  const farmers = [
    { id: 'F-001', name: 'Rajesh Kumar', eligible: true },
    { id: 'F-002', name: 'Amit Patel', eligible: true },
    { id: 'F-003', name: 'Vijay Singh', eligible: false },
    { id: 'F-004', name: 'Ramesh Sharma', eligible: true },
    { id: 'F-005', name: 'Suresh Verma', eligible: true },
  ];

  // Calculate EMI whenever amount, rate, or tenure changes
  useEffect(() => {
    const P = parseFloat(formData.amount) || 0;
    const R = parseFloat(formData.interestRate) / 100 / 12;
    const N = parseInt(formData.tenure) || 1;

    if (P > 0 && R > 0 && N > 0) {
      // EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
      const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      setEmiAmount(Math.round(emi));
    } else {
      setEmiAmount(0);
    }
  }, [formData.amount, formData.interestRate, formData.tenure]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Loan application submitted successfully!');
      navigate('/dashboard/loans');
    } catch (error) {
      toast.error('Failed to submit loan application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPayable = emiAmount * parseInt(formData.tenure || '0');
  const totalInterest = totalPayable - parseFloat(formData.amount || '0');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/loans')}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Apply for Loan
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Submit a new loan application
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
                      label: `${f.name} (${f.id})${f.eligible ? '' : ' - Not Eligible'}`,
                    }))}
                    value={formData.farmerId}
                    onChange={(value) => handleChange('farmerId', value)}
                    placeholder="Search farmer..."
                  />
                </div>
                {formData.farmerId && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900 dark:text-blue-100">
                        <p className="font-medium mb-1">Farmer Eligibility</p>
                        <ul className="space-y-1 text-xs">
                          <li>✓ Active member for 6+ months</li>
                          <li>✓ Regular milk supply record</li>
                          <li>✓ No pending loan defaults</li>
                          <li>✓ Eligible for loan up to KSh 1,00,000</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Loan Details */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Loan Details
                </h2>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      amount: '',
                      tenure: '12',
                    }));
                  }}
                >
                  <CalculatorIcon className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Loan Amount (KSh )"
                  type="number"
                  step="1000"
                  min="5000"
                  max="200000"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="50000"
                  helperText="Minimum: KSh 5,000 | Maximum: KSh 2,00,000"
                  required
                />
                <Input
                  label="Interest Rate (%)"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => handleChange('interestRate', e.target.value)}
                  helperText="Annual interest rate"
                  required
                  disabled
                />
                <div className="md:col-span-2">
                  <Select
                    label="Loan Tenure (Months)"
                    value={formData.tenure}
                    onChange={(e) => handleChange('tenure', e.target.value)}
                    options={[
                      { value: '6', label: '6 Months' },
                      { value: '12', label: '12 Months (1 Year)' },
                      { value: '18', label: '18 Months' },
                      { value: '24', label: '24 Months (2 Years)' },
                      { value: '36', label: '36 Months (3 Years)' },
                    ]}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    label="Purpose of Loan"
                    value={formData.purpose}
                    onChange={(e) => handleChange('purpose', e.target.value)}
                    placeholder="Describe the purpose of the loan (e.g., cattle purchase, farm equipment, medical expenses)..."
                    rows={4}
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Guarantor Details */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Guarantor Details
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Guarantor Name"
                  value={formData.guarantorName}
                  onChange={(e) => handleChange('guarantorName', e.target.value)}
                  placeholder="Full name of guarantor"
                  required
                />
                <Input
                  label="Guarantor Phone"
                  type="tel"
                  value={formData.guarantorPhone}
                  onChange={(e) => handleChange('guarantorPhone', e.target.value)}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
            </Card>

            {/* Collateral Details */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Collateral Details (Optional)
              </h2>
              <Textarea
                label="Collateral Information"
                value={formData.collateralDetails}
                onChange={(e) => handleChange('collateralDetails', e.target.value)}
                placeholder="Describe any collateral offered (property, cattle, equipment, etc.)..."
                rows={4}
              />
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* EMI Calculator Card */}
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
                      EMI Calculator
                    </h3>
                    {emiAmount > 0 ? (
                      <>
                        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                          KSh {emiAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          per month
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Enter loan details to calculate EMI
                      </p>
                    )}
                  </div>
                </div>

                {formData.amount && formData.tenure && (
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Loan Amount
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        KSh {parseFloat(formData.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Interest Rate
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formData.interestRate}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Tenure
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formData.tenure} months
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Interest
                      </span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        KSh {totalInterest.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-base font-semibold text-gray-900 dark:text-white">
                        Total Payable
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        KSh {totalPayable.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Submit Application
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/dashboard/loans')}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Loan Guidelines */}
            <Card>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Loan Guidelines
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Eligibility
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Active membership for minimum 6 months
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Processing Time
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    3-5 working days for approval
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Repayment
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Auto-deduction from milk payments
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Status</p>
                  <Badge variant="warning" size="sm">
                    Pending Review
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

export default ApplyLoanPage;
