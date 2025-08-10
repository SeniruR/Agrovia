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
        setCartItems(response.data.data.map(item => ({
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
        })));
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
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isCartOpen,
    setIsCartOpen,
    loading,
    error
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
