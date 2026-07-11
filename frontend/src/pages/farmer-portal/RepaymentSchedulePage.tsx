import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import type { Column } from '../../types';
import { HiArrowLeft, HiCheckCircle, HiClock, HiBanknotes } from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Installment {
  installmentNumber: number;
  dueDate: string;
  principal: number;
  interest: number;
  totalEmi: number;
  paid: boolean;
  paidDate?: string;
  balance: number;
}

interface RepaymentSchedule {
  loanNumber: string;
  amount: number;
  emiAmount: number;
  installments: Installment[];
  totalPaid: number;
  totalRemaining: number;
}

const RepaymentSchedulePage = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<RepaymentSchedule | null>(null);

  useEffect(() => {
    if (loanId) {
      fetchRepaymentSchedule();
    }
  }, [loanId]);

  const fetchRepaymentSchedule = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/farmer-portal/loans/${loanId}/repayment-schedule`);
      if (response.data.success) {
        setSchedule(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load repayment schedule');
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Installment>[] = [
    {
      id: 'installmentNumber',
      header: 'Installment #',
      accessor: (row) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {row.installmentNumber}
        </span>
      ),
    },
    {
      id: 'dueDate',
      header: 'Due Date',
      accessor: (row) => new Date(row.dueDate).toLocaleDateString(),
    },
    {
      id: 'principal',
      header: 'Principal',
      accessor: (row) => `KSh ${row.principal.toLocaleString()}`,
    },
    {
      id: 'interest',
      header: 'Interest',
      accessor: (row) => `KSh ${row.interest.toLocaleString()}`,
    },
    {
      id: 'totalEmi',
      header: 'Total EMI',
      accessor: (row) => (
        <span className="font-bold text-slate-900 dark:text-white">
          KSh {row.totalEmi.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'balance',
      header: 'Balance',
      accessor: (row) => `KSh ${row.balance.toLocaleString()}`,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <div>
          <Badge variant={row.paid ? 'success' : 'warning'}>
            {row.paid ? 'PAID' : 'PENDING'}
          </Badge>
          {row.paidDate && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {new Date(row.paidDate).toLocaleDateString()}
            </p>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">Repayment schedule not found</p>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/farmer-portal/loans')}>
          Back to Loans
        </Button>
      </div>
    );
  }

  const paidInstallments = schedule.installments.filter((i) => i.paid).length;
  const totalInstallments = schedule.installments.length;
  const progressPercent = (paidInstallments / totalInstallments) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/farmer-portal/loans')}>
          <HiArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Repayment Schedule
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Loan #{schedule.loanNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Loan Amount',
            value: `KSh ${schedule.amount.toLocaleString()}`,
            icon: HiBanknotes,
            color: 'primary',
          },
          {
            label: 'EMI Amount',
            value: `KSh ${schedule.emiAmount.toLocaleString()}`,
            icon: HiBanknotes,
            color: 'secondary',
          },
          {
            label: 'Total Paid',
            value: `KSh ${schedule.totalPaid.toLocaleString()}`,
            icon: HiCheckCircle,
            color: 'success',
          },
          {
            label: 'Remaining',
            value: `KSh ${schedule.totalRemaining.toLocaleString()}`,
            icon: HiClock,
            color: 'warning',
          },
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
          <CardTitle>Repayment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                {paidInstallments} of {totalInstallments} installments paid
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {progressPercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-success-500 to-success-600 rounded-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Installment Schedule ({totalInstallments})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table columns={columns as any} data={schedule.installments as any} />
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
                <li>• EMI is automatically deducted from your monthly milk payments</li>
                <li>• Early repayment will reduce your interest burden</li>
                <li>• Contact the office if you face difficulties in repayment</li>
                <li>• Late payments may incur additional charges</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepaymentSchedulePage;
