import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("liora_blooms_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("liora_blooms_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedAddons = []) => {
    setCart((prev) => {
      const addonTotal = selectedAddons.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
      const basePrice = product.sale_price && product.sale_price > 0 
        ? Number(product.sale_price) 
        : Number(product.price);

      const cartItem = {
        ...product,
        cartItemId: crypto.randomUUID(), // Unique ID for every specific selection
        selectedAddons: selectedAddons,
        basePrice: basePrice,
        itemTotal: basePrice + addonTotal
      };
      
      return [...prev, cartItem];
    });
    setCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  // Calculate total locally so it updates instantly
  const cartTotal = cart.reduce((acc, item) => acc + (item.itemTotal || 0), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      cartTotal,
      cartOpen,
      setCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};