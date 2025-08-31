import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Truck, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cropService } from '../services/cropService';
import { useAuth } from '../contexts/AuthContext';
import md5 from 'crypto-js/md5';

const CartPage = () => {
  const [openTransportModalId, setOpenTransportModalId] = useState(null);
  const [transporters, setTransporters] = useState([]);
  const [loadingTransporters, setLoadingTransporters] = useState(false);
  const [itemCoordinates, setItemCoordinates] = useState({});
  const [loadingCoordinates, setLoadingCoordinates] = useState({});
  // Payment method state for each cart item
  const [paymentMethods, setPaymentMethods] = useState({});

  // Helper function to diagnose why fetch might be failing
  const diagnoseFetchError = (error, url) => {
    console.log('\n🚨 FETCH ERROR DIAGNOSIS:');
    console.log(`URL: ${url}`);
    console.log(`Error type: ${error.name}`);
    console.log(`Error message: ${error.message}`);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.log('🔍 DIAGNOSIS: This is typically caused by:');
      console.log('   1. ❌ Backend server is NOT RUNNING on http://localhost:5000');
      console.log('   2. ❌ CORS policy blocking the request (frontend:5174 → backend:5000)');
      console.log('   3. ❌ Network connectivity issue');
      console.log('   4. ❌ Firewall blocking the connection');
      console.log('   5. ❌ Wrong URL or port number');
      
      console.log('🛠️ IMMEDIATE FIXES TO TRY:');
      console.log('   1. ✅ Start your backend server: npm run start (in backend folder)');
      console.log('   2. ✅ Check if http://localhost:5000 is accessible in browser');
      console.log('   3. ✅ Verify backend has CORS enabled for localhost:5174');
      console.log('   4. ✅ Check backend console for errors');
      
      // Test backend connectivity
      testBackendConnectivity();
      
    } else if (error.name === 'SyntaxError') {
      console.log('🔍 DIAGNOSIS: Response is not valid JSON');
      console.log('   - Backend might be returning HTML error page');
      console.log('   - Check if URL returns JSON when accessed directly');
      
    } else {
      console.log('🔍 DIAGNOSIS: Unexpected error type');
      console.log('   - Check error details above for clues');
    }
    console.log('🚨 END DIAGNOSIS\n');
  };

  // Test if backend server is running
  const testBackendConnectivity = async () => {
    console.log('\n🔧 TESTING BACKEND CONNECTIVITY...');
    
    const testUrls = [
      'http://localhost:5000',
      'http://localhost:5000/api',
      'http://localhost:5000/api/v1',
      'http://localhost:5000/health'
    ];
    
    for (const testUrl of testUrls) {
      try {
        console.log(`🔍 Testing: ${testUrl}`);
        const response = await fetch(testUrl, { 
          method: 'GET',
          mode: 'cors'
        });
        console.log(`✅ ${testUrl} - Status: ${response.status} (${response.ok ? 'OK' : 'ERROR'})`);
        
        if (response.ok) {
          const text = await response.text();
          console.log(`📄 Response preview: ${text.substring(0, 100)}...`);
          break; // Backend is reachable
        }
      } catch (error) {
        console.log(`❌ ${testUrl} - ${error.message}`);
      }
    }
    
    console.log('🔧 BACKEND CONNECTIVITY TEST COMPLETE\n');
  };

  // Fetch coordinates for a specific cart item from API only
  const fetchItemCoordinates = async (productId) => {
    setLoadingCoordinates(prev => ({ ...prev, [productId]: true }));
    
    // Only use the specified API endpoint: http://localhost:5000/api/v1/cart/[productId]/coordinates
    const apiUrl = `http://localhost:5000/api/v1/cart/${productId}/coordinates`;
    console.log(`🌍 FETCHING coordinates from: ${apiUrl}`);
    
    try {
      const response = await fetch(apiUrl);
      
      console.log(`📡 Response status: ${response.status} (${response.ok ? 'OK' : 'FAILED'})`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS: API response for product ${productId}:`, data);
        
        // Extract coordinates from API response
        let coordinates;
        if (data.success && data.data) {
          coordinates = data.data;
        } else if (data.coordinates) {
          coordinates = data.coordinates;
        } else if (data.latitude && data.longitude) {
          coordinates = { latitude: data.latitude, longitude: data.longitude };
        } else if (data.farmer_latitude && data.farmer_longitude) {
          // Handle farmer_latitude and farmer_longitude format
          coordinates = { latitude: data.farmer_latitude, longitude: data.farmer_longitude };
          console.log(`📍 Found farmer coordinates: farmer_latitude=${data.farmer_latitude}, farmer_longitude=${data.farmer_longitude}`);
        } else {
          console.warn(`⚠️ WARNING: Unexpected response format for product ${productId}:`, data);
          console.log(`🔍 Available keys in response:`, Object.keys(data));
          throw new Error('Invalid coordinate format in API response - Expected latitude/longitude or farmer_latitude/farmer_longitude');
        }
        
        const parsedCoords = {
          latitude: parseFloat(coordinates.latitude),
          longitude: parseFloat(coordinates.longitude)
        };
        
        console.log(`📍 PARSED coordinates for product ${productId}:`, parsedCoords);
        
        setItemCoordinates(prev => ({
          ...prev,
          [productId]: parsedCoords
        }));
        
        console.log(`✅ COORDINATES SAVED successfully for product ${productId}`);
        
        // Immediately calculate and print transport costs
        await calculateAndPrintTransportCosts(productId, parsedCoords);
        
      } else {
        const errorText = await response.text();
        console.error(`❌ API ERROR: Status ${response.status} for ${apiUrl}`);
        console.error(`❌ Error response body:`, errorText);
        setItemCoordinates(prev => ({
          ...prev,
          [productId]: { error: `API error: ${response.status} - ${errorText}` }
        }));
      }
    } catch (error) {
      // This is where "Failed to fetch" appears - provide detailed diagnosis
      console.error(`❌ FETCH ERROR for ${apiUrl}:`);
      diagnoseFetchError(error, apiUrl);
      
      setItemCoordinates(prev => ({
        ...prev,
        [productId]: { error: error.message }
      }));
    } finally {
      setLoadingCoordinates(prev => ({ ...prev, [productId]: false }));
      console.log(`🏁 FINISHED coordinate fetch for product ${productId}`);
    }
  };

  // Calculate and print transport costs for a specific product
  const calculateAndPrintTransportCosts = async (productId, itemCoordinates) => {
    console.log('\n🚚 CALCULATING TRANSPORT COSTS:');
    console.log(`📦 Product ID: ${productId}`);
    
    // Get user coordinates
    if (!user || !user.latitude || !user.longitude) {
      console.warn('⚠️ User coordinates not available - cannot calculate transport costs');
      return;
    }

    const userCoords = {
      latitude: parseFloat(user.latitude),
      longitude: parseFloat(user.longitude)
    };

    // Get cart item for details
    const cartItem = cartItems.find(item => item.id === productId);
    if (!cartItem) {
      console.warn('⚠️ Cart item not found for product:', productId);
      return;
    }

    console.log(`📦 Item: ${cartItem.name}`);
    console.log(`📍 Item Location: ${cartItem.district || cartItem.location}`);
    console.log(`📍 Item Coordinates: ${itemCoordinates.latitude.toFixed(6)}, ${itemCoordinates.longitude.toFixed(6)}`);
    console.log(`🏠 User Coordinates: ${userCoords.latitude.toFixed(6)}, ${userCoords.longitude.toFixed(6)}`);
    
    // Calculate distance
    const distance = calculateDistance(
      userCoords.latitude,
      userCoords.longitude,
      itemCoordinates.latitude,
      itemCoordinates.longitude
    );
    
    console.log(`📏 CALCULATED DISTANCE: ${distance.toFixed(2)} km`);
    
    // Get available transporters (make sure transporters are loaded)
    if (transporters.length === 0) {
      console.log('⚠️ No transporters loaded yet, fetching...');
      return;
    }
    
    const availableTransporters = filteredTransporters(transporters, cartItem);
    console.log(`🚛 AVAILABLE TRANSPORTERS: ${availableTransporters.length}`);
    
    if (availableTransporters.length === 0) {
      console.log('⚠️ No transporters available for this district');
      return;
    }
    
    console.log('\n💰 TRANSPORT COST BREAKDOWN:');
    console.log('-'.repeat(60));
    
    availableTransporters.forEach((transporter, index) => {
      const baseRate = transporter.baseRate || 500;
      const perKmRate = transporter.perKmRate || 25;
      const estimatedWeight = cartItem.quantity * (cartItem.weightPerUnit || 1);
      const weightMultiplier = Math.max(1, estimatedWeight / 100);
      const totalCost = (baseRate + (distance * perKmRate)) * weightMultiplier;
      
      console.log(`\n${index + 1}. 🚛 ${transporter.full_name || transporter.name}`);
      console.log(`   📍 District: ${transporter.district || 'N/A'}`);
      console.log(`   🚐 Vehicle: ${transporter.vehicle_type} (${transporter.vehicle_number})`);
      console.log(`   ⚖️ Estimated Weight: ${estimatedWeight} kg (multiplier: ${weightMultiplier.toFixed(2)})`);
      console.log(`   💰 Base Rate: LKR ${baseRate}`);
      console.log(`   📊 Per KM Rate: LKR ${perKmRate}`);
      console.log(`   📏 Distance: ${distance.toFixed(2)} km`);
      console.log(`   💵 TOTAL TRANSPORT COST: LKR ${Math.round(totalCost * 100) / 100}`);
    });
    
    console.log('-'.repeat(60));
  };

  // Print comprehensive summary of all coordinate URLs and transport costs
  const printAllCoordinatesAndTransportSummary = () => {
    console.log('\n' + '='.repeat(100));
    console.log('🌍 COMPREHENSIVE COORDINATE URL & TRANSPORT COST SUMMARY');
    console.log('='.repeat(100));
    
    // Print all URLs and their status
    cartItems.forEach((item, index) => {
      const url = `http://localhost:5000/api/v1/cart/${item.id}/coordinates`;
      
      console.log(`\n${index + 1}. 📦 ${item.name} (ID: ${item.id})`);
      console.log(`   🔗 Coordinate URL: ${url}`);
      console.log(`   📍 District: ${item.district || item.location}`);
      
      if (itemCoordinates[item.id] && !itemCoordinates[item.id].error) {
        const coords = itemCoordinates[item.id];
        console.log(`   ✅ Coordinates: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
        
        // Calculate and show transport costs
        if (user && user.latitude && user.longitude) {
          const userLat = parseFloat(user.latitude);
          const userLon = parseFloat(user.longitude);
          const itemLat = parseFloat(coords.latitude);
          const itemLon = parseFloat(coords.longitude);
          
          if (!isNaN(userLat) && !isNaN(userLon) && !isNaN(itemLat) && !isNaN(itemLon)) {
            const distance = calculateDistance(userLat, userLon, itemLat, itemLon);
            console.log(`   📏 Distance from user: ${distance.toFixed(2)} km`);
            
            const availableTransporters = filteredTransporters(transporters, item);
            console.log(`   🚛 Available transporters: ${availableTransporters.length}`);
            
            if (availableTransporters.length > 0) {
              console.log(`   💰 Transport costs:`);
              availableTransporters.forEach((transporter, tIdx) => {
                const baseRate = transporter.baseRate || 500;
                const perKmRate = transporter.perKmRate || 25;
                const estimatedWeight = item.quantity * (item.weightPerUnit || 1);
                const weightMultiplier = Math.max(1, estimatedWeight / 100);
                const totalCost = (baseRate + (distance * perKmRate)) * weightMultiplier;
                
                console.log(`     ${tIdx + 1}. ${transporter.full_name || transporter.name}: LKR ${Math.round(totalCost * 100) / 100}`);
              });
            }
          }
        }
      } else if (itemCoordinates[item.id]?.error) {
        console.log(`   ❌ Error: ${itemCoordinates[item.id].error}`);
      } else {
        console.log(`   ⏳ Status: Not loaded`);
      }
    });
    
    // Print user location
    console.log('\n🏠 USER DELIVERY LOCATION:');
    if (user && user.latitude && user.longitude) {
      console.log(`   📍 Coordinates: ${parseFloat(user.latitude).toFixed(6)}, ${parseFloat(user.longitude).toFixed(6)}`);
      console.log(`   📧 Address: ${user.address}, ${user.district}`);
    } else {
      console.log(`   ⚠️ User coordinates not available`);
    }
    
    console.log('='.repeat(100) + '\n');
  };

  // Debug function to test coordinate API directly
  const debugCoordinateAPI = async (productId) => {
    console.log('\n' + '='.repeat(80));
    console.log('🔍 DEBUGGING COORDINATE API CALL');
    console.log('='.repeat(80));
    
    const apiUrl = `http://localhost:5000/api/v1/cart/${productId}/coordinates`;
    console.log(`🌍 Testing URL: ${apiUrl}`);
    
    try {
      console.log('📡 Starting fetch...');
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📡 Fetch completed. Response object:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers ? Object.fromEntries(response.headers.entries()) : 'No headers'
      });
      
      if (response.ok) {
        console.log('✅ Response is OK, parsing JSON...');
        const data = await response.json();
        console.log('✅ JSON parsed successfully:', data);
        
        // Check different possible coordinate formats
        if (data.success && data.data) {
          console.log('📍 Found coordinates in data.success.data:', data.data);
        } else if (data.coordinates) {
          console.log('📍 Found coordinates in data.coordinates:', data.coordinates);
        } else if (data.latitude && data.longitude) {
          console.log('📍 Found coordinates directly:', { latitude: data.latitude, longitude: data.longitude });
        } else {
          console.warn('⚠️ No recognizable coordinate format found in response');
        }
        
      } else {
        console.error('❌ Response not OK, getting error text...');
        const errorText = await response.text();
        console.error('❌ Error text:', errorText);
      }
      
    } catch (error) {
      console.error('❌ CATCH BLOCK - Error occurred:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      diagnoseFetchError(error, apiUrl);
    }
    
    console.log('='.repeat(80) + '\n');
  };

  // Filter transporters by district match with logging and flexible matching
  const filteredTransporters = (transporters, item) => {
    const itemDistrict = (item.district || item.location || '').toLowerCase().trim();
    
    if (!itemDistrict) {
      console.log('No district found for item:', item.name);
      return [];
    }

    console.log('Looking for transporters in district:', itemDistrict);
    
    return transporters.filter(transporter => {
      const transporterDistrict = (transporter.district || transporter.location || transporter.area || '').toLowerCase().trim();
      console.log('Comparing with transporter district:', transporterDistrict, 'for transporter:', transporter.full_name || transporter.name);
      
      // Check if districts are similar (includes partial matches)
      const isMatch = transporterDistrict.includes(itemDistrict) || itemDistrict.includes(transporterDistrict);
      if (isMatch) {
        console.log('Found matching transporter:', transporter.full_name || transporter.name);
      }
      return isMatch;
    });
  };

  // Fetch transporters from backend
  const fetchTransporters = async () => {
    setLoadingTransporters(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/transporters');
      if (response.ok) {
        const result = await response.json();
        let transporterData = [];
        if (result.success && result.data) {
          transporterData = result.data;
        } else if (Array.isArray(result)) {
          transporterData = result;
        } else if (result.transporters) {
          transporterData = result.transporters;
        }
        setTransporters(transporterData);
      } else {
        setTransporters([]);
      }
    } catch {
      setTransporters([]);
    } finally {
      setLoadingTransporters(false);
    }
  };
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartTotalWithTransport,
    getTotalTransportCost,
    addTransportToCartItem, 
    removeTransportFromCartItem,
    calculateDistance
  } = useCart();
  const { getAuthHeaders } = useAuth();
  const [cropDetails, setCropDetails] = useState({});
  const [loading, setLoading] = useState(true);
  
  // PayHere credentials and endpoints
  const MERCHANT_ID = '1229505';
  const MERCHANT_SECRET = 'MjUzNjk0MjMzNTU5MzU3NjMzMjEyMDc2MDU0OTM0MDA4ODcyNzE1';
  // Redirect URLs back to your site
  const BASE_URL = window.location.origin;
  const RETURN_URL = BASE_URL + '/payment-success';    // on successful payment
  const CANCEL_URL = BASE_URL + '/cart';    // on cancellation or Go Back
  const NOTIFY_URL = BASE_URL + '/payhere/notify';  // your public notify endpoint
  
  // Delivery address (fetched from user profile)
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState("");

  // Fetch crop details for all items in cart
  // Fetch user profile for delivery address
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      setUserError('No authentication token found. Please log in again.');
      return;
    }
    let apiUrl = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api/v1/auth/profile-full`
      : (import.meta.env.DEV
          ? 'http://localhost:5000/api/v1/auth/profile-full'
          : '/api/v1/auth/profile-full');
    fetch(apiUrl, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          let msg = `Failed to fetch profile (status ${res.status})`;
          if (contentType && contentType.includes('text/html')) {
            msg = 'API endpoint not reachable. Check your Vite proxy or backend server.';
          } else {
            try {
              const errJson = await res.json();
              if (errJson && errJson.message) msg += `: ${errJson.message}`;
            } catch {}
          }
          throw new Error(msg);
        }
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API did not return JSON. Check your proxy and backend.');
        }
        return res.json();
      })
      .then(data => {
        const user = data.user || {};
        
        // Debug the actual database values
        console.log('User data:', user);
        console.log('Raw latitude value:', user.latitude);
        console.log('Raw longitude value:', user.longitude);
        
        // Ensure we're using exactly what's in the database
        setUser({
          full_name: user.full_name || '-',
          address: user.address || '-',
          district: user.district || '-',
          country: user.country || 'Sri Lanka',
          phone_number: user.phone_number || '-',
          // Store raw database values without any modifications
          latitude: user.latitude,
          longitude: user.longitude
        });
      })
      .catch(err => {
        setUserError(err.message || 'Unknown error');
      });
  }, []);

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        // Load transporters first for cost calculations
        if (transporters.length === 0) {
          await fetchTransporters();
        }
        
        const details = {};
        for (const item of cartItems) {
          const response = await cropService.getByIdEnhanced(item.id);
          if (response.success && response.data) {
            details[item.id] = {
              minimumQuantityBulk: response.data.minimum_quantity_bulk,
              availableQuantity: response.data.quantity
            };
          }
          
          // Fetch coordinates for each item (will automatically calculate transport costs)
          console.log(`🌍 Fetching coordinates for product ${item.id} (${item.name})`);
          await fetchItemCoordinates(item.id);
        }
        setCropDetails(details);
      } catch (error) {
        console.error('Error fetching crop details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cartItems.length > 0) {
      fetchCropDetails();
    } else {
      setLoading(false);
    }
  }, [cartItems]);

  // Auto-print comprehensive summary when all data is ready
  useEffect(() => {
    if (cartItems.length > 0 && user && Object.keys(itemCoordinates).length > 0 && transporters.length > 0) {
      // Delay to ensure all data is fully loaded
      const timer = setTimeout(() => {
        printAllCoordinatesAndTransportSummary();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [cartItems, user, itemCoordinates, transporters]);

  const getMinQuantity = (item) => {
    // Use the cropDetails from state if available, otherwise fallback to item.minimumQuantityBulk or 1
    return cropDetails[item.id]?.minimumQuantityBulk || item.minimumQuantityBulk || 1;
  };

  const getMaxQuantity = (item) => {
    // Use the cropDetails from state if available, otherwise fallback to item.availableQuantity or item.quantity
    return cropDetails[item.id]?.availableQuantity || item.availableQuantity || item.quantity || 1000;
  };

  const handleQuantityChange = (item, newQuantity) => {
    const minQty = getMinQuantity(item);
    const maxQty = getMaxQuantity(item);

    // Ensure quantity stays within bounds
    newQuantity = Math.max(minQty, Math.min(newQuantity, maxQty));

    if (newQuantity !== item.quantity) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncrement = (item) => {
    const newQuantity = item.quantity + 1;
    handleQuantityChange(item, newQuantity);
  };

  const handleDecrement = (item) => {
    const newQuantity = item.quantity - 1;
    handleQuantityChange(item, newQuantity);
  };

  const handleManualQuantityChange = (e, item) => {
    const newQuantity = parseInt(e.target.value) || getMinQuantity(item);
    handleQuantityChange(item, newQuantity);
  };

  // Back navigation with fallback
  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/byersmarket');
    }
  };
  
  const handleCheckout = () => {
    // Prepare order details
    const orderId = 'ORDER' + Date.now();
    const totalAmount = getTotalTransportCost() > 0 ? getCartTotalWithTransport() : getCartTotal();
    const rawAmount = totalAmount.toFixed(2);
    const amountFormatted = parseFloat(rawAmount)
      .toLocaleString('en-US',{ minimumFractionDigits:2 })
      .replace(/,/g, '');
    const currency = 'LKR';
    
    // Store cart and delivery details for success page
    try {
      localStorage.setItem('lastOrderCart', JSON.stringify(cartItems));
      if (user) localStorage.setItem('lastOrderDelivery', JSON.stringify(user));
    } catch {}
    
    // Generate hash: MD5(merchant_secret) then MD5(merchant_id + orderId + amount + currency + hashedSecret)
    const hashedSecret = md5(MERCHANT_SECRET).toString().toUpperCase();
    const hash = md5(MERCHANT_ID + orderId + amountFormatted + currency + hashedSecret)
      .toString().toUpperCase();
    
    // Build form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://sandbox.payhere.lk/pay/checkout';
    
    const params = {
      merchant_id: MERCHANT_ID,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,
      order_id: orderId,
      items: `Agrovia Cart ${orderId}`,
      currency,
      amount: amountFormatted,
      first_name: user?.full_name?.split(' ')[0] || 'Customer',
      last_name: user?.full_name?.split(' ').slice(1).join(' ') || 'Name',
      email: 'customer@example.com', // Replace with actual email if available
      phone: user?.phone_number || '0000000000',
      address: user?.address || 'Address Line',
      city: user?.district || 'City',
      country: user?.country || 'Sri Lanka',
      hash: hash
    };
    
    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  // Helper: Check if all items with 'Hire Transport' have a transporter selected
  const allHireTransportSelected = cartItems.every(item => {
    const method = paymentMethods[item.id] || "Pickup";
    if (method === "Hire Transport") {
      return !!item.transporter;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agrovia-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl border border-agrovia-200">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Start shopping to add items to your cart</p>
          <Link
            to="/byersmarket"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-agrovia-500 to-agrovia-600 text-white rounded-xl hover:from-agrovia-600 hover:to-agrovia-700 transition-all duration-300 font-semibold text-lg shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="flex items-center text-agrovia-600 hover:text-agrovia-700 transition-colors mr-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={printAllCoordinatesAndTransportSummary}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                title="Print all coordinate URLs and transport costs to console"
              >
                🖨️ Print Summary
              </button>
              <button
                onClick={clearCart}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-lg mt-2">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const minQty = getMinQuantity(item);
              const maxQty = getMaxQuantity(item);
              const isMinQty = item.quantity <= minQty;
              const isMaxQty = item.quantity >= maxQty;
              // Default payment method: Pickup
              const paymentMethod = paymentMethods[item.id] || "Pickup";

              return (
                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg border border-agrovia-100">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-2">by {item.farmer}</p>
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <span className="font-medium">District:</span>
                        <span className="text-sm bg-green-50 px-2 py-1 rounded-lg border border-green-200">{item.district || item.location}</span>
                      </div>

                      {/* Payment Method Select (hidden once transporter is chosen) */}
                      {!item.transporter ? (
                        <div className="mb-2">
                          <label className="block text-base font-bold text-agrovia-700 mb-1">Payment Method</label>
                          <select
                            className="w-40 px-3 py-2 border-2 border-agrovia-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-agrovia-500 bg-agrovia-50 text-agrovia-700 text-base font-bold shadow-md"
                            value={paymentMethod}
                            onChange={e => setPaymentMethods(pm => ({ ...pm, [item.id]: e.target.value }))}
                          >
                            <option value="Pickup">Pickup</option>
                            <option value="Hire Transport">Hire Transport</option>
                          </select>
                        </div>
                      ) : (
                        <div className="mb-2">
                          <label className="block text-base font-bold text-agrovia-700 mb-1">Payment Method</label>
                          <div className="inline-block px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-semibold">Hire Transport</div>
                        </div>
                      )}

                      {/* Coordinates & Transport Costs Section */}
                      {minQty > 1 && (
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          <span className="font-bold">Bulk Order:</span> Minimum {minQty} {item.unit}
                        </div>
                      )}

                      {/* Transport Section */}
                      {item.transporter ? (
                        <div className="mt-2 mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-blue-600" />
                                <h4 className="font-semibold text-blue-700">Selected Transport</h4>
                              </div>
                              <p className="text-sm text-gray-700 mt-1 font-medium">{item.transporter.name}</p>
                              <p className="text-xs text-gray-600">{item.transporter.vehicle}</p>
                              <p className="text-xs text-gray-600">Phone: {item.transporter.phone}</p>
                              
                              {/* Transport Cost - Only show total */}
                              {item.transporter.cost > 0 && (
                                <div className="mt-2 p-2 bg-green-100 rounded border border-green-300">
                                  <p className="font-bold text-green-800 text-sm">
                                    Transport Cost: LKR {item.transporter.cost?.toLocaleString()}
                                  </p>
                                  {item.transporter.distance > 0 ? (
                                    <p className="text-xs text-green-600 mt-1">
                                      Distance-based: {item.transporter.distance.toFixed(1)} km
                                    </p>
                                  ) : (
                                    <p className="text-xs text-green-600 mt-1">
                                      Base rate (coordinates needed for distance-based pricing)
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <button 
                              onClick={() => removeTransportFromCartItem(item.id)}
                              className="p-1 bg-white rounded-full text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 transition-colors flex-shrink-0 ml-2"
                              title="Remove transport"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        paymentMethod === "Hire Transport" && (
                          <button
                            className="mt-2 mb-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center"
                            onClick={async () => {
                              setOpenTransportModalId(item.id);
                              await fetchTransporters();
                              // Automatically fetch coordinates when opening transport modal
                              if (!itemCoordinates[item.id]) {
                                await fetchItemCoordinates(item.id);
                              }
                            }}
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Select Transport
                            {itemCoordinates[item.id] && user && user.latitude && user.longitude && (
                              <span className="ml-1 text-xs bg-blue-400 px-1 rounded">
                                ✓ Ready
                              </span>
                            )}
                          </button>
                        )
                      )}

                      {/* Transporters Modal */}
                      {openTransportModalId === item.id && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h2 className="text-xl font-bold text-gray-900">Available Transporters</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                  Transport costs calculated automatically based on distance
                                </p>
                                {itemCoordinates[item.id] && user && user.latitude && user.longitude && (
                                  <div className="mt-2 flex items-center text-xs text-green-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Coordinates loaded - accurate pricing available
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => setOpenTransportModalId(null)}
                                className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                                aria-label="Close"
                              >
                                &times;
                              </button>
                            </div>
                            {loadingTransporters || loadingCoordinates[item.id] ? (
                              <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                  {loadingTransporters ? 'Loading transporters...' : 'Loading coordinates...'}
                                </h3>
                                <p className="text-gray-500">
                                  {loadingTransporters ? 'Finding available transport services' : 'Calculating transport costs'}
                                </p>
                              </div>
                            ) : (
                              <div>
                                {transporters.length === 0 ? (
                                  <div className="text-center py-8">
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">No transporters found</h3>
                                    <p className="text-gray-500">No transport services are available at the moment.</p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredTransporters(transporters, item).map((transporter) => (
                                      <div key={transporter.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                        <h4 className="font-bold text-gray-900 mb-1">{transporter.full_name || transporter.name}</h4>
                                        <p className="text-sm text-gray-600 mb-1">District: {transporter.district}</p>
                                        <p className="text-sm text-gray-600 mb-1">Vehicle: {transporter.vehicle_type} ({transporter.vehicle_number})</p>
                                        <p className="text-sm text-gray-600 mb-1">Phone: {transporter.phone_number}</p>
                                        <p className="text-sm text-gray-600 mb-1">Rating: {transporter.rating || 'N/A'}</p>
                                        <p className="text-sm text-gray-600 mb-3">
                                          Base Rate: LKR {transporter.baseRate || 500} | Per KM: LKR {transporter.perKmRate || 25}
                                        </p>
                                        
                                        {/* Transport Cost Preview - Auto calculated */}
                                        {loadingCoordinates[item.id] ? (
                                          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="text-center">
                                              <div className="animate-pulse">
                                                <div className="h-4 bg-blue-200 rounded w-3/4 mx-auto mb-2"></div>
                                                <div className="h-3 bg-blue-100 rounded w-1/2 mx-auto"></div>
                                              </div>
                                              <p className="text-xs text-blue-600 mt-2">
                                                Calculating transport cost...
                                              </p>
                                            </div>
                                          </div>
                                        ) : user && user.latitude && user.longitude && itemCoordinates[item.id] && !itemCoordinates[item.id].error ? (
                                          <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                            {(() => {
                                              // Extract coordinates safely
                                              const userLat = parseFloat(user.latitude);
                                              const userLon = parseFloat(user.longitude);
                                              const itemLat = parseFloat(itemCoordinates[item.id].latitude);
                                              const itemLon = parseFloat(itemCoordinates[item.id].longitude);
                                              
                                              // Check if all coordinates are valid numbers
                                              if (isNaN(userLat) || isNaN(userLon) || isNaN(itemLat) || isNaN(itemLon)) {
                                                return (
                                                  <div className="text-center">
                                                    <p className="text-sm text-yellow-600">
                                                      Invalid coordinate data. Cannot calculate transport cost.
                                                    </p>
                                                  </div>
                                                );
                                              }
                                              
                                              const distance = calculateDistance(userLat, userLon, itemLat, itemLon);
                                              const estimatedWeight = item.quantity * (item.weightPerUnit || 1);
                                              const baseRate = transporter.baseRate || 500;
                                              const perKmRate = transporter.perKmRate || 25;
                                              const weightMultiplier = Math.max(1, estimatedWeight / 100);
                                              const cost = (baseRate + (distance * perKmRate)) * weightMultiplier;
                                              
                                              // Check if calculated values are valid
                                              if (isNaN(distance) || isNaN(cost)) {
                                                return (
                                                  <div className="text-center">
                                                    <p className="text-sm text-red-600">
                                                      Error calculating transport cost.
                                                    </p>
                                                  </div>
                                                );
                                              }
                                              
                                              return (
                                                <div className="text-center">
                                                  <p className="text-lg font-bold text-green-800">
                                                    Transport Cost: LKR {Math.round(cost * 100) / 100}
                                                  </p>
                                                  <p className="text-xs text-green-600 mt-1">
                                                    For {distance.toFixed(1)} km delivery
                                                  </p>
                                                </div>
                                              );
                                            })()}
                                          </div>
                                        ) : (
                                          <div className="mb-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <p className="text-xs text-yellow-700 mb-2">
                                              {!user || !user.latitude || !user.longitude ? 
                                                'User coordinates needed for cost calculation' :
                                                'Item coordinates needed - click "Get Coordinates" button above'
                                              }
                                            </p>
                                            <div className="text-center">
                                              <p className="text-lg font-bold text-yellow-800">
                                                Base Transport Cost: LKR {transporter.baseRate || 500}
                                              </p>
                                              <p className="text-xs text-yellow-600 mt-1">
                                                Distance-based pricing will be calculated once coordinates are available
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                        
                                        <button
                                          className="mt-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                          onClick={async () => {
                                            const userCoords = user && user.latitude && user.longitude ? {
                                              latitude: parseFloat(user.latitude),
                                              longitude: parseFloat(user.longitude)
                                            } : null;
                                            const itemCoords = itemCoordinates[item.id] && !itemCoordinates[item.id].error ? {
                                              latitude: parseFloat(itemCoordinates[item.id].latitude),
                                              longitude: parseFloat(itemCoordinates[item.id].longitude)
                                            } : null;

                                            // Defensive checks: ensure cart row id and transporter id exist
                                            const cartRowId = item.cartItemId ?? item.id; // prefer DB cart row id when available
                                            if (!item || !cartRowId) {
                                              console.error('Cannot create transport allocation: missing cart_item_id (cart row id)', { item });
                                              alert('Cannot add transport: missing cart_item_id');
                                              return;
                                            }
                                            if (!transporter || (!transporter.id && !transporter.transport_id)) {
                                              console.error('Cannot create transport allocation: missing transporter id', { transporter });
                                              alert('Cannot add transport: missing transporter id');
                                              return;
                                            }

                                            // Build safe, flat payload only with primitive values
                                            const safeCartItemId = Number(cartRowId);
                                            const safeTransportId = Number(transporter.transport_id ?? transporter.id);
                                            const safeTransporterId = Number(transporter.id);
                                            const safeQuantity = Number(item.quantity) || 1;
                                            const safeUserLat = userCoords && !isNaN(Number(userCoords.latitude)) ? Number(userCoords.latitude) : null;
                                            const safeUserLon = userCoords && !isNaN(Number(userCoords.longitude)) ? Number(userCoords.longitude) : null;
                                            const safeItemLat = itemCoords && !isNaN(Number(itemCoords.latitude)) ? Number(itemCoords.latitude) : null;
                                            const safeItemLon = itemCoords && !isNaN(Number(itemCoords.longitude)) ? Number(itemCoords.longitude) : null;

                                            // Map transporter field variants (camelCase/snake_case) so we don't send nulls
                                            const vehicleType = transporter.vehicle_type ?? transporter.vehicleType ?? transporter.vehicle ?? null;
                                            const vehicleNumber = transporter.vehicle_number ?? transporter.vehicleNumber ?? transporter.vehicleNo ?? null;
                                            const phoneNumber = transporter.phone_number ?? transporter.phone ?? transporter.phoneNumber ?? null;
                                            const baseRateVal = Number(transporter.base_rate ?? transporter.baseRate ?? transporter.baseRateValue ?? 500);
                                            const perKmRateVal = Number(transporter.per_km_rate ?? transporter.perKmRate ?? transporter.perKmRateValue ?? 25);
                                            const districtVal = transporter.district ?? transporter.location ?? transporter.area ?? null;

                                            // Compute distance and estimated cost if coordinates available
                                            let calculatedDistance = null;
                                            let transportCost = null;
                                            if (safeUserLat !== null && safeUserLon !== null && safeItemLat !== null && safeItemLon !== null) {
                                              calculatedDistance = Number(calculateDistance(safeUserLat, safeUserLon, safeItemLat, safeItemLon).toFixed(2));
                                              const estimatedWeight = item.quantity * (item.weightPerUnit || 1);
                                              const weightMultiplier = Math.max(1, estimatedWeight / 100);
                                              transportCost = Number(((baseRateVal + (calculatedDistance * perKmRateVal)) * weightMultiplier).toFixed(2));
                                            }

                                            const payload = {
                                              // Backend expects snake_case primitive fields only
                                              cart_item_id: isNaN(safeCartItemId) ? null : safeCartItemId,
                                              transport_id: isNaN(safeTransportId) ? null : safeTransportId,
                                              transporter_id: isNaN(safeTransporterId) ? null : safeTransporterId,
                                              quantity: safeQuantity,
                                              // transporter snapshot fields (mapped)
                                              vehicle_type: vehicleType,
                                              vehicle_number: vehicleNumber,
                                              phone_number: phoneNumber,
                                              base_rate: isNaN(baseRateVal) ? null : baseRateVal,
                                              per_km_rate: isNaN(perKmRateVal) ? null : perKmRateVal,
                                              // computed values
                                              calculated_distance: calculatedDistance,
                                              transport_cost: transportCost,
                                              district: districtVal,
                                              // flattened coordinates
                                              user_latitude: safeUserLat,
                                              user_longitude: safeUserLon,
                                              item_latitude: safeItemLat,
                                              item_longitude: safeItemLon
                                            };

                                            // Use the exact URL you indicated and include auth headers if available
                                            const url = 'http://localhost:5000/api/transport-allocations';
                                            const headers = {
                                              'Content-Type': 'application/json',
                                              ...(typeof getAuthHeaders === 'function' ? getAuthHeaders() : {})
                                            };

                                            try {
                                              // Print a clear, stringified version of the payload for easier inspection
                                              console.log('➡️ POST', url, 'payload:', payload);
                                              console.log('➡️ Request payload (stringified):', JSON.stringify(payload, null, 2));
                                              console.log('➡️ Headers:', headers);
                                              const res = await fetch(url, {
                                                method: 'POST',
                                                headers: { ...headers, 'Accept': 'application/json' },
                                                credentials: 'include',
                                                body: JSON.stringify(payload)
                                              });

                                              const text = await res.text();
                                              let body;
                                              try { body = JSON.parse(text); } catch (e) { body = text; }

                                              if (res.ok) {
                                                console.log('✅ Transport allocation created:', body);
                                                alert('Transport added successfully');
                                              } else {
                                                console.error(`❌ Transport allocation failed (status ${res.status})`, body);
                                                // Helpful alerts for devs/users
                                                if (res.status >= 500) {
                                                  alert('Server error while adding transport (500). Check backend logs.');
                                                } else if (res.status === 401 || res.status === 403) {
                                                  alert('Authentication error when adding transport. Please log in.');
                                                } else {
                                                  const msg = body && body.message ? body.message : `Failed to add transport (status ${res.status})`;
                                                  alert(msg);
                                                }
                                              }
                                            } catch (err) {
                                              console.error('❌ Network/fetch error adding transport:', err);
                                              alert('Network error while adding transport');
                                            }

                                            // Keep UI behavior: update local cart state
                                            if (userCoords && itemCoords && 
                                                !isNaN(userCoords.latitude) && !isNaN(userCoords.longitude) &&
                                                !isNaN(itemCoords.latitude) && !isNaN(itemCoords.longitude)) {
                                              addTransportToCartItem(item.id, transporter, userCoords, itemCoords);
                                              setOpenTransportModalId(null);
                                            } else {
                                              addTransportToCartItem(item.id, transporter, null, null);
                                              setOpenTransportModalId(null);
                                            }
                                          }}
                                        >
                                          Select This Transporter
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-2xl font-bold text-agrovia-600">
                          LKR {item.price}
                          <span className="text-sm text-gray-500 font-normal">/{item.unit}</span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDecrement(item)}
                            disabled={isMinQty}
                            className={`p-2 rounded-lg ${
                              isMinQty 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            } transition-colors`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleManualQuantityChange(e, item)}
                            min={minQty}
                            max={maxQty}
                            className="w-16 p-2 border rounded text-center"
                          />
                          <button
                            onClick={() => handleIncrement(item)}
                            disabled={isMaxQty}
                            className={`p-2 rounded-lg ${
                              isMaxQty 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-agrovia-100 hover:bg-agrovia-200 text-agrovia-600'
                            } transition-colors`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors ml-3"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Quantity Info */}
                      <div className="text-xs text-gray-500 mt-2">
                        {isMinQty && (
                          <span className="text-red-500">Minimum quantity: {minQty}</span>
                        )}
                        {isMaxQty && (
                          <span className="text-red-500">Maximum available: {maxQty}</span>
                        )}
                      </div>
                      
                      {/* Item Total */}
                      <div className="mt-3 text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          Subtotal: LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-agrovia-200 sticky top-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity} {item.unit}
                      </span>
                      <span className="font-semibold">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    {item.transporter && item.transporter.cost > 0 && (
                      <div className="ml-4 mt-1 text-sm text-blue-600 flex items-center justify-between">
                        <div className="flex items-center">
                          <Truck className="w-3 h-3 mr-1" />
                          <span>Transport: {item.transporter.name}</span>
                        </div>
                        <span className="font-semibold">
                          LKR {item.transporter.cost.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal (Items):</span>
                  <span className="font-semibold">LKR {getCartTotal().toLocaleString()}</span>
                </div>
                {getTotalTransportCost() > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Transport Costs:</span>
                    <span className="font-semibold text-blue-600">
                      LKR {getTotalTransportCost().toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xl font-bold border-t border-gray-200 pt-4">
                  <span>Total:</span>
                  <span className="text-agrovia-600">
                    LKR {(getTotalTransportCost() > 0 ? getCartTotalWithTransport() : getCartTotal()).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Delivery address for buyer review */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Delivery Address</h4>
                {userError ? (
                  <p className="text-red-500 text-sm">{userError}</p>
                ) : user ? (
                  user.address && user.address !== '-' && user.address.trim() !== '' ? (
                    <>
                      <p className="text-gray-700">{user.address}{user.district ? `, ${user.district}` : ''}{user.country ? `, ${user.country}` : ', Sri Lanka'}</p>
                      <p className="text-gray-700">{user.full_name} {user.phone_number ? `| ${user.phone_number}` : ''}</p>
                      
                    </>
                  ) : (
                    <>
                      <p className="text-yellow-700 text-sm mb-2">No delivery address found.</p>
                      <Link
                        to="/profile/farmer/edit"
                        className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold hover:bg-yellow-200 transition-colors text-sm"
                      >
                        Add your address in Profile
                      </Link>
                    </>
                  )
                ) : (
                  <p className="text-gray-400 italic">Loading address...</p>
                )}
              </div>
              
              {/* Proceed to Checkout only if all Hire Transport items have transporter selected */}
              {allHireTransportSelected && (
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-agrovia-500 to-agrovia-600 text-white py-4 rounded-xl hover:from-agrovia-600 hover:to-agrovia-700 transition-all duration-300 font-semibold text-lg shadow-lg transform hover:scale-105"
                >
                  Proceed to Checkout
                </button>
              )}
              
              <Link
                to="/byersmarket"
                className="block w-full text-center mt-4 px-6 py-3 border border-agrovia-500 text-agrovia-600 rounded-xl hover:bg-agrovia-50 transition-colors font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 