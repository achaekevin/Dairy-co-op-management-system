import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import type { Payment, Column } from '../../types';
import dayjs from 'dayjs';

const PaymentsListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterMode, setFilterMode] = useState('ALL');

  // Mock data
  const payments: Payment[] = [
    {
      id: '1',
      farmerId: 'F-001',
      farmerName: 'Rajesh Kumar',
      period: 'January 2024',
      totalQuantity: 1250,
      totalAmount: 62500,
      bonusAmount: 2500,
      deductionAmount: 1500,
      netAmount: 63500,
      status: 'PAID',
      paymentDate: '2024-02-05',
      paymentMode: 'BANK_TRANSFER',
      transactionId: 'TXN20240205001',
      approvedBy: 'Manager',
      createdAt: '2024-02-01T10:00:00Z',
    },
    {
      id: '2',
      farmerId: 'F-012',
      farmerName: 'Suresh Patel',
      period: 'January 2024',
      totalQuantity: 980,
      totalAmount: 47040,
      bonusAmount: 1500,
      deductionAmount: 800,
      netAmount: 47740,
      status: 'APPROVED',
      approvedBy: 'Manager',
      createdAt: '2024-02-01T10:30:00Z',
    },
    {
      id: '3',
      farmerId: 'F-023',
      farmerName: 'Amit Singh',
      period: 'January 2024',
      totalQuantity: 1450,
      totalAmount: 69600,
      bonusAmount: 3000,
      deductionAmount: 2000,
      netAmount: 70600,
      status: 'PENDING',
      createdAt: '2024-02-01T11:00:00Z',
    },
    {
      id: '4',
      farmerId: 'F-045',
      farmerName: 'Vijay Sharma',
      period: 'January 2024',
      totalQuantity: 1120,
      totalAmount: 53760,
      bonusAmount: 2000,
      deductionAmount: 1200,
      netAmount: 54560,
      status: 'REJECTED',
      createdAt: '2024-02-01T11:30:00Z',
    },
    {
      id: '5',
      farmerId: 'F-067',
      farmerName: 'Ramesh Verma',
      period: 'January 2024',
      totalQuantity: 890,
      totalAmount: 42720,
      bonusAmount: 1200,
      deductionAmount: 500,
      netAmount: 43420,
      status: 'PAID',
      paymentDate: '2024-02-06',
      paymentMode: 'BANK_TRANSFER',
      transactionId: 'TXN20240206001',
      approvedBy: 'Manager',
      createdAt: '2024-02-01T12:00:00Z',
    },
  ];

  const stats = [
    {
      label: 'Total Payments',
      value: 'KSh 3,79,820',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: BanknotesIcon,
      color: 'blue',
    },
    {
      label: 'Paid',
      value: 'KSh 1,06,920',
      change: '28.1%',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'Pending',
      value: 'KSh 70,600',
      change: '18.6%',
      changeType: 'neutral' as const,
      icon: ClockIcon,
      color: 'yellow',
    },
    {
      label: 'Approved',
      value: 'KSh 47,740',
      change: '12.6%',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'purple',
    },
  ];

  const columns: Column<Payment>[] = [
    {
      id: 'farmerId',
      header: 'Farmer',
      accessor: (row) => (
        <div>
          <button
            onClick={() => navigate(`/dashboard/farmers/${row.farmerId}`)}
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {row.farmerName}
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.farmerId}</div>
        </div>
      ),
    },
    {
      id: 'period',
      header: 'Period',
      accessor: (row) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">{row.period}</span>
      ),
      sortable: true,
    },
    {
      id: 'quantity',
      header: 'Quantity',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {row.totalQuantity.toLocaleString()} L
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total collected</div>
        </div>
      ),
    },
    {
      id: 'amounts',
      header: 'Amounts',
      accessor: (row) => (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Total:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              KSh {row.totalAmount.toLocaleString()}
            </span>
          </div>
          {row.bonusAmount > 0 && (
            <div className="flex justify-between gap-4">
              <span className="text-green-600 dark:text-green-400">Bonus:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                +KSh {row.bonusAmount.toLocaleString()}
              </span>
            </div>
          )}
          {row.deductionAmount > 0 && (
            <div className="flex justify-between gap-4">
              <span className="text-red-600 dark:text-red-400">Deduction:</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                -KSh {row.deductionAmount.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'netAmount',
      header: 'Net Amount',
      accessor: (row) => (
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            KSh {row.netAmount.toLocaleString()}
          </div>
        </div>
      ),
      align: 'right',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge
          variant={
            row.status === 'PAID'
              ? 'success'
              : row.status === 'APPROVED'
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
      id: 'payment',
      header: 'Payment Info',
      accessor: (row) => (
        <div className="text-sm">
          {row.paymentDate ? (
            <>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {dayjs(row.paymentDate).format('DD MMM YYYY')}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {row.paymentMode?.replace(/_/g, ' ')}
              </div>
              {row.transactionId && (
                <div className="text-xs text-gray-400">{row.transactionId}</div>
              )}
            </>
          ) : (
            <span className="text-gray-400">Not paid</span>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/dashboard/payments/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.farmerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.period.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || payment.status === filterStatus;
    const matchesMode =
      filterMode === 'ALL' || !payment.paymentMode || payment.paymentMode === filterMode;
    return matchesSearch && matchesStatus && matchesMode;
  });

  const handleExport = () => {
    console.log('Exporting payments data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage farmer payments and transactions
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/dashboard/payments/generate')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Generate Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : stat.changeType === 'neutral'
                          ? 'text-gray-600'
                          : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`rounded-full p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}
                >
                  <stat.icon
                    className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by farmer name, ID, or period..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'PAID', label: 'Paid' },
              { value: 'REJECTED', label: 'Rejected' },
            ]}
          />
          <Select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Payment Modes' },
              { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
              { value: 'CASH', label: 'Cash' },
              { value: 'CHEQUE', label: 'Cheque' },
            ]}
          />
        </div>
      </Card>

      {/* Payments Table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Records ({filteredPayments.length})
          </h2>
        </div>
        <Table columns={columns} data={filteredPayments} />
      </Card>
    </div>
  );
};

export default PaymentsListPage;
