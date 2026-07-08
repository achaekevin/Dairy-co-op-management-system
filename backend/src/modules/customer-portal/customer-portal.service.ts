import prisma from '../../database/client';
import {
  CustomerDashboardStats,
  Product,
  ProductCategory,
  PlaceOrderRequest,
  OrderTracking,
  CustomerPayment,
  PaymentRequest,
  Invoice,
  ReturnRequest,
  CustomerReturn,
  CustomerProfile,
  DeliveryAddress,
  SavedPaymentMethod,
} from './customer-portal.types';

export class CustomerPortalService {
  async getDashboardStats(tenantId: string, userId: string): Promise<CustomerDashboardStats> {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const totalOrders = 0;
    const pendingOrders = 0;
    const totalSpending = Number(customer.totalSales || 0);
    const loyaltyPoints = Math.floor(totalSpending / 100);

    return {
      totalOrders,
      pendingOrders,
      totalSpending,
      loyaltyPoints,
    };
  }

  private async getCustomerByUserId(tenantId: string, userId: string) {
    return prisma.customer.findFirst({
      where: {
        tenantId,
        deletedAt: null,
      },
    });
  }

  async getProducts(tenantId: string, page = 1, limit = 20, category?: string, search?: string) {
    const where: any = {
      tenantId,
      status: 'IN_STOCK',
      deletedAt: null,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.itemName = {
        contains: search,
      };
    }

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        orderBy: { itemName: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inventoryItem.count({ where }),
    ]);

    const data: Product[] = items.map((item) => ({
      id: item.id,
      productCode: item.itemCode,
      productName: item.itemName,
      category: item.category,
      unitPrice: Number(item.unitPrice),
      unit: item.unit,
      availableStock: Number(item.currentStock),
      status: Number(item.currentStock) > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK',
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductCategories(tenantId: string) {
    const items = await prisma.inventoryItem.groupBy({
      by: ['category'],
      where: {
        tenantId,
        deletedAt: null,
      },
      _count: {
        category: true,
      },
    });

    const data: ProductCategory[] = items.map((item) => ({
      category: item.category,
      productCount: item._count.category,
    }));

    return data;
  }

  async placeOrder(tenantId: string, userId: string, orderData: PlaceOrderRequest) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const orderNumber = `ORD-${Date.now()}`;

    return {
      id: `order-${Date.now()}`,
      orderNumber,
      customerId: customer.id,
      customerName: customer.customerName,
      orderDate: new Date(),
      totalAmount,
      status: 'PENDING' as const,
      paymentStatus: 'UNPAID' as const,
      deliveryAddress: orderData.deliveryAddress,
      items: orderData.items,
    };
  }

  async getOrderHistory(tenantId: string, userId: string, page = 1, limit = 20) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  async trackOrder(tenantId: string, userId: string, orderNumber: string): Promise<OrderTracking | null> {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      orderNumber,
      orderDate: new Date(),
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      timeline: [
        {
          status: 'PENDING',
          date: new Date(),
          description: 'Order placed successfully',
        },
      ],
    };
  }

  async cancelOrder(tenantId: string, userId: string, orderId: string) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      success: true,
      message: 'Order cancelled successfully',
    };
  }

  async makePayment(tenantId: string, userId: string, paymentData: PaymentRequest) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const paymentNumber = `PAY-${Date.now()}`;

    return {
      id: `payment-${Date.now()}`,
      paymentNumber,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      paymentDate: new Date(),
      status: 'PENDING' as const,
      transactionId: paymentData.transactionId,
    };
  }

  async getPaymentHistory(tenantId: string, userId: string, page = 1, limit = 20) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  async getInvoice(tenantId: string, userId: string, orderId: string): Promise<Invoice | null> {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      invoiceNumber: `INV-${Date.now()}`,
      orderNumber: `ORD-${orderId}`,
      invoiceDate: new Date(),
      dueDate: new Date(),
      totalAmount: 0,
      paidAmount: 0,
      balanceAmount: 0,
      status: 'UNPAID',
      items: [],
    };
  }

  async createReturnRequest(tenantId: string, userId: string, returnData: ReturnRequest) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const returnNumber = `RET-${Date.now()}`;

    return {
      id: `return-${Date.now()}`,
      returnNumber,
      requestDate: new Date(),
      status: 'REQUESTED' as const,
      ...returnData,
    };
  }

  async getReturnStatus(tenantId: string, userId: string, page = 1, limit = 20) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  async getProfile(tenantId: string, userId: string): Promise<CustomerProfile | null> {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      return null;
    }

    return {
      customerId: customer.id,
      customerName: customer.customerName,
      businessName: customer.businessName || undefined,
      customerType: customer.customerType,
      phoneNumber: customer.phoneNumber,
      email: customer.email || undefined,
      address: customer.address || undefined,
      city: customer.city || undefined,
      state: customer.state || undefined,
      gstNumber: customer.gstNumber || undefined,
      creditLimit: Number(customer.creditLimit),
      creditDays: customer.creditDays,
      outstandingAmount: Number(customer.outstandingAmount),
      totalSales: Number(customer.totalSales),
      status: customer.status,
    };
  }

  async updateProfile(tenantId: string, userId: string, updates: Partial<CustomerProfile>) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const updated = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        customerName: updates.customerName,
        businessName: updates.businessName,
        phoneNumber: updates.phoneNumber,
        email: updates.email,
        address: updates.address,
        city: updates.city,
        state: updates.state,
      },
    });

    return updated;
  }

  async getDeliveryAddresses(tenantId: string, userId: string) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const addresses: DeliveryAddress[] = customer.address
      ? [
          {
            addressType: 'HOME' as const,
            addressLine1: customer.address,
            city: customer.city || '',
            state: customer.state || '',
            pinCode: customer.pinCode || '',
            isDefault: true,
          },
        ]
      : [];

    return addresses;
  }

  async saveDeliveryAddress(tenantId: string, userId: string, address: DeliveryAddress) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      ...address,
      id: `addr-${Date.now()}`,
    };
  }

  async getSavedPaymentMethods(tenantId: string, userId: string) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return [];
  }

  async savePaymentMethod(tenantId: string, userId: string, method: SavedPaymentMethod) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      ...method,
      id: `pm-${Date.now()}`,
    };
  }

  async getNotifications(tenantId: string, userId: string, page = 1, limit = 20) {
    const customer = await this.getCustomerByUserId(tenantId, userId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }
}
