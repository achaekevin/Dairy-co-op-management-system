export interface StoreOfficerDashboardStats {
  currentStock: number;
  lowStockItems: number;
  expiredItems: number;
  pendingPurchases: number;
  inventoryValue: number;
}

export interface StockLevel {
  itemId: string;
  itemCode: string;
  itemName: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';
  lastRestocked?: Date;
}

export interface StockAdjustment {
  itemId: string;
  quantity: number;
  type: 'ADD' | 'REMOVE';
  reason: string;
  adjustedBy: string;
}

export interface StockTransfer {
  itemId: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  transferDate: Date;
  transferredBy: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface FeedSale {
  farmerId: string;
  farmerName: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  paymentStatus: 'PAID' | 'CREDIT';
  saleDate: Date;
}

export interface SupplierInfo {
  supplierId: string;
  supplierCode: string;
  name: string;
  contactPerson: string;
  phoneNumber: string;
  email?: string;
  category: string;
  totalPurchases: number;
  outstandingAmount: number;
  rating: number;
  status: string;
}

export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  items: {
    itemName: string;
    quantity: number;
    estimatedPrice: number;
  }[];
  requestedBy: string;
  requestDate: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
}

export interface GoodsReceived {
  poNumber: string;
  supplierName: string;
  receivedDate: Date;
  items: {
    itemName: string;
    orderedQty: number;
    receivedQty: number;
    status: 'FULL' | 'PARTIAL' | 'DAMAGED';
  }[];
  receivedBy: string;
  notes?: string;
}

export interface WarehouseInventory {
  warehouseId: string;
  warehouseName: string;
  location: string;
  totalItems: number;
  totalValue: number;
  capacity: number;
  utilization: number;
}

export interface DamagedStock {
  itemId: string;
  itemName: string;
  quantity: number;
  value: number;
  damageDate: Date;
  reason: string;
  reportedBy: string;
  status: 'REPORTED' | 'INVESTIGATED' | 'WRITTEN_OFF';
}
