import { useState } from 'react';
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

const MilkCollectionListPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data
  const collections: MilkCollection[] = [
    {
      id: '1',
      farmerId: 'FM001',
      farmerName: 'Ramesh Kumar',
      date: new Date().toISOString(),
      shift: 'MORNING',
      quantity: 25,
      fat: 4.5,
      snf: 8.5,
      temperature: 4,
      quality: 'EXCELLENT',
      status: 'ACCEPTED',
      collectedBy: 'John Doe',
      centerId: 'C001',
      amount: 1250,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      farmerId: 'FM002',
      farmerName: 'Suresh Patel',
      date: new Date().toISOString(),
      shift: 'MORNING',
      quantity: 30,
      fat: 4.8,
      snf: 8.8,
      temperature: 4,
      quality: 'EXCELLENT',
      status: 'ACCEPTED',
      collectedBy: 'John Doe',
      centerId: 'C001',
      amount: 1560,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      farmerId: 'FM003',
      farmerName: 'Mahesh Singh',
      date: new Date().toISOString(),
      shift: 'MORNING',
      quantity: 20,
      fat: 3.8,
      snf: 7.9,
      temperature: 6,
      quality: 'AVERAGE',
      status: 'REJECTED',
      reason: 'High temperature',
      collectedBy: 'John Doe',
      centerId: 'C001',
      amount: 0,
      createdAt: new Date().toISOString(),
    },
  ];

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
          ₹{row.amount.toLocaleString()}
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

  const stats = {
    totalQuantity: collections.reduce((sum, c) => sum + c.quantity, 0),
    accepted: collections.filter((c) => c.status === 'ACCEPTED').length,
    rejected: collections.filter((c) => c.status === 'REJECTED').length,
    totalAmount: collections
      .filter((c) => c.status === 'ACCEPTED')
      .reduce((sum, c) => sum + c.amount, 0),
  };

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
            label: 'Total Quantity',
            value: `${stats.totalQuantity} L`,
            color: 'text-blue-600',
            icon: <HiClock className="w-5 h-5" />,
          },
          {
            label: 'Accepted',
            value: stats.accepted,
            color: 'text-green-600',
            icon: <HiCheckCircle className="w-5 h-5" />,
          },
          {
            label: 'Rejected',
            value: stats.rejected,
            color: 'text-red-600',
            icon: <HiXCircle className="w-5 h-5" />,
          },
          {
            label: 'Total Amount',
            value: `₹${stats.totalAmount.toLocaleString()}`,
            color: 'text-green-600',
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
              {collections.map((collection) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MilkCollectionListPage;
