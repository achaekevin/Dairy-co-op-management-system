import { useState } from 'react';
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
import type { Employee, Column } from '../../types';
import dayjs from 'dayjs';

const HRPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const employees: Employee[] = [
    {
      id: '1',
      employeeId: 'EMP-001',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      designation: 'Manager',
      department: 'Operations',
      phoneNumber: '+91 98765 11111',
      email: 'rajesh.kumar@dairycoop.com',
      dateOfBirth: '1985-05-15',
      dateOfJoining: '2020-01-10',
      salary: 45000,
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      aadharNumber: '1234-5678-9012',
      panNumber: 'ABCDE1234F',
      bankName: 'HDFC Bank',
      accountNumber: '12345678901234',
      ifscCode: 'HDFC0001234',
      status: 'ACTIVE',
      createdAt: '2020-01-10T00:00:00Z',
    },
    {
      id: '2',
      employeeId: 'EMP-002',
      firstName: 'Priya',
      lastName: 'Sharma',
      designation: 'Quality Controller',
      department: 'Quality',
      phoneNumber: '+91 98765 22222',
      email: 'priya.sharma@dairycoop.com',
      dateOfBirth: '1990-08-20',
      dateOfJoining: '2021-03-15',
      salary: 35000,
      address: '456 Park Road',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411001',
      aadharNumber: '2345-6789-0123',
      bankName: 'ICICI Bank',
      accountNumber: '23456789012345',
      ifscCode: 'ICIC0002345',
      status: 'ACTIVE',
      createdAt: '2021-03-15T00:00:00Z',
    },
    {
      id: '3',
      employeeId: 'EMP-003',
      firstName: 'Amit',
      lastName: 'Patel',
      designation: 'Accountant',
      department: 'Finance',
      phoneNumber: '+91 98765 33333',
      email: 'amit.patel@dairycoop.com',
      dateOfBirth: '1988-12-10',
      dateOfJoining: '2019-06-01',
      salary: 40000,
      address: '789 Finance Street',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pinCode: '380001',
      aadharNumber: '3456-7890-1234',
      panNumber: 'CDEFG5678H',
      bankName: 'SBI',
      accountNumber: '34567890123456',
      ifscCode: 'SBIN0003456',
      status: 'ON_LEAVE',
      createdAt: '2019-06-01T00:00:00Z',
    },
  ];

  const stats = [
    { label: 'Total Employees', value: employees.length.toString(), icon: UserGroupIcon, color: 'blue' },
    { label: 'Active', value: employees.filter(e => e.status === 'ACTIVE').length.toString(), icon: CheckCircleIcon, color: 'green' },
    { label: 'On Leave', value: employees.filter(e => e.status === 'ON_LEAVE').length.toString(), icon: ClockIcon, color: 'yellow' },
    { label: 'Inactive', value: employees.filter(e => e.status === 'RESIGNED' || e.status === 'TERMINATED').length.toString(), icon: XCircleIcon, color: 'red' },
  ];

  const monthlySalary = employees.filter(e => e.status === 'ACTIVE' || e.status === 'ON_LEAVE').reduce((sum, e) => sum + e.salary, 0);

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

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || e.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'ALL' || e.department === filterDepartment;
    const matchesStatus = filterStatus === 'ALL' || e.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employees ({filteredEmployees.length})</h2>
        <Table columns={columns} data={filteredEmployees} />
      </Card>
    </div>
  );
};

export default HRPage;
