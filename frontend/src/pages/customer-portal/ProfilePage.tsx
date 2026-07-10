import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiUser,
  HiMapPin,
  HiPencil,
  HiPlus,
  HiTrash,
  HiCheckCircle,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { customerPortalService } from '../../services/customerPortalService';
import toast from 'react-hot-toast';

interface CustomerProfile {
  customerId: string;
  customerName: string;
  businessName?: string;
  customerType: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  gstNumber?: string;
  creditLimit: number;
  creditDays: number;
  outstandingAmount: number;
  totalSales: number;
  status: string;
}

interface DeliveryAddress {
  id?: string;
  addressType: 'HOME' | 'OFFICE' | 'OTHER';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
  isDefault: boolean;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editForm, setEditForm] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
  });
  const [addressForm, setAddressForm] = useState<DeliveryAddress>({
    addressType: 'HOME',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    landmark: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await customerPortalService.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        setEditForm({
          customerName: response.data.customerName,
          phoneNumber: response.data.phoneNumber,
          email: response.data.email || '',
          address: response.data.address || '',
          city: response.data.city || '',
          state: response.data.state || '',
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await customerPortalService.getDeliveryAddresses();
      if (response.success && response.data) {
        setAddresses(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await customerPortalService.updateProfile(editForm);
      if (response.success) {
        toast.success('Profile updated successfully');
        setShowEditProfile(false);
        fetchProfile();
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async () => {
    if (!addressForm.addressLine1 || !addressForm.city || !addressForm.state || !addressForm.pinCode) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await customerPortalService.saveDeliveryAddress(addressForm);
      if (response.success) {
        toast.success('Address added successfully');
        setShowAddAddress(false);
        setAddressForm({
          addressType: 'HOME',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pinCode: '',
          landmark: '',
          isDefault: false,
        });
        fetchAddresses();
      }
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="p-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">Profile not found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your profile and delivery addresses
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <HiUser className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {profile.customerName}
              </h2>
              {profile.businessName && (
                <p className="text-sm text-slate-600 dark:text-slate-400">{profile.businessName}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={profile.status === 'ACTIVE' ? 'success' : 'info'}>
                  {profile.status}
                </Badge>
                <Badge variant="info">{profile.customerType}</Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowEditProfile(true)}
          >
            <HiPencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Customer ID</p>
            <p className="font-semibold text-slate-900 dark:text-white">{profile.customerId}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Phone Number</p>
            <p className="font-semibold text-slate-900 dark:text-white">{profile.phoneNumber}</p>
          </div>
          {profile.email && (
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Email</p>
              <p className="font-semibold text-slate-900 dark:text-white">{profile.email}</p>
            </div>
          )}
          {profile.address && (
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Address</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {profile.address}, {profile.city}, {profile.state}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Credit Limit</p>
            <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
              KSh {profile.creditLimit.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Outstanding Amount</p>
            <p className="text-xl font-bold text-error-600 dark:text-error-400">
              KSh {profile.outstandingAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Sales</p>
            <p className="text-xl font-bold text-success-600 dark:text-success-400">
              KSh {profile.totalSales.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Delivery Addresses
        </h2>
        <Button
          variant="primary"
          onClick={() => setShowAddAddress(true)}
        >
          <HiPlus className="w-5 h-5 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="p-12 text-center">
          <HiMapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">No addresses added yet</p>
          <Button
            variant="primary"
            onClick={() => setShowAddAddress(true)}
          >
            Add Your First Address
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{address.addressType}</Badge>
                    {address.isDefault && (
                      <Badge variant="success">Default</Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <HiTrash className="w-4 h-4 text-error-600" />
                  </Button>
                </div>
                <p className="text-slate-900 dark:text-white font-medium mb-1">
                  {address.addressLine1}
                </p>
                {address.addressLine2 && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{address.addressLine2}</p>
                )}
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {address.city}, {address.state} {address.pinCode}
                </p>
                {address.landmark && (
                  <p className="text-slate-500 text-sm mt-1">Landmark: {address.landmark}</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        title="Edit Profile"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Customer Name *
            </label>
            <Input
              value={editForm.customerName}
              onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Phone Number *
            </label>
            <Input
              value={editForm.phoneNumber}
              onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Address
            </label>
            <Input
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                City
              </label>
              <Input
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                State
              </label>
              <Input
                value={editForm.state}
                onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditProfile(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateProfile}
              className="flex-1"
            >
              <HiCheckCircle className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAddAddress}
        onClose={() => setShowAddAddress(false)}
        title="Add Delivery Address"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Address Type *
            </label>
            <Select
              value={addressForm.addressType}
              onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value as any })}
              options={[
                { value: 'HOME', label: 'Home' },
                { value: 'OFFICE', label: 'Office' },
                { value: 'OTHER', label: 'Other' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Address Line 1 *
            </label>
            <Input
              value={addressForm.addressLine1}
              onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
              placeholder="Street address, P.O. box"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Address Line 2
            </label>
            <Input
              value={addressForm.addressLine2 || ''}
              onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                City *
              </label>
              <Input
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                State *
              </label>
              <Input
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              PIN Code *
            </label>
            <Input
              value={addressForm.pinCode}
              onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Landmark
            </label>
            <Input
              value={addressForm.landmark || ''}
              onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
              placeholder="Any nearby landmark"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <label htmlFor="isDefault" className="text-sm text-slate-700 dark:text-slate-300">
              Set as default address
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddAddress(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddAddress}
              className="flex-1"
            >
              <HiCheckCircle className="w-5 h-5 mr-2" />
              Add Address
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
