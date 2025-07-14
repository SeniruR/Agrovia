import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Star, Award, Package, DollarSign, Eye, Heart, Edit, Trash2, X, ArrowLeft, Upload } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ItemPostedForm from './ItemPostedForm';
import { useAuth } from '../../contexts/AuthContext';
const MyShopItem = () => {
   const navigate = useNavigate();
   const { user, isAuthenticated, getAuthHeaders } = useAuth();
   const [showAddPage, setShowAddPage] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCity, setSelectedCity] = useState('all');
    const [likedItems, setLikedItems] = useState(new Set());
    const [selectedItem, setSelectedItem] = useState(null);
    const [shopItems, setShopItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        shopitemid: '',
        shop_name: '',
        owner_name: '',
        phone_no: '',
        shop_address: '',
        city: '',
        product_type: '',
        product_name: '',
        brand: '',
        category: '',
        season: '',
        price: 0,
        unit: '',
        available_quantity: 0,
        product_description: '',
        usage_history: '',
        organic_certified: false,
       // terms_accepted: false,
        images: [],
        existingImages: []
    });

    // Fetch data from backend
 useEffect(() => {
  const fetchShopItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        'http://localhost:5000/api/v1/shop-products/my-shop', 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Debug the response structure
      console.log('API Response:', response.data);
      
      // Handle different possible response structures
      const products = response.data.products || 
                       response.data.data || 
                       response.data || 
                       [];
      
      setShopItems(products);
      setError(null);
      
    } catch (err) {
      console.error('API Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 404) {
        setShopItems([]);
        setError("Your shop currently has no products");
      } else {
        setError(err.response?.data?.message || "Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchShopItems();
}, []);

    // Clean up image previews when component unmounts
    useEffect(() => {
        return () => {
            if (editFormData.images) {
                editFormData.images.forEach(img => {
                    if (img?.preview) URL.revokeObjectURL(img.preview);
                });
            }
        };
    }, [editFormData.images]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => {
            return {
                file,
                preview: URL.createObjectURL(file)
            };
        });
        
        setEditFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const removeImage = (index, isExisting) => {
        if (isExisting) {
            // Mark existing image for deletion
            setEditFormData(prev => {
                const newExistingImages = [...prev.existingImages];
                newExistingImages[index].markedForDeletion = true;
                return { ...prev, existingImages: newExistingImages };
            });
        } else {
            // Remove new image and revoke URL
            setEditFormData(prev => {
                const newImages = [...prev.images];
                URL.revokeObjectURL(newImages[index].preview);
                newImages.splice(index, 1);
                return { ...prev, images: newImages };
            });
        }
    };

    // Handle edit form submission
 const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();

    // Append fields except image arrays
    Object.keys(editFormData).forEach(key => {
      if (key !== 'images' && key !== 'existingImages') {
        formData.append(key, editFormData[key]);
      }
    });

    // Append new images
    editFormData.images.forEach(img => {
      formData.append('images', img.file);
    });

    // Remaining old images
    const remainingImages = editFormData.existingImages
      .filter(img => !img.markedForDeletion)
      .map(img => img.url);
    formData.append('remainingImages', JSON.stringify(remainingImages));

    // Axios PUT request
    const response = await axios.put(
      `http://localhost:5000/api/v1/shop-products/${editFormData.shopitemid}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    //  Use response.data.product, not itemData
    const updatedItem = response.data.product;

    setShopItems(prevItems =>
      prevItems.map(item =>
        item.shopitemid === updatedItem.shopitemid ? updatedItem : item
      )
    );

    setShowEditModal(false);
    setSelectedItem(null);
    setEditFormData({
      shopitemid: '',
      shop_name: '',
      owner_name: '',
      phone_no: '',
      shop_address: '',
      city: '',
      product_type: '',
      product_name: '',
      brand: '',
      category: '',
      season: '',
      price: 0,
      unit: '',
      available_quantity: 0,
      product_description: '',
      usage_history: '',
      organic_certified: false,
      terms_accepted: false,
      images: [],
      existingImages: []
    });
     alert('Product updated successfully!');
  window.location.reload();
  } catch (error) {
    console.error('Error updating item:', error);
    console.error('Detailed error:', error);
    console.error('Error response:', error.response?.data);
    alert('Failed to update item');
  }
};


    // Handle edit form changes
    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                   (type === 'number' ? parseFloat(value) : value)

                   
        })
        
      );
    };

    // Set edit form data when opening edit modal
    const handleEdit = (item) => {
        setSelectedItem(item);
        setEditFormData({
            shopitemid: item.shopitemid || '',
            shop_name: item.shop_name || '',
            owner_name: item.owner_name || '',
            phone_no: item.phone_no || '',
            shop_address: item.shop_address || '',
            city: item.city || '',
            product_type: item.product_type || '',
            product_name: item.product_name || '',
            brand: item.brand || '',
            category: item.category || '',
            season: item.season || '',
            price: item.price || 0,
            unit: item.unit || '',
            available_quantity: item.available_quantity || 0,
            product_description: item.product_description || '',
            usage_history: item.usage_history || '',
            organic_certified: item.organic_certified || false,
            terms_accepted: item.terms_accepted || false,
            images: [],
            existingImages: item.images ? item.images.map(img => ({ 
                url: img,
                markedForDeletion: false 
            })) : []
        });
     let imagesArray = [];

  if (Array.isArray(item.images)) {
    imagesArray = item.images;
  } else if (typeof item.images === 'string' && item.images.trim() !== '') {
    imagesArray = item.images.split(',').map(url => url.trim());
  }

  setEditFormData({
    ...item,
    images: [], // for new uploaded files (empty at start)
    existingImages: imagesArray.map(url => ({
      url,
      markedForDeletion: false
    })),
  });

  setSelectedItem(item);
  setShowEditModal(true);
        setShowEditModal(true);
    };

    const handleDelete = (shopitemid) => {
        setItemToDelete(shopitemid);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/shop-products/${itemToDelete}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            

            if (res.ok) {
                alert('Product deleted successfully');
                setShopItems(prev => prev.filter(item => item.shopitemid !== itemToDelete));
               
            } else {
                alert(`Failed to delete: ${data.message}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Network error - could not connect to server');
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
      

    };

    // Extract unique categories and cities from data
    const categories = ['all', ...new Set(shopItems.map(item => item.category).filter(Boolean))];
    const cities = ['all', ...new Set(shopItems.map(item => item.city).filter(Boolean))];

    const filteredItems = shopItems.filter(item => {
        const matchesSearch =
            (item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesCity = selectedCity === 'all' || item.city === selectedCity;
        return matchesSearch && matchesCategory && matchesCity;
    });

    const toggleLike = (itemId) => {
        setLikedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const renderStars = (rating) => {
        if (!rating) return null;
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
        }
        return stars;
    };

   
 
// Replace 'your-icon-library' with your actual icon imports
const DetailView = ({ item, onClose, handleEdit }) => {
  // Helper to safely parse images (array or CSV string)
  const renderImages = () => {
    let images = [];

    if (Array.isArray(item.images)) {
      images = item.images;
    } else if (typeof item.images === 'string' && item.images.trim() !== '') {
      images = item.images.split(',').map(url => url.trim());
    }

    if (images.length === 0) {
      return (
        <div className="w-full h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-inner">
          <Package className="h-20 w-20 text-green-300" />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <img
          src={images[0]}
          alt={item.product_name}
          className="w-full h-64 object-cover rounded-xl shadow-lg border-4 border-white"
        />
        {images.length > 1 && (
          <div className="grid grid-cols-3 gap-2">
            {images.slice(1).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${item.product_name} ${index + 1}`}
                className="h-20 object-cover rounded-lg border-2 border-white shadow"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const totalStars = 5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400 text-xl">★</span>);
    }
    if (halfStar) {
      stars.push(<span key="half" className="text-yellow-400 text-xl">☆</span>);
    }
    while (stars.length < totalStars) {
      stars.push(<span key={`empty-${stars.length}`} className="text-gray-300 text-xl">★</span>);
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-green-100 animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-50 to-green-100 border-b p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-3xl font-extrabold text-green-800 tracking-tight">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="h-7 w-7 text-green-700" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative">
                {renderImages()}
                {item.organic_certified && (
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center shadow">
                    <Award className="h-4 w-4 mr-1" />
                    Organic Certified
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-4xl font-bold text-green-900 mb-2">{item.product_name}</h3>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {item.category && (
                    <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold shadow">
                      {item.category}
                    </span>
                  )}
                  {item.product_type && (
                    <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold shadow">
                      {item.product_type}
                    </span>
                  )}
                </div>
                {item.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-3">
                      {renderStars(item.rating)}
                    </div>
                    <span className="text-lg font-semibold text-gray-700 ml-2">({item.rating})</span>
                  </div>
                )}
              </div>

              {/* Price and Availability */}
              <div className="bg-green-50 p-5 rounded-xl shadow flex flex-col gap-2">
                <div className="flex items-center text-green-700 font-bold text-2xl">
                  <DollarSign className="h-6 w-6 mr-2" />
                  LKR {item.price?.toLocaleString()}
                  {item.unit && <span className="text-lg text-gray-500 ml-2">per {item.unit}</span>}
                </div>
                <div className="flex items-center text-gray-600">
                  <Package className="h-5 w-5 mr-2" />
                  <span className="font-semibold">
                    {item.available_quantity || 0} {item.unit || 'units'} available
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{item.product_description || 'No description available'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.brand && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1">Brand</h5>
                      <p className="text-gray-600">{item.brand}</p>
                    </div>
                  )}
                  {item.season && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1">Season</h5>
                      <p className="text-gray-600">{item.season}</p>
                    </div>
                  )}
                </div>

                {item.usage_history && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Usage History</h4>
                    <p className="text-gray-600 leading-relaxed">{item.usage_history}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shop Information */}
          <div className="mt-10 border-t pt-8">
            <h4 className="text-2xl font-bold text-green-800 mb-4">Shop Information</h4>
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">Shop Details</h5>
                  <div className="space-y-2">
                    {item.shop_name && (
                      <p className="text-gray-700"><span className="font-medium">Shop Name:</span> {item.shop_name}</p>
                    )}
                    {item.owner_name && (
                      <p className="text-gray-700"><span className="font-medium">Owner:</span> {item.owner_name}</p>
                    )}
                    {item.shop_address && (
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-green-500" />
                        <span>{item.shop_address}</span>
                      </div>
                    )}
                    {item.city && (
                      <p className="text-gray-700"><span className="font-medium">City:</span> {item.city}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    {item.phone_no && (
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                        <span>{item.phone_no}</span>
                      </div>
                    )}
                    {item.email && (
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-green-500" />
                        <span>{item.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex justify-center gap-6">
            <button
              onClick={() => {
                onClose();
                handleEdit(item);
              }}
              className="bg-green-800 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center shadow"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Product
            </button>
            <button
              onClick={onClose}
              className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center shadow"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const renderCategoryOptions = () => {
  if (!editFormData.product_type) {
    return (
      <>
        <option value="">Select product type first</option>
      </>
    );
  }

  const optionsMap = {
    seeds: [
      { value: "vegetable", label: "Vegetable Seeds" },
      { value: "fruit", label: "Fruit Seeds" },
      { value: "flower", label: "Flower Seeds" },
      { value: "grain", label: "Grain Seeds" }
    ],
    fertilizer: [
      { value: "organic", label: "Organic Fertilizer" },
      { value: "npk", label: "NPK Fertilizer" },
      { value: "liquid", label: "Liquid Fertilizer" },
      { value: "compost", label: "Compost" }
    ],
    chemical: [
      { value: "pesticide", label: "Pesticide" },
      { value: "herbicide", label: "Herbicide" },
      { value: "fungicide", label: "Fungicide" },
      { value: "insecticide", label: "Insecticide" }
    ]
  };

  return (
    <>
      <option value="">Select category</option>
      {optionsMap[editFormData.product_type]?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </>
  );
};

    // Edit Modal Component
    const EditModal = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-100 animate-fade-in">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-50 to-green-100 border-b p-6 flex items-center justify-between rounded-t-3xl">
                    <h2 className="text-2xl font-extrabold text-green-800 tracking-tight">Edit Product</h2>
                    <button
                        onClick={() => {
                            setShowEditModal(false);
                            setSelectedItem(null);
                            // Clean up image previews
                            editFormData.images.forEach(img => {
                                if (img?.preview) URL.revokeObjectURL(img.preview);
                            });
                            setEditFormData(prev => ({
                                ...prev,
                                images: [],
                                existingImages: prev.existingImages.map(img => ({
                                    ...img,
                                    markedForDeletion: false
                                }))
                            }));
                        }}
                        className="p-2 hover:bg-green-100 rounded-full transition-colors"
                        title="Close"
                    >
                        <X className="h-6 w-6 text-green-700" />
                    </button>
                </div>

                <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                    {/* Grid Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Shop Name*</label>
                            <input
                                type="text"
                                name="shop_name"
                                value={editFormData.shop_name}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Owner Name*</label>
                            <input
                                type="text"
                                name="owner_name"
                                value={editFormData.owner_name}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Phone Number*</label>
                            <input
                                type="tel"
                                name="phone_no"
                                value={editFormData.phone_no}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Shop Address*</label>
                            <input
                                type="text"
                                name="shop_address"
                                value={editFormData.shop_address}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Product Name*</label>
                            <input
                                type="text"
                                name="product_name"
                                value={editFormData.product_name}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Product Type*</label>
                            <select
                                name="product_type"
                                value={editFormData.product_type}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                required
                            >
                                <option value="">Select product type</option>
                                <option value="seeds">Seeds</option>
                                <option value="fertilizer">Fertilizer</option>
                                <option value="chemical">Chemical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={editFormData.brand}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Category</label>
                            <select
                                name="category"
                                value={editFormData.category || ''}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                disabled={!editFormData.product_type}
                            >
                                {renderCategoryOptions()}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Season</label>
                            <select
                                name="season"
                                value={editFormData.season}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            >
                                <option value="">Select season</option>
                                <option value="yala">Yala Season</option>
                                <option value="maha">Maha Season</option>
                                <option value="all-year">All Year Round</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Price (LKR)*</label>
                            <input
                                type="number"
                                name="price"
                                value={editFormData.price}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Available Quantity*</label>
                            <input
                                type="number"
                                name="available_quantity"
                                value={editFormData.available_quantity}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Unit</label>
                            <input
                                type="text"
                                name="unit"
                                value={editFormData.unit}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Usage History</label>
                            <input
                                type="text"
                                name="usage_history"
                                value={editFormData.usage_history}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1 font-medium text-green-900">Description*</label>
                        <textarea
                            name="product_description"
                            value={editFormData.product_description}
                            onChange={handleEditChange}
                            rows="3"
                            className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            required
                        />
                    </div>

                    {/* Images Section */}
                    <div>
                        <label className="block mb-2 font-medium text-green-900">Product Images</label>
                        <input
                            type="file"
                            name="images"
                            onChange={handleImageUpload}
                            className="w-full p-2 border rounded"
                            multiple
                            accept="image/*"
                        />
                        {/* Existing Images Preview */}
                        {editFormData.existingImages?.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-medium mb-2">Current Images</h4>
                                <div className="flex flex-wrap gap-2">
                                    {editFormData.existingImages?.map((img, index) => (
                                        !img.markedForDeletion && (
                                            <div key={`existing-${index}`} className="relative">
                                                <img
                                                    src={img.url}
                                                    alt={`Product ${index}`}
                                                    className="h-20 w-20 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index, true)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* New Images Preview */}
                        {editFormData.images?.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-medium mb-2">New Images</h4>
                                <div className="flex flex-wrap gap-2">
                                    {editFormData.images.map((img, index) => (
                                        <div key={`new-${index}`} className="relative">
                                            <img
                                                src={img.preview}
                                                alt={`New Product ${index}`}
                                                className="h-20 w-20 object-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index, false)}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Organic Certified Checkbox */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            name="organic_certified"
                            checked={editFormData.organic_certified}
                            onChange={handleEditChange}
                            className="mr-2 accent-green-600"
                        />
                        <label className="font-medium text-green-900">Organic Certified</label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedItem(null);
                                editFormData.images.forEach(img => {
                                    if (img?.preview) URL.revokeObjectURL(img.preview);
                                });
                                setEditFormData(prev => ({
                                    ...prev,
                                    images: [],
                                    existingImages: prev.existingImages.map(img => ({
                                        ...img,
                                        markedForDeletion: false
                                    }))
                                }));
                            }}
                            className="px-6 py-2 border border-green-300 rounded-lg text-green-800 hover:bg-green-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

    // Delete Confirmation Modal
    const DeleteModal = () => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-red-600">Confirm Deletion</h2>
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <p className="text-gray-700 mb-6">
                        Are you sure you want to delete this product? This action cannot be undone.
                    </p>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
                    <p className="text-green-800 text-lg">Loading products...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <div className="text-red-500 mb-4">
                        <X className="h-12 w-12 mx-auto" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Products</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // If an item is selected, show the detail view (unless we're in edit mode)
    if (selectedItem && !showEditModal) {
        return <DetailView item={selectedItem} onClose={() => setSelectedItem(null)} />;
    }
 
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
            {/* Header */}
            <div className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-green-500" />
                            <input
                                type="text"
                                placeholder="Search products, shops, or categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                            />
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                            >
                                <option value="all">All Categories</option>
                                {categories.filter(cat => cat !== 'all').map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                            >
                                <option value="all">All Cities</option>
                                {cities.filter(city => city !== 'all').map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-green-600">
                        Showing {filteredItems.length} of {shopItems.length} products
                    </div>
                      {/* Add Item Button */}
                    <div className="mt-6 flex justify-end">
        <button
            onClick={() => navigate('/itempostedForm')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors flex items-center"
        >
            + Add Item
        </button>
    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <div key={item.shopitemid} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                            {/* Product Image */}
                            <div className="relative">
                                {item.images && item.images.length > 0 ? (
                                    <img
                                        src={item.images[0]}
                                        alt={item.product_name}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                        <Package className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {item.organic_certified && (
                                        <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                            <Award className="h-3 w-3 mr-1" />
                                            Organic
                                        </div>
                                    )}
                                    <button
                                        onClick={() => toggleLike(item.shopitemid)}
                                        className={`p-2 rounded-full ${likedItems.has(item.shopitemid) ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:scale-110 transition-transform`}
                                    >
                                        <Heart className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-green-800 line-clamp-2">
                                        {item.product_name}
                                    </h3>
                                    {item.product_type && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                            {item.product_type}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {item.product_description || 'No description available'}
                                </p>

                                {/* Price */}
                                <div className="flex items-center text-green-700 font-bold text-lg mb-4">
                                    <DollarSign className="h-5 w-5 mr-1" />
                                    LKR {item.price?.toLocaleString()}
                                </div>

{/* Quantity & Unit Info */}
<div className="border-t pt-4 mb-4">
    <div className="flex items-center text-sm text-gray-600">
        <Package className="h-4 w-4 mr-2 text-green-500" />
        <span>
            {item.available_quantity || 0} {item.unit || ''}
        </span>
    </div>
</div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedItem(item)}
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.shopitemid)}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredItems.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showEditModal && <EditModal />}
            {showDeleteModal && <DeleteModal />}
        </div>
    );
};

export default MyShopItem;