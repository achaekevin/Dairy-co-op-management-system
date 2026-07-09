import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiPlus,
  HiArrowDownTray,
  HiEye,
  HiXCircle,
  HiCheckCircle,
  HiClock,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import Card from '../../components/ui/Card';
import DatePicker from '../../components/ui/DatePicker';
import type { MilkCollection, Column } from '../../types';
import { milkCollectionService } from '../../services/milkCollectionService';
import toast from 'react-hot-toast';

const MilkCollectionListPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [collections, setCollections] = useState<MilkCollection[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCollections: 0,
    todayCollections: 0,
    totalQuantity: 0,
    todayQuantity: 0,
  });

  useEffect(() => {
    fetchCollections();
  }, [currentPage, shiftFilter, statusFilter, selectedDate]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const response = await milkCollectionService.getAll({
        shift: shiftFilter !== 'all' ? shiftFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        startDate: selectedDate?.toISOString(),
        endDate: selectedDate?.toISOString(),
        page: currentPage,
        pageSize: 10,
      });
      if (response.success && response.data) {
        setCollections(Array.isArray(response.data) ? response.data : []);
        setTotalPages(response.meta?.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load collections');
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await milkCollectionService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const columns: Column<MilkCollection>[] = [
    {
      id: 'farmer',
      header: 'Farmer',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {row.farmerName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {row.farmerId}
          </p>
        </div>
      ),
    },
    {
      id: 'shift',
      header: 'Shift',
      accessor: (row) => (
        <Badge variant={row.shift === 'MORNING' ? 'info' : 'warning'}>
          {row.shift}
        </Badge>
      ),
      align: 'center',
    },
    {
      id: 'quantity',
      header: 'Quantity (L)',
      accessor: (row) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {row.quantity}
        </span>
      ),
      align: 'right',
    },
    {
      id: 'fat',
      header: 'Fat %',
      accessor: (row) => (
        <span className="text-sm text-slate-900 dark:text-white">
          {row.fat.toFixed(1)}%
        </span>
      ),
      align: 'center',
    },
    {
      id: 'snf',
      header: 'SNF %',
      accessor: (row) => (
        <span className="text-sm text-slate-900 dark:text-white">
          {row.snf.toFixed(1)}%
        </span>
      ),
      align: 'center',
    },
    {
      id: 'temperature',
      header: 'Temp (°C)',
      accessor: (row) => (
        <span
          className={`text-sm font-medium ${
            row.temperature <= 4
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {row.temperature}°C
        </span>
      ),
      align: 'center',
    },
    {
      id: 'quality',
      header: 'Quality',
      accessor: (row) => (
        <Badge
          variant={
            row.quality === 'EXCELLENT'
              ? 'success'
              : row.quality === 'GOOD'
              ? 'primary'
              : row.quality === 'AVERAGE'
              ? 'warning'
              : 'error'
          }
        >
          {row.quality}
        </Badge>
      ),
      align: 'center',
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: (row) => (
        <span className="font-medium text-slate-900 dark:text-white">
          KSh {row.amount.toLocaleString()}
        </span>
      ),
      align: 'right',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <div className="flex items-center justify-center gap-2">
          {row.status === 'ACCEPTED' ? (
            <>
              <HiCheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                Accepted
              </span>
            </>
          ) : (
            <>
              <HiXCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-600">
                Rejected
              </span>
            </>
          )}
        </div>
      ),
      align: 'center',
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/dashboard/milk-collection/${row.id}`)}
        >
          <HiEye className="w-4 h-4" />
        </Button>
      ),
      align: 'center',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Milk Collection
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Record and manage daily milk collections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <HiArrowDownTray className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/milk-collection/new')}
          >
            <HiPlus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Collections",
            value: stats.todayCollections,
            color: 'text-blue-600',
            icon: <HiClock className="w-5 h-5" />,
          },
          {
            label: "Today's Quantity",
            value: `${stats.todayQuantity} L`,
            color: 'text-green-600',
            icon: <HiCheckCircle className="w-5 h-5" />,
          },
          {
            label: 'Total Collections',
            value: stats.totalCollections,
            color: 'text-purple-600',
            icon: <HiCheckCircle className="w-5 h-5" />,
          },
          {
            label: 'Total Quantity',
            value: `${stats.totalQuantity} L`,
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
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {stat.label}
              </p>
              {stat.icon && (
                <span className={stat.color}>{stat.icon}</span>
              )}
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Select date"
          />
          <Select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Shifts' },
              { value: 'MORNING', label: 'Morning' },
              { value: 'EVENING', label: 'Evening' },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'ACCEPTED', label: 'Accepted' },
              { value: 'REJECTED', label: 'Rejected' },
            ]}
          />
          <Input placeholder="Search farmer..." />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className={`px-6 py-3 text-xs font-medium uppercase text-slate-600 dark:text-slate-400 ${
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  </td>
                </tr>
              ) : collections.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <p className="text-slate-600 dark:text-slate-400">No collections found</p>
                  </td>
                </tr>
              ) : (
                collections.map((collection) => (
                  <tr
                    key={collection.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={`px-6 py-4 ${
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      {typeof col.accessor === 'function'
                        ? col.accessor(collection)
                        : collection[col.accessor as keyof MilkCollection]}
                    </td>
                  ))}
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MilkCollectionListPage;
