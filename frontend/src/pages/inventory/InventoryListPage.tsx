import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import type { InventoryItem, Column } from '../../types';
import dayjs from 'dayjs';

const InventoryListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Mock data
  const items: InventoryItem[] = [
    {
      id: '1',
      itemCode: 'CF-001',
      itemName: 'Cattle Feed - Protein Rich',
      category: 'CATTLE_FEED',
      unit: 'Kg',
      currentStock: 2500,
      minStock: 1000,
      maxStock: 5000,
      unitPrice: 25,
      totalValue: 62500,
      supplierName: 'Agri Feeds Ltd',
      supplierId: 'SUP-001',
      location: 'Warehouse A - Section 1',
      lastRestocked: '2024-02-10',
      status: 'IN_STOCK',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      itemCode: 'MED-015',
      itemName: 'Antibiotic Injection - 100ml',
      category: 'MEDICINE',
      unit: 'Bottle',
      currentStock: 45,
      minStock: 50,
      maxStock: 200,
      unitPrice: 350,
      totalValue: 15750,
      supplierName: 'VetCare Pharma',
      supplierId: 'SUP-012',
      location: 'Medical Storage - Refrigerated',
      expiryDate: '2024-12-31',
      batchNumber: 'BATCH-2024-A123',
      lastRestocked: '2024-02-01',
      status: 'LOW_STOCK',
      createdAt: '2023-12-15T00:00:00Z',
    },
    {
      id: '3',
      itemCode: 'EQ-023',
      itemName: 'Milk Can - 40 Liters',
      category: 'EQUIPMENT',
      unit: 'Piece',
      currentStock: 150,
      minStock: 100,
      maxStock: 300,
      unitPrice: 1200,
      totalValue: 180000,
      supplierName: 'Steel Industries',
      supplierId: 'SUP-008',
      location: 'Equipment Store',
      lastRestocked: '2024-01-15',
      status: 'IN_STOCK',
      createdAt: '2023-11-01T00:00:00Z',
    },
    {
      id: '4',
      itemCode: 'PKG-007',
      itemName: 'Milk Packets - 500ml',
      category: 'PACKAGING',
      unit: 'Packet',
      currentStock: 0,
      minStock: 10000,
      maxStock: 50000,
      unitPrice: 0.5,
      totalValue: 0,
      supplierName: 'PackCo Solutions',
      supplierId: 'SUP-019',
      location: 'Packaging Store',
      lastRestocked: '2024-01-20',
      status: 'OUT_OF_STOCK',
      createdAt: '2023-10-01T00:00:00Z',
    },
    {
      id: '5',
      itemCode: 'MED-008',
      itemName: 'Vitamin Supplement',
      category: 'MEDICINE',
      unit: 'Bottle',
      currentStock: 25,
      minStock: 20,
      maxStock: 100,
      unitPrice: 450,
      totalValue: 11250,
      supplierName: 'VetCare Pharma',
      supplierId: 'SUP-012',
      location: 'Medical Storage',
      expiryDate: '2024-02-15',
      batchNumber: 'BATCH-2023-B456',
      lastRestocked: '2023-08-10',
      status: 'EXPIRED',
      createdAt: '2023-08-01T00:00:00Z',
    },
  ];

  const stats = [
    {
      label: 'Total Items',
      value: items.length.toString(),
      change: 'active',
      changeType: 'neutral' as const,
      icon: CubeIcon,
      color: 'blue',
    },
    {
      label: 'In Stock',
      value: items.filter((i) => i.status === 'IN_STOCK').length.toString(),
      change: 'healthy',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'Low Stock',
      value: items.filter((i) => i.status === 'LOW_STOCK').length.toString(),
      change: 'needs attention',
      changeType: 'neutral' as const,
      icon: ExclamationTriangleIcon,
      color: 'yellow',
    },
    {
      label: 'Out of Stock',
      value: items.filter((i) => i.status === 'OUT_OF_STOCK' || i.status === 'EXPIRED').length.toString(),
      change: 'critical',
      changeType: 'negative' as const,
      icon: XCircleIcon,
      color: 'red',
    },
  ];

  const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);

  const columns: Column<InventoryItem>[] = [
    {
      id: 'itemCode',
      header: 'Item Code',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/dashboard/inventory/${row.id}`)}
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {row.itemCode}
        </button>
      ),
    },
    {
      id: 'itemName',
      header: 'Item Name',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.itemName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {row.location}
          </div>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      accessor: (row) => (
        <Badge variant="secondary">
          {row.category.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      id: 'stock',
      header: 'Stock',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.currentStock.toLocaleString()} {row.unit}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Min: {row.minStock} | Max: {row.maxStock}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'value',
      header: 'Value',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            ₹{row.totalValue.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            @ ₹{row.unitPrice}/{row.unit}
          </div>
        </div>
      ),
      align: 'right',
    },
    {
      id: 'supplier',
      header: 'Supplier',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/dashboard/inventory/suppliers/${row.supplierId}`)}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {row.supplierName}
        </button>
      ),
    },
    {
      id: 'lastRestocked',
      header: 'Last Restocked',
      accessor: (row) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {dayjs(row.lastRestocked).format('DD MMM YYYY')}
        </div>
      ),
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge
          variant={
            row.status === 'IN_STOCK'
              ? 'success'
              : row.status === 'LOW_STOCK'
                ? 'warning'
                : 'error'
          }
        >
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/dashboard/inventory/${row.id}/adjust`)}
          >
            Adjust
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(`/dashboard/inventory/${row.id}`)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExport = () => {
    console.log('Exporting inventory data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage feed store and inventory items
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/dashboard/inventory/purchase-orders')}>
            Purchase Orders
          </Button>
          <Button onClick={() => navigate('/dashboard/inventory/suppliers')}>
            Suppliers
          </Button>
          <Button onClick={() => navigate('/dashboard/inventory/new')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
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
                        : stat.changeType === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-600'
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

      {/* Total Inventory Value */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total Inventory Value
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-100">
              ₹{totalValue.toLocaleString()}
            </p>
          </div>
          <CubeIcon className="h-12 w-12 text-blue-600 dark:text-blue-400 opacity-50" />
        </div>
      </Card>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by item name, code, or supplier..."
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
              { value: 'CATTLE_FEED', label: 'Cattle Feed' },
              { value: 'MEDICINE', label: 'Medicine' },
              { value: 'EQUIPMENT', label: 'Equipment' },
              { value: 'PACKAGING', label: 'Packaging' },
              { value: 'CLEANING', label: 'Cleaning' },
              { value: 'OTHER', label: 'Other' },
            ]}
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'IN_STOCK', label: 'In Stock' },
              { value: 'LOW_STOCK', label: 'Low Stock' },
              { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
              { value: 'EXPIRED', label: 'Expired' },
            ]}
          />
        </div>
      </Card>

      {/* Inventory Table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory Items ({filteredItems.length})
          </h2>
        </div>
        <Table columns={columns} data={filteredItems} />
      </Card>
    </div>
  );
};

export default InventoryListPage;
