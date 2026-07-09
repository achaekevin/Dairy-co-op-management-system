export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  avatar?: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  OPERATOR: 'OPERATOR',
  ACCOUNTANT: 'ACCOUNTANT',
  VIEWER: 'VIEWER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  domain: string;
  subscription: SubscriptionPlan;
  isActive: boolean;
  createdAt: string;
}

export const SubscriptionPlan = {
  TRIAL: 'TRIAL',
  BASIC: 'BASIC',
  PROFESSIONAL: 'PROFESSIONAL',
  ENTERPRISE: 'ENTERPRISE',
} as const;

export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Farmer {
  [key: string]: string | number | undefined;
  id: string;
  farmerId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address: string;
  village: string;
  district: string;
  pinCode: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  aadharNumber: string;
  panNumber?: string;
  photo?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  joinDate: string;
  cattle: number;
  totalShares: number;
  outstandingLoan: number;
  createdAt: string;
  updatedAt: string;
}

export interface MilkCollection {
  id: string;
  farmerId: string;
  farmerName: string;
  date: string;
  shift: 'MORNING' | 'EVENING';
  quantity: number;
  fat: number;
  snf: number;
  temperature: number;
  quality: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  status: 'ACCEPTED' | 'REJECTED';
  reason?: string;
  collectedBy: string;
  centerId: string;
  amount: number;
  createdAt: string;
}

export interface Payment {
  [key: string]: string | number | undefined;
  id: string;
  farmerId: string;
  farmerName: string;
  period: string;
  totalQuantity: number;
  totalAmount: number;
  bonusAmount: number;
  deductionAmount: number;
  netAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  paymentDate?: string;
  paymentMode?: 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';
  transactionId?: string;
  approvedBy?: string;
  createdAt: string;
}

export interface Loan {
  [key: string]: string | number | undefined;
  id: string;
  loanNumber: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'REJECTED';
  appliedDate: string;
  approvedDate?: string;
  disbursementDate?: string;
  closureDate?: string;
  outstandingAmount: number;
  paidAmount: number;
  createdAt: string;
}

export interface Share {
  [key: string]: string | number | undefined;
  id: string;
  shareNumber: string;
  farmerId: string;
  farmerName: string;
  shareCount: number;
  shareValue: number;
  totalValue: number;
  purchaseDate: string;
  status: 'ACTIVE' | 'TRANSFERRED' | 'REDEEMED';
  certificateNumber?: string;
  transferredTo?: string;
  transferDate?: string;
  redemptionDate?: string;
  createdAt: string;
}

export interface VeterinaryService {
  [key: string]: string | number | undefined;
  id: string;
  serviceNumber: string;
  farmerId: string;
  farmerName: string;
  cattleId: string;
  cattleTag: string;
  serviceType: 'CHECKUP' | 'VACCINATION' | 'TREATMENT' | 'AI' | 'DEWORMING' | 'EMERGENCY';
  veterinarianName: string;
  visitDate: string;
  diagnosis: string;
  treatment: string;
  medicines?: string;
  cost: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  followUpDate?: string;
  notes?: string;
  createdAt: string;
}

export interface VaccinationSchedule {
  [key: string]: string | number | undefined;
  id: string;
  farmerId: string;
  farmerName: string;
  cattleId: string;
  cattleTag: string;
  vaccineType: string;
  scheduledDate: string;
  lastVaccinationDate?: string;
  nextDueDate: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  dose: string;
  veterinarianName?: string;
  notes?: string;
}

export interface InventoryItem {
  [key: string]: string | number | undefined;
  id: string;
  itemCode: string;
  itemName: string;
  category: 'CATTLE_FEED' | 'MEDICINE' | 'EQUIPMENT' | 'PACKAGING' | 'CLEANING' | 'OTHER';
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  supplierName: string;
  supplierId: string;
  location: string;
  expiryDate?: string;
  batchNumber?: string;
  lastRestocked: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';
  createdAt: string;
}

export interface PurchaseOrder {
  [key: string]: string | number | undefined;
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'DELIVERED' | 'CANCELLED';
  totalItems: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  createdBy: string;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  [key: string]: string | number | boolean | undefined;
  id: string;
  supplierCode: string;
  name: string;
  category: string;
  contactPerson: string;
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  creditLimit: number;
  creditDays: number;
  outstandingAmount: number;
  totalPurchases: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  rating: number;
  createdAt: string;
}

export interface StockTransaction {
  [key: string]: string | number | undefined;
  id: string;
  transactionNumber: string;
  itemId: string;
  itemName: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  unit: string;
  reason: string;
  referenceNumber?: string;
  performedBy: string;
  notes?: string;
  createdAt: string;
}

export interface Vehicle {
  [key: string]: string | number | boolean | undefined;
  id: string;
  vehicleNumber: string;
  vehicleType: 'MILK_TANKER' | 'DELIVERY_VAN' | 'TRUCK' | 'CAR' | 'BIKE';
  brand: string;
  model: string;
  capacity: number;
  fuelType: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC';
  purchaseDate: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  lastService: string;
  nextService: string;
  currentMileage: number;
  driverName?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  createdAt: string;
}

export interface Employee {
  [key: string]: string | number | boolean | undefined;
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth: string;
  dateOfJoining: string;
  salary: number;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  aadharNumber: string;
  panNumber?: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED';
  photo?: string;
  createdAt: string;
}

export interface Customer {
  [key: string]: string | number | undefined;
  id: string;
  customerId: string;
  customerName: string;
  businessName?: string;
  customerType: 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR' | 'INSTITUTION';
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber?: string;
  creditLimit: number;
  creditDays: number;
  outstandingAmount: number;
  totalSales: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  createdAt: string;
}

export interface Sale {
  [key: string]: string | number | undefined;
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  saleDate: string;
  totalItems: number;
  totalAmount: number;
  discount: number;
  taxAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMode?: 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT';
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
}

export interface Meeting {
  [key: string]: string | number | boolean | undefined;
  id: string;
  meetingNumber: string;
  title: string;
  meetingType: 'BOARD' | 'GENERAL' | 'COMMITTEE' | 'SPECIAL' | 'AGM';
  date: string;
  time: string;
  venue: string;
  agenda: string;
  conductedBy: string;
  totalAttendees: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
  minutes?: string;
  decisions?: string;
  createdAt: string;
}

export interface AccountTransaction {
  [key: string]: string | number | undefined;
  id: string;
  transactionNumber: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  amount: number;
  paymentMode: 'CASH' | 'BANK' | 'CHEQUE' | 'UPI' | 'CARD';
  referenceNumber?: string;
  accountHead: string;
  createdBy: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalFarmers: number;
  activeFarmers: number;
  milkCollectedToday: number;
  milkCollectedMonth: number;
  revenueToday: number;
  revenueMonth: number;
  outstandingLoans: number;
  pendingPayments: number;
  qualityScore: number;
  rejectedMilkToday: number;
}

export interface ChartData {
  name: string;
  value: number;
  label?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  badge?: number;
  permissions?: UserRole[];
}

export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface QualityTest {
  [key: string]: string | number | undefined;
  id: string;
  testNumber: string;
  date: string;
  time: string;
  sampleType: 'INCOMING_MILK' | 'PROCESSED_MILK' | 'BUTTER' | 'GHEE' | 'PANEER' | 'CURD';
  batchNumber?: string;
  farmerId?: string;
  farmerName?: string;
  testedBy: string;
  fat: number;
  snf: number;
  protein: number;
  lactose: number;
  temperature: number;
  ph: number;
  acidity: number;
  density: number;
  alcoholTest: 'PASS' | 'FAIL';
  cob: 'PASS' | 'FAIL';
  mbrt: number;
  coliformCount: number;
  overallResult: 'PASS' | 'FAIL' | 'RETEST';
  remarks?: string;
  status: 'PENDING' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedDate?: string;
  createdAt: string;
}

export interface QualityStandard {
  [key: string]: string | number | boolean | undefined;
  id: string;
  sampleType: string;
  parameter: string;
  minValue?: number;
  maxValue?: number;
  unit: string;
  acceptableRange: string;
  criticalLimit: string;
  isActive: boolean;
  updatedAt: string;
}
