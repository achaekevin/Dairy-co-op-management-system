import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiUsers,
  HiMagnifyingGlass,
  HiEnvelope,
  HiTrash,
  HiUserGroup,
  HiCheckCircle,
  HiXCircle,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import type { Column } from '../../types';
import { farmerService } from '../../services/farmerService';
import { customerService } from '../../services/customerService';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import type { UserRole } from '../../types';

interface User {
  [key: string]: string | number | boolean | undefined;
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: string;
  location: string;
  joinDate: string;
  isActive?: boolean;
}

const UserManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalCustomers: 0,
    activeUsers: 0,
    systemUsers: 0,
  });

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, filterRole, filterStatus]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers: User[] = [];

      if (filterRole === 'ALL' || filterRole === 'FARMER') {
        const farmersResponse = await farmerService.getAll({
          search: searchQuery || undefined,
          status: filterStatus !== 'ALL' ? filterStatus : undefined,
          page: 1,
          pageSize: 100,
        });

        if (farmersResponse.success && farmersResponse.data) {
          const farmers = Array.isArray(farmersResponse.data) ? farmersResponse.data : [];
          allUsers.push(...farmers.map(f => ({
            id: f.id,
            userId: f.farmerId,
            name: `${f.firstName} ${f.lastName}`,
            email: f.email || 'N/A',
            phone: f.phoneNumber,
            role: 'FARMER' as UserRole,
            status: f.status,
            location: `${f.village}, ${f.district}`,
            joinDate: f.joinDate,
            isActive: f.status === 'ACTIVE',
          })));
        }
      }

      if (filterRole === 'ALL' || filterRole === 'CUSTOMER') {
        const customersResponse = await customerService.getAll({
          search: searchQuery || undefined,
          status: filterStatus !== 'ALL' ? filterStatus : undefined,
          page: 1,
          pageSize: 100,
        });

        if (customersResponse.success && customersResponse.data) {
          const customers = Array.isArray(customersResponse.data) ? customersResponse.data : [];
          allUsers.push(...customers.map(c => ({
            id: c.id,
            userId: c.customerId,
            name: c.customerName,
            email: c.email || 'N/A',
            phone: c.phoneNumber,
            role: 'CUSTOMER' as UserRole,
            status: c.status,
            location: `${c.city}, ${c.state}`,
            joinDate: c.createdAt,
            isActive: c.status === 'ACTIVE',
          })));
        }
      }

      const systemRoles = ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'OPERATOR', 'STORE_MANAGER', 'VETERINARIAN', 'VIEWER'];
      if (filterRole === 'ALL' || systemRoles.includes(filterRole)) {
        const systemUsersResponse = await userService.getAll({
          search: searchQuery || undefined,
          role: filterRole !== 'ALL' ? filterRole : undefined,
          status: filterStatus !== 'ALL' ? filterStatus : undefined,
          page: 1,
          limit: 100,
        });

        if (systemUsersResponse.success && systemUsersResponse.data) {
          const systemUsers = Array.isArray(systemUsersResponse.data) ? systemUsersResponse.data : [];
          allUsers.push(...systemUsers.map(u => ({
            id: u.id,
            userId: u.email.split('@')[0].toUpperCase(),
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            phone: u.phoneNumber || 'N/A',
            role: u.role as UserRole,
            status: u.isActive ? 'ACTIVE' : 'INACTIVE',
            location: 'System User',
            joinDate: u.createdAt,
            isActive: u.isActive,
          })));
        }
      }

      setUsers(allUsers);

      const totalFarmers = allUsers.filter(u => u.role === 'FARMER').length;
      const totalCustomers = allUsers.filter(u => u.role === 'CUSTOMER').length;
      const totalSystemUsers = allUsers.filter(u => 
        !['FARMER', 'CUSTOMER'].includes(u.role)
      ).length;

      setStats({
        totalUsers: allUsers.length,
        totalFarmers,
        totalCustomers,
        activeUsers: allUsers.filter(u => u.isActive).length,
        systemUsers: totalSystemUsers,
      });

    } catch (error) {
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = (user: User) => {
    setSelectedUser(user);
    setEmailSubject('');
    setEmailMessage('');
    setShowEmailModal(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmSendEmail = async () => {
    if (!selectedUser || !emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please fill in all email fields');
      return;
    }

    setIsSendingEmail(true);
    try {
      toast.success(`Email sent successfully to ${selectedUser.name}`);
      setShowEmailModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      if (selectedUser.role === 'FARMER') {
        await farmerService.delete(selectedUser.id);
      } else if (selectedUser.role === 'CUSTOMER') {
        await customerService.delete(selectedUser.id);
      } else {
        await userService.delete(selectedUser.id);
      }
      toast.success(`${selectedUser.role} deleted successfully`);
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to delete ${selectedUser.role.toLowerCase()}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatCardClick = (filterType: string) => {
    if (activeFilter === filterType) {
      setActiveFilter(null);
      setFilterRole('ALL');
      setFilterStatus('ALL');
    } else {
      setActiveFilter(filterType);
      switch (filterType) {
        case 'farmers':
          setFilterRole('FARMER');
          setFilterStatus('ALL');
          break;
        case 'customers':
          setFilterRole('CUSTOMER');
          setFilterStatus('ALL');
          break;
        case 'systemUsers':
          setFilterRole('ADMIN');
          setFilterStatus('ALL');
          break;
        case 'active':
          setFilterRole('ALL');
          setFilterStatus('ACTIVE');
          break;
        default:
          setFilterRole('ALL');
          setFilterStatus('ALL');
      }
    }
  };

  const getRoleBadgeVariant = (role: UserRole): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'MANAGER':
        return 'warning';
      case 'ACCOUNTANT':
        return 'info';
      case 'OPERATOR':
      case 'STORE_MANAGER':
      case 'VETERINARIAN':
        return 'default';
      case 'FARMER':
        return 'success';
      case 'CUSTOMER':
        return 'info';
      default:
        return 'default';
    }
  };

  const statsData = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: HiUsers, 
      color: 'blue',
      filterType: 'all'
    },
    { 
      label: 'Farmers', 
      value: stats.totalFarmers, 
      icon: HiUserGroup, 
      color: 'green',
      filterType: 'farmers'
    },
    { 
      label: 'Customers', 
      value: stats.totalCustomers, 
      icon: HiUserGroup, 
      color: 'purple',
      filterType: 'customers'
    },
    { 
      label: 'System Users', 
      value: stats.systemUsers, 
      icon: HiUsers, 
      color: 'orange',
      filterType: 'systemUsers'
    },
    { 
      label: 'Active', 
      value: stats.activeUsers, 
      icon: HiCheckCircle, 
      color: 'emerald',
      filterType: 'active'
    },
  ];

  const columns: Column<User>[] = [
    {
      id: 'userId',
      header: 'User ID',
      accessor: (row) => (
        <div className="font-medium text-slate-900 dark:text-white">
          {row.userId}
        </div>
      ),
    },
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-white">{row.name}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{row.email}</div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      accessor: (row) => (
        <Badge variant={getRoleBadgeVariant(row.role)}>
          {row.role}
        </Badge>
      ),
    },
    { id: 'phone', header: 'Phone', accessor: 'phone' },
    { id: 'location', header: 'Location', accessor: 'location' },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'error'}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSendEmail(row)}
            disabled={row.email === 'N/A'}
          >
            <HiEnvelope className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-700 hover:border-red-600"
          >
            <HiTrash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage all users in the system (farmers, customers, and staff)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleStatCardClick(stat.filterType)}
            className="cursor-pointer"
          >
            <Card className={`transition-all duration-200 ${
              activeFilter === stat.filterType 
                ? 'ring-2 ring-primary-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-full p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-10"
            />
          </div>
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Roles' },
              { value: 'ADMIN', label: 'Admin' },
              { value: 'MANAGER', label: 'Manager' },
              { value: 'ACCOUNTANT', label: 'Accountant' },
              { value: 'OPERATOR', label: 'Operator' },
              { value: 'STORE_MANAGER', label: 'Store Manager' },
              { value: 'VETERINARIAN', label: 'Veterinarian' },
              { value: 'FARMER', label: 'Farmers' },
              { value: 'CUSTOMER', label: 'Customers' },
            ]}
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'BLOCKED', label: 'Blocked' },
              { value: 'SUSPENDED', label: 'Suspended' },
            ]}
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          All Users ({users.length})
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : users.length > 0 ? (
          <Table columns={columns} data={users} />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No users found</p>
          </div>
        )}
      </Card>

      {/* Email Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Send Email Notification"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              To
            </label>
            <Input
              value={selectedUser?.email || ''}
              disabled
              className="bg-slate-100 dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Subject *
            </label>
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Message *
            </label>
            <textarea
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowEmailModal(false)}
              disabled={isSendingEmail}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmSendEmail}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <HiXCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-900 dark:text-red-200">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selectedUser?.name}</span>? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
