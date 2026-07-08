export interface FarmerDashboardStats {
  todaysMilkDelivery: number;
  monthlyMilkDelivered: number;
  currentBalance: number;
  activeLoans: number;
  sharesOwned: number;
  unreadNotifications: number;
}

export interface DeliveryHistory {
  id: string;
  date: Date;
  shift: 'MORNING' | 'EVENING';
  quantity: number;
  fat: number;
  snf: number;
  quality: string;
  rate: number;
  amount: number;
  status: 'ACCEPTED' | 'REJECTED';
  reason?: string;
}

export interface QualityResult {
  date: Date;
  shift: string;
  temperature: number;
  fat: number;
  snf: number;
  quality: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  status: 'ACCEPTED' | 'REJECTED';
  feedback?: string;
}

export interface MilkStatement {
  period: string;
  totalQuantity: number;
  totalAmount: number;
  averageQuality: string;
  collections: {
    date: Date;
    shift: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  summary: {
    morningCollections: number;
    eveningCollections: number;
    excellentQuality: number;
    goodQuality: number;
    averageQuality: number;
  };
}

export interface CollectionReceipt {
  receiptNumber: string;
  date: Date;
  shift: string;
  quantity: number;
  fat: number;
  snf: number;
  quality: string;
  rate: number;
  amount: number;
  farmerName: string;
  farmerCode: string;
  collectedBy: string;
  centerId?: string;
}

export interface FarmerPayment {
  id: string;
  paymentNumber: string;
  period: string;
  totalQuantity: number;
  totalAmount: number;
  bonusAmount: number;
  deductionAmount: number;
  netAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID';
  paymentDate?: Date;
  paymentMode?: string;
  transactionId?: string;
}

export interface PaymentStatement {
  period: string;
  openingBalance: number;
  milkSales: number;
  bonuses: number;
  deductions: {
    loans: number;
    shares: number;
    other: number;
  };
  payments: number;
  closingBalance: number;
  transactions: {
    date: Date;
    description: string;
    debit: number;
    credit: number;
    balance: number;
  }[];
}

export interface LoanApplication {
  amount: number;
  purpose: string;
  tenure: number;
  guarantor1?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  guarantor2?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

export interface FarmerLoan {
  id: string;
  loanNumber: string;
  amount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'REJECTED';
  appliedDate: Date;
  approvedDate?: Date;
  disbursementDate?: Date;
  nextEmiDate?: Date;
}

export interface LoanRepaymentSchedule {
  loanNumber: string;
  amount: number;
  emiAmount: number;
  installments: {
    installmentNumber: number;
    dueDate: Date;
    principal: number;
    interest: number;
    totalEmi: number;
    paid: boolean;
    paidDate?: Date;
    balance: number;
  }[];
  totalPaid: number;
  totalRemaining: number;
}

export interface FarmerShare {
  id: string;
  shareNumber: string;
  shareCount: number;
  shareValue: number;
  totalValue: number;
  purchaseDate: Date;
  certificateNumber?: string;
  status: 'ACTIVE' | 'TRANSFERRED' | 'REDEEMED';
}

export interface DividendHistory {
  year: number;
  shareCount: number;
  dividendRate: number;
  grossDividend: number;
  tax: number;
  netDividend: number;
  paymentDate?: Date;
  status: 'PENDING' | 'PAID';
}

export interface ShareStatement {
  totalShares: number;
  totalValue: number;
  totalDividends: number;
  shares: FarmerShare[];
  dividends: DividendHistory[];
}

export interface FarmerAnimal {
  id: string;
  tagNumber: string;
  name?: string;
  breed: string;
  category: 'COW' | 'BULL' | 'HEIFER' | 'CALF';
  age: number;
  gender: 'MALE' | 'FEMALE';
  status: 'ACTIVE' | 'SICK' | 'PREGNANT' | 'SOLD' | 'DEAD';
  lastVaccination?: Date;
  nextVaccinationDue?: Date;
}

export interface VaccinationSchedule {
  animalId: string;
  tagNumber: string;
  animalName?: string;
  vaccineName: string;
  dueDate: Date;
  status: 'DUE' | 'OVERDUE' | 'COMPLETED';
  lastVaccinated?: Date;
}

export interface TreatmentHistory {
  animalId: string;
  tagNumber: string;
  disease: string;
  treatmentDate: Date;
  medication: string;
  treatedBy: string;
  outcome?: 'RECOVERED' | 'UNDER_TREATMENT' | 'DIED';
  cost?: number;
}

export interface FarmerProfile {
  farmerId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  village?: string;
  district?: string;
  cattle: number;
  joinDate: Date;
  membershipStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface BankDetails {
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface MobileMoneyDetails {
  provider?: string;
  phoneNumber?: string;
  accountName?: string;
}

export interface FarmerDocument {
  id: string;
  documentType: 'ID_CARD' | 'BANK_STATEMENT' | 'LAND_TITLE' | 'OTHER';
  documentName: string;
  fileUrl: string;
  uploadDate: Date;
}

export interface FarmerNotification {
  id: string;
  type: 'PAYMENT' | 'LOAN' | 'MEETING' | 'VACCINATION' | 'GENERAL';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  actionUrl?: string;
}
