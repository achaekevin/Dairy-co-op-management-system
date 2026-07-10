import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowLeft,
  HiUser,
  HiMapPin,
  HiBuildingOffice,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FormField from '../../components/forms/FormField';
import Card from '../../components/ui/Card';
import { customerService, type CreateCustomerData } from '../../services/customerService';
import toast from 'react-hot-toast';

const AddCustomerPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    businessName: '',
    customerType: 'RETAIL',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    gstNumber: '',
    creditLimit: '0',
    creditDays: '0',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const customerData: CreateCustomerData = {
        customerName: formData.customerName,
        businessName: formData.businessName || undefined,
        customerType: formData.customerType as 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR' | 'INSTITUTION',
        phoneNumber: formData.phoneNumber,
        email: formData.email || undefined,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        gstNumber: formData.gstNumber || undefined,
        creditLimit: parseFloat(formData.creditLimit) || 0,
        creditDays: parseInt(formData.creditDays, 10) || 0,
      };

      const response = await customerService.create(customerData);
      
      if (response.success) {
        toast.success('Customer added successfully!');
        navigate('/dashboard/customers');
      } else {
        toast.error(response.message || 'Failed to add customer');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add customer. Please try again.';
      toast.error(errorMessage);
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
          onClick={() => navigate('/dashboard/customers')}
        >
          <HiArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Add New Customer
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Fill in the customer details to register
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          {/* Personal Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <HiUser className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Customer Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Customer Name" required>
                <Input
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                />
              </FormField>

              <FormField label="Business Name">
                <Input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter business name (optional)"
                />
              </FormField>

              <FormField label="Customer Type" required>
                <Select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                  options={[
                    { value: 'RETAIL', label: 'Retail' },
                    { value: 'WHOLESALE', label: 'Wholesale' },
                    { value: 'DISTRIBUTOR', label: 'Distributor' },
                    { value: 'INSTITUTION', label: 'Institution' },
                  ]}
                  required
                />
              </FormField>

              <FormField label="Phone Number" required>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+254 712 345678"
                  required
                />
              </FormField>

              <FormField label="Email Address">
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                />
              </FormField>

              <FormField label="GST Number">
                <Input
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="GST123456789"
                />
              </FormField>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <HiMapPin className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Address Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Address" className="md:col-span-2" required>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  required
                />
              </FormField>

              <FormField label="City" required>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City name"
                  required
                />
              </FormField>

              <FormField label="State" required>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State name"
                  required
                />
              </FormField>

              <FormField label="PIN Code" required>
                <Input
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="400001"
                  required
                />
              </FormField>
            </div>
          </div>

          {/* Credit Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <HiBuildingOffice className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Credit Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Credit Limit (KSh)">
                <Input
                  name="creditLimit"
                  type="number"
                  value={formData.creditLimit}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </FormField>

              <FormField label="Credit Days">
                <Input
                  name="creditDays"
                  type="number"
                  value={formData.creditDays}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </FormField>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/customers')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Customer'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default AddCustomerPage;
