import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import type { Column } from '../../types';
import {
  HiMagnifyingGlass,
  HiDocumentArrowDown,
  HiCalendar,
  HiBeaker,
} from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Delivery {
  id: string;
  date: string;
  shift: 'MORNING' | 'EVENING';
  quantity: number;
  fat: number;
  snf: number;
  quality: string;
  rate: number;
  amount: number;
  status: 'ACCEPTED' | 'REJECTED';
  reason?: string;
}

const DeliveriesPage = () => {
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterShift, setFilterShift] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDeliveries();
  }, [page, filterShift, filterStatus]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farmer-portal/deliveries', {
        params: {
          page,
          limit: 20,
          shift: filterShift !== 'ALL' ? filterShift : undefined,
          status: filterStatus !== 'ALL' ? filterStatus : undefined,
        },
      });
      if (response.data.success) {
        setDeliveries(response.data.data.data || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (collectionId: string) => {
    try {
      const response = await api.get(`/farmer-portal/receipts/${collectionId}`);
      if (response.data.success) {
        toast.success('Receipt downloaded successfully');
      }
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  const columns: Column<Delivery>[] = [
    {
      id: 'date',
      header: 'Date',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {new Date(row.date).toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {row.shift}
          </p>
        </div>
      ),
    },
    {
      id: 'quantity',
      header: 'Quantity (L)',
      accessor: (row) => (
        <span className="font-medium text-slate-900 dark:text-white">{row.quantity}</span>
      ),
    },
    {
      id: 'quality',
      header: 'Quality',
      accessor: (row) => (
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{row.quality}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fat: {row.fat}% | SNF: {row.snf}%
          </p>
        </div>
      ),
    },
    {
      id: 'rate',
      header: 'Rate (KSh/L)',
      accessor: (row) => `KSh ${row.rate}`,
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: (row) => (
        <span className="font-bold text-slate-900 dark:text-white">
          KSh {row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <div>
          <Badge variant={row.status === 'ACCEPTED' ? 'success' : 'error'}>
            {row.status}
          </Badge>
          {row.reason && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{row.reason}</p>
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
          onClick={() => handleDownloadReceipt(row.id)}
        >
          <HiDocumentArrowDown className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalDeliveries: deliveries.length,
    totalQuantity: deliveries.reduce((sum, d) => sum + d.quantity, 0),
    totalEarnings: deliveries.reduce((sum, d) => sum + d.amount, 0),
    acceptedRate: deliveries.length > 0 
      ? ((deliveries.filter(d => d.status === 'ACCEPTED').length / deliveries.length) * 100).toFixed(1)
      : 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Milk Deliveries</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Track your milk delivery history and download receipts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Deliveries', value: stats.totalDeliveries, icon: HiBeaker, color: 'primary' },
          { label: 'Total Quantity', value: `${stats.totalQuantity} L`, icon: HiBeaker, color: 'secondary' },
          { label: 'Total Earnings', value: `KSh ${stats.totalEarnings.toLocaleString()}`, icon: HiBeaker, color: 'success' },
          { label: 'Acceptance Rate', value: `${stats.acceptedRate}%`, icon: HiBeaker, color: 'info' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-full p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by date..."
                className="pl-10"
              />
            </div>
            <Select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Shifts' },
                { value: 'MORNING', label: 'Morning' },
                { value: 'EVENING', label: 'Evening' },
              ]}
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: 'ACCEPTED', label: 'Accepted' },
                { value: 'REJECTED', label: 'Rejected' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Delivery History</CardTitle>
            <Button variant="outline" size="sm">
              <HiDocumentArrowDown className="w-4 h-4 mr-2" />
              Export Statement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredDeliveries.length > 0 ? (
            <>
              <Table columns={columns} data={filteredDeliveries} />
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <HiCalendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No deliveries found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveriesPage;
