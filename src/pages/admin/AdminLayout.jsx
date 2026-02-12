// src/pages/admin/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#faf9f6] flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r px-6 py-10">
        <h2 className="font-serif italic text-2xl mb-10">
          Liora Admin
        </h2>

        <nav className="space-y-4 text-sm uppercase tracking-widest font-bold">
          <Link to="/admin" className="block hover:text-#c5a059">
            Dashboard
          </Link>
          <Link to="/admin/products" className="block hover:text-#c5a059">
            Products
          </Link>
          <Link to="/admin/orders" className="block hover:text-#c5a059">
            Orders
          </Link>
          <Link to="/admin/customers" className="block hover:text-#c5a059">
            Customers
          </Link>
          <Link to="/admin/users" className="block hover:text-#c5a059">
            Users
          </Link>
          <Link to="/admin/promotions" className="block hover:text-#c5a059">
            Promotions
          </Link>
          <Link to="/admin/reports" className="block hover:text-#c5a059">
            Reports
          </Link>

          <button
            onClick={logout}
            className="mt-10 text-left text-red-500 hover:underline"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 px-10 py-12">
        <Outlet />
      </main>
    </div>
  );
}
