import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import {
  HiMagnifyingGlass,
  HiCalendar,
  HiShieldCheck,
  HiExclamationTriangle,
} from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Animal {
  id: string;
  tagNumber: string;
  name?: string;
  breed: string;
  category: 'COW' | 'BULL' | 'HEIFER' | 'CALF';
  age: number;
  gender: 'MALE' | 'FEMALE';
  status: 'ACTIVE' | 'SICK' | 'PREGNANT' | 'SOLD' | 'DEAD';
  lastVaccination?: string;
  nextVaccinationDue?: string;
}

const AnimalsPage = () => {
  const [loading, setLoading] = useState(true);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farmer-portal/animals');
      if (response.data.success) {
        setAnimals(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to load animals');
    } finally {
      setLoading(false);
    }
  };

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (animal.name && animal.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'ALL' || animal.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || animal.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PREGNANT':
        return 'info';
      case 'SICK':
        return 'warning';
      case 'SOLD':
      case 'DEAD':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const isVaccinationDue = (dueDate?: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const stats = {
    totalAnimals: animals.length,
    cows: animals.filter(a => a.category === 'COW').length,
    pregnant: animals.filter(a => a.status === 'PREGNANT').length,
    vaccinationDue: animals.filter(a => isVaccinationDue(a.nextVaccinationDue)).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Livestock</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your livestock and track vaccinations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Animals', value: stats.totalAnimals, icon: HiShieldCheck, color: 'primary' },
          { label: 'Milk Cows', value: stats.cows, icon: HiShieldCheck, color: 'success' },
          { label: 'Pregnant', value: stats.pregnant, icon: HiShieldCheck, color: 'info' },
          { label: 'Vaccination Due', value: stats.vaccinationDue, icon: HiExclamationTriangle, color: 'warning' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tag or name..."
                className="pl-10"
              />
            </div>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Categories' },
                { value: 'COW', label: 'Cows' },
                { value: 'BULL', label: 'Bulls' },
                { value: 'HEIFER', label: 'Heifers' },
                { value: 'CALF', label: 'Calves' },
              ]}
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'PREGNANT', label: 'Pregnant' },
                { value: 'SICK', label: 'Sick' },
                { value: 'SOLD', label: 'Sold' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Livestock Inventory ({filteredAnimals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredAnimals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnimals.map((animal) => (
                <motion.div
                  key={animal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {animal.name || `Tag #${animal.tagNumber}`}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {animal.breed} • {animal.category}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(animal.status)}>
                      {animal.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Tag Number:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {animal.tagNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Age:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {animal.age} years
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Gender:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {animal.gender}
                      </span>
                    </div>
                  </div>

                  {animal.nextVaccinationDue && (
                    <div
                      className={`mt-3 p-2 rounded-lg flex items-center gap-2 ${
                        isVaccinationDue(animal.nextVaccinationDue)
                          ? 'bg-yellow-50 dark:bg-yellow-900/20'
                          : 'bg-blue-50 dark:bg-blue-900/20'
                      }`}
                    >
                      <HiCalendar
                        className={`w-4 h-4 ${
                          isVaccinationDue(animal.nextVaccinationDue)
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium ${
                            isVaccinationDue(animal.nextVaccinationDue)
                              ? 'text-yellow-900 dark:text-yellow-200'
                              : 'text-blue-900 dark:text-blue-200'
                          }`}
                        >
                          {isVaccinationDue(animal.nextVaccinationDue)
                            ? 'Vaccination Due Soon'
                            : 'Next Vaccination'}
                        </p>
                        <p
                          className={`text-xs ${
                            isVaccinationDue(animal.nextVaccinationDue)
                              ? 'text-yellow-700 dark:text-yellow-300'
                              : 'text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {new Date(animal.nextVaccinationDue).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HiShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No animals found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalsPage;
