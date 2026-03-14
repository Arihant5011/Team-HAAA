import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';

// Pages
import HomePage from '@/components/pages/HomePage';
import ProfilePage from '@/components/pages/ProfilePage';
import ProductsPage from '@/components/pages/ProductsPage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import ProductFormPage from '@/components/pages/ProductFormPage';
import ReceiptsPage from '@/components/pages/ReceiptsPage';
import ReceiptFormPage from '@/components/pages/ReceiptFormPage';
import DeliveriesPage from '@/components/pages/DeliveriesPage';
import DeliveryFormPage from '@/components/pages/DeliveryFormPage';
import TransfersPage from '@/components/pages/TransfersPage';
import TransferFormPage from '@/components/pages/TransferFormPage';
import AdjustmentsPage from '@/components/pages/AdjustmentsPage';
import AdjustmentFormPage from '@/components/pages/AdjustmentFormPage';
import WarehousesPage from '@/components/pages/WarehousesPage';
import WarehouseFormPage from '@/components/pages/WarehouseFormPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access your inventory dashboard">
            <HomePage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute>
            <ProfilePage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <MemberProtectedRoute>
            <ProductsPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "products/new",
        element: (
          <MemberProtectedRoute>
            <ProductFormPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "products/:id",
        element: (
          <MemberProtectedRoute>
            <ProductDetailPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "products/:id/edit",
        element: (
          <MemberProtectedRoute>
            <ProductFormPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "receipts",
        element: (
          <MemberProtectedRoute>
            <ReceiptsPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "receipts/new",
        element: (
          <MemberProtectedRoute>
            <ReceiptFormPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "deliveries",
        element: (
          <MemberProtectedRoute>
            <DeliveriesPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "deliveries/new",
        element: (
          <MemberProtectedRoute>
            <DeliveryFormPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "transfers",
        element: (
          <MemberProtectedRoute>
            <TransfersPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "transfers/new",
        element: (
          <MemberProtectedRoute>
            <TransferFormPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "adjustments",
        element: (
          <MemberProtectedRoute>
            <AdjustmentsPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "adjustments/new",
        element: (
          <MemberProtectedRoute>
            <AdjustmentFormPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "warehouses",
        element: (
          <MemberProtectedRoute>
            <WarehousesPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "warehouses/new",
        element: (
          <MemberProtectedRoute>
            <WarehouseFormPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
