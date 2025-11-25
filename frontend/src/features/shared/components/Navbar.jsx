import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { useCartStore } from '@/features/cart';
import { Menu, X, ShoppingBag, Heart, User, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.cartItems);
  const [isOpen, setIsOpen] = useState(false);

  // Home page uses dark track; other pages use light track
  const isDarkTrack = location.pathname === '/';
  
  const totalCartQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Shop All', path: '/products' },
    { label: 'Luxury Apparel', path: '/products?category=luxury-apparel' },
    { label: 'Modern Furniture', path: '/products?category=modern-furniture' },
    { label: 'Premium Tech', path: '/products?category=premium-tech' }
  ];

  return (
    <nav className={`w-full z-50 sticky top-0 transition-colors duration-300 ${
      isDarkTrack 
        ? 'bg-canvas-night text-white border-b border-zinc-900' 
        : 'bg-white text-black border-b border-hairline-light'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Wordmark Logo */}
        <Link to="/" className="flex items-center gap-1.5 font-display text-xl font-medium tracking-[0.15em]">
          SHOPIFI
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm font-body tracking-wider transition-opacity hover:opacity-100 ${
                isDarkTrack ? 'text-shade-30 opacity-70 hover:text-white' : 'text-shade-60 opacity-80 hover:text-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Action Buttons / Profiles */}
        <div className="hidden md:flex items-center gap-6">
          {user && user.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`flex items-center gap-1 text-xs uppercase tracking-widest font-medium ${
                isDarkTrack ? 'text-aloe-10 hover:text-white' : 'text-emerald-700 hover:text-black'
              }`}
            >
              <Shield size={14} /> Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className={`p-1.5 rounded-full transition-colors hover:bg-zinc-800 ${
                  isDarkTrack ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                }`}
                title="Account Settings"
              >
                <User size={18} />
              </Link>
              <button 
                onClick={handleLogout} 
                className={`p-1.5 rounded-full transition-colors ${
                  isDarkTrack ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                }`}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login"
                className={`text-xs uppercase tracking-widest font-medium font-body hover:opacity-75`}
              >
                Log In
              </Link>
              <Link 
                to="/signup"
                className={`text-xs uppercase tracking-widest font-medium font-body ${
                  isDarkTrack 
                    ? 'bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200' 
                    : 'bg-black text-white px-4 py-2 rounded-full hover:bg-zinc-800'
                }`}
              >
                Sign Up
              </Link>
            </div>
          )}

          <Link 
            to="/cart" 
            className="relative p-2 flex items-center justify-center rounded-full"
            title="Cart"
          >
            <ShoppingBag size={20} />
            {totalCartQty > 0 && (
              <span className={`absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-body ${
                isDarkTrack ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                {totalCartQty}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-4 md:hidden">
          <Link 
            to="/cart" 
            className="relative p-2 flex items-center justify-center"
          >
            <ShoppingBag size={20} />
            {totalCartQty > 0 && (
              <span className={`absolute top-0 right-0 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                isDarkTrack ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                {totalCartQty}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className={`md:hidden absolute top-20 left-0 w-full flex flex-col gap-6 p-6 border-b z-40 transition-all duration-300 ${
          isDarkTrack 
            ? 'bg-canvas-night border-zinc-900' 
            : 'bg-white border-hairline-light shadow-lg'
        }`}>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-base font-body ${isDarkTrack ? 'text-shade-30' : 'text-shade-60'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <hr className={isDarkTrack ? 'border-zinc-800' : 'border-zinc-100'} />

          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-sm"
                >
                  <User size={16} /> Account Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm text-emerald-600"
                  >
                    <Shield size={16} /> Administrative Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 text-sm text-red-500 text-left"
                >
                  <LogOut size={16} /> Logout Profile
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center border border-black dark:border-white py-2.5 rounded-full text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-full text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
