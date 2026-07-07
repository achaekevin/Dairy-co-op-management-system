import { useState } from 'react';
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
import type { Meeting, Column } from '../../types';
import dayjs from 'dayjs';

const MeetingsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const meetings: Meeting[] = [
    {
      id: '1',
      meetingNumber: 'MTG-2024-001',
      title: 'Annual General Meeting 2024',
      meetingType: 'AGM',
      date: '2024-03-15',
      time: '10:00',
      venue: 'Main Auditorium',
      agenda: 'Annual report presentation, financial review, election of board members',
      conductedBy: 'Chairman - Mr. Sharma',
      totalAttendees: 150,
      status: 'SCHEDULED',
      createdAt: '2024-02-01T00:00:00Z',
    },
    {
      id: '2',
      meetingNumber: 'MTG-2024-002',
      title: 'Board Meeting - February',
      meetingType: 'BOARD',
      date: '2024-02-20',
      time: '14:00',
      venue: 'Board Room',
      agenda: 'Review of monthly operations, approval of new purchases, quality standards discussion',
      conductedBy: 'President - Mr. Patel',
      totalAttendees: 12,
      status: 'COMPLETED',
      minutes: 'All agenda items discussed. New quality standards approved. Purchase of new tanker approved.',
      decisions: '1. Approved purchase of new 5000L tanker. 2. Implemented new quality check protocols. 3. Increased farmer bonus by 5%.',
      createdAt: '2024-02-15T00:00:00Z',
    },
    {
      id: '3',
      meetingNumber: 'MTG-2024-003',
      title: 'Quality Committee Review',
      meetingType: 'COMMITTEE',
      date: '2024-02-25',
      time: '11:00',
      venue: 'Quality Lab',
      agenda: 'Review quality test results, discuss farmer training program',
      conductedBy: 'Quality Head - Dr. Verma',
      totalAttendees: 8,
      status: 'SCHEDULED',
      createdAt: '2024-02-10T00:00:00Z',
    },
  ];

  const stats = [
    { label: 'Total Meetings', value: meetings.length.toString(), icon: CalendarDaysIcon, color: 'blue' },
    { label: 'Scheduled', value: meetings.filter(m => m.status === 'SCHEDULED').length.toString(), icon: ClockIcon, color: 'yellow' },
    { label: 'Completed', value: meetings.filter(m => m.status === 'COMPLETED').length.toString(), icon: CheckCircleIcon, color: 'green' },
    { label: 'Cancelled', value: meetings.filter(m => m.status === 'CANCELLED').length.toString(), icon: XCircleIcon, color: 'red' },
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

  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.meetingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || m.meetingType === filterType;
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meetings ({filteredMeetings.length})</h2>
        <Table columns={columns} data={filteredMeetings} />
      </Card>
    </div>
  );
};

export default MeetingsPage;
