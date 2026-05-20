import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Layers, ClipboardList, MessageSquare, 
  Check, X, Edit2, Trash2, Plus, Save, Eye, EyeOff, Mail, 
  ChevronRight, TrendingUp, ShieldCheck, Bell, Search, Settings, LogOut,
  ArrowRight, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import ListingFormModal from '../components/ListingFormModal';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showListingModal, setShowListingModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  // Category form state
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  // Category EDIT state
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [editingCatDesc, setEditingCatDesc] = useState('');

  // Subcategory form state
  const [subName, setSubName] = useState('');
  const [subParent, setSubParent] = useState('');
  // Subcategory EDIT state
  const [editingSubId, setEditingSubId] = useState(null);
  const [editingSubName, setEditingSubName] = useState('');
  const [editingSubParent, setEditingSubParent] = useState('');

  const { userInfo, logout } = useAuthStore();

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/login');
    } else {
      fetchAdminData();
    }
  }, [userInfo, navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [listRes, catRes, subRes, revRes, msgRes] = await Promise.all([
        api.get('/listings/admin'),
        api.get('/categories'),
        api.get('/subcategories'),
        api.get('/reviews'),
        api.get('/messages')
      ]);
      setListings(listRes.data);
      setCategories(catRes.data);
      setSubcategories(subRes.data);
      setReviews(revRes.data);
      setChatMessages(msgRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleListingStatus = async (id, status) => {
    try {
      await api.put(`/listings/${id}`, { status });
      toast.success(`Listing ${status}`);
      fetchAdminData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setShowListingModal(true);
  };

  const handleReviewStatus = async (id, status) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      toast.success(`Review ${status}`);
      fetchAdminData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm('⚠️ Are you sure you want to PERMANENTLY delete this listing? This action cannot be undone.')) {
      try {
        await api.delete(`/listings/${id}`);
        toast.success('Listing permanently removed');
        fetchAdminData();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name: catName, description: catDesc });
      toast.success('Category created');
      setCatName(''); setCatDesc('');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      await api.put(`/categories/${id}`, { name: editingCatName, description: editingCatDesc });
      toast.success('Category updated');
      setEditingCatId(null);
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subcategories', { name: subName, parentCategory: subParent });
      toast.success('Subcategory created');
      setSubName(''); setSubParent('');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to create subcategory');
    }
  };

  const handleUpdateSubcategory = async (id) => {
    try {
      await api.put(`/subcategories/${id}`, { name: editingSubName, parentCategory: editingSubParent });
      toast.success('Subcategory updated');
      setEditingSubId(null);
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update subcategory');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category? All subcategories under it may be affected.')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Category removed');
        fetchAdminData();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (window.confirm('Delete this subcategory?')) {
      try {
        await api.delete(`/subcategories/${id}`);
        toast.success('Subcategory removed');
        fetchAdminData();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!userInfo || userInfo.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 lg:w-64 bg-slate-900 flex flex-col py-6 px-3 transition-all duration-500 relative z-20">
        <div className="flex items-center gap-3 px-3 mb-10">
          <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/50">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div className="hidden lg:block">
            <div className="w-14 h-14 flex items-center justify-center">
               <img 
                 src="/DP.png" 
                 alt="Logo" 
                 className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" 
               />
            </div>
            <p className="text-primary-400 text-[10px] font-black uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'stats', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'listings', icon: ClipboardList, label: 'Listing Queue' },
            { id: 'categories', icon: Layers, label: 'Taxonomy' },
            { id: 'reviews', icon: MessageSquare, label: 'Moderation' },
            { id: 'messages', icon: Mail, label: 'Support Inquiries' },
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
            <span className="hidden lg:block text-sm">Settings</span>
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
            <h1 className="text-xl font-black text-slate-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h1>
            <div className="h-4 w-px bg-slate-200" />
            <p className="text-slate-400 text-xs font-bold hidden sm:block">Welcome back, {userInfo.name}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-12 pr-4 py-2.5 bg-slate-50 border border-transparent focus:border-primary-500 rounded-xl outline-none text-sm w-64 transition-all"
              />
            </div>
            <button className="relative w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-600 p-0.5 shadow-lg">
              <img src={`https://ui-avatars.com/api/?name=${userInfo.name}&background=random`} alt="Admin" className="w-full h-full rounded-[10px] object-cover" />
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6 pb-8">
            
            {activeTab === 'stats' && (
              <div className="space-y-8 animate-fade-in">
                {/* Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Listings', value: listings.length, color: 'primary', icon: ClipboardList },
                    { label: 'Pending Approval', value: listings.filter(l => l.status === 'pending').length, color: 'rose', icon: Eye },
                    { label: 'Active Users', value: '1.2k', color: 'emerald', icon: Users },
                    { label: 'Support Tickets', value: chatMessages.length, color: 'secondary', icon: Mail },
                  ].map((s, i) => (
                    <div key={i} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-premium hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                          s.color === 'primary' ? 'bg-primary-50 text-primary-600' : 
                          s.color === 'rose' ? 'bg-rose-50 text-rose-600' : 
                          s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                          'bg-indigo-50 text-indigo-600'
                        }`}>
                          <s.icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-emerald-500 text-xs font-black">+12.5%</span>
                          <span className="text-slate-300 text-[10px] uppercase font-bold tracking-widest">Growth</span>
                        </div>
                      </div>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-1">{s.label}</p>
                      <p className="text-2xl font-black text-slate-900">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Main Dashboard UI Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black text-slate-900">System Activity</h3>
                        <p className="text-sm text-slate-400 font-bold">Listing submissions over the last 30 days</p>
                      </div>
                      <select className="bg-slate-50 border-none outline-none px-4 py-2 rounded-xl text-sm font-bold text-slate-600">
                        <option>Last 30 Days</option>
                        <option>Last 7 Days</option>
                      </select>
                    </div>
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-100 rounded-[2rem]">
                      <TrendingUp className="w-12 h-12 text-slate-200 mb-4" />
                      <p className="text-slate-400 font-bold text-sm">Visual Analytics coming soon...</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Recent Reports</h3>
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors">
                            <Mail className="w-5 h-5 text-slate-400 group-hover:text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">Support Request #{i}20</p>
                            <p className="text-xs text-slate-400 mt-0.5">2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                      View All Activity
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="space-y-6 animate-slide-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Resource Registry</h2>
                    <p className="text-slate-400 font-bold">Manage and moderate all service providers</p>
                  </div>
                  <button
                    onClick={() => { setEditingListing(null); setShowListingModal(true); }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary-900/10 active:scale-95"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-sm uppercase tracking-widest">Add New Resource</span>
                  </button>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-6 py-5">Identity & Type</th>
                          <th className="px-6 py-5">Metadata</th>
                          <th className="px-6 py-5">Ownership</th>
                          <th className="px-6 py-5">Verification</th>
                          <th className="px-6 py-5 text-right">Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {listings.map(l => (
                          <tr key={l._id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                  <img 
                                    src={l.images?.[0] ? (l.images[0].startsWith('http') ? l.images[0] : `http://localhost:5000${l.images[0]}`) : 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100'} 
                                    className="w-full h-full object-cover" 
                                    alt={l.title} 
                                  />
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 leading-tight text-sm">{l.title}</p>
                                  <p className="text-[9px] text-primary-600 font-black uppercase tracking-[0.1em] mt-0.5">{l.categoryId?.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                {l.subcategoryId?.name || 'Uncategorized'}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 uppercase">
                                  {l.vendorId?.name?.[0] || 'V'}
                                </div>
                                <span className="text-xs font-bold text-slate-600">{l.vendorId?.name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center w-fit gap-1.5 ${
                                l.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                l.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                                'bg-slate-100 text-slate-400 border border-slate-200'
                              }`}>
                                {l.status === 'approved' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                                {l.status}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {l.status === 'pending' && (
                                  <button onClick={() => handleListingStatus(l._id, 'approved')} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Approve">
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {l.status === 'approved' && (
                                  <button onClick={() => handleListingStatus(l._id, 'hidden')} className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-200 transition-all shadow-sm" title="Archive">
                                    <EyeOff className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button onClick={() => handleEdit(l)} className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDeleteListing(l._id)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {listings.length === 0 && (
                    <div className="text-center py-24">
                      <ClipboardList className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Registry is currently empty</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
                {/* ── Category Panel ── */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-100 space-y-10">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">Category Architecture</h3>
                    <p className="text-slate-400 font-bold text-xs mb-6">Define top-level service classifications</p>
                    <form onSubmit={handleCreateCategory} className="space-y-5">
                      <input 
                        placeholder="Core Name (e.g., Medical Center)" 
                        value={catName} 
                        onChange={e => setCatName(e.target.value)} 
                        required 
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-primary-400 focus:bg-white transition-all font-bold text-sm" 
                      />
                      <textarea 
                        placeholder="Describe the scope of this category..." 
                        value={catDesc} 
                        onChange={e => setCatDesc(e.target.value)} 
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-primary-400 focus:bg-white transition-all text-sm h-24" 
                      />
                      <button className="w-full bg-primary-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/10 uppercase tracking-widest text-[10px]">
                        <Plus className="w-4 h-4" /> Deploy Category
                      </button>
                    </form>
                  </div>
                  
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {categories.map(c => (
                      <div key={c._id} className="group border border-slate-100 rounded-3xl bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                        {editingCatId === c._id ? (
                          <div className="space-y-4">
                            <input value={editingCatName} onChange={e => setEditingCatName(e.target.value)} className="w-full px-4 py-3 bg-white rounded-xl border border-primary-200 outline-none font-bold text-sm" />
                            <textarea value={editingCatDesc} onChange={e => setEditingCatDesc(e.target.value)} className="w-full px-4 py-3 bg-white rounded-xl border border-primary-200 outline-none text-xs h-20" />
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateCategory(c._id)} className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> Commit Changes
                              </button>
                              <button onClick={() => setEditingCatId(null)} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-wider">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-black text-slate-900 mb-1">{c.name}</p>
                              <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] line-clamp-2">{c.description || 'Global service classification system'}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                              <button onClick={() => { setEditingCatId(c._id); setEditingCatName(c.name); setEditingCatDesc(c.description || ''); }} className="p-2 bg-white text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-sm border border-slate-100">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteCategory(c._id)} className="p-2 bg-white text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Subcategory Panel ── */}
                <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-premium text-white space-y-10">
                  <div>
                    <h3 className="text-xl font-black text-white mb-1">Granular Specialization</h3>
                    <p className="text-slate-400 font-bold text-xs mb-6">Refine services with targeted sub-types</p>
                    <form onSubmit={handleCreateSubcategory} className="space-y-5">
                      <select 
                        value={subParent} 
                        onChange={e => setSubParent(e.target.value)} 
                        required 
                        className="w-full px-6 py-4 bg-slate-800 rounded-2xl outline-none border border-transparent focus:border-secondary-500 transition-all font-bold text-sm text-white"
                      >
                        <option value="" className="text-slate-900">Link to Parent Hierarchy</option>
                        {categories.map(c => <option key={c._id} value={c._id} className="text-slate-900">{c.name}</option>)}
                      </select>
                      <input 
                        placeholder="Subtype Name (e.g., Dental Clinic)" 
                        value={subName} 
                        onChange={e => setSubName(e.target.value)} 
                        required 
                        className="w-full px-6 py-4 bg-slate-800 rounded-2xl outline-none border border-transparent focus:border-secondary-500 transition-all font-bold text-sm text-white" 
                      />
                      <button className="w-full bg-secondary-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-secondary-700 transition-all shadow-xl shadow-secondary-900/20 uppercase tracking-widest text-[10px]">
                        <Plus className="w-4 h-4" /> Link Subtype
                      </button>
                    </form>
                  </div>
                  
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {subcategories.map(s => (
                      <div key={s._id} className="group border border-slate-800 rounded-3xl bg-slate-800/50 p-5 transition-all hover:bg-slate-800">
                        {editingSubId === s._id ? (
                          <div className="space-y-4">
                            <select value={editingSubParent} onChange={e => setEditingSubParent(e.target.value)} className="w-full px-4 py-3 bg-slate-700 rounded-xl border-none text-white outline-none text-sm font-bold">
                              {categories.map(c => <option key={c._id} value={c._id} className="text-slate-900">{c.name}</option>)}
                            </select>
                            <input value={editingSubName} onChange={e => setEditingSubName(e.target.value)} className="w-full px-4 py-3 bg-slate-700 rounded-xl border-none text-white outline-none font-bold text-sm" />
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateSubcategory(s._id)} className="flex-1 py-3 bg-secondary-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> Update Link
                              </button>
                              <button onClick={() => setEditingSubId(null)} className="px-6 py-3 bg-slate-700 text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-wider">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-black text-white">{s.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Layers className="w-3 h-3 text-secondary-500" />
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">{s.parentCategory?.name}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => { setEditingSubId(s._id); setEditingSubName(s.name); setEditingSubParent(s.parentCategory?._id || ''); }} className="p-2 bg-slate-700 text-white rounded-xl hover:bg-secondary-600 transition-all">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteSubcategory(s._id)} className="p-2 bg-slate-700 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Moderation Feed</h2>
                    <p className="text-slate-400 font-bold">Audit and verify community feedback</p>
                  </div>
                  <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Security Protocol Active
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {reviews.filter(r => r.status === 'pending').length > 0 ? (
                    reviews.filter(r => r.status === 'pending').map(rev => (
                      <div key={rev._id} className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-100 group hover:border-primary-200 transition-all duration-300">
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500">
                                {rev.userId?.name?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="font-black text-slate-900">{rev.userId?.name || 'Anonymous User'}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`} />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Rating: {rev.rating}/5</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-6 bg-slate-50 rounded-2xl relative border border-slate-100/50">
                              <p className="text-slate-600 italic leading-relaxed font-medium">"{rev.comment}"</p>
                              <div className="absolute top-0 right-0 p-4 opacity-10">
                                <MessageSquare className="w-12 h-12" />
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary-100">
                                Context: {rev.listingId?.title || 'System Resource'}
                              </div>
                              <span className="text-slate-300 text-xs font-bold">Published: {new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-row lg:flex-col gap-3 justify-center lg:justify-start lg:w-48">
                            <button 
                              onClick={() => handleReviewStatus(rev._id, 'approved')} 
                              className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group/btn"
                            >
                              <Check className="w-4 h-4 group-hover/btn:scale-125 transition-transform" /> 
                              Confirm
                            </button>
                            <button 
                              onClick={() => handleReviewStatus(rev._id, 'rejected')} 
                              className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group/btn"
                            >
                              <X className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" /> 
                              Discard
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Check className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Feed is Clean</h3>
                      <p className="text-slate-400 font-bold text-sm">All community reports have been processed</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6 animate-slide-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Communications Hub</h2>
                    <p className="text-slate-400 font-bold">Secure terminal for user interactions</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-6 py-3 bg-white border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">Archive All</button>
                    <button className="px-6 py-3 bg-slate-900 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all">Export CSV</button>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-6 py-5">Sender Identity</th>
                          <th className="px-6 py-5">Message Content</th>
                          <th className="px-6 py-5">Temporal Data</th>
                          <th className="px-6 py-5 text-right">Engagement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {chatMessages.map(m => (
                          <tr key={m._id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-500">
                                  {m.senderName?.[0]}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 text-xs leading-none mb-1">{m.senderName}</p>
                                  <p className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> {m.senderEmail}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 max-w-md">
                              <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                                {m.text}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg w-fit">
                                {new Date(m.timestamp).toLocaleDateString()} at {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <a 
                                href={`mailto:${m.senderEmail}?subject=Support Request\u0026body=Hi ${m.senderName}, regarding your message: \"${m.text}\"`}
                                className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all shadow-sm group/reply"
                              >
                                Respond <ArrowRight className="w-3 h-3 group-hover/reply:translate-x-1 transition-transform" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {chatMessages.length === 0 && (
                    <div className="text-center py-24">
                      <Mail className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No active inquiries</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ListingFormModal
        isOpen={showListingModal}
        onClose={() => { setShowListingModal(false); setEditingListing(null); }}
        onRefresh={fetchAdminData}
        initialData={editingListing}
      />
    </div>
  );
};

export default Admin;

