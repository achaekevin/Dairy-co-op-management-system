import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  BeakerIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import type { VeterinaryService, Column } from '../../types';
import dayjs from 'dayjs';

const VeterinaryServicesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Mock data
  const services: VeterinaryService[] = [
    {
      id: '1',
      serviceNumber: 'VET-2024-001',
      farmerId: 'F-001',
      farmerName: 'Rajesh Kumar',
      cattleId: 'C-001',
      cattleTag: 'RK-001',
      serviceType: 'VACCINATION',
      veterinarianName: 'Dr. Sharma',
      visitDate: '2024-02-15',
      diagnosis: 'Routine vaccination - FMD',
      treatment: 'FMD vaccine administered',
      medicines: 'FMD Vaccine 2ml',
      cost: 200,
      status: 'COMPLETED',
      followUpDate: '2024-08-15',
      createdAt: '2024-02-15T10:00:00Z',
    },
    {
      id: '2',
      serviceNumber: 'VET-2024-002',
      farmerId: 'F-012',
      farmerName: 'Suresh Patel',
      cattleId: 'C-045',
      cattleTag: 'SP-003',
      serviceType: 'TREATMENT',
      veterinarianName: 'Dr. Verma',
      visitDate: '2024-02-16',
      diagnosis: 'Mastitis - Left quarter',
      treatment: 'Intramammary infusion, Anti-inflammatory',
      medicines: 'Mastilone, Meloxicam',
      cost: 850,
      status: 'COMPLETED',
      followUpDate: '2024-02-20',
      notes: 'Improvement observed, continue treatment',
      createdAt: '2024-02-16T11:00:00Z',
    },
    {
      id: '3',
      serviceNumber: 'VET-2024-003',
      farmerId: 'F-023',
      farmerName: 'Amit Singh',
      cattleId: 'C-089',
      cattleTag: 'AS-002',
      serviceType: 'AI',
      veterinarianName: 'Dr. Sharma',
      visitDate: '2024-02-17',
      diagnosis: 'Artificial Insemination',
      treatment: 'AI procedure completed - HF bull semen',
      medicines: 'Oxytocin injection',
      cost: 500,
      status: 'COMPLETED',
      followUpDate: '2024-03-17',
      notes: 'Pregnancy check scheduled after 60 days',
      createdAt: '2024-02-17T09:00:00Z',
    },
    {
      id: '4',
      serviceNumber: 'VET-2024-004',
      farmerId: 'F-045',
      farmerName: 'Vijay Sharma',
      cattleId: 'C-123',
      cattleTag: 'VS-001',
      serviceType: 'CHECKUP',
      veterinarianName: 'Dr. Patel',
      visitDate: '2024-02-18',
      diagnosis: 'Routine health checkup',
      treatment: 'General examination, all parameters normal',
      cost: 300,
      status: 'SCHEDULED',
      createdAt: '2024-02-14T14:00:00Z',
    },
    {
      id: '5',
      serviceNumber: 'VET-2024-005',
      farmerId: 'F-067',
      farmerName: 'Ramesh Verma',
      cattleId: 'C-156',
      cattleTag: 'RV-004',
      serviceType: 'EMERGENCY',
      veterinarianName: 'Dr. Verma',
      visitDate: '2024-02-16',
      diagnosis: 'Bloat - Severe',
      treatment: 'Trocarization, Anti-bloat medication',
      medicines: 'Anaryl, Calcium borogluconate',
      cost: 1200,
      status: 'COMPLETED',
      notes: 'Emergency treatment successful, animal stable',
      createdAt: '2024-02-16T18:00:00Z',
    },
  ];

  const stats = [
    {
      label: 'Total Services',
      value: '248',
      change: '+15',
      changeType: 'positive' as const,
      icon: HeartIcon,
      color: 'blue',
    },
    {
      label: 'This Month',
      value: '32',
      change: '+8',
      changeType: 'positive' as const,
      icon: CalendarDaysIcon,
      color: 'green',
    },
    {
      label: 'Scheduled',
      value: '12',
      change: 'upcoming',
      changeType: 'neutral' as const,
      icon: ClockIcon,
      color: 'yellow',
    },
    {
      label: 'Vaccinations Due',
      value: '18',
      change: 'this week',
      changeType: 'neutral' as const,
      icon: BeakerIcon,
      color: 'purple',
    },
  ];

  const columns: Column<VeterinaryService>[] = [
    {
      id: 'serviceNumber',
      header: 'Service Number',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/dashboard/veterinary/${row.id}`)}
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {row.serviceNumber}
        </button>
      ),
    },
    {
      id: 'farmer',
      header: 'Farmer & Cattle',
      accessor: (row) => (
        <div>
          <button
            onClick={() => navigate(`/dashboard/farmers/${row.farmerId}`)}
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {row.farmerName}
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Tag: {row.cattleTag}
          </div>
        </div>
      ),
    },
    {
      id: 'serviceType',
      header: 'Service Type',
      accessor: (row) => (
        <Badge
          variant={
            row.serviceType === 'EMERGENCY'
              ? 'error'
              : row.serviceType === 'VACCINATION'
                ? 'success'
                : row.serviceType === 'AI'
                  ? 'info'
                  : 'primary'
          }
        >
          {row.serviceType}
        </Badge>
      ),
    },
    {
      id: 'veterinarian',
      header: 'Veterinarian',
      accessor: (row) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {row.veterinarianName}
        </div>
      ),
    },
    {
      id: 'diagnosis',
      header: 'Diagnosis',
      accessor: (row) => (
        <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
          {row.diagnosis}
        </div>
      ),
    },
    {
      id: 'visitDate',
      header: 'Visit Date',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {dayjs(row.visitDate).format('DD MMM YYYY')}
          </div>
          {row.followUpDate && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Follow-up: {dayjs(row.followUpDate).format('DD MMM')}
            </div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      id: 'cost',
      header: 'Cost',
      accessor: (row) => (
        <div className="font-semibold text-gray-900 dark:text-white">
          ₹{row.cost.toLocaleString()}
        </div>
      ),
      align: 'right',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge
          variant={
            row.status === 'COMPLETED'
              ? 'success'
              : row.status === 'SCHEDULED'
                ? 'warning'
                : 'secondary'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/dashboard/veterinary/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.farmerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.cattleTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.veterinarianName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || service.serviceType === filterType;
    const matchesStatus = filterStatus === 'ALL' || service.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleExport = () => {
    console.log('Exporting veterinary services data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Veterinary Services
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage cattle health and veterinary services
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/dashboard/veterinary/vaccinations')}>
            <BeakerIcon className="h-5 w-5 mr-2" />
            Vaccination Schedule
          </Button>
          <Button onClick={() => navigate('/dashboard/veterinary/book')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Book Service
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by farmer, cattle tag, service number, or vet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Service Types' },
              { value: 'CHECKUP', label: 'Health Checkup' },
              { value: 'VACCINATION', label: 'Vaccination' },
              { value: 'TREATMENT', label: 'Treatment' },
              { value: 'AI', label: 'Artificial Insemination' },
              { value: 'DEWORMING', label: 'Deworming' },
              { value: 'EMERGENCY', label: 'Emergency' },
            ]}
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'SCHEDULED', label: 'Scheduled' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </div>
      </Card>

      {/* Services Table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Service Records ({filteredServices.length})
          </h2>
        </div>
        <Table columns={columns} data={filteredServices} />
      </Card>
    </div>
  );
};

export default VeterinaryServicesPage;
