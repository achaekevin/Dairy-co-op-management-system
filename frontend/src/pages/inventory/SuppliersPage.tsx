import { useState, useEffect } from 'react';
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
import Pagination from '../../components/ui/Pagination';
import type { Supplier, Column } from '../../types';
import { supplierService } from '../../services/supplierService';
import toast from 'react-hot-toast';

const SuppliersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    activeSuppliers: 0,
    totalPurchases: 0,
    totalOutstanding: 0,
  });

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage, searchQuery, filterStatus, filterCategory]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const response = await supplierService.getAll({
        search: searchQuery || undefined,
        category: filterCategory !== 'ALL' ? filterCategory : undefined,
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
        page: currentPage,
        pageSize: 10,
      });
      if (response.success) {
        setSuppliers(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load suppliers');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await supplierService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const statsData = [
    {
      label: 'Total Suppliers',
      value: stats.totalSuppliers.toString(),
      icon: BuildingOfficeIcon,
      color: 'blue',
    },
    {
      label: 'Active',
      value: stats.activeSuppliers.toString(),
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'Inactive',
      value: (stats.totalSuppliers - stats.activeSuppliers).toString(),
      icon: XCircleIcon,
      color: 'red',
    },
    {
      label: 'Avg Rating',
      value: '4.5',
      icon: StarIcon,
      color: 'yellow',
    },
  ];

  const totalOutstanding = stats.totalOutstanding;
  const totalPurchases = stats.totalPurchases;

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
        {statsData.map((stat, index) => (
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
            Suppliers ({suppliers.length})
          </h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : suppliers.length > 0 ? (
          <Table columns={columns} data={suppliers} />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No suppliers found</p>
          </div>
        )}
      </Card>

      {suppliers.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;
