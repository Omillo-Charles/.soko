"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  shop?: {
    name: string;
  };
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

  const fetchCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/carts`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCartItems(data.data.items);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId: string, quantity = 1, size?: string, color?: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/carts/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity, size, color })
      });
      const data = await response.json();
      if (data.success) {
        setCartItems(data.data.items);
        toast.success("Item added to cart");
      } else {
        toast.error(data.message || data.error || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const removeFromCart = async (itemId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/carts/item/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCartItems(data.data.items);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/carts/item/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      const data = await response.json();
      if (data.success) {
        setCartItems(data.data.items);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/carts/clear`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isLoading, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      subtotal,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
