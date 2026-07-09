import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  CalendarDaysIcon,
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
import type { Meeting, Column } from '../../types';
import dayjs from 'dayjs';
import { meetingService } from '../../services/meetingService';
import toast from 'react-hot-toast';

const MeetingsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState({
    totalMeetings: 0,
    scheduledMeetings: 0,
    completedMeetings: 0,
    upcomingMeetings: 0,
  });

  useEffect(() => {
    fetchMeetings();
  }, [currentPage, searchQuery, filterType, filterStatus]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const response = await meetingService.getAll({
        search: searchQuery || undefined,
        meetingType: filterType !== 'ALL' ? filterType : undefined,
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
        page: currentPage,
        pageSize: 10,
      });
      if (response.success) {
        setMeetings(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load meetings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await meetingService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const statsData = [
    { label: 'Total Meetings', value: stats.totalMeetings.toString(), icon: CalendarDaysIcon, color: 'blue' },
    { label: 'Scheduled', value: stats.scheduledMeetings.toString(), icon: ClockIcon, color: 'yellow' },
    { label: 'Completed', value: stats.completedMeetings.toString(), icon: CheckCircleIcon, color: 'green' },
    { label: 'Cancelled', value: '0', icon: XCircleIcon, color: 'red' },
  ];

  const columns: Column<Meeting>[] = [
    {
      id: 'meetingNumber',
      header: 'Meeting No.',
      accessor: (row) => (
        <button onClick={() => navigate(`/dashboard/meetings/${row.id}`)} className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
          {row.meetingNumber}
        </button>
      ),
    },
    {
      id: 'title',
      header: 'Title',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.meetingType}</div>
        </div>
      ),
    },
    {
      id: 'dateTime',
      header: 'Date & Time',
      accessor: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{dayjs(row.date).format('DD MMM YYYY')}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.time}</div>
        </div>
      ),
      sortable: true,
    },
    { id: 'venue', header: 'Venue', accessor: 'venue' },
    { id: 'conductedBy', header: 'Conducted By', accessor: 'conductedBy' },
    {
      id: 'attendees',
      header: 'Attendees',
      accessor: (row) => row.totalAttendees.toString(),
      align: 'center',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.status === 'COMPLETED' ? 'success' : row.status === 'SCHEDULED' ? 'warning' : row.status === 'CANCELLED' ? 'error' : 'secondary'}>
          {row.status}
        </Badge>
      ),
    },
    { id: 'actions', header: 'Actions', accessor: () => <Button size="sm">View</Button> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meetings Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage cooperative meetings and AGMs</p>
        </div>
        <Button onClick={() => navigate('/dashboard/meetings/new')}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Schedule Meeting
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
          <Input placeholder="Search meetings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} options={[
            { value: 'ALL', label: 'All Types' },
            { value: 'BOARD', label: 'Board Meeting' },
            { value: 'GENERAL', label: 'General Meeting' },
            { value: 'COMMITTEE', label: 'Committee Meeting' },
            { value: 'SPECIAL', label: 'Special Meeting' },
            { value: 'AGM', label: 'AGM' },
          ]} />
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} options={[
            { value: 'ALL', label: 'All Status' },
            { value: 'SCHEDULED', label: 'Scheduled' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
            { value: 'POSTPONED', label: 'Postponed' },
          ]} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meetings ({meetings.length})</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : meetings.length > 0 ? (
          <Table columns={columns} data={meetings} />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No meetings found</p>
          </div>
        )}
      </Card>

      {meetings.length > 0 && totalPages > 1 && (
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

export default MeetingsPage;
