import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
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
      const { data } = await api.post('/users', { name, email, password, role });
      login(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/20 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-premium overflow-hidden border border-slate-100 animate-slide-up">
        {/* Left Side: Form */}
        <div className="p-8 md:p-16 space-y-10">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-lg">Join our community and start discovering services.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-all duration-300 w-5 h-5" />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 transition-all duration-300 outline-none text-slate-700 font-medium"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-all duration-300 w-5 h-5" />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 transition-all duration-300 outline-none text-slate-700 font-medium"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
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
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 ml-1">Sign up as a:</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`flex-1 py-4 rounded-2xl border-2 transition-all duration-300 font-bold flex flex-col items-center gap-2 ${role === 'user' ? 'border-primary-600 bg-primary-50 text-primary-600 shadow-lg shadow-primary-100' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <User className={`w-5 h-5 ${role === 'user' ? 'text-primary-600' : 'text-slate-300'}`} />
                  <span>Regular User</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`flex-1 py-4 rounded-2xl border-2 transition-all duration-300 font-bold flex flex-col items-center gap-2 ${role === 'vendor' ? 'border-primary-600 bg-primary-50 text-primary-600 shadow-lg shadow-primary-100' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <ShieldCheck className={`w-5 h-5 ${role === 'vendor' ? 'text-primary-600' : 'text-slate-300'}`} />
                  <span>Service Provider</span>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-primary-600 transition-all duration-300 shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
            >
              {loading ? (
                 <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all duration-300" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-slate-500 font-medium">
              Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700">Sign in instead</Link>
            </p>
          </div>
        </div>

        {/* Right Side: Visual - Now visible on mobile */}
        <div className="relative bg-primary-600 p-8 sm:p-16 overflow-hidden min-h-[400px] flex flex-col justify-center">
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
           
           <div className="relative z-10 space-y-12 text-white">
              <div className="space-y-6">
                <h3 className="text-4xl font-display font-bold">Join the <br />Community.</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                   {[
                     'Discover top educational institutions',
                     'Access verified healthcare providers',
                     'Read and write authentic reviews',
                     'Manage your favorite services easily'
                   ].map((item, idx) => (
                     <li key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white shrink-0">
                           <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-primary-50 font-medium text-sm sm:text-base">{item}</span>
                     </li>
                   ))}
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 border border-white/20 shadow-2xl">
                 <p className="text-base sm:text-lg font-medium leading-relaxed mb-6">"Our mission is to bridge the gap between quality providers and those who need them most."</p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-white/20 overflow-hidden bg-slate-200 shadow-lg">
                      <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200&h=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Team" />
                    </div>
                    <div>
                       <p className="font-bold text-lg leading-none mb-1">Team Platform</p>
                       <p className="text-xs opacity-70 font-bold uppercase tracking-widest">Core Development</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
