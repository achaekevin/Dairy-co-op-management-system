import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  HeartIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const bookServiceSchema = z.object({
  farmerId: z.string().min(1, 'Farmer is required'),
  cattleId: z.string().min(1, 'Cattle is required'),
  serviceType: z.enum([
    'CHECKUP',
    'VACCINATION',
    'TREATMENT',
    'AI',
    'DEWORMING',
    'EMERGENCY',
  ]),
  veterinarianId: z.string().min(1, 'Veterinarian is required'),
  visitDate: z.string().min(1, 'Visit date is required'),
  visitTime: z.string().min(1, 'Visit time is required'),
  priority: z.enum(['ROUTINE', 'URGENT', 'EMERGENCY']),
  symptoms: z.string().optional(),
  previousTreatment: z.string().optional(),
  notes: z.string().optional(),
});

type BookServiceFormData = z.infer<typeof bookServiceSchema>;

const BookServicePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookServiceFormData>({
    resolver: zodResolver(bookServiceSchema),
    defaultValues: {
      priority: 'ROUTINE',
      visitDate: dayjs().format('YYYY-MM-DD'),
    },
  });

  const serviceType = watch('serviceType');
  const priority = watch('priority');

  // Mock data
  const farmers = [
    { value: 'F-001', label: 'Rajesh Kumar (F-001)' },
    { value: 'F-012', label: 'Suresh Patel (F-012)' },
    { value: 'F-023', label: 'Amit Singh (F-023)' },
    { value: 'F-045', label: 'Vijay Sharma (F-045)' },
    { value: 'F-067', label: 'Ramesh Verma (F-067)' },
  ];

  const cattleOptions = [
    { value: 'C-001', label: 'RK-001 - Holstein (Milking)' },
    { value: 'C-002', label: 'RK-002 - Jersey (Pregnant)' },
    { value: 'C-003', label: 'RK-003 - Cross Breed (Dry)' },
  ];

  const veterinarians = [
    { value: 'V-001', label: 'Dr. Sharma (General)' },
    { value: 'V-002', label: 'Dr. Verma (Surgery)' },
    { value: 'V-003', label: 'Dr. Patel (Reproduction)' },
    { value: 'V-004', label: 'Dr. Singh (Emergency)' },
  ];

  const serviceTypes = [
    { value: 'CHECKUP', label: 'Health Checkup' },
    { value: 'VACCINATION', label: 'Vaccination' },
    { value: 'TREATMENT', label: 'Treatment' },
    { value: 'AI', label: 'Artificial Insemination' },
    { value: 'DEWORMING', label: 'Deworming' },
    { value: 'EMERGENCY', label: 'Emergency' },
  ];

  const priorityOptions = [
    { value: 'ROUTINE', label: 'Routine' },
    { value: 'URGENT', label: 'Urgent' },
    { value: 'EMERGENCY', label: 'Emergency' },
  ];

  const timeSlots = [
    { value: '08:00', label: '08:00 AM' },
    { value: '09:00', label: '09:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '14:00', label: '02:00 PM' },
    { value: '15:00', label: '03:00 PM' },
    { value: '16:00', label: '04:00 PM' },
    { value: '17:00', label: '05:00 PM' },
  ];

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const serviceNumber = `VET-${dayjs().year()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      toast.success(`Service booked successfully! Service No: ${serviceNumber}`);
      navigate('/dashboard/veterinary');
    } catch (error) {
      toast.error('Failed to book service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/veterinary')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Book Veterinary Service
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Schedule a veterinary service for cattle
            </p>
          </div>
        </div>
      </div>

      {/* Service Booking Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Farmer & Cattle Information */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Farmer & Cattle Information
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Farmer <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register('farmerId')}
                    error={errors.farmerId?.message}
                    options={[{ value: '', label: 'Select Farmer' }, ...farmers]}
                    onChange={(e) => {
                      setSelectedFarmer(e.target.value);
                      setValue('farmerId', e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cattle <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register('cattleId')}
                    error={errors.cattleId?.message}
                    options={[
                      { value: '', label: 'Select Cattle' },
                      ...cattleOptions,
                    ]}
                    disabled={!selectedFarmer}
                  />
                </div>
              </div>
            </Card>

            {/* Service Details */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <HeartIcon className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Service Details
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register('serviceType')}
                    error={errors.serviceType?.message}
                    options={[
                      { value: '', label: 'Select Service Type' },
                      ...serviceTypes,
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register('priority')}
                    error={errors.priority?.message}
                    options={priorityOptions}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Veterinarian <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register('veterinarianId')}
                    error={errors.veterinarianId?.message}
                    options={[
                      { value: '', label: 'Select Veterinarian' },
                      ...veterinarians,
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* Schedule */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Schedule
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Visit Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    {...register('visitDate')}
                    error={errors.visitDate?.message}
                    min={dayjs().format('YYYY-MM-DD')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Visit Time <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register('visitTime')}
                    error={errors.visitTime?.message}
                    options={[
                      { value: '', label: 'Select Time Slot' },
                      ...timeSlots,
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* Clinical Information */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BeakerIcon className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Clinical Information
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Symptoms / Reason for Visit
                  </label>
                  <Textarea
                    {...register('symptoms')}
                    error={errors.symptoms?.message}
                    rows={3}
                    placeholder="Describe the symptoms or reason for veterinary visit..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Previous Treatment (if any)
                  </label>
                  <Textarea
                    {...register('previousTreatment')}
                    error={errors.previousTreatment?.message}
                    rows={3}
                    placeholder="Any previous treatment or medication given..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Notes
                  </label>
                  <Textarea
                    {...register('notes')}
                    error={errors.notes?.message}
                    rows={3}
                    placeholder="Any additional information for the veterinarian..."
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Service Summary */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Service Summary
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Service Type
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {serviceType
                      ? serviceTypes.find((t) => t.value === serviceType)?.label
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Priority
                  </p>
                  <p
                    className={`font-medium ${
                      priority === 'EMERGENCY'
                        ? 'text-red-600'
                        : priority === 'URGENT'
                          ? 'text-orange-600'
                          : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {priority
                      ? priorityOptions.find((p) => p.value === priority)?.label
                      : '-'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Estimated Cost */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Estimated Cost
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Service Charges
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    KSh 
                    {serviceType === 'CHECKUP'
                      ? '300'
                      : serviceType === 'VACCINATION'
                        ? '200'
                        : serviceType === 'TREATMENT'
                          ? '800'
                          : serviceType === 'AI'
                            ? '500'
                            : serviceType === 'DEWORMING'
                              ? '150'
                              : serviceType === 'EMERGENCY'
                                ? '1200'
                                : '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Visit Charges
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    KSh 100
                  </span>
                </div>
                {priority === 'EMERGENCY' && (
                  <div className="flex justify-between text-red-600">
                    <span>Emergency Charges</span>
                    <span className="font-medium">KSh 500</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Total Estimate
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      KSh 
                      {serviceType
                        ? parseInt(
                            serviceType === 'CHECKUP'
                              ? '300'
                              : serviceType === 'VACCINATION'
                                ? '200'
                                : serviceType === 'TREATMENT'
                                  ? '800'
                                  : serviceType === 'AI'
                                    ? '500'
                                    : serviceType === 'DEWORMING'
                                      ? '150'
                                      : serviceType === 'EMERGENCY'
                                        ? '1200'
                                        : '0'
                          ) +
                          100 +
                          (priority === 'EMERGENCY' ? 500 : 0)
                        : '100'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                * Actual cost may vary based on medicines and additional procedures
              </p>
            </Card>

            {/* Important Notes */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Important Notes
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li>• Keep the cattle ready before the scheduled time</li>
                <li>• Ensure the cattle is not fed 2 hours before AI service</li>
                <li>• Have previous medical records available</li>
                <li>• Service can be rescheduled up to 2 hours before</li>
              </ul>
            </Card>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <Card>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/veterinary')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Book Service
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default BookServicePage;
