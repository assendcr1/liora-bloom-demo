import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const result = await supabase.from("products").insert([product]).select();
    if (result.error) throw result.error;
    if (result.data) setProducts([result.data[0], ...products]);
    return result; 
  };

  const updateProduct = async (id, updates) => {
    const result = await supabase.from("products").update(updates).eq("id", id).select();
    if (result.error) throw result.error;
    if (result.data) setProducts(products.map(p => p.id === id ? result.data[0] : p));
    return result;
  };

  const deleteProduct = async (id) => {
    const result = await supabase.from("products").delete().eq("id", id);
    if (result.error) throw result.error;
    setProducts(products.filter(p => p.id !== id));
    return result;
  };

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);