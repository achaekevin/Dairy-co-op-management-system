import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import type { Column } from '../../types';
import {
  HiCurrencyRupee,
  HiDocumentArrowDown,
  HiCheckCircle,
  HiClock,
} from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Payment {
  id: string;
  paymentNumber: string;
  period: string;
  totalQuantity: number;
  totalAmount: number;
  bonusAmount: number;
  deductionAmount: number;
  netAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID';
  paymentDate?: string;
  paymentMode?: string;
  transactionId?: string;
}

const PaymentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farmer-portal/payments', {
        params: { page, limit: 20 },
      });
      if (response.data.success) {
        setPayments(response.data.data.data || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadStatement = () => {
    toast.success('Payment statement downloaded');
  };

  const columns: Column<Payment>[] = [
    {
      id: 'paymentNumber',
      header: 'Payment #',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{row.paymentNumber}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{row.period}</p>
        </div>
      ),
    },
    {
      id: 'quantity',
      header: 'Milk Quantity',
      accessor: (row) => `${row.totalQuantity} L`,
    },
    {
      id: 'gross',
      header: 'Gross Amount',
      accessor: (row) => `KSh ${row.totalAmount.toLocaleString()}`,
    },
    {
      id: 'bonus',
      header: 'Bonus',
      accessor: (row) => (
        <span className="text-green-600 dark:text-green-400">
          +KSh {row.bonusAmount.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'deductions',
      header: 'Deductions',
      accessor: (row) => (
        <span className="text-red-600 dark:text-red-400">
          -KSh {row.deductionAmount.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'net',
      header: 'Net Amount',
      accessor: (row) => (
        <span className="font-bold text-slate-900 dark:text-white">
          KSh {row.netAmount.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <div>
          <Badge
            variant={
              row.status === 'PAID'
                ? 'success'
                : row.status === 'APPROVED'
                ? 'info'
                : 'warning'
            }
          >
            {row.status}
          </Badge>
          {row.paymentDate && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {new Date(row.paymentDate).toLocaleDateString()}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => (
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownloadStatement}
        >
          <HiDocumentArrowDown className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const stats = {
    totalPayments: payments.filter(p => p.status === 'PAID').length,
    totalEarnings: payments.reduce((sum, p) => p.status === 'PAID' ? sum + p.netAmount : sum, 0),
    pendingPayments: payments.filter(p => p.status === 'PENDING').length,
    lastPayment: payments.find(p => p.status === 'PAID')?.netAmount || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment History</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Track your payments and download statements
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Payments', value: stats.totalPayments, icon: HiCheckCircle, color: 'success' },
          { label: 'Total Earnings', value: `KSh ${stats.totalEarnings.toLocaleString()}`, icon: HiCurrencyRupee, color: 'primary' },
          { label: 'Pending Payments', value: stats.pendingPayments, icon: HiClock, color: 'warning' },
          { label: 'Last Payment', value: `KSh ${stats.lastPayment.toLocaleString()}`, icon: HiCurrencyRupee, color: 'info' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-full p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Records</CardTitle>
            <Button variant="primary" size="sm" onClick={handleDownloadStatement}>
              <HiDocumentArrowDown className="w-4 h-4 mr-2" />
              Download Full Statement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : payments.length > 0 ? (
            <>
              <Table columns={columns as any} data={payments as any} />
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <HiCurrencyRupee className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No payments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
