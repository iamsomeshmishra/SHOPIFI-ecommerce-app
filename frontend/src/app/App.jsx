import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer, AmbientProgress, ErrorBoundary } from '@/features/shared';
import { Home } from '@/features/home';

// Lazy loaded routes via feature barrels to preserve encapsulation boundaries
const Products = lazy(() => import('@/features/products').then(m => ({ default: m.Products })));
const ProductDetail = lazy(() => import('@/features/products').then(m => ({ default: m.ProductDetail })));
const Cart = lazy(() => import('@/features/cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('@/features/checkout').then(m => ({ default: m.Checkout })));
const OrderSuccess = lazy(() => import('@/features/checkout').then(m => ({ default: m.OrderSuccess })));
const Login = lazy(() => import('@/features/auth').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('@/features/auth').then(m => ({ default: m.Signup })));
const Dashboard = lazy(() => import('@/features/dashboard').then(m => ({ default: m.Dashboard })));
const AdminDashboard = lazy(() => import('@/features/admin').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('@/features/admin').then(m => ({ default: m.AdminProducts })));
const AdminCategories = lazy(() => import('@/features/admin').then(m => ({ default: m.AdminCategories })));

// Scroll Restoration Utility
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-canvas-night text-white font-body selection:bg-aloe-10 selection:text-black">
          {/* Navigation Bar */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-grow">
            <Suspense fallback={<AmbientProgress />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Admin Management Panel */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
              </Routes>
            </Suspense>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
