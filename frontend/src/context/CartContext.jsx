import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '../api/apiClient';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    
    try {
      const res = await apiClient('/cart');
      
      if (res.ok) {
        const cartData = await res.json();
        
        const itemsList = cartData.items || [];
        const populatedItems = await Promise.all(itemsList.map(async (item) => {
          // Products are now public — no auth header needed
          const prodRes = await fetch(`http://localhost:8080/products/${item.productId}`);
          if (prodRes.ok) {
            const prodData = await prodRes.json();
            return {
              cartItemId: item.id,
              id: item.productId,
              name: prodData.name,
              price: Number(prodData.price),
              image: prodData.imageUrl,
              category: prodData.categoryId ? `Category ${prodData.categoryId}` : 'Uncategorized',
              quantity: item.quantity,
            };
          }
          return null;
        }));
        
        setCartItems(populatedItems.filter(Boolean));
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please log in to add items to your cart.' };
    }
    try {
      const res = await apiClient('/cart-items', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
        })
      });
      if (res.ok) {
        await fetchCart();
        return { success: true };
      } else {
        // Surface the real error from the backend
        let errorMsg = 'Failed to add item to cart.';
        try {
          const errData = await res.json();
          if (errData.error) errorMsg = errData.error;
        } catch (_) {}
        console.error('POST /cart-items failed:', errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    try {
      const res = await apiClient(`/cart-items/${item.cartItemId}`, {
        method: 'DELETE'
      });
      if (res.ok || res.status === 204) {
        setCartItems(prev => prev.filter(i => i.id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated || quantity < 1) return;
    
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    try {
      const res = await apiClient(`/cart-items/${item.cartItemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      if (res.ok) {
        setCartItems(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i));
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiClient('/cart', {
        method: 'DELETE'
      });
      if (res.ok || res.status === 204) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const resetCartLocal = () => {
    setCartItems([]);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    resetCartLocal,
    fetchCart,
    cartItemCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
