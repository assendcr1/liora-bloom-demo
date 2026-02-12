// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { ShoppingBag, Users, Flower, CreditCard } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const getCustomerCount = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true });
      setTotalCustomers(count || 0);
    };
    getCustomerCount();
  }, []);

  // Calculate real revenue from orders table
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  // Filter low stock directly from real product data
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 5);

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
    },
    {
      label: "Total Revenue",
      value: `R ${totalRevenue.toLocaleString()}`,
      icon: CreditCard,
    },
    {
      label: "Total Users",
      value: totalCustomers,
      icon: Users,
    },
    {
      label: "Total Products",
      value: products.length,
      icon: Flower,
    },
  ];

  return (
    <>
      <h1 className="text-4xl font-light italic font-serif mb-12">
        Dashboard
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-8 mb-16">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100"
          >
            <item.icon className="text-#c5a059400 mb-6" size={28} />
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
              {item.label}
            </p>
            <p className="text-3xl font-light">{item.value}</p>
          </div>
        ))}
      </div>

      {/* QUICK INSIGHTS */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white rounded-3xl p-10 border border-stone-100">
          <h3 className="text-xl font-light mb-6">
            Recent Orders
          </h3>
          <ul className="space-y-4 text-sm">
            {orders.slice(0, 5).map(order => (
              <li key={order.id}>#{order.id.slice(0,8)} — {order.status}</li>
            ))}
            {orders.length === 0 && <li className="text-stone-400">No orders found</li>}
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-10 border border-stone-100">
          <h3 className="text-xl font-light mb-6">
            Low Stock Alerts
          </h3>
          <ul className="space-y-4 text-sm">
            {lowStockItems.map(item => (
              <li key={item.id}>{item.name} ({item.stock} left)</li>
            ))}
            {lowStockItems.length === 0 && <li className="text-stone-400">All products well stocked</li>}
          </ul>
        </div>
      </div>
    </>
  );
}