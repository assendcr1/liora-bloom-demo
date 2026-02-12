// src/pages/admin/Products.jsx
import { useState } from "react";
import { Plus, Edit, Trash2, X, Upload, Loader2 } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { supabase } from "../../lib/supabase";

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [editing, setEditing] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `bouquets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setEditing(prev => ({
        ...prev,
        gallery: [data.publicUrl]
      }));

    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image: " + err.message);
    } finally {
      // Small delay ensures state is fully committed before unlocking button
      setTimeout(() => setIsUploading(false), 300);
    }
  };

  const handleSave = async () => {
    if (!editing.name || !editing.price) return alert("Required: Name & Price");
    
    try {
      setIsSaving(true);
      
      const payload = {
        name: editing.name,
        price: parseFloat(editing.price),
        category: editing.category || "General",
        popular: Boolean(editing.popular),
        gallery: Array.isArray(editing.gallery) ? editing.gallery : []
      };

      if (editing.id) {
        await updateProduct(editing.id, payload);
      } else {
        await addProduct(payload);
      }
      
      setEditing(null);
      alert("Bouquet saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-serif italic text-stone-400">Opening the Boutique...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-stone-50/20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif italic mb-2 text-stone-900">Inventory</h1>
          <p className="text-stone-400 text-[10px] uppercase tracking-[0.3em] font-black">Liora Blooms Admin</p>
        </div>
        <button
          onClick={() => setEditing({ name: "", price: "", category: "", gallery: [], popular: false })}
          className="bg-stone-900 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex gap-2 hover:bg-[#c5a059] transition-all shadow-xl"
        >
          <Plus size={14} /> Add New Bouquet
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 text-stone-400 text-[10px] uppercase tracking-widest font-black">
            <tr>
              <th className="p-8 text-left">Bouquet</th>
              <th className="p-8 text-left">Category</th>
              <th className="p-8 text-center">Price</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50/30 transition-colors">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                      {p.gallery?.[0] && (
                        <img 
                          src={p.gallery[0]} 
                          alt={p.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-bold text-stone-900 uppercase tracking-tight">{p.name}</span>
                  </div>
                </td>
                <td className="p-8 text-[10px] uppercase font-bold text-stone-400">{p.category}</td>
                <td className="p-8 text-center font-serif italic">R {p.price}</td>
                <td className="p-8 text-right space-x-2">
                  <button onClick={() => setEditing(p)} className="p-3 bg-stone-50 hover:bg-stone-900 hover:text-white rounded-full transition-all"><Edit size={14}/></button>
                  <button onClick={() => deleteProduct(p.id)} className="p-3 bg-stone-50 hover:bg-red-500 hover:text-white rounded-full transition-all"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-10 border-b flex justify-between items-center">
              <h2 className="text-3xl font-serif italic">{editing.id ? "Edit Bouquet" : "New Bouquet"}</h2>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-stone-100 rounded-full"><X size={24}/></button>
            </div>
            
            <div className="p-10 space-y-8">
              {/* Image Preview & Upload */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-40 h-40 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 overflow-hidden relative group">
                  {editing.gallery?.[0] ? (
                    <img src={editing.gallery[0]} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
                      <Upload size={32} strokeWidth={1} />
                      <span className="text-[10px] uppercase tracking-widest mt-2 font-bold">No Image</span>
                    </div>
                  )}
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#c5a059]" />
                    </div>
                  )}
                </div>
                
                <label className="mt-4 cursor-pointer">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-stone-100 px-4 py-2 rounded-full hover:bg-stone-200 transition-colors">
                    {isUploading ? "Uploading..." : editing.gallery?.[0] ? "Change Photo" : "Upload Photo"}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading || isSaving} />
                </label>
              </div>

              <div className="space-y-6">
                <input 
                  placeholder="Bouquet Name" 
                  value={editing.name} 
                  onChange={e => setEditing({...editing, name: e.target.value})} 
                  className="w-full border-b py-3 outline-none text-xl font-serif italic" 
                />
                <div className="grid grid-cols-2 gap-6">
                  <input 
                    placeholder="Price (R)" 
                    type="number" 
                    value={editing.price} 
                    onChange={e => setEditing({...editing, price: e.target.value})} 
                    className="border-b py-3 outline-none" 
                  />
                  <input 
                    placeholder="Category" 
                    value={editing.category} 
                    onChange={e => setEditing({...editing, category: e.target.value})} 
                    className="border-b py-3 outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="p-10 border-t bg-stone-50/50 flex justify-end gap-6">
              <button 
                onClick={() => setEditing(null)} 
                className="text-[10px] uppercase font-black tracking-widest text-stone-400 hover:text-stone-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving || isUploading} 
                className={`bg-stone-900 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  (isSaving || isUploading) ? "opacity-50 cursor-not-allowed" : "hover:bg-[#c5a059]"
                }`}
              >
                {isSaving ? "Syncing..." : isUploading ? "Finalizing Image..." : "Save Bouquet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}