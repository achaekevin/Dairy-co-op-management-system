import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { HiUser, HiPhone, HiEnvelope, HiMapPin, HiBuildingLibrary } from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  village: string;
  district: string;
  cattle: number;
}

interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

interface MobileMoneyDetails {
  provider: string;
  phoneNumber: string;
  accountName: string;
}

const FarmerProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    gender: 'MALE',
    address: '',
    village: '',
    district: '',
    cattle: 0,
  });
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [mobileMoneyDetails, setMobileMoneyDetails] = useState<MobileMoneyDetails>({
    provider: 'M-PESA',
    phoneNumber: '',
    accountName: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farmer-portal/profile');
      if (response.data.success) {
        const data = response.data.data;
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
          gender: data.gender || 'MALE',
          address: data.address || '',
          village: data.village || '',
          district: data.district || '',
          cattle: data.cattle || 0,
        });
        if (data.bankDetails) {
          setBankDetails(data.bankDetails);
        }
        if (data.mobileMoneyDetails) {
          setMobileMoneyDetails(data.mobileMoneyDetails);
        }
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await api.patch('/farmer-portal/profile', profileData);
      if (response.data.success) {
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleBankDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await api.patch('/farmer-portal/bank-details', {
        bankDetails,
        mobileMoneyDetails,
      });
      if (response.data.success) {
        toast.success('Bank details updated successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update bank details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your personal information and payment details
        </p>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Gender
                </label>
                <select
                  value={profileData.gender}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <HiMapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    rows={2}
                    className="w-full pl-10 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Village
                </label>
                <Input
                  value={profileData.village}
                  onChange={(e) => setProfileData({ ...profileData, village: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  District
                </label>
                <Input
                  value={profileData.district}
                  onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Number of Cattle
                </label>
                <Input
                  type="number"
                  value={profileData.cattle}
                  onChange={(e) => setProfileData({ ...profileData, cattle: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={saving} isLoading={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>

      <form onSubmit={handleBankDetailsSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bank Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Bank Name
                </label>
                <div className="relative">
                  <HiBuildingLibrary className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    placeholder="Kenya Commercial Bank"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Account Number
                </label>
                <Input
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  placeholder="1234567890"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Bank Code / Branch
                </label>
                <Input
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                  placeholder="KCB001"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile Money Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Provider
                </label>
                <select
                  value={mobileMoneyDetails.provider}
                  onChange={(e) => setMobileMoneyDetails({ ...mobileMoneyDetails, provider: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="M-PESA">M-PESA</option>
                  <option value="AIRTEL_MONEY">Airtel Money</option>
                  <option value="T-KASH">T-Kash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="tel"
                    value={mobileMoneyDetails.phoneNumber}
                    onChange={(e) => setMobileMoneyDetails({ ...mobileMoneyDetails, phoneNumber: e.target.value })}
                    placeholder="+254712345678"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Account Name
                </label>
                <Input
                  value={mobileMoneyDetails.accountName}
                  onChange={(e) => setMobileMoneyDetails({ ...mobileMoneyDetails, accountName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={saving} isLoading={saving}>
            {saving ? 'Saving...' : 'Save Payment Details'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FarmerProfilePage;
