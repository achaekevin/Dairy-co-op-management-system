export interface ManagerDashboardStats {
  todaysMilkCollection: number;
  farmersServedToday: number;
  revenueToday: number;
  pendingLoanApprovals: number;
  lowStockAlerts: number;
  pendingPayments: number;
  activeEmployees: number;
  qualitySummary: QualitySummary;
}

export interface QualitySummary {
  excellent: number;
  good: number;
  average: number;
  poor: number;
  totalTests: number;
  averageQuality: string;
}

export interface FarmerPerformance {
  farmerId: string;
  farmerName: string;
  totalMilk: number;
  averageQuality: string;
  totalRevenue: number;
  lastCollection: Date;
  status: string;
}

export interface CollectionSummary {
  totalCollection: number;
  morningShift: number;
  eveningShift: number;
  acceptedMilk: number;
  rejectedMilk: number;
  totalFarmers: number;
  averageQuality: number;
}

export interface CollectionCenterStats {
  centerId: string;
  centerName: string;
  totalCollection: number;
  farmerCount: number;
  qualityAverage: number;
}

export interface LoanApplicationReview {
  id: string;
  loanNumber: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  purpose: string;
  interestRate: number;
  tenure: number;
  appliedDate: Date;
  status: string;
}

export interface ShareTransaction {
  id: string;
  shareNumber: string;
  farmerId: string;
  farmerName: string;
  shareCount: number;
  totalValue: number;
  purchaseDate: Date;
  status: string;
}

export interface DividendInfo {
  totalShareCapital: number;
  dividendRate: number;
  totalDividend: number;
  paidDividend: number;
  pendingDividend: number;
}

export interface StaffInfo {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  status: string;
  lastAttendance?: Date;
}

export interface DailyReport {
  date: Date;
  milkCollection: number;
  farmersServed: number;
  revenue: number;
  payments: number;
  newLoans: number;
  quality: QualitySummary;
}
