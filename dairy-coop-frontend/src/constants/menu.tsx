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
    path: '/farmers',
    permissions: [UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
  },
  {
    id: 'milk-collection',
    label: 'Milk Collection',
    icon: 'droplet',
    path: '/milk-collection',
  },
  {
    id: 'quality',
    label: 'Milk Quality',
    icon: 'award',
    path: '/quality',
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: 'credit-card',
    path: '/payments',
    permissions: [UserRole.ADMIN, UserRole.ACCOUNTANT],
  },
  {
    id: 'loans',
    label: 'Loans',
    icon: 'bank',
    path: '/loans',
    permissions: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    id: 'shares',
    label: 'Share Management',
    icon: 'trending-up',
    path: '/shares',
  },
  {
    id: 'veterinary',
    label: 'Veterinary',
    icon: 'heart-pulse',
    path: '/veterinary',
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
        path: '/inventory/feed-store',
      },
      {
        id: 'warehouse',
        label: 'Warehouse',
        icon: 'warehouse',
        path: '/inventory/warehouse',
      },
      {
        id: 'stock',
        label: 'Stock Management',
        icon: 'boxes',
        path: '/inventory/stock',
      },
    ],
  },
  {
    id: 'procurement',
    label: 'Procurement',
    icon: 'shopping-cart',
    path: '/procurement',
    permissions: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    id: 'fleet',
    label: 'Fleet Management',
    icon: 'truck',
    path: '/fleet',
  },
  {
    id: 'hr',
    label: 'Human Resources',
    icon: 'user-check',
    path: '/hr',
    permissions: [UserRole.ADMIN],
  },
  {
    id: 'accounting',
    label: 'Accounting',
    icon: 'calculator',
    path: '/accounting',
    permissions: [UserRole.ADMIN, UserRole.ACCOUNTANT],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'user-circle',
    path: '/customers',
  },
  {
    id: 'meetings',
    label: 'Meetings',
    icon: 'calendar',
    path: '/meetings',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'file-text',
    path: '/reports',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'bar-chart',
    path: '/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/settings',
    permissions: [UserRole.ADMIN],
  },
];
