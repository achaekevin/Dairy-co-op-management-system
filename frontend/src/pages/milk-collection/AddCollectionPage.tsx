import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiCheckCircle } from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FormField from '../../components/forms/FormField';
import Card from '../../components/ui/Card';
import Autocomplete from '../../components/ui/Autocomplete';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import { milkCollectionService } from '../../services/milkCollectionService';
import toast from 'react-hot-toast';

const AddCollectionPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    farmerId: '',
    shift: 'MORNING',
    quantity: '',
    fat: '',
    snf: '',
    temperature: '',
  });

  const [selectedFarmer, setSelectedFarmer] = useState<string | null>(null);
  const [qualityResult, setQualityResult] = useState<{
    quality: string;
    rate: number;
    amount: number;
  } | null>(null);

  // Mock farmers for autocomplete
  const farmers = [
    { value: 'FM001', label: 'Joseph Kamau (FM001)' },
    { value: 'FM002', label: 'Mary Wanjiku (FM002)' },
    { value: 'FM003', label: 'Peter Omondi (FM003)' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-calculate quality when all params are entered
    if (formData.quantity && formData.fat && formData.snf && formData.temperature) {
      calculateQuality();
    }
  };

  const calculateQuality = () => {
    const fat = parseFloat(formData.fat);
    const snf = parseFloat(formData.snf);
    const temp = parseFloat(formData.temperature);

    let quality = 'POOR';
    let rate = 40;

    if (fat >= 4.5 && snf >= 8.5 && temp <= 4) {
      quality = 'EXCELLENT';
      rate = 50;
    } else if (fat >= 4.0 && snf >= 8.0 && temp <= 5) {
      quality = 'GOOD';
      rate = 48;
    } else if (fat >= 3.5 && snf >= 7.5 && temp <= 6) {
      quality = 'AVERAGE';
      rate = 45;
    }

    const quantity = parseFloat(formData.quantity);
    const amount = quantity * rate;

    setQualityResult({ quality, rate, amount });
  };

  const handleSubmit = async () => {
    if (!selectedFarmer) {
      toast.error('Please select a farmer');
      return;
    }

    setIsSubmitting(true);
    try {
      const collectionData = {
        farmerId: selectedFarmer,
        date: new Date().toISOString(),
        shift: formData.shift as 'MORNING' | 'EVENING',
        quantity: parseFloat(formData.quantity),
        fat: parseFloat(formData.fat),
        snf: parseFloat(formData.snf),
        temperature: parseFloat(formData.temperature),
        quality: (qualityResult?.quality || 'GOOD') as 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR',
        status: 'ACCEPTED' as const,
      };

      const response = await milkCollectionService.create(collectionData);
      if (response.success) {
        toast.success('Milk collection recorded successfully!');
        navigate('/dashboard/milk-collection');
      }
    } catch (error) {
      toast.error('Failed to record collection');
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
          onClick={() => navigate('/dashboard/milk-collection')}
        >
          <HiArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            New Collection Entry
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Record milk collection details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Farmer Selection */}
              <FormField label="Select Farmer" required>
                <Autocomplete
                  options={farmers}
                  value={selectedFarmer || ''}
                  onChange={(value) => {
                    setSelectedFarmer(value);
                    setFormData({ ...formData, farmerId: value });
                  }}
                  placeholder="Search farmer by name or ID"
                />
              </FormField>

              {/* Shift */}
              <FormField label="Shift" required>
                <Select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  options={[
                    { value: 'MORNING', label: 'Morning' },
                    { value: 'EVENING', label: 'Evening' },
                  ]}
                />
              </FormField>

              {/* Quantity & Quality Parameters */}
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Quantity (Liters)" required>
                  <Input
                    name="quantity"
                    type="number"
                    step="0.1"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="25.0"
                  />
                </FormField>

                <FormField label="Fat %" required>
                  <Input
                    name="fat"
                    type="number"
                    step="0.1"
                    value={formData.fat}
                    onChange={handleChange}
                    placeholder="4.5"
                  />
                </FormField>

                <FormField label="SNF %" required>
                  <Input
                    name="snf"
                    type="number"
                    step="0.1"
                    value={formData.snf}
                    onChange={handleChange}
                    placeholder="8.5"
                  />
                </FormField>

                <FormField label="Temperature (°C)" required>
                  <Input
                    name="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="4.0"
                  />
                </FormField>
              </div>

              {/* Quality Alert */}
              {formData.temperature && parseFloat(formData.temperature) > 6 && (
                <Alert
                  variant="warning"
                  title="High Temperature"
                  message="The milk temperature is above acceptable limits. This collection may be rejected."
                />
              )}

              {/* Calculate Button */}
              <Button
                variant="outline"
                onClick={calculateQuality}
                className="w-full"
                disabled={
                  !formData.quantity ||
                  !formData.fat ||
                  !formData.snf ||
                  !formData.temperature
                }
              >
                Calculate Quality & Amount
              </Button>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard/milk-collection')}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!qualityResult || isSubmitting}
                >
                  <HiCheckCircle className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Collection'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Card */}
        <div>
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Collection Summary
            </h3>

            {qualityResult ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Quality Grade */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Quality Grade
                  </p>
                  <Badge
                    variant={
                      qualityResult.quality === 'EXCELLENT'
                        ? 'success'
                        : qualityResult.quality === 'GOOD'
                        ? 'primary'
                        : qualityResult.quality === 'AVERAGE'
                        ? 'warning'
                        : 'error'
                    }
                    className="text-lg"
                  >
                    {qualityResult.quality}
                  </Badge>
                </div>

                {/* Parameters */}
                <div className="space-y-3">
                  <SummaryItem
                    label="Quantity"
                    value={`${formData.quantity} L`}
                  />
                  <SummaryItem label="Fat" value={`${formData.fat}%`} />
                  <SummaryItem label="SNF" value={`${formData.snf}%`} />
                  <SummaryItem
                    label="Temperature"
                    value={`${formData.temperature}°C`}
                  />
                  <SummaryItem
                    label="Rate per Liter"
                    value={`KSh ${qualityResult.rate}`}
                  />
                </div>

                {/* Total Amount */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      KSh {qualityResult.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <HiCheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Ready to Accept
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Fill in all fields and calculate to see summary
                </p>
              </div>
            )}
          </Card>

          {/* Quality Standards Reference */}
          <Card className="p-6 mt-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Quality Standards
            </h3>
            <div className="space-y-2 text-xs">
              <QualityStandard
                grade="Excellent"
                criteria="Fat = 4.5%, SNF = 8.5%, Temp = 4°C"
                rate="KSh 50/L"
              />
              <QualityStandard
                grade="Good"
                criteria="Fat = 4.0%, SNF = 8.0%, Temp = 5°C"
                rate="KSh 48/L"
              />
              <QualityStandard
                grade="Average"
                criteria="Fat = 3.5%, SNF = 7.5%, Temp = 6°C"
                rate="KSh 45/L"
              />
              <QualityStandard
                grade="Poor"
                criteria="Below average standards"
                rate="KSh 40/L"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
    <span className="text-sm font-medium text-slate-900 dark:text-white">
      {value}
    </span>
  </div>
);

const QualityStandard = ({
  grade,
  criteria,
  rate,
}: {
  grade: string;
  criteria: string;
  rate: string;
}) => (
  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
    <div className="flex items-center justify-between mb-1">
      <span className="font-medium text-slate-900 dark:text-white">
        {grade}
      </span>
      <span className="font-medium text-green-600 dark:text-green-400">
        {rate}
      </span>
    </div>
    <p className="text-slate-600 dark:text-slate-400">{criteria}</p>
  </div>
);

export default AddCollectionPage;
