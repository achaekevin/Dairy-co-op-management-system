import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tenant } from '../types';

interface TenantState {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenant: null,
      setTenant: (tenant) => set({ tenant }),
      clearTenant: () => set({ tenant: null }),
    }),
    {
      name: 'tenant-storage',
    }
  )
);
