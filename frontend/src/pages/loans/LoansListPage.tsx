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
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import type { Loan, Column } from '../../types';
import dayjs from 'dayjs';

const LoansListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Mock data
  const loans: Loan[] = [
    {
      id: '1',
      loanNumber: 'LN-2024-001',
      farmerId: 'F-001',
      farmerName: 'Rajesh Kumar',
      amount: 50000,
      interestRate: 8.5,
      tenure: 12,
      emiAmount: 4387,
      purpose: 'Purchase of cattle feed and veterinary services',
      status: 'ACTIVE',
      appliedDate: '2024-01-10',
      approvedDate: '2024-01-15',
      disbursementDate: '2024-01-20',
      outstandingAmount: 35000,
      paidAmount: 15000,
      createdAt: '2024-01-10T10:00:00Z',
    },
    {
      id: '2',
      loanNumber: 'LN-2024-002',
      farmerId: 'F-012',
      farmerName: 'Suresh Patel',
      amount: 75000,
      interestRate: 8.5,
      tenure: 18,
      emiAmount: 4583,
      purpose: 'Purchase of new dairy equipment',
      status: 'PENDING',
      appliedDate: '2024-02-01',
      outstandingAmount: 75000,
      paidAmount: 0,
      createdAt: '2024-02-01T11:00:00Z',
    },
    {
      id: '3',
      loanNumber: 'LN-2024-003',
      farmerId: 'F-023',
      farmerName: 'Amit Singh',
      amount: 100000,
      interestRate: 8.5,
      tenure: 24,
      emiAmount: 4617,
      purpose: 'Farm expansion and infrastructure',
      status: 'APPROVED',
      appliedDate: '2024-01-25',
      approvedDate: '2024-02-05',
      outstandingAmount: 100000,
      paidAmount: 0,
      createdAt: '2024-01-25T14:00:00Z',
    },
    {
      id: '4',
      loanNumber: 'LN-2024-004',
      farmerId: 'F-045',
      farmerName: 'Vijay Sharma',
      amount: 30000,
      interestRate: 8.5,
      tenure: 6,
      emiAmount: 5174,
      purpose: 'Medical treatment for cattle',
      status: 'REJECTED',
      appliedDate: '2024-02-10',
      outstandingAmount: 0,
      paidAmount: 0,
      createdAt: '2024-02-10T09:00:00Z',
    },
    {
      id: '5',
      loanNumber: 'LN-2023-045',
      farmerId: 'F-067',
      farmerName: 'Ramesh Verma',
      amount: 40000,
      interestRate: 8.5,
      tenure: 12,
      emiAmount: 3509,
      purpose: 'Purchase of fodder and feed',
      status: 'CLOSED',
      appliedDate: '2023-02-15',
      approvedDate: '2023-02-20',
      disbursementDate: '2023-02-25',
      closureDate: '2024-02-25',
      outstandingAmount: 0,
      paidAmount: 40000,
      createdAt: '2023-02-15T12:00:00Z',
    },
  ];

  const stats = [
    {
      label: 'Total Loans',
      value: 'KSh 2,95,000',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: BanknotesIcon,
      color: 'blue',
    },
    {
      label: 'Active Loans',
      value: 'KSh 50,000',
      change: '17%',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'Pending Approval',
      value: 'KSh 75,000',
      change: '25.4%',
      changeType: 'neutral' as const,
      icon: ClockIcon,
      color: 'yellow',
    },
    {
      label: 'Outstanding',
      value: 'KSh 2,10,000',
      change: '71.2%',
      changeType: 'neutral' as const,
      icon: CurrencyRupeeIcon,
      color: 'purple',
    },
  ];

  const columns: Column<Loan>[] = [
    {
      id: 'loanNumber',
      header: 'Loan Number',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/dashboard/loans/${row.id}`)}
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {row.loanNumber}
        </button>
      ),
    },
    {
      id: 'farmer',
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
      id: 'amount',
      header: 'Loan Amount',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            KSh {row.amount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            @ {row.interestRate}% for {row.tenure} months
          </div>
        </div>
      ),
    },
    {
      id: 'emi',
      header: 'EMI',
      accessor: (row) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          KSh {row.emiAmount.toLocaleString()}/mo
        </div>
      ),
    },
    {
      id: 'outstanding',
      header: 'Outstanding',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-red-600 dark:text-red-400">
            KSh {row.outstandingAmount.toLocaleString()}
          </div>
          {row.status === 'ACTIVE' && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Paid: KSh {row.paidAmount.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge
          variant={
            row.status === 'ACTIVE'
              ? 'success'
              : row.status === 'APPROVED'
                ? 'info'
                : row.status === 'PENDING'
                  ? 'warning'
                  : row.status === 'CLOSED'
                    ? 'secondary'
                    : 'error'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'dates',
      header: 'Key Dates',
      accessor: (row) => (
        <div className="text-sm space-y-1">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Applied: </span>
            <span className="text-gray-900 dark:text-gray-100">
              {dayjs(row.appliedDate).format('DD MMM YYYY')}
            </span>
          </div>
          {row.disbursementDate && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Disbursed: </span>
              <span className="text-gray-900 dark:text-gray-100">
                {dayjs(row.disbursementDate).format('DD MMM YYYY')}
              </span>
            </div>
          )}
          {row.closureDate && (
            <div>
              <span className="text-green-600 dark:text-green-400">Closed: </span>
              <span className="text-gray-900 dark:text-gray-100">
                {dayjs(row.closureDate).format('DD MMM YYYY')}
              </span>
            </div>
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
          onClick={() => navigate(`/dashboard/loans/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.farmerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.loanNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || loan.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    console.log('Exporting loans data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loans</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage farmer loans and applications
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/dashboard/loans/apply')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Apply Loan
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by farmer name, ID, or loan number..."
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
              { value: 'ACTIVE', label: 'Active' },
              { value: 'CLOSED', label: 'Closed' },
              { value: 'REJECTED', label: 'Rejected' },
            ]}
          />
        </div>
      </Card>

      {/* Loans Table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Loan Records ({filteredLoans.length})
          </h2>
        </div>
        <Table columns={columns} data={filteredLoans} />
      </Card>
    </div>
  );
};

export default LoansListPage;
