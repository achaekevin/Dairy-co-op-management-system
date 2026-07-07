import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyOtpPage from '../pages/auth/VerifyOtpPage';
import MfaPage from '../pages/auth/MfaPage';
import ChangePasswordPage from '../pages/auth/ChangePasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import FarmersListPage from '../pages/farmers/FarmersListPage';
import AddFarmerPage from '../pages/farmers/AddFarmerPage';
import FarmerProfilePage from '../pages/farmers/FarmerProfilePage';
import MilkCollectionListPage from '../pages/milk-collection/MilkCollectionListPage';
import AddCollectionPage from '../pages/milk-collection/AddCollectionPage';
import CollectionDetailPage from '../pages/milk-collection/CollectionDetailPage';
import QualityTestsListPage from '../pages/quality/QualityTestsListPage';
import AddQualityTestPage from '../pages/quality/AddQualityTestPage';
import QualityTestDetailPage from '../pages/quality/QualityTestDetailPage';
import QualityStandardsPage from '../pages/quality/QualityStandardsPage';
import PaymentsListPage from '../pages/payments/PaymentsListPage';
import GeneratePaymentPage from '../pages/payments/GeneratePaymentPage';
import PaymentDetailPage from '../pages/payments/PaymentDetailPage';
import LoansListPage from '../pages/loans/LoansListPage';
import ApplyLoanPage from '../pages/loans/ApplyLoanPage';
import LoanDetailPage from '../pages/loans/LoanDetailPage';
import SharesListPage from '../pages/shares/SharesListPage';
import PurchaseSharesPage from '../pages/shares/PurchaseSharesPage';
import ShareDetailPage from '../pages/shares/ShareDetailPage';
import VeterinaryServicesPage from '../pages/veterinary/VeterinaryServicesPage';
import BookServicePage from '../pages/veterinary/BookServicePage';
import ServiceDetailPage from '../pages/veterinary/ServiceDetailPage';
import VaccinationSchedulePage from '../pages/veterinary/VaccinationSchedulePage';
import InventoryListPage from '../pages/inventory/InventoryListPage';
import PurchaseOrdersPage from '../pages/inventory/PurchaseOrdersPage';
import SuppliersPage from '../pages/inventory/SuppliersPage';
import FleetPage from '../pages/fleet/FleetPage';
import HRPage from '../pages/hr/HRPage';
import CustomersPage from '../pages/customers/CustomersPage';
import MeetingsPage from '../pages/meetings/MeetingsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';
import SearchPage from '../pages/search/SearchPage';
import NotFoundPage from '../pages/errors/NotFoundPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import ServerErrorPage from '../pages/errors/ServerErrorPage';
import SessionExpiredPage from '../pages/errors/SessionExpiredPage';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  // Auth Routes
  {
    path: '/login',
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <AuthLayout>
        <ResetPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: '/verify-otp',
    element: (
      <AuthLayout>
        <VerifyOtpPage />
      </AuthLayout>
    ),
  },
  {
    path: '/mfa',
    element: (
      <AuthLayout>
        <MfaPage />
      </AuthLayout>
    ),
  },
  {
    path: '/change-password',
    element: (
      <AuthLayout>
        <ChangePasswordPage />
      </AuthLayout>
    ),
  },
  // Dashboard Routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'farmers',
        element: <FarmersListPage />,
      },
      {
        path: 'farmers/new',
        element: <AddFarmerPage />,
      },
      {
        path: 'farmers/:id',
        element: <FarmerProfilePage />,
      },
      {
        path: 'farmers/:id/edit',
        element: <AddFarmerPage />,
      },
      {
        path: 'milk-collection',
        element: <MilkCollectionListPage />,
      },
      {
        path: 'milk-collection/new',
        element: <AddCollectionPage />,
      },
      {
        path: 'milk-collection/:id',
        element: <CollectionDetailPage />,
      },
      {
        path: 'quality',
        element: <QualityTestsListPage />,
      },
      {
        path: 'quality/new',
        element: <AddQualityTestPage />,
      },
      {
        path: 'quality/:id',
        element: <QualityTestDetailPage />,
      },
      {
        path: 'quality/standards',
        element: <QualityStandardsPage />,
      },
      {
        path: 'payments',
        element: <PaymentsListPage />,
      },
      {
        path: 'payments/generate',
        element: <GeneratePaymentPage />,
      },
      {
        path: 'payments/:id',
        element: <PaymentDetailPage />,
      },
      {
        path: 'loans',
        element: <LoansListPage />,
      },
      {
        path: 'loans/apply',
        element: <ApplyLoanPage />,
      },
      {
        path: 'loans/:id',
        element: <LoanDetailPage />,
      },
      {
        path: 'shares',
        element: <SharesListPage />,
      },
      {
        path: 'shares/purchase',
        element: <PurchaseSharesPage />,
      },
      {
        path: 'shares/:id',
        element: <ShareDetailPage />,
      },
      {
        path: 'veterinary',
        element: <VeterinaryServicesPage />,
      },
      {
        path: 'veterinary/book',
        element: <BookServicePage />,
      },
      {
        path: 'veterinary/:id',
        element: <ServiceDetailPage />,
      },
      {
        path: 'veterinary/:id/edit',
        element: <BookServicePage />,
      },
      {
        path: 'veterinary/vaccinations',
        element: <VaccinationSchedulePage />,
      },
      {
        path: 'inventory',
        element: <InventoryListPage />,
      },
      {
        path: 'inventory/purchase-orders',
        element: <PurchaseOrdersPage />,
      },
      {
        path: 'inventory/suppliers',
        element: <SuppliersPage />,
      },
      {
        path: 'inventory/*',
        element: <div>Inventory Pages (Coming Soon)</div>,
      },
      {
        path: 'procurement',
        element: <div>Procurement Page (Coming Soon)</div>,
      },
      {
        path: 'fleet',
        element: <FleetPage />,
      },
      {
        path: 'hr',
        element: <HRPage />,
      },
      {
        path: 'accounting',
        element: <div>Accounting Page (Coming Soon)</div>,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'meetings',
        element: <MeetingsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
    ],
  },
  // Error Routes
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/server-error',
    element: <ServerErrorPage />,
  },
  {
    path: '/session-expired',
    element: <SessionExpiredPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
