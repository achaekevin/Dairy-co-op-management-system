import type { MenuItem } from '../types';
import { UserRole } from '../types';

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'home',
    path: '/dashboard',
  },
  {
    id: 'farmers',
    label: 'Farmer Management',
    icon: 'users',
    path: '/dashboard/farmers',
    permissions: [UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
  },
  {
    id: 'milk-collection',
    label: 'Milk Collection',
    icon: 'droplet',
    path: '/dashboard/milk-collection',
  },
  {
    id: 'quality',
    label: 'Milk Quality',
    icon: 'award',
    path: '/dashboard/quality',
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: 'credit-card',
    path: '/dashboard/payments',
    permissions: [UserRole.ADMIN, UserRole.ACCOUNTANT],
  },
  {
    id: 'loans',
    label: 'Loans',
    icon: 'bank',
    path: '/dashboard/loans',
    permissions: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    id: 'shares',
    label: 'Share Management',
    icon: 'trending-up',
    path: '/dashboard/shares',
  },
  {
    id: 'veterinary',
    label: 'Veterinary',
    icon: 'heart-pulse',
    path: '/dashboard/veterinary',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: 'package',
    children: [
      {
        id: 'feed-store',
        label: 'Feed Store',
        icon: 'shopping-bag',
        path: '/dashboard/inventory/feed-store',
      },
      {
        id: 'warehouse',
        label: 'Warehouse',
        icon: 'warehouse',
        path: '/dashboard/inventory/warehouse',
      },
      {
        id: 'stock',
        label: 'Stock Management',
        icon: 'boxes',
        path: '/dashboard/inventory/stock',
      },
    ],
  },
  {
    id: 'procurement',
    label: 'Procurement',
    icon: 'shopping-cart',
    path: '/dashboard/procurement',
    permissions: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    id: 'fleet',
    label: 'Fleet Management',
    icon: 'truck',
    path: '/dashboard/fleet',
  },
  {
    id: 'hr',
    label: 'Human Resources',
    icon: 'user-check',
    path: '/dashboard/hr',
    permissions: [UserRole.ADMIN],
  },
  {
    id: 'accounting',
    label: 'Accounting',
    icon: 'calculator',
    path: '/dashboard/accounting',
    permissions: [UserRole.ADMIN, UserRole.ACCOUNTANT],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'user-circle',
    path: '/dashboard/customers',
  },
  {
    id: 'meetings',
    label: 'Meetings',
    icon: 'calendar',
    path: '/dashboard/meetings',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'file-text',
    path: '/dashboard/reports',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'bar-chart',
    path: '/dashboard/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/dashboard/settings',
    permissions: [UserRole.ADMIN],
  },
];
