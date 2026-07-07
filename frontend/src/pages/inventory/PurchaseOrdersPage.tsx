import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import type { PurchaseOrder, Column } from '../../types';
import dayjs from 'dayjs';

const PurchaseOrdersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Mock data
  const orders: PurchaseOrder[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      supplierId: 'SUP-001',
      supplierName: 'Agri Feeds Ltd',
      orderDate: '2024-02-10',
      expectedDelivery: '2024-02-17',
      status: 'PENDING',
      totalItems: 3,
      totalAmount: 125000,
      paidAmount: 0,
      balanceAmount: 125000,
      paymentStatus: 'UNPAID',
      createdBy: 'Admin User',
      createdAt: '2024-02-10T10:00:00Z',
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      supplierId: 'SUP-012',
      supplierName: 'VetCare Pharma',
      orderDate: '2024-02-08',
      expectedDelivery: '2024-02-15',
      actualDelivery: '2024-02-14',
      status: 'DELIVERED',
      totalItems: 5,
      totalAmount: 45000,
      paidAmount: 25000,
      balanceAmount: 20000,
      paymentStatus: 'PARTIAL',
      createdBy: 'Manager User',
      approvedBy: 'Admin User',
      createdAt: '2024-02-08T09:00:00Z',
    },
    {
      id: '3',
      poNumber: 'PO-2024-003',
      supplierId: 'SUP-019',
      supplierName: 'PackCo Solutions',
      orderDate: '2024-02-12',
      expectedDelivery: '2024-02-19',
      status: 'APPROVED',
      totalItems: 2,
      totalAmount: 85000,
      paidAmount: 0,
      balanceAmount: 85000,
      paymentStatus: 'UNPAID',
      createdBy: 'Manager User',
      approvedBy: 'Admin User',
      notes: 'Urgent requirement for packaging materials',
      createdAt: '2024-02-12T14:00:00Z',
    },
    {
      id: '4',
      poNumber: 'PO-2024-004',
      supplierId: 'SUP-008',
      supplierName: 'Steel Industries',
      orderDate: '2024-02-05',
      expectedDelivery: '2024-02-12',
      actualDelivery: '2024-02-12',
      status: 'DELIVERED',
      totalItems: 4,
      totalAmount: 96000,
      paidAmount: 96000,
      balanceAmount: 0,
      paymentStatus: 'PAID',
      createdBy: 'Admin User',
      approvedBy: 'Admin User',
      createdAt: '2024-02-05T11:00:00Z',
    },
  ];

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      icon: DocumentTextIcon,
      color: 'blue',
    },
    {
      label: 'Pending',
      value: orders.filter((o) => o.status === 'PENDING' || o.status === 'APPROVED').length.toString(),
      icon: ClockIcon,
      color: 'yellow',
    },
    {
      label: 'Delivered',
      value: orders.filter((o) => o.status === 'DELIVERED').length.toString(),
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'In Transit',
      value: orders.filter((o) => o.status === 'APPROVED').length.toString(),
      icon: TruckIcon,
      color: 'purple',
    },
  ];

  const totalOrderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalPending = orders.reduce((sum, order) => sum + order.balanceAmount, 0);

  const columns: Column<PurchaseOrder>[] = [
    {
      id: 'poNumber',
      header: 'PO Number',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/dashboard/inventory/purchase-orders/${row.id}`)}
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {row.poNumber}
        </button>
      ),
    },
    {
      id: 'supplier',
      header: 'Supplier',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/dashboard/inventory/suppliers/${row.supplierId}`)}
          className="font-medium text-gray-900 dark:text-white hover:text-blue-600"
        >
          {row.supplierName}
        </button>
      ),
    },
    {
      id: 'orderDate',
      header: 'Order Date',
      accessor: (row) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {dayjs(row.orderDate).format('DD MMM YYYY')}
        </div>
      ),
      sortable: true,
    },
    {
      id: 'delivery',
      header: 'Delivery',
      accessor: (row) => (
        <div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Expected: {dayjs(row.expectedDelivery).format('DD MMM')}
          </div>
          {row.actualDelivery && (
            <div className="text-xs text-green-600">
              Delivered: {dayjs(row.actualDelivery).format('DD MMM')}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'items',
      header: 'Items',
      accessor: (row) => (
        <div className="text-center font-medium text-gray-900 dark:text-white">
          {row.totalItems}
        </div>
      ),
      align: 'center',
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: (row) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900 dark:text-white">
            KSh {row.totalAmount.toLocaleString()}
          </div>
          {row.balanceAmount > 0 && (
            <div className="text-xs text-red-600">
              Due: KSh {row.balanceAmount.toLocaleString()}
            </div>
          )}
        </div>
      ),
      align: 'right',
    },
    {
      id: 'paymentStatus',
      header: 'Payment',
      accessor: (row) => (
        <Badge
          variant={
            row.paymentStatus === 'PAID'
              ? 'success'
              : row.paymentStatus === 'PARTIAL'
                ? 'warning'
                : 'error'
          }
        >
          {row.paymentStatus}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge
          variant={
            row.status === 'DELIVERED'
              ? 'success'
              : row.status === 'APPROVED'
                ? 'info'
                : row.status === 'CANCELLED'
                  ? 'error'
                  : 'warning'
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
          onClick={() => navigate(`/dashboard/inventory/purchase-orders/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    console.log('Exporting purchase orders...');
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
              Purchase Orders
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage inventory purchase orders
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/dashboard/inventory/purchase-orders/new')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            New Purchase Order
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
        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Total Order Value
            </p>
            <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">
              KSh {totalOrderValue.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-100">
              Pending Payments
            </p>
            <p className="mt-2 text-3xl font-bold text-red-900 dark:text-red-100">
              KSh {totalPending.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by PO number or supplier..."
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
              { value: 'DRAFT', label: 'Draft' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'DELIVERED', label: 'Delivered' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </div>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Purchase Orders ({filteredOrders.length})
          </h2>
        </div>
        <Table columns={columns} data={filteredOrders} />
      </Card>
    </div>
  );
};

export default PurchaseOrdersPage;
