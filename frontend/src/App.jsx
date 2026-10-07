import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { BookingsProvider } from './context/BookingsContext.jsx'
import { CatalogProvider } from './context/CatalogContext.jsx'
import { ProtectedRoute, AdminRoute, UserOnlyRoute } from './components/common/ProtectedRoute.jsx'
import ChatbotWidget from './components/chatbot/ChatbotWidget.jsx'
import Home from './pages/Home.jsx'
import TripPlanner from './pages/TripPlanner.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import MyTrips from './pages/MyTrips.jsx'
import Wishlist from './pages/Wishlist.jsx'
import DestinationDetails from './pages/DestinationDetails.jsx'
import PackageDetails from './pages/PackageDetails.jsx'
import HotelDetails from './pages/HotelDetails.jsx'
import BookingConfirmation from './pages/BookingConfirmation.jsx'
import OAuthCallback from './pages/OAuthCallback.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminBookings from './pages/admin/AdminBookings.jsx'
import AdminDestinations from './pages/admin/AdminDestinations.jsx'
import AdminHotels from './pages/admin/AdminHotels.jsx'
import AdminPackages from './pages/admin/AdminPackages.jsx'
import AdminOffers from './pages/admin/AdminOffers.jsx'

function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <BookingsProvider>
          <Routes>
            <Route
              path="/"
              element={
                <UserOnlyRoute>
                  <Home />
                </UserOnlyRoute>
              }
            />
            <Route
              path="/planner"
              element={
                <UserOnlyRoute>
                  <TripPlanner />
                </UserOnlyRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route
              path="/my-trips"
              element={
                <UserOnlyRoute>
                  <ProtectedRoute>
                    <MyTrips />
                  </ProtectedRoute>
                </UserOnlyRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <UserOnlyRoute>
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                </UserOnlyRoute>
              }
            />
            <Route
              path="/destinations/:id"
              element={
                <UserOnlyRoute>
                  <DestinationDetails />
                </UserOnlyRoute>
              }
            />
            <Route
              path="/packages/:id"
              element={
                <UserOnlyRoute>
                  <PackageDetails />
                </UserOnlyRoute>
              }
            />
            <Route
              path="/hotels/:id"
              element={
                <UserOnlyRoute>
                  <HotelDetails />
                </UserOnlyRoute>
              }
            />
            <Route
              path="/booking/:id"
              element={
                <UserOnlyRoute>
                  <BookingConfirmation />
                </UserOnlyRoute>
              }
            />

            {/* Admin dashboard — gated by role on both the frontend (AdminRoute) and backend (adminOnly middleware) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminBookings />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/destinations"
              element={
                <AdminRoute>
                  <AdminDestinations />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/hotels"
              element={
                <AdminRoute>
                  <AdminHotels />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/packages"
              element={
                <AdminRoute>
                  <AdminPackages />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/offers"
              element={
                <AdminRoute>
                  <AdminOffers />
                </AdminRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatbotWidget />
        </BookingsProvider>
      </CatalogProvider>
    </AuthProvider>
  )
}

export default App
