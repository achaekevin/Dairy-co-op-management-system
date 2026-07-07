import { useState } from 'react';
import {
  HiCog6Tooth,
  HiPaintBrush,
  HiBell,
  HiShieldCheck,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Switch from '../../components/ui/Switch';
import Tabs from '../../components/ui/Tabs';
import FormField from '../../components/forms/FormField';
import Card from '../../components/ui/Card';
import Divider from '../../components/ui/Divider';
import { useThemeStore } from '../../store/themeStore';

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
  });

  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] });
  };

  const handleChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const generalTab = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Cooperative Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Cooperative Name" required>
            <Input defaultValue="Green Valley Dairy Cooperative" />
          </FormField>
          <FormField label="Registration Number">
            <Input defaultValue="COOP-2024-001" />
          </FormField>
          <FormField label="Contact Email" required>
            <Input type="email" defaultValue="info@greenvalley.coop" />
          </FormField>
          <FormField label="Contact Phone">
            <Input defaultValue="+91 98765 43210" />
          </FormField>
          <FormField label="Address" className="md:col-span-2">
            <Input defaultValue="123 Main Street, Mumbai, Maharashtra" />
          </FormField>
        </div>
      </div>

      <Divider />

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Regional Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Language">
            <Select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'Hindi' },
                { value: 'mr', label: 'Marathi' },
              ]}
            />
          </FormField>
          <FormField label="Timezone">
            <Select
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              options={[
                { value: 'Asia/Kolkata', label: 'India (IST)' },
                { value: 'Asia/Dubai', label: 'Dubai (GST)' },
              ]}
            />
          </FormField>
          <FormField label="Date Format">
            <Select
              value={settings.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              options={[
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              ]}
            />
          </FormField>
          <FormField label="Currency">
            <Select
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              options={[
                { value: 'INR', label: 'Indian Rupee (₹)' },
                { value: 'USD', label: 'US Dollar ($)' },
              ]}
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary">Save Changes</Button>
      </div>
    </div>
  );

  const appearanceTab = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Theme
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Choose how the application looks to you
        </p>
        <div className="grid grid-cols-3 gap-4">
          {['light', 'dark', 'system'].map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption as 'light' | 'dark' | 'system')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === themeOption
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    themeOption === 'light'
                      ? 'bg-white border-2 border-slate-300'
                      : themeOption === 'dark'
                      ? 'bg-slate-900'
                      : 'bg-gradient-to-r from-white to-slate-900'
                  }`}
                >
                  {themeOption === 'light' && '☀️'}
                  {themeOption === 'dark' && '🌙'}
                  {themeOption === 'system' && '💻'}
                </div>
                <p className="text-sm font-medium capitalize text-slate-900 dark:text-white">
                  {themeOption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Divider />

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Accent Color
        </h3>
        <div className="grid grid-cols-6 gap-3">
          {['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6'].map(
            (color) => (
              <button
                key={color}
                className="w-12 h-12 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );

  const notificationsTab = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Email Notifications
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Push Notifications
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive push notifications in browser
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                SMS Notifications
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive important alerts via SMS
              </p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onChange={() => handleToggle('smsNotifications')}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const securityTab = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
              Two-Factor Authentication
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Not enabled
            </p>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
              Active Sessions
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              3 active sessions
            </p>
            <Button variant="outline" size="sm">
              Manage Sessions
            </Button>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
              API Keys
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Manage API access keys
            </p>
            <Button variant="outline" size="sm">
              View Keys
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'general',
      label: 'General',
      icon: <HiCog6Tooth className="w-4 h-4" />,
      content: generalTab,
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <HiPaintBrush className="w-4 h-4" />,
      content: appearanceTab,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <HiBell className="w-4 h-4" />,
      content: notificationsTab,
    },
    {
      id: 'security',
      label: 'Security',
      icon: <HiShieldCheck className="w-4 h-4" />,
      content: securityTab,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your application settings and preferences
        </p>
      </div>

      <Card className="p-6">
        <Tabs tabs={tabs} defaultTab="general" />
      </Card>
    </div>
  );
};

export default SettingsPage;
