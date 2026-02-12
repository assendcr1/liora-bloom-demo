import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wrapped in useCallback to prevent Vercel/Linting dependency errors
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (product) => {
    const { data, error } = await supabase.from("products").insert([product]).select();
    if (error) throw error;
    if (data) setProducts([data[0], ...products]);
  };

  const updateProduct = async (id, updates) => {
    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select();
    if (error) throw error;
    if (data) setProducts(products.map(p => p.id === id ? data[0] : p));
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    setProducts(products.filter(p => p.id !== id));
  };

  useEffect(() => { 
    fetchProducts(); 
  }, [fetchProducts]); // fetchProducts is now a stable dependency

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);