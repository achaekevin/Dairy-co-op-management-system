export interface CreatePaymentData {
  farmerId: string;
  period: string;
  totalQuantity: number;
  totalAmount: number;
  bonusAmount?: number;
  deductionAmount?: number;
  paymentMode?: 'BANK_TRANSFER' | 'CASH' | 'CHEQUE' | 'MOBILE_MONEY';
  transactionId?: string;
}

export interface UpdatePaymentData {
  bonusAmount?: number;
  deductionAmount?: number;
  status?: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  paymentDate?: Date;
  paymentMode?: 'BANK_TRANSFER' | 'CASH' | 'CHEQUE' | 'MOBILE_MONEY';
  transactionId?: string;
  approvedBy?: string;
}

export interface PaymentFilters {
  farmerId?: string;
  status?: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  period?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentStats {
  totalPayments: number;
  pendingPayments: number;
  approvedPayments: number;
  paidPayments: number;
  rejectedPayments: number;
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
}
