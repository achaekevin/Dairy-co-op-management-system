import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import type { Column, VaccinationSchedule } from '../../types';
import dayjs from 'dayjs';

const VaccinationSchedulePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterVaccine, setFilterVaccine] = useState('ALL');

  // Mock data
  const vaccinations: VaccinationSchedule[] = [
    {
      id: '1',
      farmerId: 'F-001',
      farmerName: 'James Kariuki',
      cattleId: 'C-001',
      cattleTag: 'RK-001',
      vaccineType: 'FMD',
      scheduledDate: '2024-02-20',
      lastVaccinationDate: '2023-08-20',
      nextDueDate: '2024-02-20',
      status: 'PENDING',
      dose: 'Booster',
      notes: '6-month booster due',
    },
    {
      id: '2',
      farmerId: 'F-012',
      farmerName: 'John Mwangi',
      cattleId: 'C-045',
      cattleTag: 'SP-003',
      vaccineType: 'HS',
      scheduledDate: '2024-02-18',
      lastVaccinationDate: '2023-02-18',
      nextDueDate: '2024-02-18',
      status: 'OVERDUE',
      dose: 'Annual',
      notes: 'Annual dose overdue by 2 days',
    },
    {
      id: '3',
      farmerId: 'F-023',
      farmerName: 'Peter Ochieng',
      cattleId: 'C-089',
      cattleTag: 'AS-002',
      vaccineType: 'Rabies',
      scheduledDate: '2024-02-15',
      lastVaccinationDate: '2024-02-15',
      nextDueDate: '2025-02-15',
      status: 'COMPLETED',
      dose: 'Annual',
      veterinarianName: 'Dr. Sharma',
      notes: 'Completed successfully',
    },
    {
      id: '4',
      farmerId: 'F-045',
      farmerName: 'Vijay Sharma',
      cattleId: 'C-123',
      cattleTag: 'VS-001',
      vaccineType: 'Brucellosis',
      scheduledDate: '2024-02-25',
      lastVaccinationDate: '2023-02-25',
      nextDueDate: '2024-02-25',
      status: 'PENDING',
      dose: 'Annual',
    },
    {
      id: '5',
      farmerId: 'F-067',
      farmerName: 'Samuel Njoroge',
      cattleId: 'C-156',
      cattleTag: 'RV-004',
      vaccineType: 'BQ',
      scheduledDate: '2024-02-22',
      nextDueDate: '2024-02-22',
      status: 'PENDING',
      dose: 'First Dose',
      notes: 'New cattle - first vaccination',
    },
  ];

  const stats = [
    {
      label: 'Total Scheduled',
      value: vaccinations.length.toString(),
      icon: BeakerIcon,
      color: 'blue',
    },
    {
      label: 'Completed',
      value: vaccinations.filter((v) => v.status === 'COMPLETED').length.toString(),
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'Pending',
      value: vaccinations.filter((v) => v.status === 'PENDING').length.toString(),
      icon: ClockIcon,
      color: 'yellow',
    },
    {
      label: 'Overdue',
      value: vaccinations.filter((v) => v.status === 'OVERDUE').length.toString(),
      icon: ExclamationTriangleIcon,
      color: 'red',
    },
  ];

  const columns: Column<VaccinationSchedule>[] = [
    {
      id: 'cattleTag',
      header: 'Cattle Tag',
      accessor: (row) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {row.cattleTag}
        </div>
      ),
    },
    {
      id: 'farmer',
      header: 'Farmer',
      accessor: (row) => (
        <button
          onClick={() => navigate(`/dashboard/farmers/${row.farmerId}`)}
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {row.farmerName}
        </button>
      ),
    },
    {
      id: 'vaccineType',
      header: 'Vaccine Type',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.vaccineType}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.dose}</div>
        </div>
      ),
    },
    {
      id: 'lastVaccination',
      header: 'Last Vaccination',
      accessor: (row) => (
        <div>
          {row.lastVaccinationDate ? (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {dayjs(row.lastVaccinationDate).format('DD MMM YYYY')}
            </div>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      id: 'nextDue',
      header: 'Next Due Date',
      accessor: (row) => (
        <div>
          <div
            className={`font-medium ${
              row.status === 'OVERDUE'
                ? 'text-red-600'
                : dayjs(row.nextDueDate).diff(dayjs(), 'days') <= 7
                  ? 'text-orange-600'
                  : 'text-gray-900 dark:text-white'
            }`}
          >
            {dayjs(row.nextDueDate).format('DD MMM YYYY')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {dayjs(row.nextDueDate).fromNow()}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge
          variant={
            row.status === 'COMPLETED'
              ? 'success'
              : row.status === 'OVERDUE'
                ? 'error'
                : 'warning'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'veterinarian',
      header: 'Veterinarian',
      accessor: (row) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {row.veterinarianName || '-'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          {row.status !== 'COMPLETED' && (
            <Button
              size="sm"
              onClick={() =>
                navigate('/dashboard/veterinary/book', {
                  state: {
                    farmerId: row.farmerId,
                    cattleId: row.cattleId,
                    serviceType: 'VACCINATION',
                  },
                })
              }
            >
              Book
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/dashboard/veterinary/vaccinations/${row.id}`)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  const filteredVaccinations = vaccinations.filter((vaccination) => {
    const matchesSearch =
      vaccination.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccination.cattleTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccination.vaccineType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'ALL' || vaccination.status === filterStatus;
    const matchesVaccine =
      filterVaccine === 'ALL' || vaccination.vaccineType === filterVaccine;
    return matchesSearch && matchesStatus && matchesVaccine;
  });

  const handleExport = () => {
    console.log('Exporting vaccination schedule...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/veterinary')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Vaccination Schedule
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track and manage cattle vaccination programs
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/dashboard/veterinary/book')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Book Vaccination
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Input
              placeholder="Search by farmer, cattle tag, or vaccine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <Select
            value={filterVaccine}
            onChange={(e) => setFilterVaccine(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Vaccines' },
              { value: 'FMD', label: 'FMD (Foot & Mouth Disease)' },
              { value: 'HS', label: 'HS (Hemorrhagic Septicemia)' },
              { value: 'BQ', label: 'BQ (Black Quarter)' },
              { value: 'Brucellosis', label: 'Brucellosis' },
              { value: 'Rabies', label: 'Rabies' },
              { value: 'Anthrax', label: 'Anthrax' },
            ]}
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'OVERDUE', label: 'Overdue' },
            ]}
          />
        </div>
      </Card>

      {/* Vaccination Schedule Table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Vaccination Records ({filteredVaccinations.length})
          </h2>
        </div>
        <Table columns={columns} data={filteredVaccinations} />
      </Card>

      {/* Vaccination Guidelines */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Vaccination Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
          <div>
            <h4 className="font-semibold mb-2">FMD (Foot & Mouth Disease)</h4>
            <ul className="space-y-1 ml-4">
              <li>• Primary: 2 doses, 4 weeks apart</li>
              <li>• Booster: Every 6 months</li>
              <li>• Critical for all cattle</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">HS (Hemorrhagic Septicemia)</h4>
            <ul className="space-y-1 ml-4">
              <li>• Annual vaccination required</li>
              <li>• Best before monsoon season</li>
              <li>• Protects against bacterial infection</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">BQ (Black Quarter)</h4>
            <ul className="space-y-1 ml-4">
              <li>• First dose at 6 months</li>
              <li>• Annual booster</li>
              <li>• Especially for young cattle</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Brucellosis</h4>
            <ul className="space-y-1 ml-4">
              <li>• Female calves: 4-8 months</li>
              <li>• Single dose S-19 vaccine</li>
              <li>• Prevents reproductive issues</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VaccinationSchedulePage;
