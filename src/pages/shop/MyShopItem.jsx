import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Phone, Mail, Star, Award, Package, DollarSign, Eye, Heart, Edit, Trash2, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const MyShopItem = () => {
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
    const [editFormData, setEditFormData] = useState({
        product_name: '',
        price: 0,
        available_quantity: 0,
        product_description: '',
        category: '',
        product_type: '',
        city: '',
        unit: ''
    });

    // Fetch data from backend
    useEffect(() => {
        const fetchShopItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/shop-products');
                setShopItems(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching shop items:', err);
            }
        };

        fetchShopItems();
    }, []);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/shop-products`);
            setShopItems(prevItems => prevItems.filter(item => item.id !== itemToDelete));
            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Failed to delete item. Please try again.');
        }
    };

    // Handle edit form submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/api/v1/shop-products`,
                editFormData
            );
            setShopItems(prevItems =>
                prevItems.map(item =>
                    item.id === selectedItem.id ? { ...item, ...response.data } : item
                )
            );
            setShowEditModal(false);
            setSelectedItem(null);
        } catch (err) {
            console.error('Error updating item:', err);
            alert('Failed to update item. Please try again.');
        }
    };

    // Handle edit form changes
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'available_quantity'
                ? parseFloat(value)
                : value
        }));
    };

    // Set edit form data when opening edit modal
    const handleEdit = (item) => {
        setSelectedItem(item);
        setEditFormData({
            product_name: item.product_name || '',
            price: item.price || 0,
            available_quantity: item.available_quantity || 0,
            product_description: item.product_description || '',
            category: item.category || '',
            product_type: item.product_type || '',
            city: item.city || '',
            unit: item.unit || ''
        });
        setShowEditModal(true);
    };

    // Set item to delete when opening delete modal
    const handleDelete = (itemId) => {
        setItemToDelete(itemId);
        setShowDeleteModal(true);
    };

    // Extract unique categories and cities from data
    const categories = ['all', ...new Set(shopItems.map(item => item.category).filter(Boolean))];
    const cities = ['all', ...new Set(shopItems.map(item => item.city).filter(Boolean))];

    const filteredItems = shopItems.filter(item => {
        const matchesSearch =
            (item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.shop_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.category?.toLowerCase().includes(searchTerm.toLowerCase())));
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

    // Detail View Component
    const DetailView = ({ item, onClose }) => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-green-800">Product Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Product Image */}
                            <div className="space-y-4">
                                <div className="relative">
                                    {item.images && item.images.length > 0 && typeof item.images[0] === 'string' ? (
                                        <img
                                            src={item.images[0]}
                                            alt={item.product_name}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <Package className="h-16 w-16 text-gray-400" />
                                        </div>
                                    )}
                                    {item.organic_certified && (
                                        <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                                            <Award className="h-4 w-4 mr-1" />
                                            Organic Certified
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Information */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-3xl font-bold text-green-800 mb-2">{item.product_name}</h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        {item.category && (
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                {item.category}
                                            </span>
                                        )}
                                        {item.product_type && (
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                {item.product_type}
                                            </span>
                                        )}
                                    </div>
                                    {item.rating && (
                                        <div className="flex items-center mb-4">
                                            <div className="flex items-center mr-3">
                                                {renderStars(item.rating)}
                                            </div>
                                            <span className="text-lg font-semibold text-gray-700">({item.rating})</span>
                                        </div>
                                    )}
                                </div>

                                {/* Price and Availability */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center text-green-700 font-bold text-2xl">
                                            <DollarSign className="h-6 w-6 mr-1" />
                                            LKR {item.price?.toLocaleString()}
                                            {item.unit && <span className="text-lg text-gray-500 ml-2">per {item.unit}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Package className="h-4 w-4 mr-2" />
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
                        <div className="mt-8 border-t pt-6">
                            <h4 className="text-xl font-bold text-green-800 mb-4">Shop Information</h4>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div className="mt-8 flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    onClose();
                                    handleEdit(item);
                                }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                            >
                                <Edit className="h-5 w-5 mr-2" />
                                Edit Product
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
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

    // Edit Modal Component
    const EditModal = () => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-green-800">Edit Product</h2>
                        <button
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedItem(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleEditSubmit} className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="product_name">
                                    Product Name*
                                </label>
                                <input
                                    type="text"
                                    id="product_name"
                                    name="product_name"
                                    value={editFormData.product_name}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                                        Price (LKR)*
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={editFormData.price}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="available_quantity">
                                        Available Quantity*
                                    </label>
                                    <input
                                        type="number"
                                        id="available_quantity"
                                        name="available_quantity"
                                        value={editFormData.available_quantity}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="product_description">
                                    Description*
                                </label>
                                <textarea
                                    id="product_description"
                                    name="product_description"
                                    value={editFormData.product_description}
                                    onChange={handleEditChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        id="category"
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="product_type">
                                        Product Type
                                    </label>
                                    <input
                                        type="text"
                                        id="product_type"
                                        name="product_type"
                                        value={editFormData.product_type}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="city">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={editFormData.city}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="unit">
                                        Unit
                                    </label>
                                    <input
                                        type="text"
                                        id="unit"
                                        name="unit"
                                        value={editFormData.unit}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedItem(null);
                                }}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
                            Agrovia Marketplace
                        </h1>
                        <p className="text-green-600 text-lg">
                            Discover quality agricultural products from trusted suppliers
                        </p>
                    </div>

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
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                            {/* Product Image */}
                            <div className="relative">
                                {item.images && item.images.length > 0 && typeof item.images[0] === 'string' ? (
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
                                        onClick={() => toggleLike(item.id)}
                                        className={`p-2 rounded-full ${likedItems.has(item.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:scale-110 transition-transform`}
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

                                {/* Contact Info */}
                                <div className="border-t pt-4 mb-4">
                                    {item.email && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail className="h-4 w-4 mr-2 text-green-500" />
                                            <span className="truncate">{item.email}</span>
                                        </div>
                                    )}
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
                                        onClick={() => handleDelete(item.id)}
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
