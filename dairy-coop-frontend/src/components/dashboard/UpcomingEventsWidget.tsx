import { motion } from 'framer-motion';
import {
  HiCalendar,
  HiClock,
  HiMapPin,
} from 'react-icons/hi2';
import dayjs from 'dayjs';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'meeting' | 'payment' | 'inspection' | 'training';
}

const UpcomingEventsWidget = () => {
  const events: Event[] = [
    {
      id: '1',
      title: 'Board Meeting',
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      time: '10:00 AM',
      location: 'Conference Room',
      type: 'meeting',
    },
    {
      id: '2',
      title: 'Monthly Payment Day',
      date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
      time: '9:00 AM',
      location: 'Main Office',
      type: 'payment',
    },
    {
      id: '3',
      title: 'Quality Inspection',
      date: dayjs().add(5, 'day').format('YYYY-MM-DD'),
      time: '2:00 PM',
      location: 'Collection Center',
      type: 'inspection',
    },
    {
      id: '4',
      title: 'Farmer Training',
      date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      time: '11:00 AM',
      location: 'Training Hall',
      type: 'training',
    },
  ];

  const typeColors = {
    meeting: 'info' as const,
    payment: 'success' as const,
    inspection: 'warning' as const,
    training: 'primary' as const,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <Badge variant="primary">{events.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                  {event.title}
                </h4>
                <Badge variant={typeColors[event.type]} size="sm">
                  {event.type}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <HiCalendar className="w-3.5 h-3.5" />
                  <span>{dayjs(event.date).format('MMM DD, YYYY')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <HiClock className="w-3.5 h-3.5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <HiMapPin className="w-3.5 h-3.5" />
                  <span>{event.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsWidget;
