export interface CreateLoanData {
  loanNumber: string;
  farmerId: string;
  amount: number;
  interestRate: number;
  tenure: number;
  purpose: string;
}

export interface UpdateLoanData {
  interestRate?: number;
  tenure?: number;
  purpose?: string;
  status?: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'REJECTED';
  approvedDate?: Date;
  disbursementDate?: Date;
  closureDate?: Date;
  outstandingAmount?: number;
  paidAmount?: number;
}

export interface LoanFilters {
  farmerId?: string;
  status?: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'REJECTED';
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface LoanStats {
  totalLoans: number;
  pendingLoans: number;
  approvedLoans: number;
  activeLoans: number;
  closedLoans: number;
  rejectedLoans: number;
  totalDisbursed: number;
  totalOutstanding: number;
  totalPaid: number;
}
