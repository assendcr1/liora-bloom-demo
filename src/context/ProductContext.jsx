import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    const { data, error } = await supabase.from("products").insert([product]).select();
    if (error) throw error;
    setProducts([data[0], ...products]);
  };

  const updateProduct = async (id, updates) => {
    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select();
    if (error) throw error;
    setProducts(products.map(p => p.id === id ? data[0] : p));
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    setProducts(products.filter(p => p.id !== id));
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);