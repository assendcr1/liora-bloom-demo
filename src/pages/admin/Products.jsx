import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useProducts } from "../../context/ProductContext";

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [editing, setEditing] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editing.name || !editing.price) return alert("Required: Name & Price");
    
    try {
      setIsSaving(true);
      
      const payload = {
        name: editing.name,
        price: parseFloat(editing.price),
        category: editing.category || "General",
        popular: Boolean(editing.popular),
        gallery: typeof editing.gallery === 'string' 
          ? editing.gallery.split(',').map(s => s.trim()).filter(Boolean) 
          : Array.isArray(editing.gallery) ? editing.gallery : []
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
          <h1 className="text-4xl font-serif italic mb-2">Inventory</h1>
          <p className="text-stone-400 text-[10px] uppercase tracking-[0.3em] font-black">Liora Blooms Admin</p>
        </div>
        <button
          onClick={() => setEditing({ name: "", price: "", category: "", gallery: "", popular: false })}
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
                      {p.gallery?.[0] && <img src={p.gallery[0]} className="w-full h-full object-cover"/>}
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
            <div className="p-10 space-y-6">
              <input placeholder="Bouquet Name" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full border-b py-3 outline-none text-xl font-serif italic" />
              <div className="grid grid-cols-2 gap-6">
                <input placeholder="Price (R)" type="number" value={editing.price} onChange={e => setEditing({...editing, price: e.target.value})} className="border-b py-3 outline-none" />
                <input placeholder="Category" value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})} className="border-b py-3 outline-none" />
              </div>
              <textarea placeholder="Image URLs (comma separated)" value={Array.isArray(editing.gallery) ? editing.gallery.join(', ') : editing.gallery} onChange={e => setEditing({...editing, gallery: e.target.value})} className="w-full border p-4 rounded-xl h-32 text-xs font-mono bg-stone-50" />
            </div>
            <div className="p-10 border-t bg-stone-50/50 flex justify-end gap-6">
              <button onClick={() => setEditing(null)} className="text-[10px] uppercase font-black tracking-widest text-stone-400">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="bg-stone-900 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                {isSaving ? "Syncing..." : "Save Bouquet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}