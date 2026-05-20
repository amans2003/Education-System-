import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Filter, Search, ChevronRight, X, CheckCircle, ArrowLeft, Layers, SlidersHorizontal } from 'lucide-react';
import api from '../utils/api';

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  // Read from URL
  const categoryId = searchParams.get('category');
  const subcategoryId = searchParams.get('subcategory');
  const state = searchParams.get('state');

  // ── Search bar state (pre-filled from URL) ──
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState(categoryId || '');
  const [searchSubcategory, setSearchSubcategory] = useState(subcategoryId || '');
  const [searchState, setSearchState] = useState(state || '');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (searchCategory) {
      api.get(`/subcategories/category/${searchCategory}`).then(r => setSubcategories(r.data)).catch(() => {});
    } else {
      setSubcategories([]);
      setSearchSubcategory('');
    }
  }, [searchCategory]);

  // Sync search bar when URL changes
  useEffect(() => {
    setSearchCategory(categoryId || '');
    setSearchSubcategory(subcategoryId || '');
    setSearchState(state || '');
    setSelectedCity('');
    fetchListings();
  }, [categoryId, subcategoryId, state]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/listings', {
        params: {
          category: categoryId || undefined,
          subcategory: subcategoryId || undefined,
          state: state || undefined,
        }
      });
      setAllListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchCategory && !searchState.trim()) return;
    const params = new URLSearchParams();
    if (searchCategory) params.append('category', searchCategory);
    if (searchSubcategory) params.append('subcategory', searchSubcategory);
    if (searchState.trim()) params.append('state', searchState.trim());
    setSearchParams(params);
    setShowSearch(false);
    setSelectedCity('');
  };

  // Derive unique cities
  const availableCities = useMemo(() => {
    const cities = allListings.map(l => l.location?.city).filter(Boolean);
    return [...new Set(cities)].sort();
  }, [allListings]);

  // Client-side city filter
  const displayedListings = useMemo(() => {
    if (!selectedCity) return allListings;
    return allListings.filter(l => l.location?.city?.toLowerCase() === selectedCity.toLowerCase());
  }, [allListings, selectedCity]);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 sm:pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-4 h-4 text-slate-600" />
                 </button>
                 <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400">
                    <Link to="/" className="hover:text-primary-600">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-900">Services</span>
                 </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                 {loading ? 'Discovering...' : `Available Services (${displayedListings.length})`}
              </h1>
           </div>

           <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 sm:py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${showSearch ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-slate-700 border border-slate-100 shadow-sm hover:border-primary-200'}`}
              >
                <Search className="w-4 h-4" />
                <span>{showSearch ? 'Close' : 'Search'}</span>
              </button>
              
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 sm:py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${filterOpen ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-700 border border-slate-100 shadow-sm hover:border-primary-200'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
              </button>
           </div>
        </div>

        {/* Collapsible Search Form */}
        {showSearch && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xl animate-slide-up">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-bold text-slate-400 px-1">Category</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <select
                    className="w-full pl-11 pr-4 py-4 sm:py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                    value={searchCategory}
                    onChange={e => setSearchCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-bold text-slate-400 px-1">Subcategory</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <select
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm font-bold text-slate-700 appearance-none cursor-pointer disabled:opacity-50"
                    value={searchSubcategory}
                    onChange={e => setSearchSubcategory(e.target.value)}
                    disabled={!searchCategory}
                  >
                    <option value="">All Subcategories</option>
                    {subcategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-bold text-slate-400 px-1">Location (State)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="e.g. Punjab"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-sm font-bold text-slate-700 outline-none"
                    value={searchState}
                    onChange={e => setSearchState(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3.5 rounded-xl hover:bg-primary-700 transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
                >
                  <Search className="w-5 h-5" />
                  <span>Update Search</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* City Filter Panel */}
        {filterOpen && availableCities.length > 0 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Filter by City</h3>
              {selectedCity && (
                <button onClick={() => setSelectedCity('')} className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" /> Clear Filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableCities.map(cityName => {
                const count = allListings.filter(l => l.location?.city?.toLowerCase() === cityName.toLowerCase()).length;
                const isActive = selectedCity.toLowerCase() === cityName.toLowerCase();
                return (
                  <button
                    key={cityName}
                    onClick={() => setSelectedCity(isActive ? '' : cityName)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-100'
                        : 'bg-slate-50 text-slate-600 border-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    {cityName}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-3xl h-[500px] animate-pulse border border-slate-50" />
            ))}
          </div>
        ) : displayedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            {displayedListings.map(item => (
              <Link
                to={`/listings/${item._id}`}
                key={item._id}
                className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden h-full"
              >
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img
                    src={item.images?.[0]
                      ? (item.images[0].startsWith('http') ? item.images[0] : `${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000'}${item.images[0]}`)
                      : 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={item.title}
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-primary-700 text-[10px] font-bold uppercase rounded-xl shadow-lg border border-white/50">
                      {item.categoryId?.name === 'Real State' ? 'Real Estate' : item.categoryId?.name}
                    </span>
                  </div>
                  <div className="absolute top-6 right-6 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-xl flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                    <span className="font-bold text-sm">{Number(item.averageRating || 0).toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-tight mb-3">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-3">
                      <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="truncate">{item.location?.city}, {item.location?.state}</span>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
                       {item.description}
                    </p>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex flex-col truncate pr-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</span>
                        <span className="text-xs font-bold text-slate-700 truncate">
                           {item.subcategoryId?.name && item.subcategoryId.name !== 'General' 
                             ? item.subcategoryId.name 
                             : (item.categoryId?.name === 'Real State' ? 'Real Estate' : (item.categoryId?.name || 'General'))}
                        </span>
                     </div>
                     <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg transition-all duration-300 flex-shrink-0">
                        <ChevronRight className="w-5 h-5" />
                     </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 space-y-8 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
              <Search className="w-12 h-12" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-slate-900">
                No services found
              </h3>
              <p className="text-slate-400 max-w-sm mx-auto font-medium">
                We couldn't find any listings matching your current criteria. Try adjusting your filters or search terms.
              </p>
              <button 
                onClick={() => {
                  setSearchParams({});
                  setSelectedCity('');
                }} 
                className="mt-6 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-600 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
