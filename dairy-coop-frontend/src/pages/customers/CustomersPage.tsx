import { useState } from 'react';
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
import type { Customer, Column } from '../../types';

const CustomersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const customers: Customer[] = [
    {
      id: '1',
      customerId: 'CUST-001',
      customerName: 'Retail Shop - MG Road',
      businessName: 'Fresh Dairy Store',
      customerType: 'RETAIL',
      phoneNumber: '+91 98765 11111',
      email: 'mgroad@freshdairy.com',
      address: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      gstNumber: '27AABCU9603R1ZM',
      creditLimit: 50000,
      creditDays: 7,
      outstandingAmount: 12000,
      totalSales: 850000,
      status: 'ACTIVE',
      createdAt: '2023-01-15T00:00:00Z',
    },
    {
      id: '2',
      customerId: 'CUST-002',
      customerName: 'Wholesale Distributor',
      businessName: 'City Dairy Distributors',
      customerType: 'WHOLESALE',
      phoneNumber: '+91 98765 22222',
      email: 'orders@citydairy.com',
      address: '456 Market Yard',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411001',
      gstNumber: '27AACCP1234M1Z5',
      creditLimit: 200000,
      creditDays: 15,
      outstandingAmount: 85000,
      totalSales: 3200000,
      status: 'ACTIVE',
      createdAt: '2022-06-10T00:00:00Z',
    },
    {
      id: '3',
      customerId: 'CUST-003',
      customerName: 'School Canteen',
      businessName: 'St. Mary\'s School',
      customerType: 'INSTITUTION',
      phoneNumber: '+91 98765 33333',
      email: 'canteen@stmarys.edu',
      address: '789 School Road',
      city: 'Nashik',
      state: 'Maharashtra',
      pinCode: '422001',
      creditLimit: 100000,
      creditDays: 30,
      outstandingAmount: 0,
      totalSales: 560000,
      status: 'ACTIVE',
      createdAt: '2023-04-01T00:00:00Z',
    },
  ];

  const stats = [
    { label: 'Total Customers', value: customers.length.toString(), icon: UserGroupIcon, color: 'blue' },
    { label: 'Active', value: customers.filter(c => c.status === 'ACTIVE').length.toString(), icon: CheckCircleIcon, color: 'green' },
    { label: 'Inactive', value: customers.filter(c => c.status === 'INACTIVE' || c.status === 'BLOCKED').length.toString(), icon: XCircleIcon, color: 'red' },
    { label: 'Outstanding', value: `₹${customers.reduce((sum, c) => sum + c.outstandingAmount, 0).toLocaleString()}`, icon: CurrencyRupeeIcon, color: 'yellow' },
  ];

  const totalSales = customers.reduce((sum, c) => sum + c.totalSales, 0);

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
      accessor: (row) => `₹${row.creditLimit.toLocaleString()}`,
      align: 'right',
    },
    {
      id: 'outstanding',
      header: 'Outstanding',
      accessor: (row) => (
        <div className={`font-semibold text-right ${row.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
          ₹{row.outstandingAmount.toLocaleString()}
        </div>
      ),
      align: 'right',
    },
    {
      id: 'totalSales',
      header: 'Total Sales',
      accessor: (row) => `₹${row.totalSales.toLocaleString()}`,
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

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || c.customerId.toLowerCase().includes(searchQuery.toLowerCase()) || (c.businessName?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'ALL' || c.customerType === filterType;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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
        {stats.map((stat, index) => (
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
          <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">₹{totalSales.toLocaleString()}</p>
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customers ({filteredCustomers.length})</h2>
        <Table columns={columns} data={filteredCustomers} />
      </Card>
    </div>
  );
};

export default CustomersPage;
