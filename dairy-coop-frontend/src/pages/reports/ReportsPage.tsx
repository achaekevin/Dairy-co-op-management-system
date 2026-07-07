import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  BanknotesIcon,
  UsersIcon,
  BeakerIcon,
  TruckIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

interface ReportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  reports: {
    id: string;
    name: string;
    description: string;
    frequency: string;
  }[];
}

const ReportsPage = () => {
  const navigate = useNavigate();

  const reportCategories: ReportCategory[] = [
    {
      id: 'farmers',
      title: 'Farmer Reports',
      description: 'Farmer performance, membership, and engagement reports',
      icon: UsersIcon,
      color: 'blue',
      reports: [
        { id: 'farmer-list', name: 'Farmer Directory', description: 'Complete list of all registered farmers', frequency: 'On-demand' },
        { id: 'farmer-performance', name: 'Farmer Performance', description: 'Milk supply trends and quality metrics', frequency: 'Monthly' },
        { id: 'inactive-farmers', name: 'Inactive Farmers', description: 'Farmers with no supply in last 30 days', frequency: 'Weekly' },
        { id: 'top-farmers', name: 'Top Performers', description: 'Highest milk suppliers by quantity', frequency: 'Monthly' },
      ],
    },
    {
      id: 'milk',
      title: 'Milk Collection Reports',
      description: 'Daily collection, quality analysis, and procurement reports',
      icon: TruckIcon,
      color: 'green',
      reports: [
        { id: 'daily-collection', name: 'Daily Collection Summary', description: 'Day-wise milk collection by shift', frequency: 'Daily' },
        { id: 'monthly-procurement', name: 'Monthly Procurement', description: 'Month-wise collection trends and analysis', frequency: 'Monthly' },
        { id: 'quality-analysis', name: 'Quality Analysis', description: 'Fat, SNF, and quality grade distribution', frequency: 'Weekly' },
        { id: 'rejection-report', name: 'Rejection Analysis', description: 'Rejected milk quantities and reasons', frequency: 'Weekly' },
      ],
    },
    {
      id: 'quality',
      title: 'Quality Reports',
      description: 'Lab test results, compliance, and standards reports',
      icon: BeakerIcon,
      color: 'purple',
      reports: [
        { id: 'test-summary', name: 'Test Summary', description: 'All quality tests performed', frequency: 'Weekly' },
        { id: 'compliance-report', name: 'Compliance Report', description: 'Standards compliance tracking', frequency: 'Monthly' },
        { id: 'failed-tests', name: 'Failed Tests Analysis', description: 'Analysis of failed quality tests', frequency: 'Weekly' },
      ],
    },
    {
      id: 'financial',
      title: 'Financial Reports',
      description: 'Payments, revenue, expenses, and P&L statements',
      icon: BanknotesIcon,
      color: 'yellow',
      reports: [
        { id: 'payment-summary', name: 'Payment Summary', description: 'Farmer payments by period', frequency: 'Monthly' },
        { id: 'revenue-report', name: 'Revenue Analysis', description: 'Sales revenue and trends', frequency: 'Monthly' },
        { id: 'expense-report', name: 'Expense Report', description: 'Operational expenses breakdown', frequency: 'Monthly' },
        { id: 'pl-statement', name: 'P&L Statement', description: 'Profit and loss statement', frequency: 'Quarterly' },
        { id: 'outstanding-report', name: 'Outstanding Payments', description: 'Pending payments from customers', frequency: 'Weekly' },
      ],
    },
    {
      id: 'inventory',
      title: 'Inventory Reports',
      description: 'Stock levels, consumption, and purchase reports',
      icon: CubeIcon,
      color: 'red',
      reports: [
        { id: 'stock-summary', name: 'Stock Summary', description: 'Current stock levels of all items', frequency: 'Daily' },
        { id: 'low-stock', name: 'Low Stock Alert', description: 'Items below minimum stock level', frequency: 'Daily' },
        { id: 'purchase-analysis', name: 'Purchase Analysis', description: 'Purchase orders and supplier performance', frequency: 'Monthly' },
        { id: 'consumption-report', name: 'Consumption Report', description: 'Item consumption patterns', frequency: 'Monthly' },
      ],
    },
  ];

  const quickReports = [
    { name: 'Today\'s Collection', description: 'Current day milk collection summary', icon: TruckIcon, color: 'blue' },
    { name: 'Pending Payments', description: 'Outstanding farmer payments', icon: BanknotesIcon, color: 'red' },
    { name: 'Low Stock Items', description: 'Inventory items below threshold', icon: CubeIcon, color: 'yellow' },
    { name: 'Active Farmers', description: 'Currently active member farmers', icon: UsersIcon, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate comprehensive reports and analytics
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard/analytics')}>
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Analytics Dashboard
          </Button>
        </div>
      </div>

      {/* Quick Reports */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Reports</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickReports.map((report) => (
            <motion.button
              key={report.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
            >
              <div className={`rounded-full p-2 bg-${report.color}-100 dark:bg-${report.color}-900/20`}>
                <report.icon className={`h-5 w-5 text-${report.color}-600 dark:text-${report.color}-400`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{report.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{report.description}</div>
              </div>
              <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Report Categories */}
      <div className="space-y-6">
        {reportCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-full p-2 bg-${category.color}-100 dark:bg-${category.color}-900/20`}>
                  <category.icon className={`h-6 w-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {category.reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <DocumentChartBarIcon className="h-5 w-5 text-gray-400" />
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {report.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
                        {report.description}
                      </p>
                      <div className="mt-2 ml-7">
                        <Badge variant="secondary" className="text-xs">
                          {report.frequency}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => console.log(`Generate ${report.name}`)}
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Custom Report Builder */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Custom Report Builder
            </h2>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Create custom reports with flexible filters and data selection
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard/reports/custom')}>
            Build Custom Report
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
