// src/pages/admin/Customers.jsx
import { useState, useEffect } from "react";
import { Trash2, User } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // Fetch from the 'profiles' table (lowercase)
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles") 
        .select("*")
        .eq("role", "user") // Only show standard customers
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const saveCustomer = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editing.full_name, // Match DB column 'full_name'
          email: editing.email,
          phone: editing.phone,
        })
        .eq("id", editing.id);

      if (error) throw error;
      setEditing(null);
      fetchCustomers();
    } catch (err) {
      alert("Error saving customer details");
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure? This will remove the profile record.")) return;
    try {
      // Note: This deletes the Profile row, not the Supabase Auth User
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
      fetchCustomers();
    } catch (err) {
      alert("Error deleting customer");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-light italic font-serif">Customers</h1>
      </div>

      <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 text-xs uppercase tracking-widest text-stone-400">
            <tr>
              <th className="p-5">Customer</th>
              <th className="p-5">Contact Details</th>
              <th className="p-5 text-center">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-stone-800">{c.full_name || "Unnamed"}</p>
                      <p className="text-[10px] text-stone-400 font-mono uppercase tracking-tighter">
                        {c.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <p className="text-stone-600">{c.email}</p>
                  <p className="text-stone-400 text-xs">{c.phone || "No phone provided"}</p>
                </td>
                <td className="p-5 text-center">
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Active
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setEditing(c)}
                      className="text-stone-400 hover:text-black underline text-xs transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCustomer(c.id)}
                      className="text-#c5a059200 hover:text-#c5a059 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && !loading && (
          <div className="p-20 text-center">
            <p className="text-stone-400 font-serif italic text-lg">No customers found.</p>
            <p className="text-stone-300 text-xs uppercase tracking-widest mt-2">New signups will appear here.</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-stone-900/40 z-[60] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-serif italic mb-8">Edit Customer</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Full Name</label>
                <input
                  value={editing.full_name || ""}
                  onChange={(e) => setEditing({ ...editing, full_name: e.target.value })}
                  className="w-full border-b py-2 outline-none focus:border-#c5a059400 transition-colors"
                />
              </div>
              
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Email Address</label>
                <input
                  value={editing.email || ""}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  className="w-full border-b py-2 outline-none focus:border-#c5a059400 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Phone Number</label>
                <input
                  value={editing.phone || ""}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  className="w-full border-b py-2 outline-none focus:border-#c5a059400 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-6 mt-10 items-center">
              <button 
                onClick={() => setEditing(null)} 
                className="text-xs uppercase tracking-widest font-bold text-stone-400 hover:text-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomer}
                className="bg-stone-900 text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-black hover:bg-#c5a059 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}