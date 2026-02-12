// src/pages/user/UserProfile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({ 
        name: user.name || "", 
        phone: user.phone || "", 
        email: user.email || "" 
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Updated to match your DB: 'profiles' table and 'full_name' column
      const { error } = await supabase
        .from("profiles")
        .update({ 
          full_name: profile.name, 
          phone: profile.phone 
        })
        .eq("id", user.id);

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-serif italic mb-10">Account Settings</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-stone-400">Full Name</label>
          <input 
            className="w-full border-b py-3 outline-none focus:border-#c5a059300 transition-colors bg-transparent"
            value={profile.name}
            onChange={e => setProfile({...profile, name: e.target.value})}
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-stone-400">Email (Private)</label>
          <input 
            className="w-full border-b py-3 outline-none text-stone-400 bg-transparent"
            value={profile.email}
            disabled
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-stone-400">Phone Number</label>
          <input 
            className="w-full border-b py-3 outline-none focus:border-#c5a059300 transition-colors bg-transparent"
            value={profile.phone}
            onChange={e => setProfile({...profile, phone: e.target.value})}
          />
        </div>
        <button 
          className="bg-stone-900 text-white w-full py-4 rounded-full uppercase text-xs tracking-[0.2em] hover:bg-#c5a059400 transition-colors mt-8"
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}