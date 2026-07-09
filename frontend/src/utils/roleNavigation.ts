/**
 * Role-based navigation utility
 * Maps user roles to their respective dashboard routes
 */

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'OPERATOR'
  | 'ACCOUNTANT'
  | 'FARMER'
  | 'CUSTOMER'
  | 'STORE_MANAGER'
  | 'VETERINARIAN'
  | 'LAB_TECHNICIAN'
  | 'QUALITY_OFFICER'
  | 'PROCUREMENT_OFFICER'
  | 'EXTENSION_OFFICER'
  | 'DRIVER'
  | 'VIEWER'
  | 'AUDITOR';

/**
 * Get the appropriate dashboard route based on user role
 */
export const getRoleDashboardRoute = (role: string): string => {
  const roleMap: Record<string, string> = {
    // Admin roles - full dashboard access
    SUPER_ADMIN: '/dashboard',
    ADMIN: '/dashboard',
    MANAGER: '/dashboard',
    
    // Operational roles - specific modules
    OPERATOR: '/dashboard/milk-collection',
    ACCOUNTANT: '/dashboard/payments',
    STORE_MANAGER: '/dashboard/inventory',
    VETERINARIAN: '/dashboard/veterinary',
    LAB_TECHNICIAN: '/dashboard/quality',
    QUALITY_OFFICER: '/dashboard/quality',
    PROCUREMENT_OFFICER: '/dashboard/inventory/purchase-orders',
    EXTENSION_OFFICER: '/dashboard/farmers',
    DRIVER: '/dashboard/fleet',
    
    // End-user roles
    FARMER: '/dashboard/farmers',
    CUSTOMER: '/dashboard/customers',
    
    // Other roles
    VIEWER: '/dashboard',
    AUDITOR: '/dashboard/reports',
  };

  return roleMap[role] || '/dashboard';
};

/**
 * Get a user-friendly role display name
 */
export const getRoleDisplayName = (role: string): string => {
  const displayNames: Record<string, string> = {
    SUPER_ADMIN: 'Super Administrator',
    ADMIN: 'Administrator',
    MANAGER: 'Manager',
    OPERATOR: 'Milk Collection Officer',
    ACCOUNTANT: 'Accountant',
    STORE_MANAGER: 'Store Officer',
    VETERINARIAN: 'Veterinary Officer',
    LAB_TECHNICIAN: 'Lab Technician',
    QUALITY_OFFICER: 'Quality Officer',
    PROCUREMENT_OFFICER: 'Procurement Officer',
    EXTENSION_OFFICER: 'Extension Officer',
    DRIVER: 'Driver',
    FARMER: 'Farmer',
    CUSTOMER: 'Customer',
    VIEWER: 'Viewer',
    AUDITOR: 'Auditor',
  };

  return displayNames[role] || role;
};

/**
 * Check if a role has access to a specific route
 */
export const hasRouteAccess = (role: string, route: string): boolean => {
  const rolePermissions: Record<string, string[]> = {
    SUPER_ADMIN: ['*'], // Full access
    ADMIN: ['*'], // Full access
    MANAGER: [
      '/dashboard',
      '/dashboard/farmers',
      '/dashboard/milk-collection',
      '/dashboard/quality',
      '/dashboard/payments',
      '/dashboard/inventory',
      '/dashboard/reports',
      '/dashboard/analytics',
    ],
    OPERATOR: [
      '/dashboard/milk-collection',
      '/dashboard/farmers',
      '/dashboard/quality',
    ],
    ACCOUNTANT: [
      '/dashboard/payments',
      '/dashboard/loans',
      '/dashboard/shares',
      '/dashboard/reports',
    ],
    STORE_MANAGER: [
      '/dashboard/inventory',
      '/dashboard/inventory/purchase-orders',
      '/dashboard/inventory/suppliers',
    ],
    VETERINARIAN: [
      '/dashboard/veterinary',
      '/dashboard/farmers',
    ],
    LAB_TECHNICIAN: [
      '/dashboard/quality',
      '/dashboard/milk-collection',
    ],
    FARMER: [
      '/dashboard/farmers',
      '/dashboard/milk-collection',
      '/dashboard/payments',
      '/dashboard/loans',
      '/dashboard/shares',
      '/dashboard/veterinary',
    ],
    CUSTOMER: [
      '/dashboard/customers',
      '/dashboard/payments',
    ],
    DRIVER: [
      '/dashboard/fleet',
      '/dashboard/milk-collection',
    ],
  };

  const permissions = rolePermissions[role] || [];
  
  // Check for full access
  if (permissions.includes('*')) return true;
  
  // Check if route matches any permission
  return permissions.some(permission => route.startsWith(permission));
};
