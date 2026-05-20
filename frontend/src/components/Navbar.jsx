import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, User, LogOut, Menu, X, Bell, Heart } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { userInfo, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Services', path: '/listings' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'py-2 md:py-3 bg-white/80 backdrop-blur-lg shadow-premium' : 'py-3 md:py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <img 
                src="/DP.png" 
                alt="DP Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" 
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isHome = location.pathname === '/';
                const useWhiteText = isHome && !scrolled;
                return (
                  <NavLink 
                    key={link.name}
                    to={link.path} 
                    className={({ isActive }) => 
                      `text-sm font-semibold transition-all duration-300 hover:text-primary-600 relative py-1 ${
                        isActive 
                          ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 after:rounded-full' 
                          : useWhiteText ? 'text-white' : 'text-slate-600'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                );
              })}
            </div>

            <div className={`flex items-center gap-5 border-l pl-10 ${location.pathname === '/' && !scrolled ? 'border-white/20' : 'border-slate-200'}`}>
              {userInfo ? (
                <div className="flex items-center gap-4">
                  {/* ... rest of the existing logic ... */}

                  {userInfo.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-xl font-bold text-xs hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                    >
                      <User className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  {userInfo.role === 'vendor' && (
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  <Link to="/wishlist" className="p-2 text-slate-400 hover:text-primary-600 transition-colors relative">
                    <Heart className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
                  </Link>
                  
                  <div className="flex items-center gap-3 bg-slate-50 p-1 pr-4 rounded-full border border-slate-100">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 leading-none">{userInfo.name}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{userInfo.role}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className={`text-sm font-bold transition-colors ${location.pathname === '/' && !scrolled ? 'text-white hover:text-primary-200' : 'text-slate-600 hover:text-primary-600'}`}>
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`lg:hidden p-2 rounded-lg transition-colors ${location.pathname === '/' && !scrolled ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'}`} 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-500 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-[75%] sm:w-[50%] bg-white z-[70] shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full bg-white relative">
          {/* Sidebar Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-50">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
              <div className="w-16 h-16 flex items-center justify-center">
                <img 
                  src="/DP.png" 
                  alt="DP Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" 
                />
              </div>
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Links */}
          <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name}
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 shadow-sm shadow-primary-100' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                    }`
                  }
                >
                  <span className="text-lg">{link.name}</span>
                </NavLink>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Account</p>
              {userInfo ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-4 px-4 py-4 bg-slate-50 rounded-2xl mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 font-bold text-xl">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none mb-1">{userInfo.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{userInfo.role}</p>
                    </div>
                  </div>

                  {userInfo.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  {userInfo.role === 'vendor' && (
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span>My Wishlist</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-4 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all mt-4"
                  >
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 px-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center justify-center gap-2 w-full py-4 font-bold text-slate-700 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center justify-center gap-2 w-full py-4 font-bold text-white bg-primary-600 rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-8 bg-slate-50 mt-auto">
            <p className="text-[10px] text-slate-400 font-medium text-center">
              © 2026. <br/> All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
