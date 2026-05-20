import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { userInfo, login } = useAuthStore();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/users/login', { email, password });
      login(data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-200/20 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-premium overflow-hidden border border-slate-100 animate-slide-up">
        {/* Left Side: Form */}
        <div className="p-8 md:p-16 space-y-10">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-lg">Access your personalized dashboard and services.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-all duration-300 w-5 h-5" />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 transition-all duration-300 outline-none text-slate-700 font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-all duration-300 w-5 h-5" />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 transition-all duration-300 outline-none text-slate-700 font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-primary-600 transition-all duration-300 shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all duration-300" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-slate-500 font-medium">
              New to the platform? <Link to="/signup" className="text-primary-600 font-bold hover:text-primary-700">Create account</Link>
            </p>
          </div>
        </div>

        {/* Right Side: Visual - Now visible on mobile below form */}
        <div className="relative bg-primary-600 p-8 sm:p-16 overflow-hidden min-h-[400px] flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
           
           <div className="relative z-10 h-full flex flex-col justify-between text-white gap-12">
              <div className="space-y-4">
                <h3 className="text-3xl font-display font-bold">Secure Access. <br />Better Experience.</h3>
                <p className="text-primary-100 text-lg leading-relaxed">Log in to manage your bookings, save your favorite services, and connect with providers directly.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 border border-white/20">
                 <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex -space-x-3">
                        {[
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop',
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop'
                        ].map((url, i) => (
                           <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white/20 overflow-hidden bg-slate-200">
                             <img src={url} className="w-full h-full object-cover" alt="User" />
                           </div>
                        ))}
                    </div>
                    <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">+2k active users</span>
                 </div>
                 <p className="text-sm font-medium italic opacity-80">"This platform has completely changed how I find healthcare services. Highly recommended!"</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
