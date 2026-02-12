// src/pages/user/UserLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, ShoppingBag, Star, LogOut } from "lucide-react";

export default function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r px-8 py-12 hidden md:block">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">
            Welcome back,
          </p>
          <h2 className="font-serif italic text-2xl">{user?.name || "Member"}</h2>
        </div>

        <nav className="space-y-6 text-sm uppercase tracking-widest font-bold">
          <Link to="/account" className="flex items-center gap-3 hover:text-#c5a059 transition-colors">
            <User size={18} /> Profile
          </Link>
          <Link to="/account/orders" className="flex items-center gap-3 hover:text-#c5a059 transition-colors">
            <ShoppingBag size={18} /> My Orders
          </Link>
          <Link to="/account/reviews" className="flex items-center gap-3 hover:text-#c5a059 transition-colors">
            <Star size={18} /> My Reviews
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 mt-12 text-red-400 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-16">
        <Outlet />
      </main>
    </div>
  );
}