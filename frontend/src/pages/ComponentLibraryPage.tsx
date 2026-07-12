import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiUser, HiHome, HiCog, HiHeart, HiPlus, HiTrash, HiPencil, HiEye
} from 'react-icons/hi2';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import MultiSelect from '../components/ui/MultiSelect';
import SearchBox from '../components/ui/SearchBox';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import Drawer from '../components/ui/Drawer';
import Tabs from '../components/ui/Tabs';
import Timeline from '../components/ui/Timeline';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { ToastContainer } from '../components/ui/Toast';
import type { ToastProps } from '../components/ui/Toast';
import Alert from '../components/ui/Alert';
import FileUpload, { type UploadedFile } from '../components/ui/FileUpload';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Switch from '../components/ui/Switch';
import Checkbox from '../components/ui/Checkbox';
import Radio from '../components/ui/Radio';
import Progress from '../components/ui/Progress';
import Textarea from '../components/ui/Textarea';
import DatePicker from '../components/ui/DatePicker';

const ComponentLibraryPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const addToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const id = Math.random().toString(36);
    const toast: ToastProps = {
      id,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
      message: `This is a ${type} toast message`,
      onClose: removeToast,
    };
    setToasts([...toasts, toast]);
    
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  const multiSelectOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
    { value: '5', label: 'Option 5' },
  ];

  const tableColumns = [
    { id: 'name', header: 'Name', accessor: 'name' as const },
    { id: 'email', header: 'Email', accessor: 'email' as const },
    { id: 'role', header: 'Role', accessor: 'role' as const },
    { id: 'status', header: 'Status', accessor: 'status' as const },
  ];

  const tableData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive' },
  ];

  const timelineItems = [
    {
      id: '1',
      title: 'Project Started',
      description: 'Initial project setup and planning',
      time: '2026-01-01',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'Development Phase',
      description: 'Building core features and components',
      time: '2026-02-15',
      status: 'current' as const,
    },
    {
      id: '3',
      title: 'Testing & QA',
      description: 'Quality assurance and bug fixes',
      time: '2026-03-30',
      status: 'pending' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Component Library
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Comprehensive UI component collection for the Dairy Coop Management System
          </p>
        </motion.div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Various button styles and variants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="danger">Danger Button</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">With Icons</h4>
                <div className="flex flex-wrap gap-3">
                  <Button leftIcon={<HiPlus className="w-5 h-5" />}>Add New</Button>
                  <Button leftIcon={<HiTrash className="w-5 h-5" />} variant="danger">Delete</Button>
                  <Button leftIcon={<HiPencil className="w-5 h-5" />} variant="outline">Edit</Button>
                  <Button leftIcon={<HiEye className="w-5 h-5" />} variant="ghost">View</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">States</h4>
                <div className="flex flex-wrap gap-3">
                  <Button isLoading>Loading...</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
            <CardDescription>Text inputs, selects, and form controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                leftIcon={<HiUser className="w-5 h-5" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                helperText="Must be at least 8 characters"
              />
              <Select
                label="Select Country"
                options={[
                  { value: 'us', label: 'United States' },
                  { value: 'uk', label: 'United Kingdom' },
                  { value: 'ca', label: 'Canada' },
                ]}
              />
              <MultiSelect
                label="Multi Select"
                options={multiSelectOptions}
                value={selectedOptions}
                onChange={setSelectedOptions}
                placeholder="Select multiple options"
              />
              <div className="md:col-span-2">
                <SearchBox
                  placeholder="Search anything..."
                  onSearch={(value) => console.log('Search:', value)}
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  label="Description"
                  placeholder="Enter description"
                  rows={4}
                />
              </div>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Select Date"
              />
            </div>
          </CardContent>
        </Card>

        {/* Checkboxes, Radio, Switch */}
        <Card>
          <CardHeader>
            <CardTitle>Selection Controls</CardTitle>
            <CardDescription>Checkboxes, radio buttons, and toggles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Checkbox</h4>
                <Checkbox
                  label="I agree to the terms and conditions"
                  checked={checkboxValue}
                  onChange={(e) => setCheckboxValue(e.target.checked)}
                />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Radio Buttons</h4>
                <div className="space-y-2">
                  <Radio
                    label="Option 1"
                    checked={radioValue === 'option1'}
                    onChange={() => setRadioValue('option1')}
                  />
                  <Radio
                    label="Option 2"
                    checked={radioValue === 'option2'}
                    onChange={() => setRadioValue('option2')}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Switch</h4>
                <Switch
                  label="Enable notifications"
                  checked={switchValue}
                  onChange={(e) => setSwitchValue(e.target.checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>Data table with sorting and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table
              columns={tableColumns}
              data={tableData}
              onRowClick={(row) => console.log('Clicked:', row)}
            />
          </CardContent>
        </Card>

        {/* Badges & Avatars */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Avatars</CardTitle>
            <CardDescription>Status indicators and user avatars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Badges</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="primary">Primary</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Avatars</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar name="John Doe" size="sm" />
                  <Avatar name="Jane Smith" size="md" />
                  <Avatar name="Bob Johnson" size="lg" />
                  <Avatar src="https://i.pravatar.cc/150?img=1" size="md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Progress bars and indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={25} label="25%" />
              <Progress value={50} label="50%" variant="success" />
              <Progress value={75} label="75%" variant="warning" />
              <Progress value={100} label="Complete" variant="primary" />
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Toasts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Toasts</CardTitle>
            <CardDescription>Notification and alert components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="success" title="Success!" message="Operation completed successfully" />
              <Alert variant="error" title="Error!" message="Something went wrong" />
              <Alert variant="warning" title="Warning!" message="Please review your input" />
              <Alert variant="info" title="Info" message="Here's some helpful information" />

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Toasts with Auto-dismiss</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Toasts automatically dismiss after 5 seconds. Click to trigger notifications.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => addToast('success')} size="sm">Success Toast</Button>
                  <Button onClick={() => addToast('error')} size="sm" variant="danger">Error Toast</Button>
                  <Button onClick={() => addToast('warning')} size="sm" variant="outline">Warning Toast</Button>
                  <Button onClick={() => addToast('info')} size="sm" variant="ghost">Info Toast</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal & Drawer */}
        <Card>
          <CardHeader>
            <CardTitle>Modal & Drawer</CardTitle>
            <CardDescription>Overlay components for dialogs and side panels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setShowModal(true)}>Open Modal</Button>
              <Button onClick={() => setShowDrawer(true)} variant="outline">Open Drawer</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Tabbed navigation component</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              tabs={[
                { id: 'tab1', label: 'Tab 1', icon: <HiHome className="w-5 h-5" />, content: <div className="p-4">Content for Tab 1</div> },
                { id: 'tab2', label: 'Tab 2', icon: <HiUser className="w-5 h-5" />, content: <div className="p-4">Content for Tab 2</div> },
                { id: 'tab3', label: 'Tab 3', icon: <HiCog className="w-5 h-5" />, content: <div className="p-4">Content for Tab 3</div> },
              ]}
              defaultTab="tab1"
            />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Vertical timeline component</CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline items={timelineItems} />
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State</CardTitle>
            <CardDescription>Placeholder for empty data</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<HiHeart className="w-16 h-16" />}
              title="No data yet"
              description="Start by adding your first item"
              action={{
                label: 'Add Item',
                onClick: () => console.log('Add item clicked')
              }}
            />
          </CardContent>
        </Card>

        {/* Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Skeleton</CardTitle>
            <CardDescription>Loading placeholders with shimmer effects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Text Skeletons</h4>
                <div className="space-y-2">
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="60%" height={20} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Circular Skeletons</h4>
                <div className="flex gap-4">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={60} height={60} />
                  <Skeleton variant="circular" width={80} height={80} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Rectangular Skeletons</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton variant="rectangular" width="100%" height={100} />
                  <Skeleton variant="rectangular" width="100%" height={100} />
                  <Skeleton variant="rectangular" width="100%" height={100} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <Card>
          <CardHeader>
            <CardTitle>Pagination</CardTitle>
            <CardDescription>Page navigation component</CardDescription>
          </CardHeader>
          <CardContent>
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>File upload component with drag and drop</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              value={uploadedFiles}
              onChange={setUploadedFiles}
              maxSize={5 * 1024 * 1024}
              accept="image/*,.pdf"
            />
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Modal Title"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => setShowModal(false)}>Confirm</Button>
          </>
        }
      >
        <p className="text-slate-600 dark:text-slate-400">
          This is a modal dialog. It can contain any content you want.
        </p>
      </Modal>

      {/* Drawer */}
      <Drawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title="Drawer Title"
      >
        <p className="text-slate-600 dark:text-slate-400">
          This is a drawer component. Perfect for side panels and filters.
        </p>
      </Drawer>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} position="top-right" />
    </div>
  );
};

export default ComponentLibraryPage;
