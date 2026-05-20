import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronRight, Star, ArrowRight, Shield, Globe, Award } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [state, setState] = useState('');
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subDropdownOpen, setSubDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchTrending();
    fetchTopRated();
  }, []);

  useEffect(() => {
    if (category) {
      fetchSubcategories(category);
    } else {
      setSubcategories([]);
      setSubcategory('');
    }
  }, [category]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTrending = async () => {
    try {
      const { data } = await api.get('/listings', { params: { limit: 6, sortBy: 'createdAt', order: 'desc' } });
      setTrending(data);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const fetchTopRated = async () => {
    try {
      const { data } = await api.get('/listings', { params: { limit: 6, sortBy: 'averageRating', order: 'desc' } });
      setTopRated(data);
    } catch (error) {
      console.error('Error fetching top rated:', error);
    }
  };

  const fetchSubcategories = async (catId) => {
    try {
      const { data } = await api.get(`/subcategories/category/${catId}`);
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!category && !state.trim()) {
      return; 
    }
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (subcategory) params.append('subcategory', subcategory);
    if (state.trim()) params.append('state', state.trim());
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden isolate">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-20"
        >
          <source src="/Business-hero.mp4" type="video/mp4" />
        </video>
        
        {/* Modern Gradient Overlay for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent -z-10" />
        <div className="absolute inset-0 bg-slate-950/20 -z-10" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-4xl space-y-10 animate-slide-up">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">Trusted by 10k+ Users</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-[1.1] tracking-tight">
                Find Everything Local <br />
                <span className="text-white">in One <span className="text-orange-400">Smart Search</span></span>
              </h1>
              <p className="text-lg text-slate-100 max-w-2xl leading-relaxed font-medium drop-shadow-sm">
                Connect with world-class educational institutions and healthcare providers. Verified reviews, expert insights, and seamless bookings.
              </p>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-1.5 sm:p-2 rounded-none md:rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col md:flex-row items-center gap-1.5 max-w-4xl animate-slide-up hover:shadow-primary-500/10 transition-all duration-500 group/form focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-400/50"
            >
              {/* Location Input */}
              <div className="flex-[1.2] w-full flex items-center gap-3 px-4 py-2.5 sm:px-6 sm:py-4 border-b md:border-b-0 md:border-r border-slate-100 group/input">
                <MapPin className="text-primary-500 w-5 h-5 flex-shrink-0 transition-transform group-focus-within/input:scale-110" />
                <input
                  type="text"
                  placeholder="Where are you looking?"
                  className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-sm sm:text-base font-semibold text-slate-700 placeholder:text-slate-400"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              {/* Custom Category Dropdown */}
              <div className="flex-[0.6] w-full relative group/dropdown">
                <div 
                   onClick={() => setDropdownOpen(!dropdownOpen)}
                   className="flex items-center gap-3 px-4 py-2.5 sm:px-6 sm:py-4 border-b md:border-b-0 md:border-r border-slate-100 cursor-pointer hover:bg-slate-50/50 transition-all duration-300 rounded-none"
                >
                  <Globe className={`w-5 h-5 flex-shrink-0 transition-colors ${dropdownOpen ? 'text-primary-500' : 'text-slate-400'}`} />
                  <span className={`text-sm sm:text-base font-semibold truncate ${category ? 'text-slate-900' : 'text-slate-400'}`}>
                    {category ? categories.find(c => c._id === category)?.name : 'Select Category'}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-300 ml-auto transition-transform duration-500 ${dropdownOpen ? 'rotate-90' : 'rotate-0'}`} />
                </div>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-none md:rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                           <div 
                             onClick={() => { setCategory(''); setDropdownOpen(false); }}
                             className="px-6 py-3.5 hover:bg-slate-50 text-sm font-bold text-slate-400 cursor-pointer transition-colors flex items-center gap-3"
                           >
                             <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                                <ArrowRight className="w-4 h-4" />
                             </div>
                             All Categories
                           </div>
                        {categories.map(c => {
                             const displayName = c.name === 'Real State' ? 'Real Estate' : c.name;
                             return (
                               <div 
                                 key={c._id}
                                 onClick={() => { setCategory(c._id); setDropdownOpen(false); setSubDropdownOpen(true); }}
                                 className={`px-6 py-3.5 hover:bg-primary-50 group/item text-sm font-bold cursor-pointer transition-all flex items-center gap-3 ${category === c._id ? 'bg-primary-50 text-primary-600' : 'text-slate-600'}`}
                               >
                                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${category === c._id ? 'bg-primary-100 text-primary-600' : 'bg-slate-50 text-slate-400 group-hover/item:bg-primary-100 group-hover/item:text-primary-600'}`}>
                                    {c.name === 'Education' ? '🎓' : c.name === 'Health' ? '🏥' : '🏢'}
                                 </div>
                                 <span className="truncate">{displayName}</span>
                                </div>
                             );
                           })}
                        </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Custom Subcategory Dropdown */}
              <div className="flex-[0.6] w-full relative group/dropdown border-l border-slate-100">
                <div 
                   onClick={() => category && setSubDropdownOpen(!subDropdownOpen)}
                   className={`flex items-center gap-3 px-4 py-2.5 sm:px-6 sm:py-4 border-b md:border-b-0 md:border-r border-slate-100 cursor-pointer hover:bg-slate-50/50 transition-all duration-300 rounded-none ${!category && 'opacity-50 cursor-not-allowed'}`}
                >
                  <Search className={`w-5 h-5 flex-shrink-0 transition-colors ${subDropdownOpen ? 'text-primary-500' : 'text-slate-400'}`} />
                  <span className={`text-sm sm:text-base font-semibold truncate ${subcategory ? 'text-slate-900' : 'text-slate-400'}`}>
                    {subcategory ? subcategories.find(s => s._id === subcategory)?.name : 'Sub Category'}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-300 ml-auto transition-transform duration-500 ${subDropdownOpen ? 'rotate-90' : 'rotate-0'}`} />
                </div>

                {subDropdownOpen && subcategories.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setSubDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-none md:rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                           <div 
                             onClick={() => { setSubcategory(''); setSubDropdownOpen(false); }}
                             className="px-6 py-3.5 hover:bg-slate-50 text-sm font-bold text-slate-400 cursor-pointer transition-colors flex items-center gap-3"
                           >
                              All Sub Categories
                           </div>
                        {subcategories.map(s => (
                           <div 
                             key={s._id}
                             onClick={() => { setSubcategory(s._id); setSubDropdownOpen(false); }}
                             className={`px-6 py-3.5 hover:bg-primary-50 group/item text-sm font-bold cursor-pointer transition-all flex items-center gap-3 ${subcategory === s._id ? 'bg-primary-50 text-primary-600' : 'text-slate-600'}`}
                           >
                             <span className="truncate">{s.name}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                  </>
                )}
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full lg:w-auto bg-primary-600 text-white px-8 py-3.5 sm:px-10 sm:py-4 rounded-none md:rounded-full font-bold hover:bg-primary-700 transition-all duration-300 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 group/btn active:scale-95"
              >
                <span className="text-sm sm:text-base">Find Now</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">500+</span>
                <span className="text-sm text-slate-300 font-medium">Hospitals</span>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">1.2k+</span>
                <span className="text-sm text-slate-300 font-medium">Institutions</span>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">15k+</span>
                <span className="text-sm text-slate-300 font-medium">Verified Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 px-4">Browse by Category</h2>
            <p className="text-slate-500 max-w-2xl text-base sm:text-lg px-6">Find exactly what you need through our curated classification system.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <button
                key={cat._id}
                onClick={() => navigate(`/listings?category=${cat._id}`)}
                className="group bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col items-center gap-3 sm:gap-4"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {cat.name.charAt(0)}
                </div>
                 <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors text-center px-2">
                   {cat.name === 'Real State' ? 'Real Estate' : cat.name}
                 </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Excellence Guaranteed</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">Top Rated Services</h2>
              <p className="text-slate-500 text-base sm:text-lg">Highly-reviewed partners on our platform.</p>
            </div>
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-600 transition-all duration-300 group"
            >
              <span>Explore All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {topRated.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {topRated.map((item, idx) => (
                <Link
                  to={`/listings/${item._id}`}
                  key={item._id}
                  className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.images?.[0]
                        ? (item.images[0].startsWith('http') ? item.images[0] : `${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000'}${item.images[0]}`)
                        : 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={item.title}
                    />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-primary-700 text-[10px] font-bold uppercase rounded-xl shadow-lg border border-white/50">
                        {item.categoryId?.name}
                      </span>
                    </div>
                    <div className="absolute top-6 right-6 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-xl flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <span className="font-bold text-sm">{Number(item.averageRating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-8 space-y-4 flex-grow flex flex-col">
                    <div className="flex-grow space-y-3">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span>{item.location?.city}, {item.location?.state}</span>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-400">Featured Provider</span>
                       <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 animate-pulse flex items-center justify-center" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 mb-24">
          <div className="relative bg-primary-600 rounded-3xl sm:rounded-[4rem] overflow-hidden p-8 sm:p-12 md:p-24 text-center space-y-6 sm:space-y-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white relative z-10 px-4">Ready to find your perfect match?</h2>
            <p className="text-primary-100 text-base sm:text-xl max-w-2xl mx-auto relative z-10 px-6">Join thousands of others making informed decisions about their education and healthcare today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
               <button onClick={() => navigate('/listings')} className="w-full sm:w-auto bg-white text-primary-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all">Start Searching</button>
               <button onClick={() => navigate('/signup')} className="w-full sm:w-auto bg-primary-700 text-white px-10 py-5 rounded-2xl font-bold text-lg border border-primary-500 hover:bg-primary-800 transition-all">List Your Service</button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
