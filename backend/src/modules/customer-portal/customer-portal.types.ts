export interface CustomerDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalSpending: number;
  loyaltyPoints: number;
}

export interface Product {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  description?: string;
  unitPrice: number;
  unit: string;
  availableStock: number;
  imageUrl?: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

export interface ProductCategory {
  category: string;
  productCount: number;
  description?: string;
}

export interface PlaceOrderRequest {
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  deliveryAddress: string;
  deliveryDate?: Date;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CREDIT';
  notes?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  orderDate: Date;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  deliveryDate?: Date;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface OrderTracking {
  orderNumber: string;
  orderDate: Date;
  status: string;
  paymentStatus: string;
  estimatedDelivery?: Date;
  timeline: {
    status: string;
    date: Date;
    description: string;
  }[];
}

export interface CustomerPayment {
  id: string;
  paymentNumber: string;
  orderNumber: string;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId?: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CHEQUE';
  transactionId?: string;
}

export interface Invoice {
  invoiceNumber: string;
  orderNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface ReturnRequest {
  orderId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    reason: string;
  }[];
  returnReason: string;
  requestedAction: 'REFUND' | 'REPLACEMENT';
}

export interface CustomerReturn {
  id: string;
  returnNumber: string;
  orderNumber: string;
  requestDate: Date;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  returnReason: string;
  requestedAction: string;
  items: {
    productName: string;
    quantity: number;
  }[];
  refundAmount?: number;
  processedDate?: Date;
}

export interface CustomerProfile {
  customerId: string;
  customerName: string;
  businessName?: string;
  customerType: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  gstNumber?: string;
  creditLimit: number;
  creditDays: number;
  outstandingAmount: number;
  totalSales: number;
  status: string;
}

export interface DeliveryAddress {
  id?: string;
  addressType: 'HOME' | 'OFFICE' | 'OTHER';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface SavedPaymentMethod {
  id?: string;
  methodType: 'BANK' | 'MOBILE_MONEY';
  bankName?: string;
  accountNumber?: string;
  mobileProvider?: string;
  mobileNumber?: string;
  isDefault: boolean;
}

export interface CustomerNotification {
  id: string;
  type: 'ORDER' | 'PROMOTION' | 'DELIVERY' | 'PAYMENT';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  actionUrl?: string;
}
