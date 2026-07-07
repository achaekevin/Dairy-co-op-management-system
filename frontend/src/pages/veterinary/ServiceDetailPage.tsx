import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PrinterIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  UserIcon,
  HeartIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data
  const service = {
    id: id || '1',
    serviceNumber: 'VET-2024-002',
    farmerId: 'F-012',
    farmerName: 'Suresh Patel',
    farmerPhone: '+91 98765 43210',
    cattleId: 'C-045',
    cattleTag: 'SP-003',
    cattleBreed: 'Holstein Friesian',
    cattleAge: '4 years',
    serviceType: 'TREATMENT',
    veterinarianName: 'Dr. Verma',
    veterinarianPhone: '+91 98765 12345',
    visitDate: '2024-02-16',
    visitTime: '11:00',
    priority: 'URGENT',
    diagnosis: 'Mastitis - Left quarter',
    symptoms: 'Swelling in left quarter, reduced milk production, fever',
    treatment: 'Intramammary infusion, Anti-inflammatory medication',
    medicines: [
      { name: 'Mastilone Intra-mammary', dosage: '10ml', frequency: 'Once daily', duration: '3 days' },
      { name: 'Meloxicam Injection', dosage: '15ml', frequency: 'Once daily', duration: '3 days' },
      { name: 'Calcium Gluconate', dosage: '450ml IV', frequency: 'Single dose', duration: '1 day' },
    ],
    cost: 850,
    status: 'COMPLETED',
    followUpDate: '2024-02-20',
    followUpNotes: 'Check for improvement in milk production and swelling',
    notes: 'Improvement observed after first treatment. Continue medication as prescribed.',
    createdAt: '2024-02-16T11:00:00Z',
    completedAt: '2024-02-16T12:30:00Z',
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Service cancelled successfully');
      setShowCancelModal(false);
      navigate('/dashboard/veterinary');
    } catch (error) {
      toast.error('Failed to cancel service');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Service marked as completed');
      setShowCompleteModal(false);
    } catch (error) {
      toast.error('Failed to complete service');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'SCHEDULED':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'secondary';
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
              Service Details
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {service.serviceNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print
          </Button>
          {service.status === 'SCHEDULED' && (
            <>
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/dashboard/veterinary/${service.id}/edit`)
                }
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit
              </Button>
              <Button onClick={() => setShowCompleteModal(true)}>
                <CheckIcon className="h-5 w-5 mr-2" />
                Mark Complete
              </Button>
              <Button variant="danger" onClick={() => setShowCancelModal(true)}>
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <HeartIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {service.serviceType.replace('_', ' ')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dayjs(service.visitDate).format('DD MMM YYYY')} at {service.visitTime}
              </p>
            </div>
          </div>
          <Badge variant={getStatusColor(service.status) as 'success' | 'warning' | 'error'}>
            {service.status}
          </Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Farmer & Cattle Information */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Farmer & Cattle Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Farmer Name</p>
                <button
                  onClick={() => navigate(`/dashboard/farmers/${service.farmerId}`)}
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {service.farmerName}
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {service.farmerPhone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cattle Tag</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {service.cattleTag}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Breed</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {service.cattleBreed}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {service.cattleAge}
                </p>
              </div>
            </div>
          </Card>

          {/* Clinical Details */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BeakerIcon className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Clinical Details
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Symptoms
                </p>
                <p className="text-gray-900 dark:text-white">{service.symptoms}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Diagnosis
                </p>
                <p className="text-gray-900 dark:text-white">{service.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Treatment
                </p>
                <p className="text-gray-900 dark:text-white">{service.treatment}</p>
              </div>
            </div>
          </Card>

          {/* Medicines Prescribed */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Medicines Prescribed
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Medicine Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Dosage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {service.medicines.map((medicine, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {medicine.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {medicine.dosage}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {medicine.frequency}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {medicine.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Follow-up & Notes */}
          {(service.followUpDate || service.notes) && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Follow-up & Notes
              </h3>
              <div className="space-y-4">
                {service.followUpDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Follow-up Date
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {dayjs(service.followUpDate).format('DD MMM YYYY')}
                    </p>
                    {service.followUpNotes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {service.followUpNotes}
                      </p>
                    )}
                  </div>
                )}
                {service.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Notes
                    </p>
                    <p className="text-gray-900 dark:text-white">{service.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Veterinarian Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Veterinarian
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {service.veterinarianName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {service.veterinarianPhone}
                </p>
              </div>
            </div>
          </Card>

          {/* Service Cost */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Service Cost
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Service Charges</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{(service.cost * 0.6).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Medicines</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{(service.cost * 0.3).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Visit Charges</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₹{(service.cost * 0.1).toFixed(0)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Total Cost
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ₹{service.cost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Service Booked
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {dayjs(service.createdAt).format('DD MMM YYYY, hh:mm A')}
                  </p>
                </div>
              </div>
              {service.completedAt && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Service Completed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(service.completedAt).format('DD MMM YYYY, hh:mm A')}
                    </p>
                  </div>
                </div>
              )}
              {service.followUpDate && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Follow-up Scheduled
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(service.followUpDate).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Cancel Service Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Service"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to cancel this service? This action cannot be undone.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              rows={3}
              placeholder="Please provide a reason for cancellation..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              disabled={isProcessing}
            >
              Close
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              isLoading={isProcessing}
            >
              Cancel Service
            </Button>
          </div>
        </div>
      </Modal>

      {/* Complete Service Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Service"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Mark this service as completed. Add any final notes or observations.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Treatment Notes (Optional)
            </label>
            <Textarea
              value={treatmentNotes}
              onChange={(e) => setTreatmentNotes(e.target.value)}
              rows={3}
              placeholder="Add any final notes or observations..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCompleteModal(false)}
              disabled={isProcessing}
            >
              Close
            </Button>
            <Button
              onClick={handleComplete}
              isLoading={isProcessing}
            >
              Mark as Complete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceDetailPage;
