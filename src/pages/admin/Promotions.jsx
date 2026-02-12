// src/pages/admin/Promotions.jsx
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminPromotions() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromos(data || []);
    } catch (err) {
      console.error("Error fetching promos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const savePromo = async () => {
    try {
      const payload = {
        code: editing.code.toUpperCase().trim(),
        type: editing.type,
        value: Number(editing.value),
        active: editing.active,
        expires: editing.expires || null,
      };

      let error;
      if (editing.id) {
        // Update existing
        const { error: err } = await supabase
          .from("promotions")
          .update(payload)
          .eq("id", editing.id);
        error = err;
      } else {
        // Insert new
        const { error: err } = await supabase
          .from("promotions")
          .insert(payload);
        error = err;
      }

      if (error) throw error;
      setEditing(null);
      fetchPromos();
    } catch (err) {
      alert(err.message || "Error saving promotion");
    }
  };

  const deletePromo = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw error;
      fetchPromos();
    } catch (err) {
      alert("Error deleting promotion");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-light italic font-serif">
          Promotions
        </h1>
        <button
          onClick={() =>
            setEditing({
              code: "",
              type: "Percentage",
              value: 0,
              active: true,
              expires: "",
            })
          }
          className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest"
        >
          <Plus size={14} />
          New Coupon
        </button>
      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-5">Code</th>
              <th className="p-5">Discount</th>
              <th className="p-5">Expires</th>
              <th className="p-5 text-center">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-5 font-bold tracking-widest">{p.code}</td>
                <td className="p-5 text-stone-500">
                  {p.type === "Percentage" ? `${p.value}%` : `R ${p.value}`}
                </td>
                <td className="p-5 text-stone-400">
                  {p.expires ? new Date(p.expires).toLocaleDateString() : "Never"}
                </td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase ${
                    p.active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {p.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setEditing(p)}
                      className="text-stone-400 hover:text-black underline text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePromo(p.id)}
                      className="text-#c5a059300 hover:text-#c5a059"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {promos.length === 0 && !loading && (
          <div className="p-10 text-center text-stone-400">No coupons found.</div>
        )}
      </div>

      {/* MODAL (Untouched Design) */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-10 w-[420px]">
            <h2 className="text-xl mb-6 font-serif italic">Coupon Details</h2>

            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Coupon Code</p>
            <input
              placeholder="e.g. SAVE20"
              value={editing.code}
              onChange={(e) =>
                setEditing({ ...editing, code: e.target.value })
              }
              className="w-full border-b py-3 mb-4 outline-none focus:border-black uppercase"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Type</p>
                <select
                  value={editing.type}
                  onChange={(e) =>
                    setEditing({ ...editing, type: e.target.value })
                  }
                  className="w-full border-b py-3 outline-none bg-transparent"
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Value</p>
                <input
                  type="number"
                  placeholder="Value"
                  value={editing.value}
                  onChange={(e) =>
                    setEditing({ ...editing, value: e.target.value })
                  }
                  className="w-full border-b py-3 outline-none focus:border-black"
                />
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Expiry Date</p>
            <input
              type="date"
              value={editing.expires || ""}
              onChange={(e) =>
                setEditing({ ...editing, expires: e.target.value })
              }
              className="w-full border-b py-3 mb-8 outline-none focus:border-black"
            />

            <div className="flex justify-end gap-4">
              <button onClick={() => setEditing(null)} className="text-sm">Cancel</button>
              <button
                onClick={savePromo}
                className="bg-stone-900 text-white px-8 py-2 rounded-full text-sm"
              >
                Save Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}