import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import type { Vehicle, Column } from '../../types';
import dayjs from 'dayjs';

const FleetPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const vehicles: Vehicle[] = [
    {
      id: '1',
      vehicleNumber: 'MH-12-AB-1234',
      vehicleType: 'MILK_TANKER',
      brand: 'Tata',
      model: 'LPT 1613',
      capacity: 5000,
      fuelType: 'DIESEL',
      purchaseDate: '2022-01-15',
      insuranceExpiry: '2025-01-14',
      fitnessExpiry: '2025-06-30',
      lastService: '2024-01-10',
      nextService: '2024-04-10',
      currentMileage: 45000,
      driverName: 'Ramesh Kumar',
      status: 'ACTIVE',
      createdAt: '2022-01-15T00:00:00Z',
    },
    {
      id: '2',
      vehicleNumber: 'MH-12-CD-5678',
      vehicleType: 'DELIVERY_VAN',
      brand: 'Mahindra',
      model: 'Supro',
      capacity: 1000,
      fuelType: 'DIESEL',
      purchaseDate: '2023-03-20',
      insuranceExpiry: '2025-03-19',
      fitnessExpiry: '2026-03-19',
      lastService: '2024-02-01',
      nextService: '2024-05-01',
      currentMileage: 28000,
      driverName: 'Suresh Patil',
      status: 'ACTIVE',
      createdAt: '2023-03-20T00:00:00Z',
    },
    {
      id: '3',
      vehicleNumber: 'MH-12-EF-9012',
      vehicleType: 'TRUCK',
      brand: 'Ashok Leyland',
      model: 'Dost+',
      capacity: 1500,
      fuelType: 'DIESEL',
      purchaseDate: '2021-06-10',
      insuranceExpiry: '2024-06-09',
      fitnessExpiry: '2024-12-31',
      lastService: '2024-01-20',
      nextService: '2024-04-20',
      currentMileage: 62000,
      driverName: 'Vijay Singh',
      status: 'MAINTENANCE',
      createdAt: '2021-06-10T00:00:00Z',
    },
    {
      id: '4',
      vehicleNumber: 'MH-12-GH-3456',
      vehicleType: 'CAR',
      brand: 'Maruti',
      model: 'Swift Dzire',
      capacity: 0,
      fuelType: 'PETROL',
      purchaseDate: '2023-08-15',
      insuranceExpiry: '2025-08-14',
      fitnessExpiry: '2028-08-14',
      lastService: '2024-02-05',
      nextService: '2024-08-05',
      currentMileage: 12000,
      status: 'ACTIVE',
      createdAt: '2023-08-15T00:00:00Z',
    },
  ];

  const stats = [
    { label: 'Total Vehicles', value: vehicles.length.toString(), icon: TruckIcon, color: 'blue' },
    { label: 'Active', value: vehicles.filter(v => v.status === 'ACTIVE').length.toString(), icon: CheckCircleIcon, color: 'green' },
    { label: 'In Maintenance', value: vehicles.filter(v => v.status === 'MAINTENANCE').length.toString(), icon: WrenchScrewdriverIcon, color: 'yellow' },
    { label: 'Service Due', value: vehicles.filter(v => dayjs(v.nextService).diff(dayjs(), 'days') <= 7).length.toString(), icon: ExclamationTriangleIcon, color: 'red' },
  ];

  const columns: Column<Vehicle>[] = [
    { id: 'vehicleNumber', header: 'Vehicle Number', accessor: (row) => <div className="font-medium text-gray-900 dark:text-white">{row.vehicleNumber}</div> },
    {
      id: 'details',
      header: 'Vehicle Details',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.brand} {row.model}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.vehicleType.replace('_', ' ')}</div>
        </div>
      ),
    },
    {
      id: 'capacity',
      header: 'Capacity',
      accessor: (row) => row.capacity > 0 ? `${row.capacity.toLocaleString()} L` : '-',
    },
    {
      id: 'driver',
      header: 'Driver',
      accessor: (row) => row.driverName || '-',
    },
    {
      id: 'mileage',
      header: 'Mileage',
      accessor: (row) => `${row.currentMileage.toLocaleString()} km`,
    },
    {
      id: 'nextService',
      header: 'Next Service',
      accessor: (row) => (
        <div className={dayjs(row.nextService).diff(dayjs(), 'days') <= 7 ? 'text-red-600 font-medium' : ''}>
          {dayjs(row.nextService).format('DD MMM YYYY')}
        </div>
      ),
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : row.status === 'MAINTENANCE' ? 'warning' : 'secondary'}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => <Button size="sm">View</Button>,
    },
  ];

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) || (v.driverName?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'ALL' || v.vehicleType === filterType;
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fleet Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage vehicles and fleet operations</p>
        </div>
        <Button onClick={() => navigate('/dashboard/fleet/new')}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input placeholder="Search by vehicle number or driver..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} options={[
            { value: 'ALL', label: 'All Types' },
            { value: 'MILK_TANKER', label: 'Milk Tanker' },
            { value: 'DELIVERY_VAN', label: 'Delivery Van' },
            { value: 'TRUCK', label: 'Truck' },
            { value: 'CAR', label: 'Car' },
            { value: 'BIKE', label: 'Bike' },
          ]} />
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} options={[
            { value: 'ALL', label: 'All Status' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'MAINTENANCE', label: 'Maintenance' },
            { value: 'INACTIVE', label: 'Inactive' },
          ]} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicles ({filteredVehicles.length})</h2>
        <Table columns={columns} data={filteredVehicles} />
      </Card>
    </div>
  );
};

export default FleetPage;
