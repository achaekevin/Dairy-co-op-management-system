import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Pagination from '../../components/ui/Pagination';
import type { Customer, Column } from '../../types';
import { customerService } from '../../services/customerService';
import toast from 'react-hot-toast';

const CustomersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalSales: 0,
    totalOutstanding: 0,
  });

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchQuery, filterType, filterStatus]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await customerService.getAll({
        search: searchQuery || undefined,
        customerType: filterType !== 'ALL' ? filterType : undefined,
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
        page: currentPage,
        pageSize: 10,
      });
      if (response.success && response.data) {
        setCustomers(Array.isArray(response.data) ? response.data : []);
        setTotalPages(response.meta?.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await customerService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const statsData = [
    { label: 'Total Customers', value: (stats.totalCustomers ?? 0).toString(), icon: UserGroupIcon, color: 'blue' },
    { label: 'Active', value: (stats.activeCustomers ?? 0).toString(), icon: CheckCircleIcon, color: 'green' },
    { label: 'Inactive', value: ((stats.totalCustomers ?? 0) - (stats.activeCustomers ?? 0)).toString(), icon: XCircleIcon, color: 'red' },
    { label: 'Outstanding', value: `KSh ${(stats.totalOutstanding ?? 0).toLocaleString()}`, icon: CurrencyRupeeIcon, color: 'yellow' },
  ];

  const totalSales = stats.totalSales;

  const columns: Column<Customer>[] = [
    {
      id: 'customerId',
      header: 'Customer ID',
      accessor: (row) => (
        <button onClick={() => navigate(`/dashboard/customers/${row.id}`)} className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
          {row.customerId}
        </button>
      ),
    },
    {
      id: 'name',
      header: 'Customer',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.customerName}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.businessName}</div>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (row) => <Badge variant="secondary">{row.customerType}</Badge>,
    },
    { id: 'phone', header: 'Phone', accessor: 'phoneNumber' },
    {
      id: 'location',
      header: 'Location',
      accessor: (row) => `${row.city}, ${row.state}`,
    },
    {
      id: 'credit',
      header: 'Credit Limit',
      accessor: (row) => `KSh ${row.creditLimit.toLocaleString()}`,
      align: 'right',
    },
    {
      id: 'outstanding',
      header: 'Outstanding',
      accessor: (row) => (
        <div className={`font-semibold text-right ${row.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
          KSh {row.outstandingAmount.toLocaleString()}
        </div>
      ),
      align: 'right',
    },
    {
      id: 'totalSales',
      header: 'Total Sales',
      accessor: (row) => `KSh ${row.totalSales.toLocaleString()}`,
      align: 'right',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : row.status === 'BLOCKED' ? 'error' : 'secondary'}>
          {row.status}
        </Badge>
      ),
    },
    { id: 'actions', header: 'Actions', accessor: () => <Button size="sm">View</Button> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage customer relationships</p>
        </div>
        <Button onClick={() => navigate('/dashboard/customers/new')}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <div>
          <p className="text-sm font-medium text-green-900 dark:text-green-100">Total Sales</p>
          <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">KSh {totalSales.toLocaleString()}</p>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input placeholder="Search customers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} options={[
            { value: 'ALL', label: 'All Types' },
            { value: 'RETAIL', label: 'Retail' },
            { value: 'WHOLESALE', label: 'Wholesale' },
            { value: 'DISTRIBUTOR', label: 'Distributor' },
            { value: 'INSTITUTION', label: 'Institution' },
          ]} />
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} options={[
            { value: 'ALL', label: 'All Status' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'INACTIVE', label: 'Inactive' },
            { value: 'BLOCKED', label: 'Blocked' },
          ]} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customers ({customers.length})</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : customers.length > 0 ? (
          <Table columns={columns} data={customers} />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No customers found</p>
          </div>
        )}
      </Card>

      {customers.length > 0 && totalPages > 1 && (
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

export default CustomersPage;
