import React, { useState, useEffect } from 'react';
import { Star, MapPin, Search, ChevronRight, Award, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Explore = () => {
    const [topRated, setTopRated] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopRated();
    }, []);

    const fetchTopRated = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/listings', { 
                params: { sortBy: 'averageRating', order: 'desc', limit: 21 } 
            });
            setTopRated(data);
        } catch (error) {
            console.error('Error fetching top rated:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary-50/50 to-transparent -z-10" />
            <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary-200/20 blur-[120px] rounded-full -z-10 animate-pulse" />
            <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-secondary-200/20 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 relative">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md text-primary-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary-100 shadow-sm animate-fade-in">
                            <Award className="w-4 h-4 text-secondary-500" />
                            Premium Selection
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] animate-slide-up">
                            Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Gold Standard</span>
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed animate-slide-up delay-100">
                            Handpicked and verified services that have earned the highest trust and ratings from our professional community.
                        </p>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-6 animate-slide-up delay-200">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white overflow-hidden shadow-lg">
                                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-2xl border-4 border-white bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                                +2k
                            </div>
                        </div>
                        <div className="text-sm font-bold text-slate-400">
                            Trusted by <span className="text-slate-900">2,400+</span> members
                        </div>
                    </div>
                </div>

                {/* Explore Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-[2.5rem] h-[450px] animate-pulse border border-slate-100 shadow-sm" />
                        ))}
                    </div>
                ) : topRated.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {topRated.map((item, index) => (
                            <Link
                                to={`/listings/${item._id}`}
                                key={item._id}
                                className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-premium hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 overflow-hidden animate-slide-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Image Container */}
                                <div className="relative h-72 overflow-hidden">
                                    <img
                                        src={item.images?.[0]
                                            ? (item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000${item.images[0]}`)
                                            : 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                        alt={item.title}
                                    />
                                    
                                    {/* Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                    
                                    {/* Badges */}
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-2">
                                            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            Trending
                                        </div>
                                        <div className="px-3 py-1.5 bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3" />
                                            Verified
                                        </div>
                                    </div>

                                    <div className="absolute top-6 right-6 px-3 py-1.5 bg-white backdrop-blur-md rounded-xl shadow-lg flex items-center gap-2 border border-slate-100">
                                        <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                                        <span className="font-black text-xs text-slate-900">{Number(item.averageRating || 0).toFixed(1)}</span>
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mb-1">
                                            {item.categoryId?.name}
                                        </p>
                                        <h3 className="text-2xl font-bold text-white leading-tight">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 pt-6 space-y-5">
                                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-primary-500" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{item.location?.city}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-primary-600 group-hover:gap-4 transition-all duration-300">
                                            View Details
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Border Effect */}
                                <div className="absolute inset-0 border-2 border-primary-500/0 group-hover:border-primary-500/10 rounded-[2.5rem] pointer-events-none transition-colors duration-500" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 bg-white rounded-[3.5rem] border border-dashed border-slate-200 shadow-sm animate-fade-in">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Elite Listings Found</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">
                            We couldn't find any listings meeting our elite criteria. Check back later for new additions.
                        </p>
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-32 p-12 md:p-20 bg-slate-900 rounded-[3.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/20 to-transparent -z-0" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-6 max-w-xl text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                Own a <span className="text-primary-400">Premium</span> Service?
                            </h2>
                            <p className="text-slate-400 text-lg">
                                Join our network of verified professionals and reach thousands of local clients searching for quality.
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <Link to="/signup" className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-900/20">
                                    Become a Vendor
                                </Link>
                                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all border border-white/10 backdrop-blur-md">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="relative hidden lg:block">
                            <div className="w-72 h-72 bg-gradient-to-tr from-primary-600 to-secondary-600 rounded-[3rem] rotate-12 animate-pulse opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Award className="w-32 h-32 text-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;

