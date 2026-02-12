import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ProductContext = createContext(null);
export const useProducts = () => useContext(ProductContext);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("🚨 Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (payload) => {
    const { id, created_at, ...newProduct } = payload;
    const { data, error } = await supabase.from("products").insert([newProduct]).select();
    if (error) throw error;
    setProducts((prev) => [data[0], ...prev]);
    return data[0];
  };

  const updateProduct = async (id, payload) => {
    const { id: _, created_at, ...updates } = payload;
    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select();
    if (error) throw error;
    setProducts((prev) => prev.map((p) => (p.id === id ? data[0] : p)));
    return data[0];
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}