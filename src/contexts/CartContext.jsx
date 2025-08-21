import React, { useState, useEffect, useCallback } from 'react';
import { CartContext } from './CartContextDefinition';
import { useAuth } from './AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1'; // Adjust this to match your API URL

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, getAuthHeaders } = useAuth();
  
  // Fetch cart items from the database when user logs in
  const fetchCartItems = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cart`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        // Map API cart items to local shape
        let mappedItems = response.data.data.map(item => ({
          id: item.productId,
          cartItemId: item.id,
          name: item.productName,
          price: Number(item.priceAtAddTime),
          unit: item.productUnit,
          farmer: item.farmerName,
          location: item.district || item.location, // Use district if available, fallback to location
          image: item.productImage,
          quantity: item.quantity,
          addedAt: item.createdAt
        }));

        // Try to fetch transport allocations and merge into cart items so selections persist after refresh
        try {
          const allocResp = await axios.get('http://localhost:5000/api/transport-allocations', {
            headers: getAuthHeaders()
          });

          const allocations = allocResp && allocResp.data ? (allocResp.data.data || allocResp.data) : [];

          if (Array.isArray(allocations) && allocations.length > 0) {
            // Helper to convert allocation object into transporter shape expected by UI
            const mapAllocToTransporter = (alloc, item) => {
              const name = alloc.transporter_name || alloc.full_name || alloc.name || alloc.transport_name || null;
              const vehicleType = alloc.vehicle_type ?? alloc.vehicle ?? null;
              const vehicleNumber = alloc.vehicle_number ?? alloc.vehicle_no ?? alloc.vehicleNumber ?? null;
              const phone = alloc.phone_number ?? alloc.phone ?? alloc.phoneNumber ?? null;
              const baseRate = Number(alloc.base_rate ?? alloc.baseRate ?? alloc.baseRateValue ?? 500);
              const perKmRate = Number(alloc.per_km_rate ?? alloc.perKmRate ?? alloc.perKmRateValue ?? 25);
              const distance = Number(alloc.calculated_distance ?? alloc.distance ?? 0) || 0;
              const cost = Number(alloc.transport_cost ?? alloc.cost ?? 0) || 0;

              return {
                ...alloc,
                name: name || `Transporter ${alloc.transporter_id ?? alloc.id ?? ''}`,
                full_name: name,
                vehicle_type: vehicleType,
                vehicle_number: vehicleNumber,
                phone_number: phone,
                vehicle: `${vehicleType || ''}${vehicleNumber ? ' (' + vehicleNumber + ')' : ''}`,
                district: alloc.district ?? alloc.location ?? null,
                distance,
                cost,
                baseRate,
                perKmRate
              };
            };

            // Merge allocations to mappedItems by cart_item_id or product id
            mappedItems = mappedItems.map(ci => {
              // Find matching allocation
              const found = allocations.find(a =>
                (a.cart_item_id && Number(a.cart_item_id) === Number(ci.cartItemId)) ||
                (a.cart_item_id && Number(a.cart_item_id) === Number(ci.id)) ||
                (a.product_id && Number(a.product_id) === Number(ci.id)) ||
                (a.product_id && Number(a.product_id) === Number(ci.cartItemId))
              );

              if (found) {
                const transporter = mapAllocToTransporter(found, ci);
                return {
                  ...ci,
                  transporter: transporter
                };
              }
              return ci;
            });
          }
        } catch (allocErr) {
          // If allocations fetch fails, continue without transporters
          console.warn('Could not fetch transport allocations:', allocErr?.message || allocErr);
        }

        setCartItems(mappedItems);
      }
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to fetch cart items');
      // Fallback to localStorage if API call fails
      const savedCart = localStorage.getItem('agrovia-cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user, getAuthHeaders]);
  
  // Load cart from API or localStorage on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      // If user is not logged in, use localStorage
      const savedCart = localStorage.getItem('agrovia-cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, [user, fetchCartItems]);
  
  // Save cart to localStorage as a backup whenever it changes
  useEffect(() => {
    localStorage.setItem('agrovia-cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = async (product, quantity = 1) => {
    try {
      if (user) {
        // Add to database if user is logged in
        const response = await axios.post(`${API_URL}/cart`, {
          productId: product.id,
          quantity,
          productName: product.name,
          priceAtAddTime: product.price,
          productUnit: product.unit,
          farmerName: product.farmer,
          location: product.district || product.location, // Use district if available, fallback to location
          productImage: product.image
        }, {
          headers: getAuthHeaders()
        });
        
        if (response.data.success) {
          // Refetch cart items to get the updated list from server
          fetchCartItems();
        }
      } else {
        // Add to local state if user is not logged in
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id);
          
          if (existingItem) {
            // Update quantity if item already exists
            return prevItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item to cart
            return [...prevItems, {
              id: product.id,
              name: product.name,
              price: product.price,
              unit: product.unit,
              farmer: product.farmer,
              location: product.district || product.location, // Use district if available, fallback to location
              image: product.image,
              quantity: quantity,
              addedAt: new Date().toISOString()
            }];
          }
        });
      }
      
      console.log(`Added ${quantity} ${product.unit} of ${product.name} to cart`);
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError('Failed to add item to cart');
      
      // Add to local state as fallback if API call fails
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevItems, {
            id: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            farmer: product.farmer,
            district: product.district || product.location,
            image: product.image,
            quantity: quantity,
            addedAt: new Date().toISOString()
          }];
        }
      });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user) {
        // Find the cartItemId for the product
        const cartItem = cartItems.find(item => item.id === productId);
        if (cartItem && cartItem.cartItemId) {
          // Remove from database if user is logged in
          await axios.delete(`${API_URL}/cart/${cartItem.cartItemId}`, {
            headers: getAuthHeaders()
          });
          
          // Refetch cart items to get the updated list from server
          fetchCartItems();
        }
      }
      
      // Always update local state
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Failed to remove item from cart');
      
      // Remove from local state as fallback if API call fails
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }
  };
  
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    try {
      if (user) {
        // Find the cartItemId for the product
        const cartItem = cartItems.find(item => item.id === productId);
        if (cartItem && cartItem.cartItemId) {
          // Update quantity in database if user is logged in
          await axios.put(`${API_URL}/cart/${cartItem.cartItemId}`, {
            quantity: newQuantity
          }, {
            headers: getAuthHeaders()
          });
          
          // Refetch cart items to get the updated list from server
          fetchCartItems();
        }
      }
      
      // Always update local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error('Error updating cart item quantity:', err);
      setError('Failed to update item quantity');
      
      // Update local state as fallback if API call fails
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };
  
  const clearCart = async () => {
    try {
      if (user) {
        // Clear cart in database if user is logged in
        await axios.delete(`${API_URL}/cart`, {
          headers: getAuthHeaders()
        });
      }
      
      // Always update local state
      setCartItems([]);
      // Refresh cart items from server to confirm empty
      if (user) {
        fetchCartItems();
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
      
      // Clear local state as fallback if API call fails
      setCartItems([]);
    }
  };
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Synchronize localStorage cart with database when user logs in
  const syncCartWithDatabase = async () => {
    if (!user) return;
    
    const savedCart = localStorage.getItem('agrovia-cart');
    if (savedCart) {
      try {
        const localCartItems = JSON.parse(savedCart);
        
        // Add each local cart item to the database
        for (const item of localCartItems) {
          await axios.post(`${API_URL}/cart`, {
            productId: item.id,
            quantity: item.quantity,
            productName: item.name,
            priceAtAddTime: item.price,
            productUnit: item.unit,
            farmerName: item.farmer,
            district: item.district || item.location,
            productImage: item.image
          }, {
            headers: getAuthHeaders()
          });
        }
        
        // Clear localStorage cart after syncing
        localStorage.removeItem('agrovia-cart');
        
        // Fetch updated cart from database
        fetchCartItems();
      } catch (error) {
        console.error('Error syncing cart with database:', error);
      }
    }
  };
  
  // Call this function when user logs in
  useEffect(() => {
    if (user) {
      syncCartWithDatabase();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Validate input coordinates
    const numLat1 = parseFloat(lat1);
    const numLon1 = parseFloat(lon1);
    const numLat2 = parseFloat(lat2);
    const numLon2 = parseFloat(lon2);
    
    if (isNaN(numLat1) || isNaN(numLon1) || isNaN(numLat2) || isNaN(numLon2)) {
      console.error('Invalid coordinates provided to calculateDistance:', { lat1, lon1, lat2, lon2 });
      return 0; // Return 0 for invalid coordinates
    }
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (numLat2 - numLat1) * Math.PI / 180;
    const dLon = (numLon2 - numLon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(numLat1 * Math.PI / 180) * Math.cos(numLat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
  };

  // Calculate transport cost using the provided formula
  const calculateTransportCost = (distance, weight, transporter) => {
    // Default rates if not provided by transporter
    const baseRate = transporter.baseRate || 500; // LKR
    const perKmRate = transporter.perKmRate || 25; // LKR per km
    const weightMultiplier = Math.max(1, weight / 100); // Scale weight factor (per 100kg)
    
    const deliveryFee = (baseRate + (distance * perKmRate)) * weightMultiplier;
    return Math.round(deliveryFee * 100) / 100; // Round to 2 decimal places
  };

  // Add transport to cart item
  const addTransportToCartItem = (itemId, transporter, userCoordinates, itemCoordinates) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          let transportCost = transporter.baseRate || 500; // Default base rate
          let distance = 0;
          
          // Calculate distance and cost if coordinates are available and valid
          if (userCoordinates && itemCoordinates && 
              userCoordinates.latitude && userCoordinates.longitude &&
              itemCoordinates.latitude && itemCoordinates.longitude) {
            
            const userLat = parseFloat(userCoordinates.latitude);
            const userLon = parseFloat(userCoordinates.longitude);
            const itemLat = parseFloat(itemCoordinates.latitude);
            const itemLon = parseFloat(itemCoordinates.longitude);
            
            // Only calculate if all coordinates are valid numbers
            if (!isNaN(userLat) && !isNaN(userLon) && !isNaN(itemLat) && !isNaN(itemLon)) {
              distance = calculateDistance(userLat, userLon, itemLat, itemLon);
              
              // Estimate weight based on quantity (assuming 1kg per unit as default)
              const estimatedWeight = item.quantity * (item.weightPerUnit || 1);
              transportCost = calculateTransportCost(distance, estimatedWeight, transporter);
            }
          }
          
          return {
            ...item,
            transporter: {
              ...transporter,
              name: transporter.full_name || transporter.name,
              vehicle: `${transporter.vehicle_type} (${transporter.vehicle_number})`,
              phone: transporter.phone_number,
              district: transporter.district,
              distance: distance,
              cost: transportCost,
              baseRate: transporter.baseRate || 500,
              perKmRate: transporter.perKmRate || 25
            }
          };
        }
        return item;
      })
    );
  };

  // Remove transport from cart item
  const removeTransportFromCartItem = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const { transporter, ...itemWithoutTransporter } = item;
          return itemWithoutTransporter;
        }
        return item;
      })
    );
  };

  // Get cart total including transport costs
  const getCartTotalWithTransport = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const transportCost = item.transporter ? item.transporter.cost : 0;
      return total + itemTotal + transportCost;
    }, 0);
  };

  // Get total transport cost
  const getTotalTransportCost = () => {
    return cartItems.reduce((total, item) => {
      const transportCost = item.transporter ? item.transporter.cost : 0;
      return total + transportCost;
    }, 0);
  };
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartTotalWithTransport,
    getTotalTransportCost,
    getCartItemCount,
    isCartOpen,
    setIsCartOpen,
    loading,
    error,
    addTransportToCartItem,
    removeTransportFromCartItem,
    calculateDistance,
    calculateTransportCost
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
