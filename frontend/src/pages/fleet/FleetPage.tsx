import { useState, useEffect } from 'react';
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
import Pagination from '../../components/ui/Pagination';
import type { Vehicle, Column } from '../../types';
import dayjs from 'dayjs';
import { vehicleService } from '../../services/vehicleService';
import toast from 'react-hot-toast';

const FleetPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    maintenanceVehicles: 0,
    expiringInsurance: 0,
  });

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, searchQuery, filterType, filterStatus]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await vehicleService.getAll({
        search: searchQuery || undefined,
        vehicleType: filterType !== 'ALL' ? filterType : undefined,
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
        page: currentPage,
        pageSize: 10,
      });
      if (response.success && response.data) {
        setVehicles(Array.isArray(response.data) ? response.data : []);
        setTotalPages(response.meta?.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load vehicles');
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await vehicleService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const statsData = [
    { label: 'Total Vehicles', value: (stats.totalVehicles ?? 0).toString(), icon: TruckIcon, color: 'blue' },
    { label: 'Active', value: (stats.activeVehicles ?? 0).toString(), icon: CheckCircleIcon, color: 'green' },
    { label: 'In Maintenance', value: (stats.maintenanceVehicles ?? 0).toString(), icon: WrenchScrewdriverIcon, color: 'yellow' },
    { label: 'Service Due', value: (stats.expiringInsurance ?? 0).toString(), icon: ExclamationTriangleIcon, color: 'red' },
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
        {statsData.map((stat, index) => (
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicles ({vehicles.length})</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : vehicles.length > 0 ? (
          <Table columns={columns} data={vehicles} />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No vehicles found</p>
          </div>
        )}
      </Card>

      {vehicles.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default FleetPage;
