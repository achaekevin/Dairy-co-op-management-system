import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiPlus,
  HiFunnel,
  HiArrowDownTray,
  HiEye,
  HiPencil,
  HiTrash,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import Avatar from '../../components/ui/Avatar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { Farmer, Column } from '../../types';

const FarmersListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    farmerId: string | null;
  }>({ isOpen: false, farmerId: null });

  // Mock data
  const farmers: Farmer[] = [
    {
      id: '1',
      farmerId: 'FM001',
      firstName: 'Ramesh',
      lastName: 'Kumar',
      phoneNumber: '+91 98765 43210',
      email: 'ramesh.kumar@example.com',
      dateOfBirth: '1980-05-15',
      gender: 'MALE',
      address: '123 Village Road',
      village: 'Green Valley',
      district: 'Mumbai',
      pinCode: '400001',
      bankName: 'State Bank',
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      aadharNumber: '1234-5678-9012',
      panNumber: 'ABCDE1234F',
      status: 'ACTIVE',
      joinDate: '2020-01-15',
      cattle: 5,
      totalShares: 10,
      outstandingLoan: 50000,
      createdAt: '2020-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      farmerId: 'FM002',
      firstName: 'Suresh',
      lastName: 'Patel',
      phoneNumber: '+91 98765 43211',
      dateOfBirth: '1985-08-20',
      gender: 'MALE',
      address: '456 Farm Lane',
      village: 'Sunrise Village',
      district: 'Pune',
      pinCode: '411001',
      bankName: 'HDFC Bank',
      accountNumber: '0987654321',
      ifscCode: 'HDFC0001234',
      aadharNumber: '9876-5432-1098',
      status: 'ACTIVE',
      joinDate: '2020-03-20',
      cattle: 8,
      totalShares: 15,
      outstandingLoan: 0,
      createdAt: '2020-03-20T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '3',
      farmerId: 'FM003',
      firstName: 'Mahesh',
      lastName: 'Singh',
      phoneNumber: '+91 98765 43212',
      dateOfBirth: '1975-12-10',
      gender: 'MALE',
      address: '789 Dairy Street',
      village: 'Milk Town',
      district: 'Nashik',
      pinCode: '422001',
      bankName: 'ICICI Bank',
      accountNumber: '5678901234',
      ifscCode: 'ICIC0001234',
      aadharNumber: '5678-9012-3456',
      status: 'INACTIVE',
      joinDate: '2019-06-10',
      cattle: 3,
      totalShares: 5,
      outstandingLoan: 25000,
      createdAt: '2019-06-10T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
  ];

  const columns: Column<Farmer>[] = [
    {
      id: 'farmer',
      header: 'Farmer',
      accessor: (row: Farmer) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.firstName} ${row.lastName}`} size="sm" />
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {row.farmerId}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      accessor: (row: Farmer) => (
        <div>
          <p className="text-sm text-slate-900 dark:text-white">
            {row.phoneNumber}
          </p>
          {row.email && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {row.email}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'location',
      header: 'Location',
      accessor: (row: Farmer) => (
        <div>
          <p className="text-sm text-slate-900 dark:text-white">{row.village}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {row.district}
          </p>
        </div>
      ),
    },
    {
      id: 'cattle',
      header: 'Cattle',
      accessor: (row: Farmer) => (
        <span className="text-sm text-slate-900 dark:text-white">
          {row.cattle}
        </span>
      ),
      align: 'center' as const,
    },
    {
      id: 'shares',
      header: 'Shares',
      accessor: (row: Farmer) => (
        <span className="text-sm text-slate-900 dark:text-white">
          {row.totalShares}
        </span>
      ),
      align: 'center' as const,
    },
    {
      id: 'loan',
      header: 'Outstanding Loan',
      accessor: (row: Farmer) => (
        <span
          className={`text-sm font-medium ${
            row.outstandingLoan > 0
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-green-600 dark:text-green-400'
          }`}
        >
          ₹{row.outstandingLoan.toLocaleString()}
        </span>
      ),
      align: 'right' as const,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: Farmer) => (
        <Badge
          variant={
            row.status === 'ACTIVE'
              ? 'success'
              : row.status === 'SUSPENDED'
              ? 'warning'
              : 'error'
          }
        >
          {row.status}
        </Badge>
      ),
      align: 'center' as const,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Farmer) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/farmers/${row.id}`)}
          >
            <HiEye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/farmers/${row.id}/edit`)}
          >
            <HiPencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setDeleteDialog({ isOpen: true, farmerId: row.id })
            }
          >
            <HiTrash className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
      align: 'center' as const,
    },
  ];

  const handleDelete = () => {
    // Delete logic here
    setDeleteDialog({ isOpen: false, farmerId: null });
  };

  const filteredFarmers =
    statusFilter === 'all'
      ? farmers
      : farmers.filter((f) => f.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Farmers
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your cooperative farmers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
          >
            <HiArrowDownTray className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/farmers/new')}
          >
            <HiPlus className="w-4 h-4 mr-2" />
            Add Farmer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Farmers',
            value: farmers.length,
            color: 'text-blue-600',
          },
          {
            label: 'Active',
            value: farmers.filter((f) => f.status === 'ACTIVE').length,
            color: 'text-green-600',
          },
          {
            label: 'Total Cattle',
            value: farmers.reduce((sum, f) => sum + f.cattle, 0),
            color: 'text-purple-600',
          },
          {
            label: 'Outstanding Loans',
            value: `₹${farmers
              .reduce((sum, f) => sum + f.outstandingLoan, 0)
              .toLocaleString()}`,
            color: 'text-amber-600',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'SUSPENDED', label: 'Suspended' },
            ]}
          />
          <Button variant="outline">
            <HiFunnel className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Table<Farmer> columns={columns} data={filteredFarmers} hoverable striped />
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, farmerId: null })}
        onConfirm={handleDelete}
        title="Delete Farmer"
        message="Are you sure you want to delete this farmer? This action cannot be undone."
        variant="danger"
      />
    </div>
  );
};

export default FarmersListPage;
