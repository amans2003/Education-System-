import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateWishlist } = useAuthStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/users/wishlist');
      setWishlist(data);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeWishlist = async (id) => {
    try {
      const { data } = await api.post(`/users/wishlist/${id}`);
      setWishlist(wishlist.filter(item => item._id !== id));
      updateWishlist(data.wishlist);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  if (loading) return <div className="pt-40 pb-20 text-center font-bold text-slate-500 animate-pulse">Loading your favorites...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-40 pb-24 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-500">Saved colleges, hospitals, and services</p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-xl text-gray-500 mb-6">Your wishlist is empty</p>
          <Link to="/listings" className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-300">
            Explore Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((listing) => (
            <div key={listing._id} className="group glass rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/50">
              <div className="relative h-48">
                <img 
                  src={listing.images[0] || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3'} 
                  alt={listing.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button 
                  onClick={() => removeWishlist(listing._id)}
                  className="absolute top-6 right-6 p-3 bg-pink-600 text-white rounded-2xl hover:bg-pink-700 transition-all shadow-xl shadow-pink-200"
                  title="Remove from favorites"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary-600 uppercase tracking-wider">
                    {listing.categoryId?.name}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-300">{listing.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location.address}</span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{listing.ratingStats?.avgRating || 0}</span>
                  </div>
                  <Link to={`/listings/${listing._id}`} className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
