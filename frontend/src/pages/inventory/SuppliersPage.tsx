import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import type { Supplier, Column } from '../../types';

const SuppliersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Mock data
  const suppliers: Supplier[] = [
    {
      id: 'SUP-001',
      supplierCode: 'SUP-001',
      name: 'Agri Feeds Ltd',
      category: 'Cattle Feed',
      contactPerson: 'Ramesh Kumar',
      phoneNumber: '+91 98765 11111',
      email: 'info@agrifeeds.com',
      address: '123 Industrial Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      gstNumber: '27AABCU9603R1ZM',
      creditLimit: 500000,
      creditDays: 30,
      outstandingAmount: 125000,
      totalPurchases: 2500000,
      status: 'ACTIVE',
      rating: 4.5,
      createdAt: '2023-01-15T00:00:00Z',
    },
    {
      id: 'SUP-012',
      supplierCode: 'SUP-012',
      name: 'VetCare Pharma',
      category: 'Medicine',
      contactPerson: 'Dr. Sharma',
      phoneNumber: '+91 98765 22222',
      email: 'sales@vetcare.com',
      address: '456 Medical Complex',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411001',
      gstNumber: '27AACCP1234M1Z5',
      creditLimit: 300000,
      creditDays: 45,
      outstandingAmount: 45000,
      totalPurchases: 850000,
      status: 'ACTIVE',
      rating: 4.8,
      createdAt: '2023-02-10T00:00:00Z',
    },
    {
      id: 'SUP-008',
      supplierCode: 'SUP-008',
      name: 'Steel Industries',
      category: 'Equipment',
      contactPerson: 'Vijay Patel',
      phoneNumber: '+91 98765 33333',
      email: 'orders@steelindustries.com',
      address: '789 Industrial Estate',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pinCode: '380001',
      gstNumber: '24AACCS5678P1Z8',
      creditLimit: 1000000,
      creditDays: 60,
      outstandingAmount: 0,
      totalPurchases: 3200000,
      status: 'ACTIVE',
      rating: 4.6,
      createdAt: '2022-11-20T00:00:00Z',
    },
    {
      id: 'SUP-019',
      supplierCode: 'SUP-019',
      name: 'PackCo Solutions',
      category: 'Packaging',
      contactPerson: 'Amit Desai',
      phoneNumber: '+91 98765 44444',
      email: 'contact@packco.com',
      address: '321 Packaging Hub',
      city: 'Delhi',
      state: 'Delhi',
      pinCode: '110001',
      gstNumber: '07AACCP9876K1Z2',
      creditLimit: 400000,
      creditDays: 30,
      outstandingAmount: 85000,
      totalPurchases: 1200000,
      status: 'ACTIVE',
      rating: 4.2,
      createdAt: '2023-05-01T00:00:00Z',
    },
    {
      id: 'SUP-025',
      supplierCode: 'SUP-025',
      name: 'Local Feed Store',
      category: 'Cattle Feed',
      contactPerson: 'Suresh Yadav',
      phoneNumber: '+91 98765 55555',
      address: '555 Market Road',
      city: 'Nashik',
      state: 'Maharashtra',
      pinCode: '422001',
      creditLimit: 100000,
      creditDays: 15,
      outstandingAmount: 25000,
      totalPurchases: 450000,
      status: 'INACTIVE',
      rating: 3.5,
      createdAt: '2023-08-15T00:00:00Z',
    },
  ];

  const stats = [
    {
      label: 'Total Suppliers',
      value: suppliers.length.toString(),
      icon: BuildingOfficeIcon,
      color: 'blue',
    },
    {
      label: 'Active',
      value: suppliers.filter((s) => s.status === 'ACTIVE').length.toString(),
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'Inactive',
      value: suppliers.filter((s) => s.status === 'INACTIVE').length.toString(),
      icon: XCircleIcon,
      color: 'red',
    },
    {
      label: 'Avg Rating',
      value: (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1),
      icon: StarIcon,
      color: 'yellow',
    },
  ];

  const totalOutstanding = suppliers.reduce((sum, s) => sum + s.outstandingAmount, 0);
  const totalPurchases = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0);

  const columns: Column<Supplier>[] = [
    {
      id: 'supplierCode',
      header: 'Supplier Code',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/dashboard/inventory/suppliers/${row.id}`)}
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {row.supplierCode}
        </button>
      ),
    },
    {
      id: 'name',
      header: 'Supplier Name',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {row.category}
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      accessor: (row) => (
        <div>
          <div className="text-sm text-gray-900 dark:text-white">
            {row.contactPerson}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.phoneNumber}
          </div>
        </div>
      ),
    },
    {
      id: 'location',
      header: 'Location',
      accessor: (row) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {row.city}, {row.state}
        </div>
      ),
    },
    {
      id: 'credit',
      header: 'Credit Info',
      accessor: (row) => (
        <div>
          <div className="text-sm text-gray-900 dark:text-white">
            Limit: KSh {row.creditLimit.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.creditDays} days
          </div>
        </div>
      ),
    },
    {
      id: 'outstanding',
      header: 'Outstanding',
      accessor: (row) => (
        <div className="text-right">
          <div
            className={`font-semibold ${
              row.outstandingAmount > 0
                ? 'text-red-600'
                : 'text-green-600'
            }`}
          >
            KSh {row.outstandingAmount.toLocaleString()}
          </div>
        </div>
      ),
      align: 'right',
    },
    {
      id: 'totalPurchases',
      header: 'Total Purchases',
      accessor: (row) => (
        <div className="text-right font-medium text-gray-900 dark:text-white">
          KSh {row.totalPurchases.toLocaleString()}
        </div>
      ),
      align: 'right',
    },
    {
      id: 'rating',
      header: 'Rating',
      accessor: (row) => (
        <div className="flex items-center gap-1">
          <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {row.rating}
          </span>
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
              : row.status === 'BLOCKED'
                ? 'error'
                : 'secondary'
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
          onClick={() => navigate(`/dashboard/inventory/suppliers/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.supplierCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || supplier.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || supplier.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExport = () => {
    console.log('Exporting suppliers data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/inventory')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Suppliers
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage supplier relationships
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/dashboard/inventory/suppliers/new')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Supplier
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
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
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

      {/* Financial Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total Purchases
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-100">
              KSh {totalPurchases.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-100">
              Total Outstanding
            </p>
            <p className="mt-2 text-3xl font-bold text-red-900 dark:text-red-100">
              KSh {totalOutstanding.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by name, code, or contact person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Categories' },
              { value: 'Cattle Feed', label: 'Cattle Feed' },
              { value: 'Medicine', label: 'Medicine' },
              { value: 'Equipment', label: 'Equipment' },
              { value: 'Packaging', label: 'Packaging' },
            ]}
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'BLOCKED', label: 'Blocked' },
            ]}
          />
        </div>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Suppliers ({filteredSuppliers.length})
          </h2>
        </div>
        <Table columns={columns} data={filteredSuppliers} />
      </Card>
    </div>
  );
};

export default SuppliersPage;
