import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import type { Column } from '../../types';
import {
  HiBanknotes,
  HiPlus,
  HiEye,
  HiCheckCircle,
  HiClock,
} from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Loan {
  id: string;
  loanNumber: string;
  amount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'REJECTED';
  appliedDate: string;
  approvedDate?: string;
  disbursementDate?: string;
  nextEmiDate?: string;
}

const LoansPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLoans();
  }, [page]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farmer-portal/loans', {
        params: { page, limit: 20 },
      });
      if (response.data.success) {
        setLoans(response.data.data.data || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load loans');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRepayment = (loanId: string) => {
    navigate(`/farmer-portal/loans/${loanId}/repayment`);
  };

  const columns: Column<Loan>[] = [
    {
      id: 'loanNumber',
      header: 'Loan #',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{row.loanNumber}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Applied: {new Date(row.appliedDate).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      id: 'amount',
      header: 'Loan Amount',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            KSh {row.amount.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {row.tenure} months @ {row.interestRate}%
          </p>
        </div>
      ),
    },
    {
      id: 'emi',
      header: 'EMI Amount',
      accessor: (row) => `KSh ${row.emiAmount.toLocaleString()}`,
    },
    {
      id: 'paid',
      header: 'Paid / Outstanding',
      accessor: (row) => (
        <div>
          <p className="text-sm text-green-600 dark:text-green-400">
            Paid: KSh {row.paidAmount.toLocaleString()}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Due: KSh {row.outstandingAmount.toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      id: 'nextEmi',
      header: 'Next EMI',
      accessor: (row) => (
        row.nextEmiDate ? (
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {new Date(row.nextEmiDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              KSh {row.emiAmount.toLocaleString()}
            </p>
          </div>
        ) : (
          <span className="text-slate-400">N/A</span>
        )
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge
          variant={
            row.status === 'ACTIVE' || row.status === 'APPROVED'
              ? 'success'
              : row.status === 'CLOSED'
              ? 'info'
              : row.status === 'PENDING'
              ? 'warning'
              : 'error'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleViewRepayment(row.id)}
          disabled={row.status === 'PENDING' || row.status === 'REJECTED'}
        >
          <HiEye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  const stats = {
    totalLoans: loans.length,
    activeLoans: loans.filter(l => l.status === 'ACTIVE').length,
    totalBorrowed: loans.reduce((sum, l) => sum + l.amount, 0),
    totalOutstanding: loans.reduce((sum, l) => l.status === 'ACTIVE' ? sum + l.outstandingAmount : sum, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Loans</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your loans and repayment schedules
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/farmer-portal/loans/apply')}>
          <HiPlus className="w-4 h-4 mr-2" />
          Apply for Loan
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Loans', value: stats.totalLoans, icon: HiBanknotes, color: 'primary' },
          { label: 'Active Loans', value: stats.activeLoans, icon: HiCheckCircle, color: 'success' },
          { label: 'Total Borrowed', value: `KSh ${stats.totalBorrowed.toLocaleString()}`, icon: HiBanknotes, color: 'info' },
          { label: 'Total Outstanding', value: `KSh ${stats.totalOutstanding.toLocaleString()}`, icon: HiClock, color: 'warning' },
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
          <CardTitle>Loan History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : loans.length > 0 ? (
            <>
              <Table columns={columns as any} data={loans as any} />
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
              <HiBanknotes className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">No loans found</p>
              <Button variant="primary" onClick={() => navigate('/farmer-portal/loans/apply')}>
                <HiPlus className="w-4 h-4 mr-2" />
                Apply for Your First Loan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoansPage;
