import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import type { Column } from '../../types';
import {
  HiCreditCard,
  HiDocumentText,
  HiChartBar,
  HiCurrencyRupee,
} from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Share {
  id: string;
  shareNumber: string;
  shareCount: number;
  shareValue: number;
  totalValue: number;
  purchaseDate: string;
  certificateNumber?: string;
  status: 'ACTIVE' | 'TRANSFERRED' | 'REDEEMED';
}

interface Dividend {
  year: number;
  shareCount: number;
  dividendRate: number;
  grossDividend: number;
  tax: number;
  netDividend: number;
  paymentDate?: string;
  status: 'PENDING' | 'PAID';
}

const SharesPage = () => {
  const [loading, setLoading] = useState(true);
  const [shares, setShares] = useState<Share[]>([]);
  const [dividends, setDividends] = useState<Dividend[]>([]);

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farmer-portal/shares');
      if (response.data.success) {
        setShares(response.data.data.shares || []);
        setDividends(response.data.data.dividends || []);
      }
    } catch (error) {
      toast.error('Failed to load shares');
    } finally {
      setLoading(false);
    }
  };

  const shareColumns: Column<Share>[] = [
    {
      id: 'shareNumber',
      header: 'Share #',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{row.shareNumber}</p>
          {row.certificateNumber && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cert: {row.certificateNumber}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'count',
      header: 'Share Count',
      accessor: (row) => (
        <span className="font-medium text-slate-900 dark:text-white">{row.shareCount}</span>
      ),
    },
    {
      id: 'value',
      header: 'Share Value',
      accessor: (row) => `KSh ${row.shareValue.toLocaleString()}`,
    },
    {
      id: 'total',
      header: 'Total Value',
      accessor: (row) => (
        <span className="font-bold text-slate-900 dark:text-white">
          KSh {row.totalValue.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'purchaseDate',
      header: 'Purchase Date',
      accessor: (row) => new Date(row.purchaseDate).toLocaleDateString(),
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
              : 'warning'
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  const dividendColumns: Column<Dividend>[] = [
    {
      id: 'year',
      header: 'Year',
      accessor: (row) => (
        <span className="font-medium text-slate-900 dark:text-white">{row.year}</span>
      ),
    },
    {
      id: 'shares',
      header: 'Shares',
      accessor: (row) => row.shareCount,
    },
    {
      id: 'rate',
      header: 'Dividend Rate',
      accessor: (row) => `${row.dividendRate}%`,
    },
    {
      id: 'gross',
      header: 'Gross Dividend',
      accessor: (row) => `KSh ${row.grossDividend.toLocaleString()}`,
    },
    {
      id: 'tax',
      header: 'Tax',
      accessor: (row) => (
        <span className="text-red-600 dark:text-red-400">
          KSh {row.tax.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'net',
      header: 'Net Dividend',
      accessor: (row) => (
        <span className="font-bold text-green-600 dark:text-green-400">
          KSh {row.netDividend.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <div>
          <Badge variant={row.status === 'PAID' ? 'success' : 'warning'}>
            {row.status}
          </Badge>
          {row.paymentDate && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {new Date(row.paymentDate).toLocaleDateString()}
            </p>
          )}
        </div>
      ),
    },
  ];

  const totalShares = shares.reduce((sum, s) => sum + s.shareCount, 0);
  const totalValue = shares.reduce((sum, s) => sum + s.totalValue, 0);
  const totalDividends = dividends.reduce((sum, d) => d.status === 'PAID' ? sum + d.netDividend : sum, 0);
  const pendingDividends = dividends.reduce((sum, d) => d.status === 'PENDING' ? sum + d.netDividend : sum, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Shares</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          View your share holdings and dividend history
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Shares', value: totalShares, icon: HiCreditCard, color: 'primary' },
          { label: 'Total Value', value: `KSh ${totalValue.toLocaleString()}`, icon: HiCurrencyRupee, color: 'success' },
          { label: 'Total Dividends', value: `KSh ${totalDividends.toLocaleString()}`, icon: HiChartBar, color: 'info' },
          { label: 'Pending Dividends', value: `KSh ${pendingDividends.toLocaleString()}`, icon: HiDocumentText, color: 'warning' },
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
          <CardTitle>Share Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : shares.length > 0 ? (
            <Table columns={shareColumns as any} data={shares as any} />
          ) : (
            <div className="text-center py-12">
              <HiCreditCard className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No shares found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dividend History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : dividends.length > 0 ? (
            <Table columns={dividendColumns as any} data={dividends as any} />
          ) : (
            <div className="text-center py-12">
              <HiDocumentText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No dividends found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SharesPage;
