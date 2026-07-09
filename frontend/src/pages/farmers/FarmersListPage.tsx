import { useState, useEffect } from 'react';
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
import { farmerService } from '../../services/farmerService';
import toast from 'react-hot-toast';

const FarmersListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    farmerId: string | null;
  }>({ isOpen: false, farmerId: null });

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalFarmers: 0,
    activeFarmers: 0,
    totalCattle: 0,
    totalOutstandingLoans: 0,
  });

  // Fetch farmers
  useEffect(() => {
    fetchFarmers();
  }, [currentPage, searchQuery, statusFilter]);

  // Fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchFarmers = async () => {
    setIsLoading(true);
    try {
      const response = await farmerService.getAll({
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: currentPage,
        pageSize: 10,
      });

      if (response.success && response.data) {
        setFarmers(Array.isArray(response.data) ? response.data : []);
        setTotalPages(response.meta?.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load farmers');
      setFarmers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await farmerService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      // Silently fail for stats
    }
  };

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
          KSh {row.outstandingLoan.toLocaleString()}
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

  const handleDelete = async () => {
    if (!deleteDialog.farmerId) return;

    try {
      const response = await farmerService.delete(deleteDialog.farmerId);
      if (response.success) {
        toast.success('Farmer deleted successfully');
        fetchFarmers();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to delete farmer');
    } finally {
      setDeleteDialog({ isOpen: false, farmerId: null });
    }
  };

  const filteredFarmers = farmers;

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
            value: stats.totalFarmers,
            color: 'text-blue-600',
          },
          {
            label: 'Active',
            value: stats.activeFarmers,
            color: 'text-green-600',
          },
          {
            label: 'Total Cattle',
            value: stats.totalCattle,
            color: 'text-purple-600',
          },
          {
            label: 'Outstanding Loans',
            value: `KSh ${stats.totalOutstandingLoans.toLocaleString()}`,
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredFarmers.length > 0 ? (
          <Table<Farmer> columns={columns} data={filteredFarmers} hoverable striped />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No farmers found</p>
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard/farmers/new')}
            >
              <HiPlus className="w-4 h-4 mr-2" />
              Add First Farmer
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredFarmers.length > 0 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

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
