import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    subscribe: false,
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const success = await signup(form);

    if (success) {
      navigate("/account");
    } else {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#faf9f6] px-6">
      <div className="bg-white rounded-[3rem] shadow-2xl p-14 max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="font-serif italic text-3xl inline-block mb-6 hover:text-#c5a059400 transition-colors">
            Liora Bloom
          </Link>
          <h2 className="text-4xl font-light italic font-serif">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            placeholder="Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border-b border-stone-300 py-4 outline-none focus:border-#c5a059 transition-colors bg-transparent"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border-b border-stone-300 py-4 outline-none focus:border-#c5a059 transition-colors bg-transparent"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border-b border-stone-300 py-4 outline-none focus:border-#c5a059 transition-colors bg-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border-b border-stone-300 py-4 outline-none focus:border-#c5a059 transition-colors bg-transparent"
          />

          <label className="flex items-center gap-3 text-sm text-stone-500 cursor-pointer">
            <input
              type="checkbox"
              checked={form.subscribe}
              onChange={(e) => setForm({ ...form, subscribe: e.target.checked })}
              className="accent-stone-900 w-4 h-4"
            />
            Subscribe to Bloom Letter
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-#c5a059400 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>

        <div className="mt-10 text-center text-sm">
          <Link to="/login" className="underline text-stone-500 hover:text-stone-800">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}