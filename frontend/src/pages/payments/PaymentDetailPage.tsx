import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PrinterIcon,
  CheckCircleIcon,
  XCircleIcon,
  BanknotesIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { Payment } from '../../types';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const PaymentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [paymentFormData, setPaymentFormData] = useState({
    paymentDate: dayjs().format('YYYY-MM-DD'),
    paymentMode: 'BANK_TRANSFER',
    transactionId: '',
    notes: '',
  });

  // Mock data
  const payment: Payment = {
    id: id || '1',
    farmerId: 'F-001',
    farmerName: 'James Kariuki',
    period: 'January 2024',
    totalQuantity: 1250,
    totalAmount: 62500,
    bonusAmount: 2500,
    deductionAmount: 1500,
    netAmount: 63500,
    status: 'APPROVED',
    approvedBy: 'Manager',
    createdAt: '2024-02-01T10:00:00Z',
  };

  const milkCollectionBreakdown = [
    { date: '2024-01-01', shift: 'MORNING', quantity: 42, amount: 2100 },
    { date: '2024-01-01', shift: 'EVENING', quantity: 40, amount: 2000 },
    { date: '2024-01-02', shift: 'MORNING', quantity: 43, amount: 2150 },
    { date: '2024-01-02', shift: 'EVENING', quantity: 41, amount: 2050 },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleApprove = () => {
    toast.success('Payment approved successfully!');
    setShowApproveDialog(false);
  };

  const handleReject = () => {
    toast.success('Payment rejected');
    setShowRejectDialog(false);
  };

  const handleMakePayment = () => {
    toast.success('Payment processed successfully!');
    setShowPaymentModal(false);
    navigate('/dashboard/payments');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              Payment #{payment.id}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Payment details for {payment.farmerName}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {payment.status === 'PENDING' && (
            <>
              <Button variant="outline" onClick={() => setShowRejectDialog(true)}>
                <XCircleIcon className="h-5 w-5 mr-2" />
                Reject
              </Button>
              <Button onClick={() => setShowApproveDialog(true)}>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Approve
              </Button>
            </>
          )}
          {payment.status === 'APPROVED' && (
            <Button onClick={() => setShowPaymentModal(true)}>
              <BanknotesIcon className="h-5 w-5 mr-2" />
              Make Payment
            </Button>
          )}
          <Button variant="outline" onClick={handlePrint}>
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg p-6 ${
          payment.status === 'PAID'
            ? 'bg-green-50 dark:bg-green-900/20'
            : payment.status === 'APPROVED'
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : payment.status === 'PENDING'
                ? 'bg-yellow-50 dark:bg-yellow-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                payment.status === 'PAID'
                  ? 'bg-green-100 dark:bg-green-800'
                  : payment.status === 'APPROVED'
                    ? 'bg-blue-100 dark:bg-blue-800'
                    : payment.status === 'PENDING'
                      ? 'bg-yellow-100 dark:bg-yellow-800'
                      : 'bg-red-100 dark:bg-red-800'
              }`}
            >
              {payment.status === 'PAID' ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              ) : payment.status === 'REJECTED' ? (
                <XCircleIcon className="h-6 w-6 text-red-600" />
              ) : (
                <BanknotesIcon className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                KSh {payment.netAmount.toLocaleString()}
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Payment for {payment.period}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant={
                payment.status === 'PAID'
                  ? 'success'
                  : payment.status === 'APPROVED'
                    ? 'info'
                    : payment.status === 'PENDING'
                      ? 'warning'
                      : 'error'
              }
              size="lg"
            >
              {payment.status}
            </Badge>
            {payment.approvedBy && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Approved by {payment.approvedBy}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Farmer Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Farmer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <UserIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Farmer Name</p>
                  <button
                    onClick={() => navigate(`/dashboard/farmers/${payment.farmerId}`)}
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {payment.farmerName}
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Farmer ID</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {payment.farmerId}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Period</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {payment.period}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BanknotesIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Quantity
                  </p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {payment.totalQuantity.toLocaleString()} Liters
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Amount Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Amount Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Base Amount</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {payment.totalQuantity} L milk supplied
                  </p>
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  KSh {payment.totalAmount.toLocaleString()}
                </span>
              </div>
              {payment.bonusAmount > 0 && (
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-green-900 dark:text-green-100">
                      Bonus Amount
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Quality bonus, Festival bonus
                    </p>
                  </div>
                  <span className="text-xl font-semibold text-green-600 dark:text-green-400">
                    +KSh {payment.bonusAmount.toLocaleString()}
                  </span>
                </div>
              )}
              {payment.deductionAmount > 0 && (
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-red-900 dark:text-red-100">
                      Deduction Amount
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Loan EMI, Feed purchase
                    </p>
                  </div>
                  <span className="text-xl font-semibold text-red-600 dark:text-red-400">
                    -KSh {payment.deductionAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <div>
                  <p className="text-base font-semibold text-blue-900 dark:text-blue-100">
                    Net Payable Amount
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Final amount to be paid
                  </p>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  KSh {payment.netAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          {payment.paymentDate && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Payment Date</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {dayjs(payment.paymentDate).format('DD MMMM YYYY')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Payment Mode</span>
                  <Badge variant="info">
                    {payment.paymentMode?.replace(/_/g, ' ')}
                  </Badge>
                </div>
                {payment.transactionId && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">
                      Transaction ID
                    </span>
                    <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                      {payment.transactionId}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Milk Collection Summary */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Collection Summary (First 4 entries)
            </h3>
            <div className="space-y-2">
              {milkCollectionBreakdown.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {dayjs(entry.date).format('DD MMM')} - {entry.shift}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {entry.quantity}L
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      KSh {entry.amount}
                    </p>
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  navigate(`/dashboard/milk-collection?farmer=${payment.farmerId}`)
                }
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 py-2"
              >
                View all collections ?
              </button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Payment Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Payment Created
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {dayjs(payment.createdAt).format('DD MMM YYYY, HH:mm')}
                  </p>
                </div>
              </div>
              {payment.status !== 'PENDING' && (
                <div className="flex gap-3">
                  <div
                    className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                      payment.status === 'REJECTED' ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.status === 'REJECTED' ? 'Rejected' : 'Approved'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      By {payment.approvedBy}
                    </p>
                  </div>
                </div>
              )}
              {payment.paymentDate && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-purple-600"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Payment Completed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(payment.paymentDate).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/dashboard/farmers/${payment.farmerId}`)}
              >
                View Farmer Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  navigate(`/dashboard/milk-collection?farmer=${payment.farmerId}`)
                }
              >
                View Collections
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handlePrint}
              >
                Download Receipt
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Approve Dialog */}
      <ConfirmDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={handleApprove}
        title="Approve Payment"
        message="Are you sure you want to approve this payment? The farmer will be eligible to receive the payment."
        confirmText="Approve"
      />

      {/* Reject Dialog */}
      <ConfirmDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleReject}
        title="Reject Payment"
        message="Are you sure you want to reject this payment? Please provide a reason for rejection."
        confirmText="Reject"
      />

      {/* Make Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Process Payment"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMakePayment();
          }}
          className="space-y-4"
        >
          <Input
            label="Payment Date"
            type="date"
            value={paymentFormData.paymentDate}
            onChange={(e) =>
              setPaymentFormData({ ...paymentFormData, paymentDate: e.target.value })
            }
            required
          />
          <Select
            label="Payment Mode"
            value={paymentFormData.paymentMode}
            onChange={(e) =>
              setPaymentFormData({ ...paymentFormData, paymentMode: e.target.value })
            }
            options={[
              { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
              { value: 'CASH', label: 'Cash' },
              { value: 'CHEQUE', label: 'Cheque' },
            ]}
            required
          />
          <Input
            label="Transaction ID / Reference Number"
            value={paymentFormData.transactionId}
            onChange={(e) =>
              setPaymentFormData({
                ...paymentFormData,
                transactionId: e.target.value,
              })
            }
            placeholder="Enter transaction ID or reference number"
            required
          />
          <Textarea
            label="Notes (Optional)"
            value={paymentFormData.notes}
            onChange={(e) =>
              setPaymentFormData({ ...paymentFormData, notes: e.target.value })
            }
            placeholder="Any additional notes about this payment..."
            rows={3}
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Process Payment
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentDetailPage;
