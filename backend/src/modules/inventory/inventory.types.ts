export interface CreateInventoryItemData {
  itemCode: string;
  itemName: string;
  category: 'CATTLE_FEED' | 'MEDICINE' | 'EQUIPMENT' | 'PACKAGING' | 'CLEANING' | 'OTHER';
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplierName?: string;
  location?: string;
  expiryDate?: Date;
  batchNumber?: string;
}

export interface UpdateInventoryItemData {
  itemName?: string;
  category?: 'CATTLE_FEED' | 'MEDICINE' | 'EQUIPMENT' | 'PACKAGING' | 'CLEANING' | 'OTHER';
  unit?: string;
  currentStock?: number;
  minStock?: number;
  maxStock?: number;
  unitPrice?: number;
  supplierName?: string;
  location?: string;
  expiryDate?: Date;
  batchNumber?: string;
  status?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';
  lastRestocked?: Date;
}

export interface InventoryFilters {
  category?: 'CATTLE_FEED' | 'MEDICINE' | 'EQUIPMENT' | 'PACKAGING' | 'CLEANING' | 'OTHER';
  status?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';
  search?: string;
  minStock?: number;
  maxStock?: number;
  location?: string;
}

export interface InventoryStats {
  totalItems: number;
  inStockItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiredItems: number;
  totalValue: number;
}
