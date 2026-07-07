import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import type { Share, Column } from '../../types';
import dayjs from 'dayjs';

const SharesListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Mock data
  const shares: Share[] = [
    {
      id: '1',
      shareNumber: 'SH-2024-001',
      farmerId: 'F-001',
      farmerName: 'Rajesh Kumar',
      shareCount: 10,
      shareValue: 1000,
      totalValue: 10000,
      purchaseDate: '2024-01-15',
      status: 'ACTIVE',
      certificateNumber: 'CERT-2024-001',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      shareNumber: 'SH-2024-002',
      farmerId: 'F-012',
      farmerName: 'Suresh Patel',
      shareCount: 15,
      shareValue: 1000,
      totalValue: 15000,
      purchaseDate: '2024-01-20',
      status: 'ACTIVE',
      certificateNumber: 'CERT-2024-002',
      createdAt: '2024-01-20T11:00:00Z',
    },
    {
      id: '3',
      shareNumber: 'SH-2024-003',
      farmerId: 'F-023',
      farmerName: 'Amit Singh',
      shareCount: 20,
      shareValue: 1000,
      totalValue: 20000,
      purchaseDate: '2024-01-25',
      status: 'ACTIVE',
      certificateNumber: 'CERT-2024-003',
      createdAt: '2024-01-25T14:00:00Z',
    },
    {
      id: '4',
      shareNumber: 'SH-2023-045',
      farmerId: 'F-045',
      farmerName: 'Vijay Sharma',
      shareCount: 8,
      shareValue: 1000,
      totalValue: 8000,
      purchaseDate: '2023-06-10',
      status: 'TRANSFERRED',
      certificateNumber: 'CERT-2023-045',
      transferredTo: 'F-067',
      transferDate: '2024-02-01',
      createdAt: '2023-06-10T09:00:00Z',
    },
    {
      id: '5',
      shareNumber: 'SH-2023-012',
      farmerId: 'F-089',
      farmerName: 'Ramesh Verma',
      shareCount: 5,
      shareValue: 1000,
      totalValue: 5000,
      purchaseDate: '2023-03-15',
      status: 'REDEEMED',
      certificateNumber: 'CERT-2023-012',
      redemptionDate: '2024-01-30',
      createdAt: '2023-03-15T12:00:00Z',
    },
  ];

  const stats = [
    {
      label: 'Total Share Capital',
      value: 'KSh 5,80,000',
      change: '+8.5%',
      changeType: 'positive' as const,
      icon: CurrencyRupeeIcon,
      color: 'blue',
    },
    {
      label: 'Active Shares',
      value: '450',
      change: '77.6%',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'Total Shareholders',
      value: '85',
      change: '+5',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
      color: 'purple',
    },
    {
      label: 'Avg Holding',
      value: '5.3',
      change: 'shares/farmer',
      changeType: 'neutral' as const,
      icon: DocumentTextIcon,
      color: 'yellow',
    },
  ];

  const columns: Column<Share>[] = [
    {
      id: 'shareNumber',
      header: 'Share Number',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/dashboard/shares/${row.id}`)}
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {row.shareNumber}
        </button>
      ),
    },
    {
      id: 'farmer',
      header: 'Shareholder',
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
      id: 'shares',
      header: 'Share Details',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {row.shareCount} Shares
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            @ KSh {row.shareValue.toLocaleString()} each
          </div>
        </div>
      ),
    },
    {
      id: 'totalValue',
      header: 'Total Value',
      accessor: (row) => (
        <div className="font-semibold text-gray-900 dark:text-white">
          KSh {row.totalValue.toLocaleString()}
        </div>
      ),
    },
    {
      id: 'certificate',
      header: 'Certificate',
      accessor: (row) => (
        <div className="text-sm">
          {row.certificateNumber ? (
            <>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {row.certificateNumber}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Issued</div>
            </>
          ) : (
            <span className="text-gray-400">Pending</span>
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
              : row.status === 'TRANSFERRED'
                ? 'info'
                : 'secondary'
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
            <span className="text-gray-600 dark:text-gray-400">Purchase: </span>
            <span className="text-gray-900 dark:text-gray-100">
              {dayjs(row.purchaseDate).format('DD MMM YYYY')}
            </span>
          </div>
          {row.transferDate && (
            <div>
              <span className="text-blue-600 dark:text-blue-400">Transfer: </span>
              <span className="text-gray-900 dark:text-gray-100">
                {dayjs(row.transferDate).format('DD MMM YYYY')}
              </span>
            </div>
          )}
          {row.redemptionDate && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Redeemed: </span>
              <span className="text-gray-900 dark:text-gray-100">
                {dayjs(row.redemptionDate).format('DD MMM YYYY')}
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
          onClick={() => navigate(`/dashboard/shares/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const filteredShares = shares.filter((share) => {
    const matchesSearch =
      share.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      share.farmerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      share.shareNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      share.certificateNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || share.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    console.log('Exporting shares data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Share Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage cooperative shares and capital
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/dashboard/shares/purchase')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Purchase Shares
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
              placeholder="Search by farmer name, ID, share number, or certificate..."
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
              { value: 'ACTIVE', label: 'Active' },
              { value: 'TRANSFERRED', label: 'Transferred' },
              { value: 'REDEEMED', label: 'Redeemed' },
            ]}
          />
        </div>
      </Card>

      {/* Share Capital Info */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Share Capital Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Par Value per Share</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  KSh 1,000
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Minimum Purchase
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  5 Shares
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Maximum Holding</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  50 Shares
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Shares Table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Share Holdings ({filteredShares.length})
          </h2>
        </div>
        <Table columns={columns} data={filteredShares} />
      </Card>
    </div>
  );
};

export default SharesListPage;
