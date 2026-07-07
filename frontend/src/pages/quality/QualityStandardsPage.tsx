import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Switch from '../../components/ui/Switch';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { QualityStandard, Column } from '../../types';
import toast from 'react-hot-toast';

const QualityStandardsPage = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    sampleType: 'INCOMING_MILK',
    parameter: '',
    minValue: '',
    maxValue: '',
    unit: '',
    acceptableRange: '',
    criticalLimit: '',
    isActive: true,
  });

  // Mock data
  const standards: QualityStandard[] = [
    {
      id: '1',
      sampleType: 'INCOMING_MILK',
      parameter: 'Fat',
      minValue: 3.5,
      maxValue: 6.0,
      unit: '%',
      acceptableRange: '3.5 - 6.0%',
      criticalLimit: '< 3.0%',
      isActive: true,
      updatedAt: '2024-01-10',
    },
    {
      id: '2',
      sampleType: 'INCOMING_MILK',
      parameter: 'SNF (Solids Not Fat)',
      minValue: 7.5,
      maxValue: 9.5,
      unit: '%',
      acceptableRange: '7.5 - 9.5%',
      criticalLimit: '< 7.0%',
      isActive: true,
      updatedAt: '2024-01-10',
    },
    {
      id: '3',
      sampleType: 'INCOMING_MILK',
      parameter: 'Temperature',
      minValue: 0,
      maxValue: 6,
      unit: '°C',
      acceptableRange: '0 - 6°C',
      criticalLimit: '> 8°C',
      isActive: true,
      updatedAt: '2024-01-10',
    },
    {
      id: '4',
      sampleType: 'INCOMING_MILK',
      parameter: 'pH Level',
      minValue: 6.4,
      maxValue: 6.8,
      unit: 'pH',
      acceptableRange: '6.4 - 6.8',
      criticalLimit: '< 6.4 or > 6.9',
      isActive: true,
      updatedAt: '2024-01-10',
    },
    {
      id: '5',
      sampleType: 'INCOMING_MILK',
      parameter: 'Acidity',
      minValue: 0.12,
      maxValue: 0.16,
      unit: '%',
      acceptableRange: '0.12 - 0.16%',
      criticalLimit: '> 0.18%',
      isActive: true,
      updatedAt: '2024-01-10',
    },
    {
      id: '6',
      sampleType: 'INCOMING_MILK',
      parameter: 'MBRT (Methylene Blue)',
      minValue: 4.0,
      unit: 'hours',
      acceptableRange: '≥ 4.0 hours',
      criticalLimit: '< 3.0 hours',
      isActive: true,
      updatedAt: '2024-01-10',
    },
    {
      id: '7',
      sampleType: 'INCOMING_MILK',
      parameter: 'Coliform Count',
      minValue: 0,
      maxValue: 5,
      unit: 'cfu/ml',
      acceptableRange: '0 - 5 cfu/ml',
      criticalLimit: '> 10 cfu/ml',
      isActive: true,
      updatedAt: '2024-01-10',
    },
    {
      id: '8',
      sampleType: 'PROCESSED_MILK',
      parameter: 'Fat',
      minValue: 3.0,
      maxValue: 3.5,
      unit: '%',
      acceptableRange: '3.0 - 3.5%',
      criticalLimit: '< 2.8%',
      isActive: true,
      updatedAt: '2024-01-10',
    },
    {
      id: '9',
      sampleType: 'BUTTER',
      parameter: 'Fat',
      minValue: 80,
      maxValue: 82,
      unit: '%',
      acceptableRange: '80 - 82%',
      criticalLimit: '< 78%',
      isActive: true,
      updatedAt: '2024-01-10',
    },
  ];

  const columns: Column<QualityStandard>[] = [
    {
      id: 'sampleType',
      header: 'Sample Type',
      accessor: (row) => (
        <Badge variant="info">{row.sampleType.replace(/_/g, ' ')}</Badge>
      ),
    },
    {
      id: 'parameter',
      header: 'Parameter',
      accessor: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.parameter}
        </span>
      ),
    },
    {
      id: 'acceptableRange',
      header: 'Acceptable Range',
      accessor: (row) => (
        <span className="text-gray-700 dark:text-gray-300">{row.acceptableRange}</span>
      ),
    },
    {
      id: 'criticalLimit',
      header: 'Critical Limit',
      accessor: (row) => (
        <Badge variant="error" size="sm">
          {row.criticalLimit}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.isActive ? 'success' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setFormData({
                sampleType: row.sampleType,
                parameter: row.parameter,
                minValue: row.minValue?.toString() || '',
                maxValue: row.maxValue?.toString() || '',
                unit: row.unit,
                acceptableRange: row.acceptableRange,
                criticalLimit: row.criticalLimit,
                isActive: row.isActive,
              });
              setIsEditModalOpen(true);
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteId(row.id)}
          >
            <TrashIcon className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    toast.success('Quality standard added successfully!');
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    toast.success('Quality standard updated successfully!');
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    toast.success('Quality standard deleted successfully!');
    setDeleteId(null);
  };

  const resetForm = () => {
    setFormData({
      sampleType: 'INCOMING_MILK',
      parameter: '',
      minValue: '',
      maxValue: '',
      unit: '',
      acceptableRange: '',
      criticalLimit: '',
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/quality')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quality Standards
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage quality parameters and acceptable ranges
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Standard
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Standards
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {standards.length}
                </p>
              </div>
              <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/20">
                <CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Standards
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {standards.filter((s) => s.isActive).length}
                </p>
              </div>
              <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/20">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sample Types
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {new Set(standards.map((s) => s.sampleType)).size}
                </p>
              </div>
              <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900/20">
                <CheckCircleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Standards Table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quality Standards ({standards.length})
          </h2>
        </div>
        <Table
          columns={columns}
          data={standards}
        />
      </Card>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add Quality Standard"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
          className="space-y-4"
        >
          <Select
            label="Sample Type"
            value={formData.sampleType}
            onChange={(e) => handleChange('sampleType', e.target.value)}
            options={[
              { value: 'INCOMING_MILK', label: 'Incoming Milk' },
              { value: 'PROCESSED_MILK', label: 'Processed Milk' },
              { value: 'BUTTER', label: 'Butter' },
              { value: 'GHEE', label: 'Ghee' },
              { value: 'PANEER', label: 'Paneer' },
              { value: 'CURD', label: 'Curd' },
            ]}
            required
          />
          <Input
            label="Parameter Name"
            value={formData.parameter}
            onChange={(e) => handleChange('parameter', e.target.value)}
            placeholder="e.g., Fat, SNF, Temperature"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimum Value"
              type="number"
              step="0.01"
              value={formData.minValue}
              onChange={(e) => handleChange('minValue', e.target.value)}
              placeholder="0.00"
            />
            <Input
              label="Maximum Value"
              type="number"
              step="0.01"
              value={formData.maxValue}
              onChange={(e) => handleChange('maxValue', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <Input
            label="Unit"
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            placeholder="e.g., %, °C, pH, hours"
            required
          />
          <Input
            label="Acceptable Range"
            value={formData.acceptableRange}
            onChange={(e) => handleChange('acceptableRange', e.target.value)}
            placeholder="e.g., 3.5 - 6.0%"
            required
          />
          <Input
            label="Critical Limit"
            value={formData.criticalLimit}
            onChange={(e) => handleChange('criticalLimit', e.target.value)}
            placeholder="e.g., < 3.0%"
            required
          />
          <Switch
            label="Active Status"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Add Standard
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit Quality Standard"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
          className="space-y-4"
        >
          <Select
            label="Sample Type"
            value={formData.sampleType}
            onChange={(e) => handleChange('sampleType', e.target.value)}
            options={[
              { value: 'INCOMING_MILK', label: 'Incoming Milk' },
              { value: 'PROCESSED_MILK', label: 'Processed Milk' },
              { value: 'BUTTER', label: 'Butter' },
              { value: 'GHEE', label: 'Ghee' },
              { value: 'PANEER', label: 'Paneer' },
              { value: 'CURD', label: 'Curd' },
            ]}
            required
          />
          <Input
            label="Parameter Name"
            value={formData.parameter}
            onChange={(e) => handleChange('parameter', e.target.value)}
            placeholder="e.g., Fat, SNF, Temperature"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimum Value"
              type="number"
              step="0.01"
              value={formData.minValue}
              onChange={(e) => handleChange('minValue', e.target.value)}
              placeholder="0.00"
            />
            <Input
              label="Maximum Value"
              type="number"
              step="0.01"
              value={formData.maxValue}
              onChange={(e) => handleChange('maxValue', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <Input
            label="Unit"
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            placeholder="e.g., %, °C, pH, hours"
            required
          />
          <Input
            label="Acceptable Range"
            value={formData.acceptableRange}
            onChange={(e) => handleChange('acceptableRange', e.target.value)}
            placeholder="e.g., 3.5 - 6.0%"
            required
          />
          <Input
            label="Critical Limit"
            value={formData.criticalLimit}
            onChange={(e) => handleChange('criticalLimit', e.target.value)}
            placeholder="e.g., < 3.0%"
            required
          />
          <Switch
            label="Active Status"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Update Standard
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Quality Standard"
        message="Are you sure you want to delete this quality standard? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default QualityStandardsPage;
