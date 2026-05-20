import React, { useState, useEffect } from 'react';
import { Plus, Upload, X, MapPin, Globe, Phone, Mail, Info, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ListingFormModal = ({ isOpen, onClose, onRefresh, initialData }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);           // new File objects
  const [imagePreviews, setImagePreviews] = useState([]); // blob URLs for new files
  const [existingImages, setExistingImages] = useState([]); // server paths kept

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    address: '',
    city: '',
    state: '',
    lng: '',
    lat: '',
    phone: '',
    website: '',
    email: '',
    mapLink: '', 
  });
  const [specificDetails, setSpecificDetails] = useState({});
  const [fetchingCoords, setFetchingCoords] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          categoryId: initialData.categoryId?._id || initialData.categoryId || '',
          subcategoryId: initialData.subcategoryId?._id || initialData.subcategoryId || '',
          address: initialData.location?.address || '',
          city: initialData.location?.city || '',
          state: initialData.location?.state || '',
          lng: initialData.geo?.coordinates?.[0] || '',
          lat: initialData.geo?.coordinates?.[1] || '',
          phone: initialData.contact?.phone || '',
          website: initialData.contact?.website || '',
          email: initialData.contact?.email || '',
          mapLink: '', 
        });
        setSpecificDetails(initialData.specificDetails || {});
        setExistingImages(initialData.images || []);
        setImagePreviews([]);
        setImages([]);
      } else {
        setFormData({
          title: '', description: '', categoryId: '', subcategoryId: '',
          address: '', city: '', state: '', lng: '', lat: '',
          phone: '', website: '', email: '', mapLink: '',
        });
        setSpecificDetails({});
        setImagePreviews([]);
        setImages([]);
        setExistingImages([]);
      }
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSpecificDetails({
        ...specificDetails,
        [name]: type === 'checkbox' ? checked : value
    });
  };

  const addDoctor = () => {
    const doctors = specificDetails.doctors || [];
    setSpecificDetails({
        ...specificDetails,
        doctors: [...doctors, { name: '', specialization: '', timings: '' }]
    });
  };

  const handleDoctorChange = (index, field, value) => {
    const doctors = [...(specificDetails.doctors || [])];
    doctors[index][field] = value;
    setSpecificDetails({ ...specificDetails, doctors });
  };

  const removeDoctor = (index) => {
    const doctors = specificDetails.doctors.filter((_, i) => i !== index);
    setSpecificDetails({ ...specificDetails, doctors });
  };

  const handleFetchLocation = async () => {
    setFetchingCoords(true);
    try {
        if (formData.mapLink) {
            const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
            const match = formData.mapLink.match(regex);
            if (match) {
                setFormData(prev => ({ ...prev, lat: match[1], lng: match[2] }));
                toast.success('Coordinates synchronized from link');
                setFetchingCoords(false);
                return;
            }
        }

        const query = `${formData.address}, ${formData.city}, ${formData.state}`;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
        const data = await response.json();

        if (data && data.length > 0) {
            setFormData(prev => ({ ...prev, lat: data[0].lat, lng: data[0].lon }));
            toast.success('Precision coordinates locked');
        } else {
            toast.error('Address not found. Please try map link.');
        }
    } catch (error) {
        toast.error('Location sync engine failure');
    } finally {
        setFetchingCoords(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length + existingImages.length > 5) {
      toast.error('Maximum 5 images allowed per listing');
      return;
    }
    setImages([...images, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeExistingImage = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx) => {
    const newFiles = images.filter((_, i) => i !== idx);
    const newPreviews = imagePreviews.filter((_, i) => i !== idx);
    setImages(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('categoryId', formData.categoryId);
    
    if (formData.subcategoryId && formData.subcategoryId.trim() !== '') {
      data.append('subcategoryId', formData.subcategoryId);
    }

    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);

    if (!isNaN(lat) && (lat < -90 || lat > 90)) {
      toast.error('Invalid latitude coordinates');
      setLoading(false);
      return;
    }
    if (!isNaN(lng) && (lng < -180 || lng > 180)) {
      toast.error('Invalid longitude coordinates');
      setLoading(false);
      return;
    }

    const location = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      coordinates: [isNaN(lng) ? 0 : lng, isNaN(lat) ? 0 : lat],
    };
    data.append('location', JSON.stringify(location));

    const contact = {
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
    };
    data.append('contact', JSON.stringify(contact));

    data.append('specificDetails', JSON.stringify(specificDetails));
    data.append('existingImages', JSON.stringify(existingImages));
    
    for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
    }

    try {
      if (initialData?._id) {
        await api.put(`/listings/${initialData._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Resource updated successfully');
      } else {
        await api.post('/listings', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('New registration submitted');
      }
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission engine error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentCatName = categories.find(c => c._id === formData.categoryId)?.name || '';
  const currentSubcatName = subcategories.find(s => s._id === formData.subcategoryId)?.name || '';
  const isMatch = (term) => 
    currentCatName.toLowerCase().includes(term.toLowerCase()) || 
    currentSubcatName.toLowerCase().includes(term.toLowerCase());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl overflow-hidden transition-all duration-500">
      <div className="bg-white w-full max-w-4xl h-full max-h-[95vh] lg:max-h-[90vh] rounded-[2rem] shadow-2xl relative flex flex-col animate-in fade-in zoom-in duration-500 overflow-hidden border border-white/20">
        
        {/* Modal Header */}
        <div className="shrink-0 px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/20">
               <FileText className="text-white w-6 h-6" />
             </div>
             <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                 {initialData ? 'Edit Registration' : 'New Resource'}
               </h2>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Platform Inventory Engine</p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-400 hover:text-slate-900 hover:rotate-90 transition-all duration-300 shadow-sm border border-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar scroll-smooth">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Core Data */}
            <div className="space-y-8">
              
              {/* Section: Basic Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Info className="w-4 h-4 text-primary-500" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Core Specification</h3>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Listing Title</label>
                    <input
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                      placeholder="e.g. Royal International School"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Category</label>
                      <div className="relative">
                        <select
                          name="categoryId"
                          required
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-bold appearance-none cursor-pointer shadow-sm"
                        >
                          <option value="">System Select</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <Plus className="w-4 h-4 rotate-45" />
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Subcategory</label>
                      <div className="relative">
                        <select
                          name="subcategoryId"
                          value={formData.subcategoryId}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-bold appearance-none cursor-pointer shadow-sm"
                        >
                          <option value="">Optional Tag</option>
                          {subcategories.map((s) => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <Plus className="w-4 h-4 rotate-45" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Public Bio / Description</label>
                    <textarea
                      name="description"
                      required
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm resize-none"
                      placeholder="Describe the excellence provided..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Dynamic Category Sections */}
              {isMatch('School') && (
                <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[2rem] space-y-6 animate-in slide-in-from-left duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-blue-200">
                    <CheckCircle2 className="w-12 h-12 rotate-12 opacity-30" />
                  </div>
                  <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] relative z-10">Academic Config</h3>
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Curriculum Board</label>
                      <select
                        name="board"
                        value={specificDetails.board || ''}
                        onChange={handleDetailChange}
                        className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl outline-none focus:border-blue-400 font-bold text-slate-700 transition-all shadow-sm"
                      >
                        <option value="">Select Board</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                        <option value="International">International</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Grade Range</label>
                      <input
                        name="totalClasses"
                        placeholder="e.g. Nursery - 12th"
                        value={specificDetails.totalClasses || ''}
                        onChange={handleDetailChange}
                        className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl outline-none focus:border-blue-400 font-bold text-slate-700 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 bg-white/80 p-4 rounded-xl border border-blue-100 cursor-pointer hover:bg-white transition-all group relative z-10">
                    <input
                      type="checkbox"
                      name="isAffiliated"
                      checked={specificDetails.isAffiliated || false}
                      onChange={handleDetailChange}
                      className="w-5 h-5 rounded-lg border-blue-200 text-blue-600 focus:ring-blue-500 transition-all accent-blue-600"
                    />
                    <span className="text-xs font-black text-blue-700 uppercase tracking-wider">Official Accreditation Verified</span>
                  </label>
                </div>
              )}

              {isMatch('College') && (
                <div className="p-8 bg-purple-50/50 border border-purple-100 rounded-[2rem] space-y-6 animate-in slide-in-from-left duration-500 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 text-purple-200">
                    <CheckCircle2 className="w-12 h-12 rotate-12 opacity-30" />
                  </div>
                  <h3 className="text-xs font-black text-purple-500 uppercase tracking-[0.2em] relative z-10">Higher Ed Specs</h3>
                  <div className="space-y-4 relative z-10">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Programs Offered</label>
                      <input
                        name="courses"
                        placeholder="B.Tech, MBA, M.A, etc."
                        value={specificDetails.courses || ''}
                        onChange={handleDetailChange}
                        className="w-full px-4 py-3 bg-white border border-purple-100 rounded-xl outline-none focus:border-purple-400 font-bold text-slate-700 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Annual Fee Estimate</label>
                      <input
                        name="feeStructure"
                        placeholder="INR 80k - 2.5L"
                        value={specificDetails.feeStructure || ''}
                        onChange={handleDetailChange}
                        className="w-full px-4 py-3 bg-white border border-purple-100 rounded-xl outline-none focus:border-purple-400 font-bold text-slate-700 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isMatch('Hospital') && (
                <div className="p-8 bg-rose-50/50 border border-rose-100 rounded-[2rem] space-y-6 animate-in slide-in-from-left duration-500 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 text-rose-200">
                    <CheckCircle2 className="w-12 h-12 rotate-12 opacity-30" />
                  </div>
                  <div className="flex justify-between items-center relative z-10">
                    <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em]">Specialist Roster</h3>
                    <button 
                      type="button" 
                      onClick={addDoctor}
                      className="px-3 py-1 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-rose-700 transition-all shadow-md shadow-rose-200"
                    >
                      <Plus className="w-3 h-3" /> Add Staff
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                    {(specificDetails.doctors || []).map((doc, idx) => (
                      <div key={idx} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-rose-100 relative group animate-in fade-in slide-in-from-top-2 duration-300">
                        <button 
                          type="button" 
                          onClick={() => removeDoctor(idx)}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="space-y-3">
                          <input
                            placeholder="Professional Name"
                            value={doc.name}
                            onChange={(e) => handleDoctorChange(idx, 'name', e.target.value)}
                            className="w-full text-xs font-black outline-none border-b border-rose-50 bg-transparent py-1 text-slate-800"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              placeholder="Department"
                              value={doc.specialization}
                              onChange={(e) => handleDoctorChange(idx, 'specialization', e.target.value)}
                              className="w-full text-[10px] font-bold outline-none border-b border-rose-50 bg-transparent py-1 text-slate-500"
                            />
                            <input
                              placeholder="Availability (e.g. 24/7)"
                              value={doc.timings}
                              onChange={(e) => handleDoctorChange(idx, 'timings', e.target.value)}
                              className="w-full text-[10px] font-bold outline-none border-b border-rose-50 bg-transparent py-1 text-slate-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Media & Location */}
            <div className="space-y-8">
              
              {/* Section: Media Assets */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Upload className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Visual Assets</h3>
                </div>

                <div className="space-y-6">
                   <div className="relative border-4 border-dashed border-slate-50 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:border-emerald-100 transition-all cursor-pointer group shadow-sm">
                    <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center group-hover:bg-emerald-500 group-hover:scale-110 transition-all duration-500">
                      <Upload className="w-8 h-8 text-slate-300 group-hover:text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Upload Resource Images</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">JPG, PNG • MAX 5MB • UP TO 5 IMAGES</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Image Grid */}
                  {(existingImages.length > 0 || imagePreviews.length > 0) && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {existingImages.map((p, i) => (
                        <div key={`ex-${i}`} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-slate-100 shadow-sm">
                          <img
                            src={p.startsWith('http') ? p : `http://localhost:5000/${p.replace(/\\/g, '/').replace(/^\//, '')}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                            alt="existing"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeExistingImage(i)}
                              className="w-8 h-8 bg-white text-rose-500 rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {imagePreviews.map((p, i) => (
                        <div key={`new-${i}`} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-emerald-400 shadow-md">
                          <img src={p} className="w-full h-full object-cover" alt="new" />
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-lg shadow-lg">NEW</div>
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeNewImage(i)}
                              className="w-8 h-8 bg-white text-rose-500 rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section: Location Logic */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Geospatial Data</h3>
                </div>

                <div className="p-6 bg-slate-900 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                  {/* Decorative background map pattern would go here */}
                  <div className="relative z-10 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Terminal City</label>
                        <input
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-800 border-2 border-transparent rounded-xl outline-none focus:border-primary-500 text-white font-bold text-xs"
                          placeholder="e.g. Mumbai"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Region/State</label>
                        <input
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-800 border-2 border-transparent rounded-xl outline-none focus:border-primary-500 text-white font-bold text-xs"
                          placeholder="Maharashtra"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Street Level Address</label>
                      <input
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800 border-2 border-transparent rounded-xl outline-none focus:border-primary-500 text-white font-bold text-xs"
                        placeholder="Plot No. 42, Sector 10..."
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-3">Precision Engine Sync (Maps Link)</label>
                      <div className="flex gap-3">
                        <input
                          name="mapLink"
                          value={formData.mapLink}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-3 bg-slate-800 border-2 border-transparent rounded-xl outline-none focus:border-emerald-500 text-white font-bold text-[10px] transition-all"
                          placeholder="https://maps.app.goo.gl/..."
                        />
                        <button
                          type="button"
                          onClick={handleFetchLocation}
                          disabled={fetchingCoords || (!formData.address && !formData.mapLink)}
                          className={`px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                            fetchingCoords ? 'bg-slate-700' : 'bg-emerald-500 hover:bg-emerald-600'
                          } text-white font-black uppercase text-[10px] tracking-widest active:scale-95 disabled:opacity-30`}
                        >
                          {fetchingCoords ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          {fetchingCoords ? 'SYNC' : 'Lock'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Contact */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Connect Terminal</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-900 font-bold text-sm shadow-sm"
                        placeholder="Direct Contact"
                    />
                  </div>
                  <div className="group relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all text-slate-900 font-bold text-sm shadow-sm"
                        placeholder="Official URL"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 px-8 py-6 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-white border border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-50 transition-all"
          >
            Abort
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-12 py-4 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {initialData ? 'Commit Updates' : 'Authorize Listing'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingFormModal;

