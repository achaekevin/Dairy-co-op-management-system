import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Pagination from '../../components/ui/Pagination';
import type { Employee, Column } from '../../types';
import dayjs from 'dayjs';
import { employeeService } from '../../services/employeeService';
import toast from 'react-hot-toast';

const HRPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departments: 0,
    totalSalary: 0,
  });

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchQuery, filterDepartment, filterStatus]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await employeeService.getAll({
        search: searchQuery || undefined,
        department: filterDepartment !== 'ALL' ? filterDepartment : undefined,
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
        page: currentPage,
        pageSize: 10,
      });
      if (response.success) {
        setEmployees(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await employeeService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const statsData = [
    { label: 'Total Employees', value: stats.totalEmployees.toString(), icon: UserGroupIcon, color: 'blue' },
    { label: 'Active', value: stats.activeEmployees.toString(), icon: CheckCircleIcon, color: 'green' },
    { label: 'On Leave', value: '0', icon: ClockIcon, color: 'yellow' },
    { label: 'Inactive', value: (stats.totalEmployees - stats.activeEmployees).toString(), icon: XCircleIcon, color: 'red' },
  ];

  const monthlySalary = stats.totalSalary;

  const columns: Column<Employee>[] = [
    {
      id: 'employeeId',
      header: 'Employee ID',
      accessor: (row) => (
        <button onClick={() => navigate(`/dashboard/hr/${row.id}`)} className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
          {row.employeeId}
        </button>
      ),
    },
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.firstName} {row.lastName}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.designation}</div>
        </div>
      ),
    },
    { id: 'department', header: 'Department', accessor: 'department' },
    { id: 'phoneNumber', header: 'Phone', accessor: 'phoneNumber' },
    {
      id: 'joiningDate',
      header: 'Joining Date',
      accessor: (row) => dayjs(row.dateOfJoining).format('DD MMM YYYY'),
      sortable: true,
    },
    {
      id: 'salary',
      header: 'Salary',
      accessor: (row) => `KSh ${row.salary.toLocaleString()}`,
      align: 'right',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : row.status === 'ON_LEAVE' ? 'warning' : 'error'}>
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    { id: 'actions', header: 'Actions', accessor: () => <Button size="sm">View</Button> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HR Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage employees and HR operations</p>
        </div>
        <Button onClick={() => navigate('/dashboard/hr/new')}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Employee
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

      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <div>
          <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Monthly Salary Expense</p>
          <p className="mt-2 text-3xl font-bold text-purple-900 dark:text-purple-100">KSh {monthlySalary.toLocaleString()}</p>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input placeholder="Search by name or employee ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} options={[
            { value: 'ALL', label: 'All Departments' },
            { value: 'Operations', label: 'Operations' },
            { value: 'Quality', label: 'Quality' },
            { value: 'Finance', label: 'Finance' },
            { value: 'HR', label: 'HR' },
            { value: 'Sales', label: 'Sales' },
          ]} />
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} options={[
            { value: 'ALL', label: 'All Status' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'ON_LEAVE', label: 'On Leave' },
            { value: 'RESIGNED', label: 'Resigned' },
            { value: 'TERMINATED', label: 'Terminated' },
          ]} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employees ({employees.length})</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : employees.length > 0 ? (
          <Table columns={columns} data={employees} />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No employees found</p>
          </div>
        )}
      </Card>

      {employees.length > 0 && totalPages > 1 && (
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

export default HRPage;
