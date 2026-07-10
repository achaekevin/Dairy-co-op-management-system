import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiArrowLeft,
  HiUser,
  HiMapPin,
  HiBuildingLibrary,
  HiDocumentText,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import FormField from '../../components/forms/FormField';
import Card from '../../components/ui/Card';
import Progress from '../../components/ui/Progress';
import { farmerService, type CreateFarmerData } from '../../services/farmerService';
import toast from 'react-hot-toast';

const AddFarmerPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    phoneNumber: '',
    email: '',
    // Address Info
    address: '',
    village: '',
    district: '',
    pinCode: '',
    // Bank Info
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    // Documents
    aadharNumber: '',
    panNumber: '',
    // Additional
    cattle: '',
    shares: '',
    notes: '',
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      icon: <HiUser className="w-5 h-5" />,
    },
    {
      id: 2,
      title: 'Address Details',
      icon: <HiMapPin className="w-5 h-5" />,
    },
    {
      id: 3,
      title: 'Bank Information',
      icon: <HiBuildingLibrary className="w-5 h-5" />,
    },
    {
      id: 4,
      title: 'Documents & Others',
      icon: <HiDocumentText className="w-5 h-5" />,
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const farmerData: CreateFarmerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email || undefined,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
        address: formData.address,
        village: formData.village,
        district: formData.district,
        pinCode: formData.pinCode,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber || undefined,
        cattle: parseInt(formData.cattle, 10),
        totalShares: formData.shares ? parseInt(formData.shares, 10) : undefined,
      };

      const response = await farmerService.create(farmerData);
      
      if (response.success) {
        toast.success('Farmer added successfully!');
        navigate('/dashboard/farmers');
      }
    } catch (error) {
      toast.error('Failed to add farmer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="First Name" required>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </FormField>

              <FormField label="Last Name" required>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </FormField>

              <FormField label="Date of Birth" required>
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Gender" required>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' },
                    { value: 'OTHER', label: 'Other' },
                  ]}
                />
              </FormField>

              <FormField label="Phone Number" required>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </FormField>

              <FormField label="Email Address">
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="farmer@example.com"
                />
              </FormField>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <FormField label="Address" required>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Village" required>
                <Input
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Village name"
                />
              </FormField>

              <FormField label="District" required>
                <Input
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="District name"
                />
              </FormField>

              <FormField label="PIN Code" required>
                <Input
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="400001"
                />
              </FormField>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Bank Name" required>
                <Input
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Kenya Commercial Bank (KCB)"
                />
              </FormField>

              <FormField label="Account Number" required>
                <Input
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="1234567890"
                />
              </FormField>

              <FormField label="IFSC Code" required>
                <Input
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="SBIN0001234"
                />
              </FormField>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Aadhar Number" required>
                <Input
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  placeholder="1234-5678-9012"
                />
              </FormField>

              <FormField label="PAN Number">
                <Input
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                />
              </FormField>

              <FormField label="Number of Cattle" required>
                <Input
                  name="cattle"
                  type="number"
                  value={formData.cattle}
                  onChange={handleChange}
                  placeholder="5"
                />
              </FormField>

              <FormField label="Initial Shares">
                <Input
                  name="shares"
                  type="number"
                  value={formData.shares}
                  onChange={handleChange}
                  placeholder="10"
                />
              </FormField>

              <FormField label="Notes" className="md:col-span-2">
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes..."
                  rows={4}
                />
              </FormField>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/farmers')}
        >
          <HiArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Add New Farmer
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Fill in the farmer details to register
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-2 ${
                step.id === currentStep
                  ? 'text-primary-600 dark:text-primary-400'
                  : step.id < currentStep
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  step.id === currentStep
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : step.id < currentStep
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {step.icon}
              </div>
              <span className="text-xs font-medium text-center hidden md:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AddFarmerPage;
