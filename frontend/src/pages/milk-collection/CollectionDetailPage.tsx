import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowLeft,
  HiPrinter,
  HiCheckCircle,
  HiXCircle,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Divider from '../../components/ui/Divider';
import type { MilkCollection } from '../../types';

const CollectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const collection: MilkCollection = {
    id: id || '1',
    farmerId: 'FM001',
    farmerName: 'Joseph Kamau',
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
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/milk-collection')}
          >
            <HiArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Collection Details
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              View collection record details
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handlePrint}>
          <HiPrinter className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {collection.status === 'ACCEPTED' ? (
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <HiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <HiXCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Collection {collection.status}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Collection ID: {collection.id}
                </p>
              </div>
            </div>
            <Badge
              variant={
                collection.quality === 'EXCELLENT'
                  ? 'success'
                  : collection.quality === 'GOOD'
                  ? 'primary'
                  : collection.quality === 'AVERAGE'
                  ? 'warning'
                  : 'error'
              }
              className="text-lg px-4 py-2"
            >
              {collection.quality}
            </Badge>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farmer Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Farmer Information
            </h3>
            <div className="space-y-3">
              <InfoRow label="Farmer Name" value={collection.farmerName} />
              <InfoRow label="Farmer ID" value={collection.farmerId} />
            </div>
          </Card>
        </motion.div>

        {/* Collection Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Collection Information
            </h3>
            <div className="space-y-3">
              <InfoRow
                label="Date"
                value={new Date(collection.date).toLocaleDateString()}
              />
              <InfoRow label="Shift" value={collection.shift} />
              <InfoRow label="Center ID" value={collection.centerId} />
              <InfoRow label="Collected By" value={collection.collectedBy} />
            </div>
          </Card>
        </motion.div>

        {/* Quality Parameters */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Quality Parameters
            </h3>
            <div className="space-y-4">
              <QualityMetric
                label="Fat Content"
                value={`${collection.fat}%`}
                status={collection.fat >= 4.5 ? 'excellent' : 'good'}
              />
              <QualityMetric
                label="SNF Content"
                value={`${collection.snf}%`}
                status={collection.snf >= 8.5 ? 'excellent' : 'good'}
              />
              <QualityMetric
                label="Temperature"
                value={`${collection.temperature}°C`}
                status={collection.temperature <= 4 ? 'excellent' : 'warning'}
              />
            </div>
          </Card>
        </motion.div>

        {/* Payment Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Payment Information
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Quantity
                  </span>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {collection.quantity} L
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Rate per Liter
                  </span>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    KSh {(collection.amount / collection.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <Divider />

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  KSh {collection.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Rejection Reason (if rejected) */}
      {collection.status === 'REJECTED' && collection.reason && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
              Rejection Reason
            </h3>
            <p className="text-red-700 dark:text-red-300">
              {collection.reason}
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
    <span className="text-sm font-medium text-slate-900 dark:text-white">
      {value}
    </span>
  </div>
);

const QualityMetric = ({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: 'excellent' | 'good' | 'warning';
}) => {
  const statusColors = {
    excellent: 'text-green-600 dark:text-green-400',
    good: 'text-blue-600 dark:text-blue-400',
    warning: 'text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <span className="text-sm text-slate-600 dark:text-slate-400">
        {label}
      </span>
      <span className={`text-lg font-bold ${statusColors[status]}`}>
        {value}
      </span>
    </div>
  );
};

export default CollectionDetailPage;
