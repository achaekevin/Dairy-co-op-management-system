import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import type { QualityTest, Column } from '../../types';
import dayjs from 'dayjs';

const QualityTestsListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterResult, setFilterResult] = useState('ALL');

  // Mock data
  const tests: QualityTest[] = [
    {
      id: '1',
      testNumber: 'QT-2024-001',
      date: '2024-01-15',
      time: '09:30 AM',
      sampleType: 'INCOMING_MILK',
      farmerId: 'F-001',
      farmerName: 'Rajesh Kumar',
      testedBy: 'Lab Tech 1',
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
      status: 'APPROVED',
      approvedBy: 'Quality Manager',
      approvedDate: '2024-01-15',
      createdAt: '2024-01-15T09:30:00Z',
    },
    {
      id: '2',
      testNumber: 'QT-2024-002',
      date: '2024-01-15',
      time: '06:15 PM',
      sampleType: 'INCOMING_MILK',
      farmerId: 'F-012',
      farmerName: 'Suresh Patel',
      testedBy: 'Lab Tech 2',
      fat: 3.8,
      snf: 8.2,
      protein: 3.1,
      lactose: 4.7,
      temperature: 5.5,
      ph: 6.5,
      acidity: 0.16,
      density: 1.028,
      alcoholTest: 'FAIL',
      cob: 'PASS',
      mbrt: 3.5,
      coliformCount: 5,
      overallResult: 'FAIL',
      remarks: 'Failed alcohol test, high coliform count',
      status: 'REJECTED',
      approvedBy: 'Quality Manager',
      approvedDate: '2024-01-15',
      createdAt: '2024-01-15T18:15:00Z',
    },
    {
      id: '3',
      testNumber: 'QT-2024-003',
      date: '2024-01-15',
      time: '10:00 AM',
      sampleType: 'PROCESSED_MILK',
      batchNumber: 'BATCH-2024-045',
      testedBy: 'Lab Tech 1',
      fat: 3.5,
      snf: 8.5,
      protein: 3.3,
      lactose: 4.9,
      temperature: 4.0,
      ph: 6.6,
      acidity: 0.15,
      density: 1.030,
      alcoholTest: 'PASS',
      cob: 'PASS',
      mbrt: 5.0,
      coliformCount: 0,
      overallResult: 'PASS',
      status: 'COMPLETED',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '4',
      testNumber: 'QT-2024-004',
      date: '2024-01-15',
      time: '11:30 AM',
      sampleType: 'BUTTER',
      batchNumber: 'BATCH-2024-012',
      testedBy: 'Lab Tech 2',
      fat: 80.5,
      snf: 2.0,
      protein: 0.8,
      lactose: 0.5,
      temperature: 4.0,
      ph: 6.8,
      acidity: 0.12,
      density: 0.911,
      alcoholTest: 'PASS',
      cob: 'PASS',
      mbrt: 6.0,
      coliformCount: 0,
      overallResult: 'RETEST',
      remarks: 'Slightly high acidity, requires retesting',
      status: 'PENDING',
      createdAt: '2024-01-15T11:30:00Z',
    },
  ];

  const stats = [
    {
      label: 'Total Tests Today',
      value: '24',
      change: '+8',
      changeType: 'positive' as const,
      icon: BeakerIcon,
      color: 'blue',
    },
    {
      label: 'Tests Passed',
      value: '20',
      change: '83.3%',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'Tests Failed',
      value: '3',
      change: '12.5%',
      changeType: 'negative' as const,
      icon: XCircleIcon,
      color: 'red',
    },
    {
      label: 'Pending Approval',
      value: '1',
      change: '4.2%',
      changeType: 'neutral' as const,
      icon: ClockIcon,
      color: 'yellow',
    },
  ];

  const columns: Column<QualityTest>[] = [
    {
      id: 'testNumber',
      header: 'Test Number',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/dashboard/quality/${row.id}`)}
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {row.testNumber}
        </button>
      ),
    },
    {
      id: 'date',
      header: 'Date & Time',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {dayjs(row.date).format('DD MMM YYYY')}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.time}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'sampleType',
      header: 'Sample Type',
      accessor: (row) => (
        <Badge
          variant={
            row.sampleType === 'INCOMING_MILK'
              ? 'info'
              : row.sampleType === 'PROCESSED_MILK'
                ? 'primary'
                : 'secondary'
          }
        >
          {row.sampleType.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row) => (
        <div>
          {row.farmerName ? (
            <>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {row.farmerName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{row.farmerId}</div>
            </>
          ) : row.batchNumber ? (
            <div className="text-gray-900 dark:text-gray-100">{row.batchNumber}</div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      id: 'parameters',
      header: 'Key Parameters',
      accessor: (row) => (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Fat:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{row.fat}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">SNF:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{row.snf}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600 dark:text-gray-400">Temp:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{row.temperature}°C</span>
          </div>
        </div>
      ),
    },
    {
      id: 'tests',
      header: 'Tests',
      accessor: (row) => (
        <div className="flex gap-2">
          <Badge variant={row.alcoholTest === 'PASS' ? 'success' : 'error'} size="sm">
            Alcohol: {row.alcoholTest}
          </Badge>
          <Badge variant={row.cob === 'PASS' ? 'success' : 'error'} size="sm">
            COB: {row.cob}
          </Badge>
        </div>
      ),
    },
    {
      id: 'result',
      header: 'Result',
      accessor: (row) => (
        <Badge
          variant={
            row.overallResult === 'PASS'
              ? 'success'
              : row.overallResult === 'FAIL'
                ? 'error'
                : 'warning'
          }
        >
          {row.overallResult}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge
          variant={
            row.status === 'APPROVED'
              ? 'success'
              : row.status === 'REJECTED'
                ? 'error'
                : row.status === 'COMPLETED'
                  ? 'info'
                  : 'warning'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'testedBy',
      header: 'Tested By',
      accessor: 'testedBy',
    },
  ];

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.testNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || test.sampleType === filterType;
    const matchesStatus = filterStatus === 'ALL' || test.status === filterStatus;
    const matchesResult = filterResult === 'ALL' || test.overallResult === filterResult;
    return matchesSearch && matchesType && matchesStatus && matchesResult;
  });

  const handleExport = () => {
    console.log('Exporting quality tests data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quality Control
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage quality tests and standards
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/dashboard/quality/standards')}>
            <FunnelIcon className="h-5 w-5 mr-2" />
            Standards
          </Button>
          <Button onClick={() => navigate('/dashboard/quality/new')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            New Test
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

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by test number, farmer, or batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Types' },
              { value: 'INCOMING_MILK', label: 'Incoming Milk' },
              { value: 'PROCESSED_MILK', label: 'Processed Milk' },
              { value: 'BUTTER', label: 'Butter' },
              { value: 'GHEE', label: 'Ghee' },
              { value: 'PANEER', label: 'Paneer' },
              { value: 'CURD', label: 'Curd' },
            ]}
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'REJECTED', label: 'Rejected' },
            ]}
          />
          <Select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Results' },
              { value: 'PASS', label: 'Pass' },
              { value: 'FAIL', label: 'Fail' },
              { value: 'RETEST', label: 'Retest' },
            ]}
          />
        </div>
      </Card>

      {/* Tests Table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quality Tests ({filteredTests.length})
          </h2>
        </div>
        <Table
          columns={columns}
          data={filteredTests}
        />
      </Card>
    </div>
  );
};

export default QualityTestsListPage;
