import { useState, useEffect } from 'react';
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
import Pagination from '../../components/ui/Pagination';
import type { InventoryItem, Column } from '../../types';
import dayjs from 'dayjs';
import { inventoryService } from '../../services/inventoryService';
import toast from 'react-hot-toast';

const InventoryListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
  });

  useEffect(() => {
    fetchItems();
  }, [currentPage, searchQuery, filterCategory, filterStatus]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await inventoryService.getAll({
        search: searchQuery || undefined,
        category: filterCategory !== 'ALL' ? filterCategory : undefined,
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
        page: currentPage,
        pageSize: 10,
      });
      if (response.success) {
        setItems(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await inventoryService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const statsData = [
    {
      label: 'Total Items',
      value: stats.totalItems.toString(),
      change: 'active',
      changeType: 'neutral' as const,
      icon: CubeIcon,
      color: 'blue',
    },
    {
      label: 'In Stock',
      value: (stats.totalItems - stats.lowStockItems - stats.outOfStockItems).toString(),
      change: 'healthy',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'Low Stock',
      value: stats.lowStockItems.toString(),
      change: 'needs attention',
      changeType: 'neutral' as const,
      icon: ExclamationTriangleIcon,
      color: 'yellow',
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStockItems.toString(),
      change: 'critical',
      changeType: 'negative' as const,
      icon: XCircleIcon,
      color: 'red',
    },
  ];

  const totalValue = stats.totalValue;

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
            KSh {row.totalValue.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            @ KSh {row.unitPrice}/{row.unit}
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
        {statsData.map((stat, index) => (
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
              KSh {totalValue.toLocaleString()}
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
            Inventory Items ({items.length})
          </h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : items.length > 0 ? (
          <Table columns={columns} data={items} />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No items found</p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {items.length > 0 && totalPages > 1 && (
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

export default InventoryListPage;
