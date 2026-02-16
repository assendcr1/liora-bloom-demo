import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

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

  /**
   * Updated addToCart:
   * @param {Object} product - The base product from Supabase
   * @param {Array} selectedAddons - Array of addon objects {id, name, price}
   */
  const addToCart = (product, selectedAddons = []) => {
    setCart((prev) => {
      // Calculate the total for just the addons
      const addonTotal = selectedAddons.reduce((sum, addon) => sum + Number(addon.price), 0);
      
      // Determine the base price (handling sale prices)
      const basePrice = product.sale_price && product.sale_price > 0 
        ? Number(product.sale_price) 
        : Number(product.price);

      // Create a unique item entry
      const cartItem = {
        ...product,
        cartItemId: crypto.randomUUID(), // Ensures items with different addons are unique
        selectedAddons: selectedAddons,
        basePrice: basePrice,
        itemTotal: basePrice + addonTotal
      };
      
      return [...prev, cartItem];
    });
    
    // Optional: Open the cart sidebar automatically when an item is added
    setCartOpen(true);
  };

  /**
   * Updated removeFromCart:
   * Uses cartItemId instead of product.id to ensure we remove the specific selection
   */
  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  /**
   * Updated Total:
   * Sums up the pre-calculated itemTotal (base + addons) for every item in cart
   */
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