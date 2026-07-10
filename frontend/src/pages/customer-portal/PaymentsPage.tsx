import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiCreditCard,
  HiMagnifyingGlass,
  HiArrowPath,
  HiCheckCircle,
  HiXCircle,
  HiClock,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { customerPortalService } from '../../services/customerPortalService';
import toast from 'react-hot-toast';

interface Payment {
  id: string;
  paymentNumber: string;
  orderNumber: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId?: string;
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    orderId: '',
    amount: '',
    paymentMethod: 'MOBILE_MONEY' as 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CHEQUE',
    transactionId: '',
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await customerPortalService.getPaymentHistory({ page: 1, limit: 50 });
      if (response.success && response.data) {
        setPayments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakePayment = async () => {
    if (!paymentForm.orderId || !paymentForm.amount) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await customerPortalService.makePayment({
        orderId: paymentForm.orderId,
        amount: parseFloat(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        transactionId: paymentForm.transactionId || undefined,
      });

      if (response.success) {
        toast.success('Payment initiated successfully');
        setShowPaymentModal(false);
        setPaymentForm({
          orderId: '',
          amount: '',
          paymentMethod: 'MOBILE_MONEY',
          transactionId: '',
        });
        fetchPayments();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return HiCheckCircle;
      case 'FAILED':
        return HiXCircle;
      default:
        return HiClock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'error';
      default:
        return 'warning';
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.paymentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Payments
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Make payments and view payment history
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowPaymentModal(true)}
        >
          <HiCreditCard className="w-5 h-5 mr-2" />
          Make Payment
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by payment or order number..."
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={fetchPayments}
            disabled={isLoading}
          >
            <HiArrowPath className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Loading payments...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <Card className="p-12 text-center">
          <HiCreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">No payments found</p>
          <Button
            variant="primary"
            onClick={() => setShowPaymentModal(true)}
          >
            Make Your First Payment
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPayments.map((payment, index) => {
            const StatusIcon = getStatusIcon(payment.status);
            
            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        payment.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                        payment.status === 'FAILED' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        <StatusIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {payment.paymentNumber}
                          </h3>
                          <Badge variant={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Order: {payment.orderNumber}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm text-slate-500">
                          Method: {payment.paymentMethod}
                        </p>
                        {payment.transactionId && (
                          <p className="text-xs text-slate-400 mt-1">
                            Transaction ID: {payment.transactionId}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        KSh {payment.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Make Payment"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Order ID *
            </label>
            <Input
              value={paymentForm.orderId}
              onChange={(e) => setPaymentForm({ ...paymentForm, orderId: e.target.value })}
              placeholder="Enter order ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Amount (KSh) *
            </label>
            <Input
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Payment Method *
            </label>
            <Select
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
              options={[
                { value: 'MOBILE_MONEY', label: 'Mobile Money' },
                { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                { value: 'CASH', label: 'Cash' },
                { value: 'CHEQUE', label: 'Cheque' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Transaction ID (Optional)
            </label>
            <Input
              value={paymentForm.transactionId}
              onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
              placeholder="Enter transaction ID if available"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleMakePayment}
              className="flex-1"
            >
              <HiCheckCircle className="w-5 h-5 mr-2" />
              Submit Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentsPage;
