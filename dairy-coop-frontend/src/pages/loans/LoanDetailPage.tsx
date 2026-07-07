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
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { Loan } from '../../types';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface EMI {
  month: number;
  dueDate: string;
  principal: number;
  interest: number;
  total: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidDate?: string;
}

const LoanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDisburseModal, setShowDisburseModal] = useState(false);

  const [disburseFormData, setDisburseFormData] = useState({
    disbursementDate: dayjs().format('YYYY-MM-DD'),
    mode: 'BANK_TRANSFER',
    transactionId: '',
    notes: '',
  });

  // Mock data
  const loan: Loan = {
    id: id || '1',
    loanNumber: 'LN-2024-001',
    farmerId: 'F-001',
    farmerName: 'Rajesh Kumar',
    amount: 50000,
    interestRate: 8.5,
    tenure: 12,
    emiAmount: 4387,
    purpose: 'Purchase of cattle feed and veterinary services for dairy operations',
    status: 'ACTIVE',
    appliedDate: '2024-01-10',
    approvedDate: '2024-01-15',
    disbursementDate: '2024-01-20',
    outstandingAmount: 35000,
    paidAmount: 15000,
    createdAt: '2024-01-10T10:00:00Z',
  };

  // Generate EMI schedule
  const generateEMISchedule = (): EMI[] => {
    const schedule: EMI[] = [];
    const monthlyRate = loan.interestRate / 100 / 12;
    let remainingPrincipal = loan.amount;

    for (let month = 1; month <= loan.tenure; month++) {
      const interest = remainingPrincipal * monthlyRate;
      const principal = loan.emiAmount - interest;
      remainingPrincipal -= principal;

      const dueDate = dayjs(loan.disbursementDate)
        .add(month, 'month')
        .format('YYYY-MM-DD');

      // Mark first 3 as PAID for demo
      const status =
        month <= 3 ? 'PAID' : dayjs(dueDate).isBefore(dayjs()) ? 'OVERDUE' : 'PENDING';

      schedule.push({
        month,
        dueDate,
        principal: Math.round(principal),
        interest: Math.round(interest),
        total: loan.emiAmount,
        status,
        paidDate: status === 'PAID' ? dueDate : undefined,
      });
    }

    return schedule;
  };

  const emiSchedule = generateEMISchedule();

  const handlePrint = () => {
    window.print();
  };

  const handleApprove = () => {
    toast.success('Loan approved successfully!');
    setShowApproveDialog(false);
  };

  const handleReject = () => {
    toast.success('Loan application rejected');
    setShowRejectDialog(false);
  };

  const handleDisburse = () => {
    toast.success('Loan disbursed successfully!');
    setShowDisburseModal(false);
    navigate('/dashboard/loans');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              {loan.loanNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Loan details for {loan.farmerName}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {loan.status === 'PENDING' && (
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
          {loan.status === 'APPROVED' && (
            <Button onClick={() => setShowDisburseModal(true)}>
              <BanknotesIcon className="h-5 w-5 mr-2" />
              Disburse Loan
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
          loan.status === 'ACTIVE'
            ? 'bg-green-50 dark:bg-green-900/20'
            : loan.status === 'APPROVED'
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : loan.status === 'PENDING'
                ? 'bg-yellow-50 dark:bg-yellow-900/20'
                : loan.status === 'CLOSED'
                  ? 'bg-gray-50 dark:bg-gray-800'
                  : 'bg-red-50 dark:bg-red-900/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                loan.status === 'ACTIVE'
                  ? 'bg-green-100 dark:bg-green-800'
                  : loan.status === 'APPROVED'
                    ? 'bg-blue-100 dark:bg-blue-800'
                    : loan.status === 'PENDING'
                      ? 'bg-yellow-100 dark:bg-yellow-800'
                      : loan.status === 'CLOSED'
                        ? 'bg-gray-200 dark:bg-gray-700'
                        : 'bg-red-100 dark:bg-red-800'
              }`}
            >
              {loan.status === 'ACTIVE' || loan.status === 'CLOSED' ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              ) : loan.status === 'REJECTED' ? (
                <XCircleIcon className="h-6 w-6 text-red-600" />
              ) : (
                <BanknotesIcon className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{loan.amount.toLocaleString()}
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                @ {loan.interestRate}% p.a. for {loan.tenure} months
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant={
                loan.status === 'ACTIVE'
                  ? 'success'
                  : loan.status === 'APPROVED'
                    ? 'info'
                    : loan.status === 'PENDING'
                      ? 'warning'
                      : loan.status === 'CLOSED'
                        ? 'secondary'
                        : 'error'
              }
              size="lg"
            >
              {loan.status}
            </Badge>
            {loan.status === 'ACTIVE' && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding</p>
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  ₹{loan.outstandingAmount.toLocaleString()}
                </p>
              </div>
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
                    onClick={() => navigate(`/dashboard/farmers/${loan.farmerId}`)}
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {loan.farmerName}
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Farmer ID</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {loan.farmerId}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Applied Date</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {dayjs(loan.appliedDate).format('DD MMMM YYYY')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">EMI Amount</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    ₹{loan.emiAmount.toLocaleString()}/month
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Loan Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Loan Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Purpose</span>
                <span className="text-right max-w-md text-sm font-medium text-gray-900 dark:text-gray-100">
                  {loan.purpose}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Loan Amount</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  ₹{loan.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Interest Rate</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {loan.interestRate}% per annum
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Tenure</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {loan.tenure} months
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  ₹{((loan.emiAmount * loan.tenure) - loan.amount).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  Total Payable
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{(loan.emiAmount * loan.tenure).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* EMI Schedule */}
          {loan.status === 'ACTIVE' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                EMI Payment Schedule
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Month
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Due Date
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Principal
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Interest
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        EMI
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {emiSchedule.map((emi) => (
                      <tr
                        key={emi.month}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                          {emi.month}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                          {dayjs(emi.dueDate).format('DD MMM YYYY')}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                          ₹{emi.principal.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                          ₹{emi.interest.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                          ₹{emi.total.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              emi.status === 'PAID'
                                ? 'success'
                                : emi.status === 'OVERDUE'
                                  ? 'error'
                                  : 'warning'
                            }
                            size="sm"
                          >
                            {emi.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          {loan.status === 'ACTIVE' && (
            <Card>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Payment Summary
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-300 mb-1">
                    Paid Amount
                  </p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    ₹{loan.paidAmount.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-xs text-red-700 dark:text-red-300 mb-1">
                    Outstanding
                  </p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    ₹{loan.outstandingAmount.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                    Completion
                  </p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.round((loan.paidAmount / loan.amount) * 100)}%
                  </p>
                  <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(loan.paidAmount / loan.amount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Loan Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Application Submitted
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {dayjs(loan.appliedDate).format('DD MMM YYYY')}
                  </p>
                </div>
              </div>
              {loan.approvedDate && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-600"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Loan Approved
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(loan.approvedDate).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
              )}
              {loan.disbursementDate && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-purple-600"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Amount Disbursed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(loan.disbursementDate).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
              )}
              {loan.closureDate && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-gray-600"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Loan Closed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(loan.closureDate).format('DD MMM YYYY')}
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
                onClick={() => navigate(`/dashboard/farmers/${loan.farmerId}`)}
              >
                View Farmer Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  navigate(`/dashboard/payments?farmer=${loan.farmerId}`)
                }
              >
                View Payments
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handlePrint}
              >
                Download Statement
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
        title="Approve Loan"
        message="Are you sure you want to approve this loan application? The farmer will be eligible to receive the loan amount."
        confirmText="Approve"
      />

      {/* Reject Dialog */}
      <ConfirmDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleReject}
        title="Reject Loan"
        message="Are you sure you want to reject this loan application? Please provide a reason for rejection."
        confirmText="Reject"
      />

      {/* Disburse Modal */}
      <Modal
        isOpen={showDisburseModal}
        onClose={() => setShowDisburseModal(false)}
        title="Disburse Loan"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDisburse();
          }}
          className="space-y-4"
        >
          <Input
            label="Disbursement Date"
            type="date"
            value={disburseFormData.disbursementDate}
            onChange={(e) =>
              setDisburseFormData({
                ...disburseFormData,
                disbursementDate: e.target.value,
              })
            }
            required
          />
          <Input
            label="Transaction ID / Reference Number"
            value={disburseFormData.transactionId}
            onChange={(e) =>
              setDisburseFormData({
                ...disburseFormData,
                transactionId: e.target.value,
              })
            }
            placeholder="Enter transaction ID"
            required
          />
          <Textarea
            label="Notes (Optional)"
            value={disburseFormData.notes}
            onChange={(e) =>
              setDisburseFormData({ ...disburseFormData, notes: e.target.value })
            }
            placeholder="Any additional notes..."
            rows={3}
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Disburse Loan
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowDisburseModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoanDetailPage;
