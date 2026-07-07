import farmerRepository from '@modules/farmer/farmer.repository.js';
import milkCollectionRepository from '@modules/milk-collection/milk-collection.repository.js';
import qualityRepository from '@modules/quality/quality.repository.js';
import paymentRepository from '@modules/payment/payment.repository.js';
import loanRepository from '@modules/loan/loan.repository.js';
import shareRepository from '@modules/share/share.repository.js';
import inventoryRepository from '@modules/inventory/inventory.repository.js';
import supplierRepository from '@modules/supplier/supplier.repository.js';
import purchaseOrderRepository from '@modules/purchase-order/purchase-order.repository.js';
import customerRepository from '@modules/customer/customer.repository.js';
import vehicleRepository from '@modules/vehicle/vehicle.repository.js';
import employeeRepository from '@modules/employee/employee.repository.js';
import meetingRepository from '@modules/meeting/meeting.repository.js';
import cacheService from '@shared/services/cache.service.js';

class DashboardService {
  async getDashboardOverview(tenantId: string) {
    const cacheKey = `dashboard:overview:${tenantId}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const [
      farmerStats,
      milkStats,
      qualityStats,
      paymentStats,
      loanStats,
      shareStats,
      inventoryStats,
      supplierStats,
      poStats,
      customerStats,
      vehicleStats,
      employeeStats,
      meetingStats,
    ] = await Promise.all([
      farmerRepository.getStats(tenantId),
      milkCollectionRepository.getStats(tenantId),
      qualityRepository.getStats(tenantId),
      paymentRepository.getStats(tenantId),
      loanRepository.getStats(tenantId),
      shareRepository.getStats(tenantId),
      inventoryRepository.getStats(tenantId),
      supplierRepository.getStats(tenantId),
      purchaseOrderRepository.getStats(tenantId),
      customerRepository.getStats(tenantId),
      vehicleRepository.getStats(tenantId),
      employeeRepository.getStats(tenantId),
      meetingRepository.getStats(tenantId),
    ]);

    const overview = {
      farmers: farmerStats,
      milkCollection: milkStats,
      quality: qualityStats,
      payments: paymentStats,
      loans: loanStats,
      shares: shareStats,
      inventory: inventoryStats,
      suppliers: supplierStats,
      purchaseOrders: poStats,
      customers: customerStats,
      vehicles: vehicleStats,
      employees: employeeStats,
      meetings: meetingStats,
    };

    await cacheService.set(cacheKey, overview, 600);
    return overview;
  }

  async getFinancialSummary(tenantId: string, startDate?: Date, endDate?: Date) {
    const cacheKey = `dashboard:financial:${tenantId}:${startDate?.toISOString()}:${endDate?.toISOString()}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const [paymentStats, loanStats, shareStats, poStats] = await Promise.all([
      paymentRepository.getStats(tenantId, startDate, endDate),
      loanRepository.getStats(tenantId, startDate, endDate),
      shareRepository.getStats(tenantId, startDate, endDate),
      purchaseOrderRepository.getStats(tenantId, startDate, endDate),
    ]);

    const summary = {
      revenue: {
        totalSales: 0,
        pendingPayments: paymentStats.totalPending,
        receivedPayments: paymentStats.totalPaid,
      },
      expenses: {
        totalPurchases: poStats.totalAmount,
        pendingPurchases: poStats.totalBalance,
        paidPurchases: poStats.totalPaid,
      },
      loans: {
        totalDisbursed: loanStats.totalDisbursed,
        totalOutstanding: loanStats.totalOutstanding,
        totalRecovered: loanStats.totalPaid,
      },
      shares: {
        totalShareCapital: shareStats.totalShareValue,
        totalMembers: shareStats.totalFarmersWithShares,
      },
      netCashFlow: paymentStats.totalPaid - poStats.totalPaid,
    };

    await cacheService.set(cacheKey, summary, 600);
    return summary;
  }

  async getOperationalMetrics(tenantId: string, startDate?: Date, endDate?: Date) {
    const cacheKey = `dashboard:operational:${tenantId}:${startDate?.toISOString()}:${endDate?.toISOString()}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const [milkStats, qualityStats, inventoryStats, vehicleStats] = await Promise.all([
      milkCollectionRepository.getStats(tenantId, startDate, endDate),
      qualityRepository.getStats(tenantId, startDate, endDate),
      inventoryRepository.getStats(tenantId),
      vehicleRepository.getStats(tenantId),
    ]);

    const metrics = {
      milkCollection: {
        totalQuantity: milkStats.totalQuantity,
        totalCollections: milkStats.totalCollections,
        averageFat: milkStats.avgFat,
        averageSnf: milkStats.avgSnf,
        acceptedCollections: milkStats.acceptedCollections,
        rejectedCollections: milkStats.rejectedCollections,
      },
      quality: {
        totalTests: qualityStats.totalTests,
        passedTests: qualityStats.passedTests,
        failedTests: qualityStats.failedTests,
        pendingTests: qualityStats.pendingTests,
      },
      inventory: {
        totalItems: inventoryStats.totalItems,
        lowStockItems: inventoryStats.lowStockItems,
        outOfStockItems: inventoryStats.outOfStockItems,
        expiredItems: inventoryStats.expiredItems,
        totalValue: inventoryStats.totalValue,
      },
      fleet: {
        totalVehicles: vehicleStats.totalVehicles,
        activeVehicles: vehicleStats.activeVehicles,
        maintenanceVehicles: vehicleStats.maintenanceVehicles,
        expiringSoonInsurance: vehicleStats.expiringSoonInsurance,
        expiringSoonFitness: vehicleStats.expiringSoonFitness,
      },
    };

    await cacheService.set(cacheKey, metrics, 600);
    return metrics;
  }

  async getAlerts(tenantId: string) {
    const cacheKey = `dashboard:alerts:${tenantId}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const [inventoryStats, vehicleStats, loanStats, paymentStats, qualityStats] = await Promise.all([
      inventoryRepository.getStats(tenantId),
      vehicleRepository.getStats(tenantId),
      loanRepository.getStats(tenantId),
      paymentRepository.getStats(tenantId),
      qualityRepository.getStats(tenantId),
    ]);

    const alerts = [];

    if (inventoryStats.lowStockItems > 0) {
      alerts.push({
        type: 'warning',
        category: 'inventory',
        message: `${inventoryStats.lowStockItems} items are running low on stock`,
        count: inventoryStats.lowStockItems,
      });
    }

    if (inventoryStats.outOfStockItems > 0) {
      alerts.push({
        type: 'error',
        category: 'inventory',
        message: `${inventoryStats.outOfStockItems} items are out of stock`,
        count: inventoryStats.outOfStockItems,
      });
    }

    if (inventoryStats.expiredItems > 0) {
      alerts.push({
        type: 'error',
        category: 'inventory',
        message: `${inventoryStats.expiredItems} items have expired`,
        count: inventoryStats.expiredItems,
      });
    }

    if (vehicleStats.expiringSoonInsurance > 0) {
      alerts.push({
        type: 'warning',
        category: 'fleet',
        message: `${vehicleStats.expiringSoonInsurance} vehicles have insurance expiring within 30 days`,
        count: vehicleStats.expiringSoonInsurance,
      });
    }

    if (vehicleStats.expiringSoonFitness > 0) {
      alerts.push({
        type: 'warning',
        category: 'fleet',
        message: `${vehicleStats.expiringSoonFitness} vehicles have fitness certificates expiring within 30 days`,
        count: vehicleStats.expiringSoonFitness,
      });
    }

    if (loanStats.activeLoans > 0) {
      alerts.push({
        type: 'info',
        category: 'loans',
        message: `${loanStats.activeLoans} active loans with total outstanding: ${loanStats.totalOutstanding}`,
        count: loanStats.activeLoans,
      });
    }

    if (paymentStats.pendingPayments > 0) {
      alerts.push({
        type: 'info',
        category: 'payments',
        message: `${paymentStats.pendingPayments} pending payments worth ${paymentStats.totalPending}`,
        count: paymentStats.pendingPayments,
      });
    }

    if (qualityStats.pendingTests > 0) {
      alerts.push({
        type: 'info',
        category: 'quality',
        message: `${qualityStats.pendingTests} quality tests pending approval`,
        count: qualityStats.pendingTests,
      });
    }

    await cacheService.set(cacheKey, alerts, 300);
    return alerts;
  }
}

export default new DashboardService();
