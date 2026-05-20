import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Explore from './pages/Explore';
import VendorDashboard from './pages/VendorDashboard';
import Admin from './pages/Admin';
import Wishlist from './pages/Wishlist';
import Chatbox from './components/Chatbox';
import ProtectedRoute from './components/ProtectedRoute';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderFooter = ['/dashboard', '/admin'].some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeaderFooter && <Navbar  />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
      <Chatbox />
      <Toaster position="top-center" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <VendorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } 
          />
          {/* Catch all */}
          <Route path="*" element={<div className="flex items-center justify-center min-h-[60vh] text-2xl font-bold text-slate-900">404 - Terminal Failure: Page Not Found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

