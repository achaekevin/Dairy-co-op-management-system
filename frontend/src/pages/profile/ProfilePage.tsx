import { useState, useEffect } from 'react';
import { HiCamera, HiPencil } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import FormField from '../../components/forms/FormField';
import Card from '../../components/ui/Card';
import Divider from '../../components/ui/Divider';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: '',
    bio: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await authService.getProfile();
      if (response.success) {
        const profileData = response.data;
        updateUser(profileData);
        setFormData({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          phoneNumber: profileData.phoneNumber || '',
          address: '',
          bio: '',
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await authService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });
      
      if (response.success) {
        updateUser(response.data);
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const personalInfoTab = (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="relative">
          <Avatar
            name={`${formData.firstName} ${formData.lastName}`}
            size="2xl"
            src={user?.avatar}
          />
          <button className="absolute bottom-0 right-0 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-colors">
            <HiCamera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {user?.role}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="success">Active</Badge>
            <Badge variant="info">{user?.tenantId}</Badge>
          </div>
        </div>

        <Button
          variant={isEditing ? 'primary' : 'outline'}
          size="sm"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <HiPencil className="w-4 h-4 mr-2" />
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="First Name" required>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormField>

        <FormField label="Last Name" required>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormField>

        <FormField label="Email Address" required>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormField>

        <FormField label="Phone Number">
          <Input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormField>

        <FormField label="Address" className="md:col-span-2">
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </FormField>

        <FormField label="Bio" className="md:col-span-2">
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            rows={4}
          />
        </FormField>
      </div>
    </div>
  );

  const activityTab = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Recent Activity
      </h3>
      {[1, 2, 3, 4, 5].map((item) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: item * 0.1 }}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div className="w-2 h-2 bg-primary-600 rounded-full mt-2" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Updated farmer records
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              2 hours ago
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const securityTab = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Change Password
        </h3>
        <div className="space-y-4">
          <FormField label="Current Password" required>
            <Input type="password" placeholder="Enter current password" />
          </FormField>
          <FormField label="New Password" required>
            <Input type="password" placeholder="Enter new password" />
          </FormField>
          <FormField label="Confirm Password" required>
            <Input type="password" placeholder="Confirm new password" />
          </FormField>
          <Button variant="primary">Update Password</Button>
        </div>
      </div>

      <Divider />

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Two-Factor Authentication
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Add an extra layer of security to your account
        </p>
        <Button variant="outline">Enable 2FA</Button>
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      content: personalInfoTab,
    },
    {
      id: 'activity',
      label: 'Activity',
      content: activityTab,
    },
    {
      id: 'security',
      label: 'Security',
      content: securityTab,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your personal information and preferences
        </p>
      </div>

      <Card className="p-6">
        <Tabs tabs={tabs} defaultTab="personal" />
      </Card>
    </div>
  );
};

export default ProfilePage;
