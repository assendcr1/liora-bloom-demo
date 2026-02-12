// src/pages/admin/Users.jsx
import { useState, useEffect } from "react";
import { Plus, Trash2, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // Fetch only users with admin or staff roles from lowercase 'profiles'
  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles") // Match lowercase DB table
        .select("*")
        .in("role", ["admin", "staff"]) 
        .order("full_name", { ascending: true }); // Order by full_name column

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching admin users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const saveUser = async () => {
    try {
      const { error } = await supabase
        .from("profiles") // Match lowercase DB table
        .update({
          full_name: editing.full_name, // Update full_name
          role: editing.role,
        })
        .eq("id", editing.id);

      if (error) throw error;
      setEditing(null);
      fetchAdminUsers();
    } catch (err) {
      alert("Error updating user role");
    }
  };

  const removeAdminAccess = async (id) => {
    if (!window.confirm("Remove administrative access for this user?")) return;
    try {
      const { error } = await supabase
        .from("profiles") // Match lowercase DB table
        .update({ role: 'user' })
        .eq("id", id);
      
      if (error) throw error;
      fetchAdminUsers();
    } catch (err) {
      alert("Error removing access");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-light italic font-serif">Administrative Users</h1>
      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-5">Admin Name</th>
              <th className="p-5">Email</th>
              <th className="p-5 text-center">Role</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-#c5a059400" />
                    <span className="font-medium">{u.full_name || "Unnamed"}</span>
                  </div>
                </td>
                <td className="p-5 text-stone-500">{u.email}</td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter ${
                    u.role === 'admin' ? 'bg-black text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setEditing(u)}
                      className="text-stone-400 hover:text-black underline text-xs"
                    >
                      Change Role
                    </button>
                    <button
                      onClick={() => removeAdminAccess(u.id)}
                      className="text-#c5a059300 hover:text-#c5a059"
                      title="Revoke Admin Access"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <div className="p-10 text-center text-stone-400">No administrative users found.</div>
        )}
      </div>

      {/* MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-10 w-[420px]">
            <h2 className="text-xl mb-6 font-serif italic">Edit Access</h2>
            
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Display Name</p>
            <input
              value={editing.full_name || ""}
              onChange={(e) => setEditing({ ...editing, full_name: e.target.value })}
              className="w-full border-b py-3 mb-6 outline-none focus:border-black"
            />

            <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Permissions</p>
            <select
              value={editing.role}
              onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              className="w-full border-b py-3 mb-8 outline-none bg-transparent"
            >
              <option value="admin">Full Admin</option>
              <option value="staff">Staff (Limited)</option>
            </select>

            <div className="flex justify-end gap-4">
              <button onClick={() => setEditing(null)} className="text-sm">Cancel</button>
              <button
                onClick={saveUser}
                className="bg-stone-900 text-white px-8 py-2 rounded-full text-sm"
              >
                Update Access
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}