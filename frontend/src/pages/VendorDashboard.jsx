import React, { useState, useEffect } from 'react';
import { 
  Plus, LayoutDashboard, ListFilter, ClipboardCheck, Clock, Settings, 
  Eye, TrendingUp, Star, MapPin, MoreVertical, Edit3, Trash2, Bell, Search, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import ListingFormModal from '../components/ListingFormModal';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  
  const { userInfo, logout } = useAuthStore();

  useEffect(() => {
    fetchVendorListings();
  }, []);

  const fetchVendorListings = async () => {
    try {
        const { data } = await api.get('/listings'); 
        setListings(data.filter(l => l.vendorId?._id === userInfo._id));
    } catch (error) {
        console.error('Error fetching listings:', error);
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingListing(null);
    setShowForm(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 lg:w-64 bg-slate-900 flex flex-col py-6 px-3 transition-all duration-500 relative z-20 shrink-0">
        <div className="flex items-center gap-3 px-3 mb-10">
          <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/50">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <div className="hidden lg:block">
            <div className="w-14 h-14 flex items-center justify-center">
               <img 
                 src="/DP.png" 
                 alt="Logo" 
                 className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" 
               />
            </div>
            <p className="text-primary-400 text-[10px] font-black uppercase tracking-widest mt-1">Vendor Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Performance' },
            { id: 'listings', icon: ListFilter, label: 'My Services' },
            { id: 'reviews', icon: Star, label: 'Client Feedback' },
            { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-bold group ${
                activeTab === item.id 
                  ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'animate-pulse' : ''}`} />
              <span className="hidden lg:block text-sm">{item.label}</span>
              {activeTab === item.id && <div className="hidden lg:block ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
            </button>
          ))}
        </nav>

        <div className="pt-8 mt-8 border-t border-slate-800 space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold group">
            <Settings className="w-5 h-5" />
            <span className="hidden lg:block text-sm">Portal Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold group"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-slate-900 capitalize tracking-tight">
              {activeTab === 'overview' ? 'Performance Insights' : activeTab === 'listings' ? 'Service Management' : activeTab}
            </h1>
            <div className="h-4 w-px bg-slate-200" />
            <p className="text-slate-400 text-xs font-bold hidden sm:block">Managing as {userInfo.name}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search your listings..." 
                className="pl-12 pr-4 py-2.5 bg-slate-50 border border-transparent focus:border-primary-500 rounded-xl outline-none text-sm w-64 transition-all"
              />
            </div>
            <button className="relative w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-600 p-0.5 shadow-lg">
              <img src={`https://ui-avatars.com/api/?name=${userInfo.name}&background=random`} alt="Vendor" className="w-full h-full rounded-[10px] object-cover" />
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6 pb-8">
            
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* Greeting */}
                <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary-900/20">
                  <div className="relative z-10 space-y-3 max-w-lg">
                    <h2 className="text-3xl font-black tracking-tight leading-tight">Elite Partner Dashboard</h2>
                    <p className="text-primary-100 font-medium opacity-80 leading-relaxed">
                      Your services have reached <span className="text-white font-black underline decoration-emerald-400 decoration-2 underline-offset-4">4,200+ clients</span> this month. Keep up the excellent work!
                    </p>
                    <button onClick={handleCreate} className="px-6 py-3 bg-white text-primary-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                      List New Service
                    </button>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 h-full w-1/3 bg-white/10 -skew-x-12 translate-x-20" />
                  <LayoutDashboard className="absolute bottom-[-20%] right-[5%] w-64 h-64 text-white opacity-10 rotate-12" />
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: 'Live Services', value: listings.filter(l => l.status === 'approved').length, icon: ClipboardCheck, color: 'emerald', trend: '+2 this week' },
                    { label: 'Pending Review', value: listings.filter(l => l.status === 'pending').length, icon: Clock, color: 'amber', trend: 'Average 24h wait' },
                    { label: 'Total Views', value: '8.4k', icon: Eye, color: 'primary', trend: '+18.4% from last month' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-100 flex items-center justify-between group hover:shadow-2xl transition-all duration-300">
                      <div className="space-y-2">
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        <p className="text-[10px] font-bold text-slate-400">{stat.trend}</p>
                      </div>
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                        stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                        stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 
                        'bg-primary-50 text-primary-600'
                      }`}>
                        <stat.icon className="w-8 h-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="space-y-8 animate-slide-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Service Portfolio</h2>
                    <p className="text-slate-400 font-bold">Manage your active and pending registrations</p>
                  </div>
                  <button 
                    onClick={handleCreate}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary-900/10 active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-widest">New Service Listing</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {listings.length > 0 ? listings.map(item => (
                    <div key={item._id} className="bg-white p-6 rounded-[2rem] shadow-premium border border-slate-100 flex flex-col md:flex-row items-center gap-8 group hover:border-primary-200 transition-all duration-300">
                      {/* Image Preview */}
                      <div className="w-full md:w-48 h-32 bg-slate-100 rounded-2xl overflow-hidden shrink-0 relative">
                        {item.images && item.images[0] ? (
                          <img 
                            src={item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000${item.images[0]}`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            alt={item.title}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ListFilter className="w-8 h-8 text-slate-200" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg shadow-sm">
                           <div className="flex items-center gap-1">
                             <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                             <span className="text-[10px] font-black">{Number(item.averageRating || 0).toFixed(1)}</span>
                           </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-3 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-1">
                          <h3 className="text-2xl font-black text-slate-900 leading-tight">{item.title}</h3>
                          <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border ${
                            item.status === 'approved' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {item.status === 'approved' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                            {item.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                           <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                             <MapPin className="w-4 h-4 text-primary-500" />
                             {item.location?.city || 'Location Pending'}
                           </div>
                           <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-widest">
                             {item.categoryId?.name}
                           </div>
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-1 max-w-2xl font-medium italic">"{item.description}"</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-sm group/btn"
                          title="Edit Resource"
                        >
                          <Edit3 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button 
                          className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                          title="Archive Listing"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-40 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 animate-fade-in">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <ListFilter className="w-10 h-10 text-slate-200" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">No Services Discovered</h3>
                      <p className="text-slate-400 font-bold text-sm max-w-xs mx-auto leading-relaxed">
                        You haven't listed any services yet. Start by creating your first resource registration.
                      </p>
                      <button onClick={handleCreate} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl">
                        Register Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other tabs can be added here */}
            {activeTab === 'reviews' && (
              <div className="text-center py-40 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 animate-fade-in">
                <Star className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900">Feedback Terminal</h3>
                <p className="text-slate-400 font-bold text-sm">Customer review management coming soon.</p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-40 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 animate-fade-in">
                <TrendingUp className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900">Growth Engine</h3>
                <p className="text-slate-400 font-bold text-sm">Advanced data visualization coming soon.</p>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Listing Form Modal */}
      <ListingFormModal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        onRefresh={fetchVendorListings} 
        initialData={editingListing}
      />
    </div>
  );
};

export default VendorDashboard;

