// src/pages/user/UserOrders.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Added this missing import
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function UserOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyOrders() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id) // Filter by the logged-in user
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyOrders();
  }, [user]);

  if (loading) {
    return <div className="py-20 text-center text-stone-400 italic font-serif">Loading your history...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-serif italic mb-10">My Orders</h1>
      
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xs font-mono text-stone-400">#{order.id.slice(0,8)}</p>
                <p className="font-medium text-stone-800">{new Date(order.created_at).toLocaleDateString()}</p>
                <p className="text-sm text-stone-500">{order.items?.length || 0} items</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-lg mb-2 text-#c5a059400">
                  R {(order.total || 0).toFixed(2)}
                </p>
                <span className="text-[10px] uppercase tracking-widest bg-stone-50 text-stone-500 px-3 py-1 rounded-full border border-stone-100">
                  {order.status || 'Processing'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-stone-200">
          <p className="text-stone-400 font-serif italic text-lg">You haven't placed any orders yet.</p>
          <Link to="/collections" className="text-xs uppercase tracking-widest font-black mt-6 inline-block underline hover:text-#c5a059400 transition-colors">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}