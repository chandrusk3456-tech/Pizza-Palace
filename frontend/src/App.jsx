import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import PizzaDetail from './pages/PizzaDetail';
import Cart from './pages/Cart';
import LoginRegister from './pages/LoginRegister';

// Protected Customer Pages
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';

// Protected Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPizzas from './pages/admin/AdminPizzas';
import AdminOrders from './pages/admin/AdminOrders';

// Custom Not Found Page
const NotFound = () => {
  return (
    <div className="pt-28 pb-16 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <span className="text-6xl mb-4">🔍</span>
      <h2 className="text-3xl font-extrabold text-neutralDark">Page Not Found</h2>
      <p className="text-neutral-500 font-semibold mt-1 mb-8 max-w-sm">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="bg-primary text-white font-extrabold px-8 py-3.5 rounded-full hover:bg-primary-dark">
        Back to Home
      </Link>
    </div>
  );
};

// Help helper since Link is used in NotFound page
import { Link } from 'react-router-dom';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-neutralLight">
              {/* Sticky Navbar */}
              <Navbar />

              {/* Main Routing Container */}
              <main className="flex-grow">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/pizza/:id" element={<PizzaDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<LoginRegister />} />

                  {/* Customer protected routes */}
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/order-history" 
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Admin protected routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/pizzas" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminPizzas />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/orders" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminOrders />
                      </ProtectedRoute>
                    } 
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Responsive Footer */}
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
