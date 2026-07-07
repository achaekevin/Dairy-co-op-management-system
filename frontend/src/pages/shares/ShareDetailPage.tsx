import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PrinterIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Autocomplete from '../../components/ui/Autocomplete';
import type { Share } from '../../types';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const ShareDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [transferFormData, setTransferFormData] = useState({
    transferToFarmerId: '',
    transferDate: dayjs().format('YYYY-MM-DD'),
    reason: '',
  });

  // Mock data
  const share: Share = {
    id: id || '1',
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
  };

  // Mock eligible farmers for transfer
  const eligibleFarmers = [
    { id: 'F-012', name: 'Suresh Patel' },
    { id: 'F-023', name: 'Amit Singh' },
    { id: 'F-045', name: 'Vijay Sharma' },
    { id: 'F-067', name: 'Ramesh Verma' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleTransfer = () => {
    if (!transferFormData.transferToFarmerId) {
      toast.error('Please select a farmer to transfer shares to');
      return;
    }

    toast.success('Share transfer initiated successfully!');
    setShowTransferModal(false);
    navigate('/dashboard/shares');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/shares')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {share.shareNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Share certificate details
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {share.status === 'ACTIVE' && (
            <Button onClick={() => setShowTransferModal(true)}>
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Transfer Shares
            </Button>
          )}
          <Button variant="outline" onClick={handlePrint}>
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print Certificate
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg p-6 ${
          share.status === 'ACTIVE'
            ? 'bg-green-50 dark:bg-green-900/20'
            : share.status === 'TRANSFERRED'
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : 'bg-gray-50 dark:bg-gray-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                share.status === 'ACTIVE'
                  ? 'bg-green-100 dark:bg-green-800'
                  : share.status === 'TRANSFERRED'
                    ? 'bg-blue-100 dark:bg-blue-800'
                    : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <DocumentTextIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {share.shareCount} Shares
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                @ ₹{share.shareValue.toLocaleString()} per share
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant={
                share.status === 'ACTIVE'
                  ? 'success'
                  : share.status === 'TRANSFERRED'
                    ? 'info'
                    : 'secondary'
              }
              size="lg"
            >
              {share.status}
            </Badge>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Total Value: ₹{share.totalValue.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shareholder Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Shareholder Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <UserIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Shareholder Name
                  </p>
                  <button
                    onClick={() => navigate(`/dashboard/farmers/${share.farmerId}`)}
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {share.farmerName}
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Farmer ID</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {share.farmerId}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Purchase Date
                  </p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {dayjs(share.purchaseDate).format('DD MMMM YYYY')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Certificate Number
                  </p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {share.certificateNumber || 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Share Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">
                  Number of Shares
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {share.shareCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">
                  Par Value per Share
                </span>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  ₹{share.shareValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  Total Investment
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{share.totalValue.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Transfer History */}
          {share.transferDate && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Transfer History
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Transferred
                    </p>
                    <Badge variant="info" size="sm">
                      {dayjs(share.transferDate).format('DD MMM YYYY')}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Shares transferred to farmer: {share.transferredTo}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Redemption Info */}
          {share.redemptionDate && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Redemption Information
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Redeemed
                  </p>
                  <Badge variant="secondary" size="sm">
                    {dayjs(share.redemptionDate).format('DD MMM YYYY')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Shares have been redeemed and amount credited to farmer
                </p>
              </div>
            </Card>
          )}

          {/* Benefits & Rights */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Shareholder Benefits & Rights
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Dividend Rights
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Eligible for annual profit distribution based on shareholding
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-900 dark:text-purple-100">
                    Voting Rights
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    One vote per share in cooperative general meetings
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Transfer Rights
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Can transfer shares to other members after 1-year lock-in
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">
                    Redemption Rights
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Can redeem shares at par value as per cooperative bylaws
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Financial Summary
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CurrencyRupeeIcon className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Current Value
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{share.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-green-700 dark:text-green-300 mb-1">
                  Estimated Annual Dividend
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  ₹{Math.round(share.totalValue * 0.08).toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  @ 8% dividend rate
                </p>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Share Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Share Purchased
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {dayjs(share.purchaseDate).format('DD MMM YYYY')}
                  </p>
                </div>
              </div>
              {share.certificateNumber && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-600"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Certificate Issued
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {share.certificateNumber}
                    </p>
                  </div>
                </div>
              )}
              {share.transferDate && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-purple-600"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Share Transferred
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(share.transferDate).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
              )}
              {share.redemptionDate && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-gray-600"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Share Redeemed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(share.redemptionDate).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/dashboard/farmers/${share.farmerId}`)}
              >
                View Shareholder Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handlePrint}
              >
                Download Certificate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/dashboard/shares')}
              >
                View All Shares
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Transfer Shares"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTransfer();
          }}
          className="space-y-4"
        >
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-4">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              <span className="font-medium">Note:</span> Share transfers are subject to
              1-year lock-in period from purchase date and require board approval.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transfer To (Farmer) *
            </label>
            <Autocomplete
              options={eligibleFarmers.map((f) => ({
                value: f.id,
                label: `${f.name} (${f.id})`,
              }))}
              value={transferFormData.transferToFarmerId}
              onChange={(value) =>
                setTransferFormData({ ...transferFormData, transferToFarmerId: value })
              }
              placeholder="Search farmer..."
            />
          </div>
          <Input
            label="Transfer Date"
            type="date"
            value={transferFormData.transferDate}
            onChange={(e) =>
              setTransferFormData({
                ...transferFormData,
                transferDate: e.target.value,
              })
            }
            required
          />
          <Input
            label="Reason for Transfer"
            value={transferFormData.reason}
            onChange={(e) =>
              setTransferFormData({ ...transferFormData, reason: e.target.value })
            }
            placeholder="Enter reason for share transfer"
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Transfer Shares
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowTransferModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShareDetailPage;
