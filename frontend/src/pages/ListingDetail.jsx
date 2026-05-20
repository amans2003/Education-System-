import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Phone, Globe, Mail, Clock, ShieldCheck, ChevronLeft, Send, Heart, BookOpen, Award, Users, CheckCircle2, Stethoscope, Activity, FileText, ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  
  const { userInfo, updateWishlist } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, reviewsRes] = await Promise.all([
          api.get(`/listings/${id}`),
          api.get(`/reviews/${id}`)
        ]);
        setListing(listingRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching details:', error);
        toast.error('Could not load listing details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) return toast.error('Please login to leave a review');
    
    try {
      await api.post('/reviews', { listingId: id, rating, comment });
      toast.success('Review submitted for moderation!');
      setComment('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleToggleWishlist = async () => {
    if (!userInfo) return toast.error('Please login to save favorites');
    
    try {
      const { data } = await api.post(`/users/wishlist/${id}`);
      updateWishlist(data.wishlist);
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
        <div className="relative">
            <div className="w-20 h-20 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-primary-600 rounded-full animate-pulse" />
            </div>
        </div>
        <div className="text-center space-y-1">
            <p className="font-display font-bold text-slate-900 text-xl tracking-tight">Loading Details</p>
            <p className="text-slate-400 font-medium">Preparing a premium experience for you...</p>
        </div>
    </div>
  );
  
  if (!listing) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
            <FileText className="w-10 h-10" />
        </div>
        <p className="font-display font-bold text-2xl text-slate-900">Listing not found</p>
        <button onClick={() => navigate('/listings')} className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-200">
            Go Back
        </button>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* Premium Hero Section with Gallery */}
      <div className="pt-24 sm:pt-32 pb-8 sm:pb-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div className="space-y-4 w-full">
                 <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                       <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400">
                       <Link to="/listings" className="hover:text-primary-600 transition-colors">Services</Link>
                       <ChevronLeft className="w-4 h-4 rotate-180" />
                       <span className="text-slate-900 truncate">{listing.categoryId?.name}</span>
                    </div>
                 </div>
                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                    {listing.title}
                 </h1>
                 <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div className="flex items-start gap-2 text-slate-500 font-bold max-w-full">
                       <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                       <span className="break-words whitespace-normal text-sm sm:text-base">{listing.location.address}, {listing.location.city}, {listing.location.state}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 bg-orange-50 px-3 sm:px-4 py-1.5 rounded-full text-orange-600 border border-orange-100">
                         <Star className="w-4 h-4 fill-current" />
                         <span className="font-black text-sm">{listing.averageRating.toFixed(1)}</span>
                         <span className="text-[10px] font-bold opacity-60">({listing.totalReviews})</span>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 sm:px-4 py-1.5 rounded-full text-emerald-600 border border-emerald-100">
                         <ShieldCheck className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                      </div>
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                 <button 
                   onClick={handleToggleWishlist}
                   className={`p-4 rounded-2xl transition-all duration-300 border shadow-sm w-full sm:w-auto flex items-center justify-center ${
                     userInfo?.wishlist?.includes(id) 
                       ? 'bg-rose-50 border-rose-100 text-rose-600' 
                       : 'bg-white border-slate-100 text-slate-400 hover:border-rose-200 hover:text-rose-500'
                   }`}
                 >
                   <Heart className={`w-6 h-6 ${userInfo?.wishlist?.includes(id) ? 'fill-current' : ''}`} />
                   <span className="md:hidden ml-2 font-bold">Add to Wishlist</span>
                 </button>
                 <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-600 transition-all duration-300 shadow-xl shadow-slate-200 w-full sm:w-auto">
                    <MessageCircle className="w-5 h-5" />
                    <span>Contact Service</span>
                 </button>
              </div>
           </div>

           {/* Gallery Layout */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:h-[600px] animate-fade-in">
              <div className="lg:col-span-8 h-64 sm:h-96 lg:h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-premium relative group">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[activeImage].startsWith('http') ? listing.images[activeImage] : `${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000'}${listing.images[activeImage]}`} 
                      alt={listing.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-slate-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-6 h-24 sm:h-32 md:h-40 lg:h-full">
                  {listing.images?.slice(0, 3).map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative rounded-xl sm:rounded-[2rem] overflow-hidden transition-all duration-300 border-2 sm:border-4 ${activeImage === idx ? 'border-primary-600 shadow-xl' : 'border-white opacity-80 hover:opacity-100 hover:border-slate-100'}`}
                    >
                       <img 
                         src={img.startsWith('http') ? img : `http://localhost:5000${img}`} 
                         className="w-full h-full object-cover" 
                         alt="listing" 
                       />
                       {idx === 2 && listing.images.length > 3 && (
                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl">
                            +{listing.images.length - 3}
                         </div>
                       )}
                    </button>
                  ))}
                  {/* Fill empty slots with placeholders if less than 3 images */}
                  {[...Array(Math.max(0, 3 - (listing.images?.length || 0)))].map((_, i) => (
                    <div key={i} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-200" />
                    </div>
                  ))}
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
        {/* Left Column: Details & Reviews */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* About Section */}
          <section className="bg-white rounded-3xl p-10 md:p-14 border border-slate-100 shadow-premium space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900">About this service</h2>
              <p className="text-slate-600 leading-relaxed text-lg font-medium">
                {listing.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                        <Phone className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                        <p className="text-lg font-bold text-slate-700">{listing.contact?.phone || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Website</p>
                        {listing.contact?.website ? (
                            <a 
                                href={listing.contact.website.startsWith('http') ? listing.contact.website : `https://${listing.contact.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-lg font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2 group"
                            >
                                <span>Visit Site</span>
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        ) : (
                            <p className="text-lg font-bold text-slate-700">N/A</p>
                        )}
                    </div>
                </div>
            </div>
          </section>

          {/* Dynamic Details Section */}
          {listing.specificDetails && Object.keys(listing.specificDetails).length > 0 && (
              <section className="bg-white rounded-3xl p-10 md:p-14 border border-slate-100 shadow-premium">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="h-px flex-1 bg-slate-100"></div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap px-4">Specifications</h3>
                    <div className="h-px flex-1 bg-slate-100"></div>
                 </div>

                 {(() => {
                    const catName = listing.categoryId?.name || '';
                    const subcatName = listing.subcategoryId?.name || '';
                    const isMatch = (term) => catName.toLowerCase().includes(term.toLowerCase()) || subcatName.toLowerCase().includes(term.toLowerCase());

                    if (isMatch('School')) {
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: BookOpen, label: 'Academic Levels', value: listing.specificDetails.totalClasses, color: 'blue' },
                                    { icon: Award, label: 'Affiliation Board', value: listing.specificDetails.board, color: 'indigo' },
                                    { icon: CheckCircle2, label: 'Affiliation Status', value: listing.specificDetails.isAffiliated ? 'Affiliated' : 'Not Affiliated', color: 'emerald' }
                                ].map((item, idx) => (
                                    <div key={idx} className={`bg-${item.color}-50/50 p-8 rounded-[2rem] border border-${item.color}-100 space-y-4`}>
                                        <item.icon className={`w-8 h-8 text-${item.color}-600`} />
                                        <div>
                                            <p className={`text-[10px] font-black text-${item.color}-400 uppercase tracking-widest`}>{item.label}</p>
                                            <p className="text-xl font-bold text-slate-900">{item.value || 'N/A'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    }

                    if (isMatch('Hospital')) {
                        return (
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                                            <Stethoscope className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Specialists Directory</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {listing.specificDetails.doctors?.map((doc, i) => (
                                            <div key={i} className="bg-slate-50 p-6 rounded-[2rem] flex items-center gap-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-100 group">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rose-500 shadow-sm">
                                                    <Users className="w-8 h-8" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h5 className="font-bold text-slate-900 text-lg truncate">{doc.name}</h5>
                                                    <p className="text-xs font-black text-rose-500 uppercase tracking-widest truncate">{doc.specialization}</p>
                                                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400 truncate">
                                                        <Clock className="w-3 h-3 flex-shrink-0" />
                                                        {doc.timings}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-6 h-6 text-primary-400" />
                                        <h4 className="font-display font-bold text-xl">Available Services</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {listing.specificDetails.services?.split(',').map((s, i) => (
                                            <div key={i} className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-sm font-bold">
                                                {s.trim()}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(listing.specificDetails).map(([key, value]) => {
                                if (typeof value === 'object') return null;
                                return (
                                    <div key={key} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{key.replace(/([A-Z])/g, ' $1')}</p>
                                        <p className="font-bold text-slate-800">{String(value)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    );
                 })()}
              </section>
          )}

          {/* User Reviews Section */}
          <section className="space-y-10 animate-fade-in delay-200">
            <div className="flex items-center justify-between">
                <h3 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Community Feedback</h3>
                <div className="px-5 py-2 bg-slate-100 rounded-full text-slate-500 text-xs font-black uppercase tracking-widest">
                    {reviews.length} Feedbacks
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
               {reviews.length > 0 ? reviews.map(rev => (
                 <div key={rev._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-2xl flex items-center justify-center text-primary-700 font-bold text-2xl uppercase shadow-inner flex-shrink-0">
                        {rev.userId?.name.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h5 className="font-bold text-slate-900 text-lg">{rev.userId?.name}</h5>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{new Date(rev.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                 {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-orange-400 fill-current' : 'text-slate-100'}`} />
                                 ))}
                            </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-medium">"{rev.comment}"</p>
                    </div>
                 </div>
               )) : (
                 <div className="bg-slate-50 py-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-4">
                    <MessageCircle className="w-12 h-12 text-slate-200 mx-auto" />
                    <p className="text-slate-400 font-bold">No reviews yet. Be the first to share your experience!</p>
                 </div>
               )}
            </div>

            {/* Review Form */}
            <div className="bg-white p-8 sm:p-10 md:p-14 rounded-3xl sm:rounded-[3rem] border border-slate-100 shadow-premium mt-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <h4 className="text-2xl sm:text-3xl font-display font-bold mb-8">Share your thoughts</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">How would you rate this service?</label>
                        <div className="flex gap-3">
                            {[1,2,3,4,5].map(num => (
                                <button 
                                    key={num} 
                                    type="button"
                                    onClick={() => setRating(num)}
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${rating === num ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Write a detailed review</label>
                        <textarea 
                            rows="5"
                            className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 transition-all text-slate-700 font-medium"
                            placeholder="Tell us about the quality of service, facilities, and staff behavior..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button 
                        type="submit"
                        className="bg-primary-600 text-white px-12 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-700 transition-all duration-300 shadow-xl shadow-primary-200"
                    >
                        <span>Post Review</span>
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
          </section>
        </div>

        {/* Right Column: Mini Map & Sidebar */}
            <div className="lg:sticky lg:top-32 space-y-8">
               {/* Map Card */}
               <div className="bg-white rounded-3xl overflow-hidden shadow-premium border border-slate-100">
                 <div className="h-80 relative">
                     {(() => {
                       const lat = listing.geo?.coordinates?.[1];
                       const lng = listing.geo?.coordinates?.[0];
                       const hasCoords = lat && lng && lat !== 0 && lng !== 0;
                       const mapSrc = hasCoords
                         ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`
                         : `https://www.openstreetmap.org/export/embed.html?bbox=68%2C8%2C97%2C37&layer=mapnik`;
                       return (
                         <iframe
                           src={mapSrc}
                           className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                           title="Location Map"
                           loading="lazy"
                           referrerPolicy="no-referrer-when-downgrade"
                         />
                       );
                     })()}
                     <div className="absolute inset-0 pointer-events-none border-[12px] border-white/40" />
                 </div>
                 
                 <div className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm flex-shrink-0">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exact Location</p>
                            <p className="font-bold text-slate-900 leading-tight break-words">{listing.location.address}, {listing.location.city}</p>
                        </div>
                    </div>
                    
                    <button className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-primary-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-slate-100">
                        <MapPin className="w-5 h-5" />
                        <span>Open in Google Maps</span>
                    </button>
                 </div>

                 {/* Contact Card */}
                 <div className="p-8 border-t border-slate-50 bg-slate-50/50 space-y-6">
                    <div className="space-y-4">
                        <h4 className="font-display font-bold text-lg text-slate-900">Direct Inquiries</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-600 font-medium">
                                <Mail className="w-4 h-4 text-primary-500" />
                                <span className="text-sm">support@eduheal.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 font-medium">
                                <Clock className="w-4 h-4 text-primary-500" />
                                <span className="text-sm">Response time: ~2 hours</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-white text-slate-900 border border-slate-200 font-bold py-5 rounded-2xl hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm">
                        <MessageCircle className="w-5 h-5" />
                        <span>Message Provider</span>
                    </button>
                 </div>
             </div>

             {/* Help Card */}
             <div className="bg-primary-600 rounded-3xl p-10 text-white shadow-xl shadow-primary-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 space-y-6">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-2xl font-display font-bold leading-tight">Safety & Trust</h4>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">
                            All our service providers go through a rigorous 3-step verification process to ensure quality and reliability.
                        </p>
                    </div>
                    <Link to="/contact" className="inline-flex items-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em] group">
                        <span>Learn More</span>
                        <ChevronLeft className="w-4 h-4 rotate-180 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
             </div>
            </div>
        </div>
      </div>
  );
};

export default ListingDetail;
