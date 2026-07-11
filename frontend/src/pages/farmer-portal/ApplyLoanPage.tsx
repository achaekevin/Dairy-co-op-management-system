import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { HiBanknotes, HiArrowLeft } from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ApplyLoanPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    tenure: '12',
    guarantor1Name: '',
    guarantor1Phone: '',
    guarantor1Relationship: '',
    guarantor2Name: '',
    guarantor2Phone: '',
    guarantor2Relationship: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        tenure: parseInt(formData.tenure),
        guarantor1: formData.guarantor1Name ? {
          name: formData.guarantor1Name,
          phoneNumber: formData.guarantor1Phone,
          relationship: formData.guarantor1Relationship,
        } : undefined,
        guarantor2: formData.guarantor2Name ? {
          name: formData.guarantor2Name,
          phoneNumber: formData.guarantor2Phone,
          relationship: formData.guarantor2Relationship,
        } : undefined,
      };

      const response = await api.post('/farmer-portal/loans/apply', payload);
      if (response.data.success) {
        toast.success('Loan application submitted successfully!');
        navigate('/farmer-portal/loans');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit loan application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/farmer-portal/loans')}
        >
          <HiArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Apply for Loan</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Fill in the details to submit your loan application
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Loan Amount (KSh) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="50000"
                  required
                  min="1000"
                  step="1000"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Minimum: KSh 1,000 | Maximum: KSh 500,000
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Loan Tenure (Months) <span className="text-red-500">*</span>
                </label>
                <select
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                  required
                >
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="18">18 Months</option>
                  <option value="24">24 Months</option>
                  <option value="36">36 Months</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Purpose of Loan <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Describe how you plan to use this loan..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guarantor 1 (Required)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="guarantor1Name"
                  value={formData.guarantor1Name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="guarantor1Phone"
                  value={formData.guarantor1Phone}
                  onChange={handleChange}
                  placeholder="+254712345678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="guarantor1Relationship"
                  value={formData.guarantor1Relationship}
                  onChange={handleChange}
                  placeholder="Friend, Family, etc."
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guarantor 2 (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="guarantor2Name"
                  value={formData.guarantor2Name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  name="guarantor2Phone"
                  value={formData.guarantor2Phone}
                  onChange={handleChange}
                  placeholder="+254787654321"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Relationship
                </label>
                <Input
                  type="text"
                  name="guarantor2Relationship"
                  value={formData.guarantor2Relationship}
                  onChange={handleChange}
                  placeholder="Friend, Family, etc."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <HiBanknotes className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Important Information
                </h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                  <li>• Interest rate: 12% per annum (reducing balance)</li>
                  <li>• Processing fee: 2% of loan amount</li>
                  <li>• Monthly EMI will be automatically deducted from your milk payments</li>
                  <li>• Loan approval typically takes 3-5 business days</li>
                  <li>• You will receive a notification once your loan is approved</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/farmer-portal/loans')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ApplyLoanPage;
