import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // Import the client to check connection

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [didLogin, setDidLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // SAFETY CHECK: If Supabase failed to initialize
    if (!supabase) {
      alert("❌ Database connection error: Check your .env file and restart your terminal.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await login(email, password);

      if (!result) {
        alert("Invalid login credentials");
        setSubmitting(false);
        return;
      }

      setDidLogin(true);
    } catch (err) {
      console.error("Login attempt failed:", err);
      alert("An unexpected error occurred during login.");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * ✅ Redirect logic: Sends admins to /admin and customers to /account
   */
  useEffect(() => {
    if (loading) return;
    if (!didLogin) return;
    if (!user) return;

    if (user.role === "admin" || user.role === "staff") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/account", { replace: true });
    }
  }, [didLogin, user, loading, navigate]);

  return (
    <section className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#faf9f6] px-6">
      <div className="bg-white rounded-[3rem] shadow-2xl p-14 max-w-md w-full text-center">
        <Link
          to="/"
          className="font-serif italic text-3xl inline-block mb-6 hover:text-[#c5a059] transition-colors"
        >
          Liora Blooms
        </Link>

        <h2 className="text-4xl font-light italic font-serif mb-10 text-stone-900">
          Sign In
        </h2>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="text-left">
            <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-stone-300 py-4 outline-none focus:border-[#c5a059] transition-colors bg-transparent"
            />
          </div>

          <div className="text-left">
            <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-stone-300 py-4 outline-none focus:border-[#c5a059] transition-colors bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-stone-900 text-white py-5 rounded-full text-xs font-black uppercase tracking-widest disabled:opacity-60 hover:bg-[#c5a059] transition-all shadow-lg active:scale-95"
          >
            {submitting ? "Verifying..." : "Continue"}
          </button>
        </form>

        <div className="mt-10 text-sm space-y-3">
          <Link to="/signup" className="underline block text-stone-400 hover:text-stone-800 transition-colors">
            Don’t have an account? Create one
          </Link>
          <Link to="/collections" className="underline block text-stone-400 hover:text-stone-800 transition-colors">
            Back to shop
          </Link>
        </div>
      </div>
    </section>
  );
}