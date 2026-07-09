import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  BeakerIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';
import Autocomplete from '../../components/ui/Autocomplete';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { qualityService } from '../../services/qualityService';

const AddQualityTestPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    time: dayjs().format('HH:mm'),
    sampleType: 'INCOMING_MILK',
    batchNumber: '',
    farmerId: '',
    fat: '',
    snf: '',
    protein: '',
    lactose: '',
    temperature: '',
    ph: '',
    acidity: '',
    density: '',
    alcoholTest: 'PASS',
    cob: 'PASS',
    mbrt: '',
    coliformCount: '',
    remarks: '',
  });

  const [overallResult, setOverallResult] = useState<'PASS' | 'FAIL' | 'RETEST'>('PASS');
  const [qualityGrade, setQualityGrade] = useState('');

  // Mock farmers data
  const farmers = [
    { id: 'F-001', name: 'Rajesh Kumar' },
    { id: 'F-002', name: 'Amit Patel' },
    { id: 'F-003', name: 'Vijay Singh' },
    { id: 'F-004', name: 'Ramesh Sharma' },
    { id: 'F-005', name: 'Suresh Verma' },
  ];

  // Calculate overall result based on parameters
  useEffect(() => {
    const {
      fat,
      snf,
      temperature,
      ph,
      acidity,
      alcoholTest,
      cob,
      mbrt,
      coliformCount,
    } = formData;

    if (
      !fat ||
      !snf ||
      !temperature ||
      !ph ||
      !acidity ||
      !mbrt ||
      !coliformCount
    ) {
      return;
    }

    const fatNum = parseFloat(fat);
    const snfNum = parseFloat(snf);
    const tempNum = parseFloat(temperature);
    const phNum = parseFloat(ph);
    const acidityNum = parseFloat(acidity);
    const mbrtNum = parseFloat(mbrt);
    const coliformNum = parseInt(coliformCount);

    let failCount = 0;
    let retestCount = 0;

    // Check critical parameters
    if (alcoholTest === 'FAIL' || cob === 'FAIL') {
      failCount++;
    }

    // Check fat
    if (formData.sampleType === 'INCOMING_MILK') {
      if (fatNum < 3.0) failCount++;
      else if (fatNum < 3.5) retestCount++;
    }

    // Check SNF
    if (formData.sampleType === 'INCOMING_MILK') {
      if (snfNum < 7.5) failCount++;
      else if (snfNum < 8.0) retestCount++;
    }

    // Check temperature
    if (tempNum > 6) failCount++;
    else if (tempNum > 5) retestCount++;

    // Check pH
    if (phNum < 6.4 || phNum > 6.8) failCount++;
    else if (phNum < 6.5 || phNum > 6.7) retestCount++;

    // Check acidity
    if (acidityNum > 0.18) failCount++;
    else if (acidityNum > 0.16) retestCount++;

    // Check MBRT
    if (mbrtNum < 3.0) failCount++;
    else if (mbrtNum < 4.0) retestCount++;

    // Check coliform
    if (coliformNum > 10) failCount++;
    else if (coliformNum > 5) retestCount++;

    // Determine overall result
    if (failCount > 0) {
      setOverallResult('FAIL');
    } else if (retestCount > 0) {
      setOverallResult('RETEST');
    } else {
      setOverallResult('PASS');
    }

    // Calculate quality grade
    if (failCount === 0 && retestCount === 0) {
      if (fatNum >= 4.5 && snfNum >= 8.5) {
        setQualityGrade('EXCELLENT');
      } else if (fatNum >= 4.0 && snfNum >= 8.0) {
        setQualityGrade('GOOD');
      } else {
        setQualityGrade('AVERAGE');
      }
    } else {
      setQualityGrade('POOR');
    }
  }, [formData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const testData = {
        date: formData.date,
        time: formData.time,
        sampleType: formData.sampleType as any,
        batchNumber: formData.batchNumber || undefined,
        farmerId: formData.farmerId || undefined,
        fat: parseFloat(formData.fat),
        snf: parseFloat(formData.snf),
        protein: parseFloat(formData.protein),
        lactose: parseFloat(formData.lactose),
        temperature: parseFloat(formData.temperature),
        ph: parseFloat(formData.ph),
        acidity: parseFloat(formData.acidity),
        density: parseFloat(formData.density),
        alcoholTest: formData.alcoholTest as 'PASS' | 'FAIL',
        cob: formData.cob as 'PASS' | 'FAIL',
        mbrt: parseFloat(formData.mbrt),
        coliformCount: parseFloat(formData.coliformCount),
        overallResult: 'PASS' as any,
        remarks: formData.remarks || undefined,
      };

      const response = await qualityService.create(testData);
      if (response.success) {
        toast.success('Quality test recorded successfully!');
        navigate('/dashboard/quality');
      }
    } catch (error) {
      toast.error('Failed to record quality test');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            New Quality Test
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Record quality test parameters and results
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Test Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
                <Input
                  label="Test Time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  required
                />
                <div className="md:col-span-2">
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
                </div>
                {formData.sampleType === 'INCOMING_MILK' ? (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Farmer *
                    </label>
                    <Autocomplete
                      options={farmers.map((f) => ({
                        value: f.id,
                        label: `${f.name} (${f.id})`,
                      }))}
                      value={formData.farmerId}
                      onChange={(value) => handleChange('farmerId', value)}
                      placeholder="Search farmer..."
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <Input
                      label="Batch Number"
                      value={formData.batchNumber}
                      onChange={(e) => handleChange('batchNumber', e.target.value)}
                      placeholder="Enter batch number"
                      required
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Composition Parameters */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Composition Parameters
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Fat (%)"
                  type="number"
                  step="0.1"
                  value={formData.fat}
                  onChange={(e) => handleChange('fat', e.target.value)}
                  placeholder="0.0"
                  required
                />
                <Input
                  label="SNF - Solids Not Fat (%)"
                  type="number"
                  step="0.1"
                  value={formData.snf}
                  onChange={(e) => handleChange('snf', e.target.value)}
                  placeholder="0.0"
                  required
                />
                <Input
                  label="Protein (%)"
                  type="number"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => handleChange('protein', e.target.value)}
                  placeholder="0.0"
                  required
                />
                <Input
                  label="Lactose (%)"
                  type="number"
                  step="0.1"
                  value={formData.lactose}
                  onChange={(e) => handleChange('lactose', e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </Card>

            {/* Physical & Chemical Parameters */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Physical & Chemical Parameters
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Temperature (°C)"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                  placeholder="0.0"
                  required
                />
                <Input
                  label="pH Level"
                  type="number"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => handleChange('ph', e.target.value)}
                  placeholder="0.0"
                  required
                />
                <Input
                  label="Acidity (%)"
                  type="number"
                  step="0.01"
                  value={formData.acidity}
                  onChange={(e) => handleChange('acidity', e.target.value)}
                  placeholder="0.00"
                  required
                />
                <Input
                  label="Density (g/ml)"
                  type="number"
                  step="0.001"
                  value={formData.density}
                  onChange={(e) => handleChange('density', e.target.value)}
                  placeholder="1.000"
                />
              </div>
            </Card>

            {/* Microbiological Tests */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Microbiological Tests
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select
                  label="Alcohol Test"
                  value={formData.alcoholTest}
                  onChange={(e) => handleChange('alcoholTest', e.target.value)}
                  options={[
                    { value: 'PASS', label: 'Pass' },
                    { value: 'FAIL', label: 'Fail' },
                  ]}
                  required
                />
                <Select
                  label="COB (Clot on Boiling) Test"
                  value={formData.cob}
                  onChange={(e) => handleChange('cob', e.target.value)}
                  options={[
                    { value: 'PASS', label: 'Pass' },
                    { value: 'FAIL', label: 'Fail' },
                  ]}
                  required
                />
                <Input
                  label="MBRT (hours)"
                  type="number"
                  step="0.1"
                  value={formData.mbrt}
                  onChange={(e) => handleChange('mbrt', e.target.value)}
                  placeholder="0.0"
                  helperText="Methylene Blue Reduction Test"
                  required
                />
                <Input
                  label="Coliform Count (cfu/ml)"
                  type="number"
                  value={formData.coliformCount}
                  onChange={(e) => handleChange('coliformCount', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </Card>

            {/* Remarks */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Additional Notes
              </h2>
              <Textarea
                label="Remarks"
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                placeholder="Enter any additional observations or notes..."
                rows={4}
              />
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Test Result Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="sticky top-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <BeakerIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Test Result
                    </h3>
                    <div className="mt-3">
                      <Badge
                        variant={
                          overallResult === 'PASS'
                            ? 'success'
                            : overallResult === 'FAIL'
                              ? 'error'
                              : 'warning'
                        }
                        size="lg"
                      >
                        {overallResult === 'PASS' && (
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                        )}
                        {overallResult === 'FAIL' && (
                          <XCircleIcon className="h-5 w-5 mr-2" />
                        )}
                        {overallResult}
                      </Badge>
                    </div>
                    {qualityGrade && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quality Grade
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {qualityGrade}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Quick Reference
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fat:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formData.fat || '-'}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">SNF:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formData.snf || '-'}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Temp:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formData.temperature || '-'}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">pH:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formData.ph || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    Save Test Results
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/dashboard/quality')}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Quality Standards Reference */}
            <Card>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Quality Standards (Incoming Milk)
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Excellent
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fat ≥4.5%, SNF ≥8.5%, Temp ≤4°C
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Good</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fat ≥4.0%, SNF ≥8.0%, Temp ≤5°C
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Average
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fat ≥3.5%, SNF ≥7.5%, Temp ≤6°C
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Microbiological
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    MBRT ≥4 hrs, Coliform ≤5 cfu/ml
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddQualityTestPage;
