export interface CreatePurchaseOrderData {
  poNumber: string;
  supplierId: string;
  expectedDelivery: Date;
  totalItems: number;
  totalAmount: number;
  createdBy: string;
  notes?: string;
}

export interface UpdatePurchaseOrderData {
  expectedDelivery?: Date;
  actualDelivery?: Date;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'DELIVERED' | 'CANCELLED';
  totalItems?: number;
  totalAmount?: number;
  paidAmount?: number;
  balanceAmount?: number;
  paymentStatus?: 'UNPAID' | 'PARTIAL' | 'PAID';
  approvedBy?: string;
  notes?: string;
}

export interface PurchaseOrderFilters {
  supplierId?: string;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus?: 'UNPAID' | 'PARTIAL' | 'PAID';
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface PurchaseOrderStats {
  totalOrders: number;
  draftOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalAmount: number;
  totalPaid: number;
  totalBalance: number;
}
