import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PrinterIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { QualityTest } from '../../types';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const QualityTestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Mock data
  const test: QualityTest = {
    id: id || '1',
    testNumber: 'QT-2024-001',
    date: '2024-01-15',
    time: '09:30 AM',
    sampleType: 'INCOMING_MILK',
    farmerId: 'F-001',
    farmerName: 'James Kariuki',
    testedBy: 'Lab Technician 1',
    fat: 4.2,
    snf: 8.5,
    protein: 3.2,
    lactose: 4.8,
    temperature: 4.0,
    ph: 6.7,
    acidity: 0.14,
    density: 1.029,
    alcoholTest: 'PASS',
    cob: 'PASS',
    mbrt: 4.5,
    coliformCount: 0,
    overallResult: 'PASS',
    status: 'COMPLETED',
    remarks: 'Sample quality is excellent. All parameters within acceptable range.',
    createdAt: '2024-01-15T09:30:00Z',
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApprove = () => {
    toast.success('Quality test approved successfully!');
    setShowApproveDialog(false);
    navigate('/dashboard/quality');
  };

  const handleReject = () => {
    toast.success('Quality test rejected');
    setShowRejectDialog(false);
    navigate('/dashboard/quality');
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'PASS':
        return <CheckCircleIcon className="h-12 w-12 text-green-600" />;
      case 'FAIL':
        return <XCircleIcon className="h-12 w-12 text-red-600" />;
      case 'RETEST':
        return <ExclamationTriangleIcon className="h-12 w-12 text-yellow-600" />;
      default:
        return <BeakerIcon className="h-12 w-12 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/quality')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {test.testNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Quality test details
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {test.status === 'COMPLETED' && (
            <>
              <Button variant="outline" onClick={() => setShowRejectDialog(true)}>
                <XCircleIcon className="h-5 w-5 mr-2" />
                Reject
              </Button>
              <Button onClick={() => setShowApproveDialog(true)}>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Approve
              </Button>
            </>
          )}
          <Button variant="outline" onClick={handlePrint}>
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg p-6 ${
          test.overallResult === 'PASS'
            ? 'bg-green-50 dark:bg-green-900/20'
            : test.overallResult === 'FAIL'
              ? 'bg-red-50 dark:bg-red-900/20'
              : 'bg-yellow-50 dark:bg-yellow-900/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getResultIcon(test.overallResult)}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Test Result: {test.overallResult}
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {test.overallResult === 'PASS'
                  ? 'All parameters are within acceptable range'
                  : test.overallResult === 'FAIL'
                    ? 'One or more parameters failed quality standards'
                    : 'Sample requires retesting for confirmation'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant={
                test.status === 'APPROVED'
                  ? 'success'
                  : test.status === 'REJECTED'
                    ? 'error'
                    : test.status === 'COMPLETED'
                      ? 'info'
                      : 'warning'
              }
              size="lg"
            >
              {test.status}
            </Badge>
            {test.approvedBy && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Approved by {test.approvedBy}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {dayjs(test.date).format('DD MMMM YYYY')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {test.time}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BeakerIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sample Type</p>
                  <Badge variant="info">{test.sampleType.replace(/_/g, ' ')}</Badge>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tested By</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {test.testedBy}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Source Information */}
          {test.farmerName && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Farmer Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Farmer Name</span>
                  <button
                    onClick={() => navigate(`/dashboard/farmers/${test.farmerId}`)}
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {test.farmerName}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Farmer ID</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {test.farmerId}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {test.batchNumber && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Batch Information
              </h3>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Batch Number</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {test.batchNumber}
                </span>
              </div>
            </Card>
          )}

          {/* Composition Parameters */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Composition Parameters
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Fat</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {test.fat}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">SNF</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {test.snf}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Protein</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {test.protein}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Lactose</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {test.lactose}%
                </p>
              </div>
            </div>
          </Card>

          {/* Physical & Chemical Parameters */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Physical & Chemical Parameters
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Temperature</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {test.temperature}°C
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">pH Level</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {test.ph}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Acidity</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {test.acidity}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Density</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {test.density} g/ml
                </span>
              </div>
            </div>
          </Card>

          {/* Microbiological Tests */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Microbiological Tests
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Alcohol Test</span>
                <Badge variant={test.alcoholTest === 'PASS' ? 'success' : 'error'}>
                  {test.alcoholTest}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">
                  COB (Clot on Boiling)
                </span>
                <Badge variant={test.cob === 'PASS' ? 'success' : 'error'}>
                  {test.cob}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">MBRT</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {test.mbrt} hours
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Coliform Count</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {test.coliformCount} cfu/ml
                </span>
              </div>
            </div>
          </Card>

          {/* Remarks */}
          {test.remarks && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Remarks
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{test.remarks}</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quality Standards Reference */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Quality Standards (Incoming Milk)
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-1">
                  EXCELLENT
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Fat ≥4.5%, SNF ≥8.5%
                  <br />
                  Temp ≤4°C, pH 6.6-6.7
                  <br />
                  MBRT ≥4.5 hrs
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  GOOD
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Fat ≥4.0%, SNF ≥8.0%
                  <br />
                  Temp ≤5°C, pH 6.5-6.8
                  <br />
                  MBRT ≥4.0 hrs
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  AVERAGE
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Fat ≥3.5%, SNF ≥7.5%
                  <br />
                  Temp ≤6°C, pH 6.4-6.8
                  <br />
                  MBRT ≥3.5 hrs
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-xs font-semibold text-red-900 dark:text-red-100 mb-1">
                  REJECTION CRITERIA
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Alcohol Test: FAIL
                  <br />
                  COB Test: FAIL
                  <br />
                  Coliform &gt;10 cfu/ml
                  <br />
                  MBRT &lt;3.0 hrs
                </p>
              </div>
            </div>
          </Card>

          {/* Test History */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Test Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Test Created
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {dayjs(test.createdAt).format('DD MMM YYYY, HH:mm')}
                  </p>
                </div>
              </div>
              {test.status === 'COMPLETED' && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-600"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Test Completed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(test.createdAt).format('DD MMM YYYY, HH:mm')}
                    </p>
                  </div>
                </div>
              )}
              {test.approvedBy && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-purple-600"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Approved by {test.approvedBy}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(test.approvedDate).format('DD MMM YYYY, HH:mm')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Approve Dialog */}
      <ConfirmDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={handleApprove}
        title="Approve Quality Test"
        message="Are you sure you want to approve this quality test? This action cannot be undone."
        confirmText="Approve"
      />

      {/* Reject Dialog */}
      <ConfirmDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleReject}
        title="Reject Quality Test"
        message="Are you sure you want to reject this quality test? Please provide a reason for rejection."
        confirmText="Reject"
      />
    </div>
  );
};

export default QualityTestDetailPage;
