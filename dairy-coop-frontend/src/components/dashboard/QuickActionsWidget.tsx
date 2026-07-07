import { motion } from 'framer-motion';
import {
  HiUserPlus,
  HiDocumentPlus,
  HiCurrencyRupee,
  HiBeaker,
  HiArrowRight,
} from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

const QuickActionsWidget = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <HiUserPlus className="w-5 h-5" />,
      title: 'Add Farmer',
      description: 'Register new farmer',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      path: '/dashboard/farmers',
    },
    {
      icon: <HiBeaker className="w-5 h-5" />,
      title: 'Milk Collection',
      description: 'Record collection',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      path: '/dashboard/milk-collection',
    },
    {
      icon: <HiCurrencyRupee className="w-5 h-5" />,
      title: 'Process Payment',
      description: 'Make payment',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      path: '/dashboard/payments',
    },
    {
      icon: <HiDocumentPlus className="w-5 h-5" />,
      title: 'Generate Report',
      description: 'Create new report',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
      path: '/dashboard/reports',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(action.path)}
              className="group p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-md text-left"
            >
              <div
                className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center ${action.color} mb-3`}
              >
                {action.icon}
              </div>
              <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                {action.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {action.description}
              </p>
              <HiArrowRight className="w-4 h-4 text-slate-400 mt-2 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsWidget;
