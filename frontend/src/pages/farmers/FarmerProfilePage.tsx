import { useParams, useNavigate } from 'react-router-dom';
import {
  HiArrowLeft,
  HiPencil,
  HiTrash,
  HiPhone,
  HiEnvelope,
  HiMapPin,
  HiBuildingLibrary,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import Divider from '../../components/ui/Divider';
import type { Farmer } from '../../types';

const FarmerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock farmer data
  const farmer: Farmer = {
    id: id || '1',
    farmerId: 'FM001',
    firstName: 'Ramesh',
    lastName: 'Kumar',
    phoneNumber: '+91 98765 43210',
    email: 'ramesh.kumar@example.com',
    dateOfBirth: '1980-05-15',
    gender: 'MALE',
    address: '123 Village Road',
    village: 'Green Valley',
    district: 'Mumbai',
    pinCode: '400001',
    bankName: 'State Bank',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    aadharNumber: '1234-5678-9012',
    panNumber: 'ABCDE1234F',
    status: 'ACTIVE',
    joinDate: '2020-01-15',
    cattle: 5,
    totalShares: 10,
    outstandingLoan: 50000,
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  };

  // Mock data for tabs
  const milkHistory = [
    {
      date: '2024-01-15',
      shift: 'Morning',
      quantity: '25 L',
      fat: '4.5%',
      snf: '8.5%',
      amount: '₹1,250',
      status: 'Accepted',
    },
    {
      date: '2024-01-15',
      shift: 'Evening',
      quantity: '22 L',
      fat: '4.2%',
      snf: '8.3%',
      amount: '₹1,100',
      status: 'Accepted',
    },
  ];

  const paymentHistory = [
    {
      date: '2024-01-01',
      period: 'December 2023',
      quantity: '750 L',
      amount: '₹37,500',
      deductions: '₹2,500',
      netAmount: '₹35,000',
      status: 'Paid',
    },
  ];

  const loanHistory = [
    {
      loanNo: 'LN001',
      date: '2023-06-01',
      amount: '₹50,000',
      interest: '12%',
      emi: '₹5,000',
      outstanding: '₹30,000',
      status: 'Active',
    },
  ];

  const overviewTab = (
    <div className="space-y-6">
      {/* Personal Info */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Farmer ID" value={farmer.farmerId} />
          <InfoItem label="Full Name" value={`${farmer.firstName} ${farmer.lastName}`} />
          <InfoItem label="Date of Birth" value={farmer.dateOfBirth} />
          <InfoItem label="Gender" value={farmer.gender} />
          <InfoItem label="Join Date" value={farmer.joinDate} />
          <InfoItem label="Status" value={<Badge variant="success">{farmer.status}</Badge>} />
        </div>
      </div>

      <Divider />

      {/* Contact Info */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Phone" value={farmer.phoneNumber} icon={<HiPhone />} />
          <InfoItem label="Email" value={farmer.email || 'N/A'} icon={<HiEnvelope />} />
          <InfoItem label="Address" value={farmer.address} icon={<HiMapPin />} className="md:col-span-2" />
          <InfoItem label="Village" value={farmer.village} />
          <InfoItem label="District" value={farmer.district} />
          <InfoItem label="PIN Code" value={farmer.pinCode} />
        </div>
      </div>

      <Divider />

      {/* Bank Info */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Bank Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Bank Name" value={farmer.bankName} icon={<HiBuildingLibrary />} />
          <InfoItem label="Account Number" value={farmer.accountNumber} />
          <InfoItem label="IFSC Code" value={farmer.ifscCode} />
        </div>
      </div>

      <Divider />

      {/* Additional Info */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Number of Cattle" value={farmer.cattle} />
          <InfoItem label="Total Shares" value={farmer.totalShares} />
          <InfoItem label="Outstanding Loan" value={`₹${farmer.outstandingLoan.toLocaleString()}`} />
          <InfoItem label="Aadhar Number" value={farmer.aadharNumber} />
          <InfoItem label="PAN Number" value={farmer.panNumber || 'N/A'} />
        </div>
      </div>
    </div>
  );

  const milkTab = (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Recent Collections
        </h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Shift</th>
              <th className="text-left py-2">Quantity</th>
              <th className="text-left py-2">Fat</th>
              <th className="text-left py-2">SNF</th>
              <th className="text-right py-2">Amount</th>
              <th className="text-center py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {milkHistory.map((record, index) => (
              <tr key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                <td className="py-3">{record.date}</td>
                <td className="py-3">{record.shift}</td>
                <td className="py-3">{record.quantity}</td>
                <td className="py-3">{record.fat}</td>
                <td className="py-3">{record.snf}</td>
                <td className="py-3 text-right">{record.amount}</td>
                <td className="py-3 text-center">
                  <Badge variant="success">{record.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const paymentTab = (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Payment History
        </h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Period</th>
              <th className="text-left py-2">Quantity</th>
              <th className="text-right py-2">Amount</th>
              <th className="text-right py-2">Deductions</th>
              <th className="text-right py-2">Net Amount</th>
              <th className="text-center py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((record, index) => (
              <tr key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                <td className="py-3">{record.date}</td>
                <td className="py-3">{record.period}</td>
                <td className="py-3">{record.quantity}</td>
                <td className="py-3 text-right">{record.amount}</td>
                <td className="py-3 text-right text-red-600">{record.deductions}</td>
                <td className="py-3 text-right font-semibold">{record.netAmount}</td>
                <td className="py-3 text-center">
                  <Badge variant="success">{record.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const loanTab = (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Loan History
        </h3>
        <Button variant="primary" size="sm">
          Apply New Loan
        </Button>
      </div>
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2">Loan No</th>
              <th className="text-left py-2">Date</th>
              <th className="text-right py-2">Amount</th>
              <th className="text-left py-2">Interest</th>
              <th className="text-right py-2">EMI</th>
              <th className="text-right py-2">Outstanding</th>
              <th className="text-center py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loanHistory.map((record, index) => (
              <tr key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                <td className="py-3">{record.loanNo}</td>
                <td className="py-3">{record.date}</td>
                <td className="py-3 text-right">{record.amount}</td>
                <td className="py-3">{record.interest}</td>
                <td className="py-3 text-right">{record.emi}</td>
                <td className="py-3 text-right font-semibold text-amber-600">{record.outstanding}</td>
                <td className="py-3 text-center">
                  <Badge variant="warning">{record.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', content: overviewTab },
    { id: 'milk', label: 'Milk History', content: milkTab },
    { id: 'payments', label: 'Payments', content: paymentTab },
    { id: 'loans', label: 'Loans', content: loanTab },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              Farmer Profile
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              View farmer details and history
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/farmers/${id}/edit`)}
          >
            <HiPencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="danger">
            <HiTrash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar
            name={`${farmer.firstName} ${farmer.lastName}`}
            size="2xl"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {farmer.firstName} {farmer.lastName}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {farmer.farmerId}
                </p>
              </div>
              <Badge variant="success">{farmer.status}</Badge>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">
              <StatItem label="Cattle" value={farmer.cattle} />
              <StatItem label="Shares" value={farmer.totalShares} />
              <StatItem
                label="Outstanding Loan"
                value={`₹${farmer.outstandingLoan.toLocaleString()}`}
              />
              <StatItem label="Member Since" value={new Date(farmer.joinDate).getFullYear()} />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="p-6">
        <Tabs tabs={tabs} defaultTab="overview" />
      </Card>
    </div>
  );
};

const InfoItem = ({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
    <div className="flex items-center gap-2">
      {icon && <span className="text-slate-400">{icon}</span>}
      <p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const StatItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
    <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
  </div>
);

export default FarmerProfilePage;
