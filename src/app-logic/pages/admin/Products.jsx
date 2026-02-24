import { useState } from "react";
import { Plus, Edit, Trash2, X, Upload, Loader2, ChevronDown } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { supabase } from "../../lib/supabase";

const CATEGORIES = ["Assorted Roses", "Red Roses", "Personalised", "Funeral Packages", "Luxury Boxes", "Bouquets"];
const OCCASIONS = ["Funeral", "Anniversary", "Birthday", "Sympathy", "Romance", "New Baby"];

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [editing, setEditing] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // FIX: Deep clean strings for UI (removes [" "] and JSON artifacts)
  const ensureString = (val) => {
    if (!val) return "";
    if (Array.isArray(val)) return val[0] || "";
    if (typeof val === 'string' && val.startsWith('[')) {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed[0] : val;
      } catch (e) {
        return val.replace(/[[\]"]/g, '').replace(/^"|"$/g, ''); 
      }
    }
    return val;
  };

  const ensureArray = (val) => {
    const str = ensureString(val);
    return str ? [str] : [];
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || isUploading) return;
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `bouquets/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      
      setEditing(prev => ({
        ...prev,
        gallery: [data.publicUrl], // Reset gallery to new upload for simplicity
        images: [data.publicUrl]
      }));
    } catch (err) { alert(err.message); } finally { setIsUploading(false); }
  };

  const handleSave = async () => {
    if (!editing.name || !editing.price) return alert("Name and Price required");
    try {
      setIsSaving(true);
      const payload = {
        name: editing.name,
        description: editing.description || "",
        about: editing.about || "",
        care: editing.care || "",
        price: parseFloat(editing.price),
        sale_price: editing.sale_price ? parseFloat(editing.sale_price) : null,
        sku: editing.sku || "",
        stock: parseInt(editing.stock) || 0,
        popular: Boolean(editing.popular),
        category: ensureArray(editing.category),
        occasion: ensureArray(editing.occasion),
        gallery: ensureArray(editing.gallery || editing.images),
        images: ensureArray(editing.gallery || editing.images),
      };

      const res = editing.id ? await updateProduct(editing.id, payload) : await addProduct(payload);
      if (res?.error) throw res.error;
      setEditing(null);
    } catch (err) { alert(`Save Failed: ${err.message}`); } finally { setIsSaving(false); }
  };

  if (loading) return <div className="p-20 text-center font-serif italic text-stone-400">Loading Inventory...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-stone-50/20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif italic mb-2 text-stone-900">Inventory</h1>
          <p className="text-stone-400 text-[10px] uppercase tracking-[0.3em] font-black">Liora Bloom Administrative Suite</p>
        </div>
        <button onClick={() => setEditing({})} className="bg-stone-900 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex gap-2 hover:bg-[#c5a059] transition-all shadow-xl">
          <Plus size={14} /> Add New Arrangement
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 text-stone-400 text-[10px] uppercase tracking-widest font-black">
            <tr>
              <th className="p-8 text-left">Arrangement</th>
              <th className="p-8 text-left">Category</th>
              <th className="p-8 text-center">Stock</th>
              <th className="p-8 text-center">Price</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50/30 transition-colors group">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <img src={ensureString(p.gallery || p.images)} className="w-12 h-12 object-cover rounded-lg border border-stone-100" alt="" />
                    <span className="font-bold text-stone-900 uppercase tracking-tight">{p.name}</span>
                  </div>
                </td>
                <td className="p-8">
                  <span className="text-[10px] font-black uppercase text-stone-500 block">{ensureString(p.category)}</span>
                  <span className="text-[10px] italic text-stone-400">{ensureString(p.occasion)}</span>
                </td>
                <td className="p-8 text-center font-bold text-stone-600">{p.stock}</td>
                <td className="p-8 text-center font-serif italic text-lg text-[#c5a059]">R {p.price}</td>
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
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-6xl shadow-2xl relative overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-white">
              <h2 className="text-3xl font-serif italic">Arrangement Details</h2>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-stone-100 rounded-full"><X size={24}/></button>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10 max-h-[75vh] overflow-y-auto">
              <div className="space-y-6">
                <div className="aspect-square bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 overflow-hidden relative">
                  {ensureString(editing.gallery || editing.images) ? (
                    <img src={ensureString(editing.gallery || editing.images)} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-300"><Upload size={32} /></div>
                  )}
                  {isUploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-[#c5a059]" /></div>}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                </div>
                <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl">
                    <input type="checkbox" checked={editing.popular} onChange={e => setEditing({...editing, popular: e.target.checked})} className="accent-stone-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Featured Arrangement</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-8">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div className="col-span-2 border-b border-stone-100 pb-2">
                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Arrangement Name</label>
                    <input value={editing.name || ""} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full py-2 outline-none text-2xl font-serif italic text-stone-900" />
                  </div>
                  
                  <div className="border-b border-stone-100 pb-2">
                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Price (R)</label>
                    <input type="number" value={editing.price || ""} onChange={e => setEditing({...editing, price: e.target.value})} className="w-full py-2 outline-none text-lg font-serif italic" />
                  </div>

                  <div className="border-b border-stone-100 pb-2">
                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Stock</label>
                    <input type="number" value={editing.stock || ""} onChange={e => setEditing({...editing, stock: e.target.value})} className="w-full py-2 outline-none text-lg" />
                  </div>

                  <div className="border-b border-stone-100 pb-2 relative">
                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Category</label>
                    <select value={ensureString(editing.category)} onChange={e => setEditing({...editing, category: e.target.value})} className="w-full py-2 outline-none bg-transparent appearance-none">
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-0 bottom-3 text-stone-400 pointer-events-none" />
                  </div>

                  <div className="border-b border-stone-100 pb-2 relative">
                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Occasion</label>
                    <select value={ensureString(editing.occasion)} onChange={e => setEditing({...editing, occasion: e.target.value})} className="w-full py-2 outline-none bg-transparent appearance-none">
                      <option value="">Select Occasion</option>
                      {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-0 bottom-3 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                {/* Restored Text Areas */}
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-bold text-stone-400 uppercase block mb-2">Short Description</label>
                    <textarea value={editing.description || ""} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full bg-stone-50 rounded-2xl p-4 text-sm min-h-[80px] outline-none" placeholder="A brief overview of the flowers..." />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-stone-400 uppercase block mb-2">Detailed About</label>
                    <textarea value={editing.about || ""} onChange={e => setEditing({...editing, about: e.target.value})} className="w-full bg-stone-50 rounded-2xl p-4 text-sm min-h-[120px] outline-none" placeholder="The story behind this arrangement..." />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-stone-400 uppercase block mb-2">Care Instructions</label>
                    <textarea value={editing.care || ""} onChange={e => setEditing({...editing, care: e.target.value})} className="w-full bg-stone-50 rounded-2xl p-4 text-sm min-h-[100px] outline-none" placeholder="How to keep these blooms fresh..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t bg-stone-50 flex justify-end gap-6">
              <button onClick={() => setEditing(null)} className="text-[10px] uppercase font-black tracking-widest text-stone-400">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="bg-stone-900 text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] shadow-lg disabled:opacity-50 transition-all">
                {isSaving ? "Synchronizing..." : "Update Atelier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}