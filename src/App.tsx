import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { GuestLayout } from './shared/components/layouts/GuestLayout';
import { HostLayout } from './shared/components/layouts/HostLayout';
import { AdminLayout } from './shared/components/layouts/AdminLayout';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { RoleRoute } from './shared/components/RoleRoute';
import { Spinner } from './shared/components/Spinner';
import { NotFound } from './shared/components/NotFound';
import { ListingsPage } from './features/listings';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import { UnauthorizedPage } from './features/auth/pages/UnauthorizedPage';

const BookingPage = lazy(() => import('./features/bookings/pages/BookingPage'));
const MyBookingsPage = lazy(() => import('./features/bookings/pages/MyBookingsPage'));
const ListingDetail = lazy(() => import('./features/listings/pages/ListingDetail'));
const SavedListingsPage = lazy(() => import('./features/listings/pages/SavedListingsPage'));
const ProfilePage = lazy(() => import('./features/auth/pages/ProfilePage'));
const HostDashboard = lazy(() => import('./features/host/pages/HostDashboard'));
const MyListingsPage = lazy(() => import('./features/host/pages/MyListingsPage'));
const CreateListingPage = lazy(() => import('./features/host/pages/CreateListingPage'));
const EditListingPage = lazy(() => import('./features/host/pages/EditListingPage'));
const HostBookingsPage = lazy(() => import('./features/host/pages/HostBookingsPage'));
const AdminDashboard = lazy(() => import('./features/admin/pages/AdminDashboard'));
const ModerationPage = lazy(() => import('./features/admin/pages/ModerationPage'));
const UsersPage = lazy(() => import('./features/admin/pages/UsersPage'));
const AllBookingsPage = lazy(() => import('./features/admin/pages/AllBookingsPage'));
const ExperiencesPage = lazy(() => import('./features/experiences/pages/ExperiencesPage'));
const ExperienceDetailPage = lazy(() => import('./features/experiences/pages/ExperienceDetailPage'));
const CreateExperiencePage = lazy(() => import('./features/experiences/pages/CreateExperiencePage'));
const EditExperiencePage = lazy(() => import('./features/experiences/pages/EditExperiencePage'));

function NProgressBar() {
  const location = useLocation();
  useEffect(() => {
    NProgress.start();
    const t = setTimeout(() => NProgress.done(), 100);
    return () => clearTimeout(t);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <NProgressBar />
      <Suspense fallback={<Spinner />}>
        <Routes>

          {/* Guest routes */}
          <Route element={<GuestLayout />}>
            <Route path="/" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/saved" element={
              <ProtectedRoute><SavedListingsPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
            } />
            <Route path="/listings/:id/book" element={
              <ProtectedRoute><BookingPage /></ProtectedRoute>
            } />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/experiences/new" element={
              <ProtectedRoute><CreateExperiencePage /></ProtectedRoute>
            } />
            <Route path="/experiences/:id/edit" element={
              <ProtectedRoute><EditExperiencePage /></ProtectedRoute>
            } />
            <Route path="/experiences/:id" element={<ExperienceDetailPage />} />
          </Route>

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Host routes */}
          <Route element={<RoleRoute role="host" />}>
            <Route element={<HostLayout />}>
              <Route path="/host/dashboard" element={<HostDashboard />} />
              <Route path="/host/listings" element={<MyListingsPage />} />
              <Route path="/host/listings/new" element={<CreateListingPage />} />
              <Route path="/host/listings/:id/edit" element={<EditListingPage />} />
              <Route path="/host/bookings" element={<HostBookingsPage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<RoleRoute role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/moderation" element={<ModerationPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/bookings" element={<AllBookingsPage />} />
            </Route>
          </Route>

          {/* Fallback routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}