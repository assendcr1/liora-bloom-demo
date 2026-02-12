// src/pages/admin/Orders.jsx
import { useState } from "react";
import { X, Truck, Ban, PackageCheck } from "lucide-react"; // Removed FileText, Download
import { useOrders } from "../../context/OrderContext";

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const [activeOrder, setActiveOrder] = useState(null);

  return (
    <>
      <h1 className="text-4xl font-light italic font-serif mb-12">
        Orders
      </h1>

      <div className="bg-white rounded-3xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-5 text-left">Order ID</th>
              <th className="p-5 text-left">Customer</th>
              <th className="p-5">Total</th>
              <th className="p-5">Status</th>
              <th className="p-5">Date</th>
              <th className="p-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-5 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                <td className="p-5">
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-xs text-stone-400">{order.customer_email}</p>
                </td>
                <td className="p-5 text-center">R {order.total?.toFixed(2)}</td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-#c5a059100 text-#c5a059700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-5 text-center text-stone-400">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-5 text-center">
                  <button 
                    onClick={() => setActiveOrder(order)}
                    className="text-xs underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveOrder(null)}
              className="absolute top-8 right-8"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl mb-2 font-serif italic">Order Details</h2>
            <p className="text-stone-400 text-sm mb-10 uppercase tracking-widest">
              #{activeOrder.id}
            </p>

            <div className="grid md:grid-cols-2 gap-12 mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest mb-4">Status Actions</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => updateOrderStatus(activeOrder.id, 'Shipped')}
                    className="p-3 border rounded-xl hover:bg-stone-50" title="Mark Shipped"
                  >
                    <Truck size={18} />
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(activeOrder.id, 'Delivered')}
                    className="p-3 border rounded-xl hover:bg-stone-50" title="Mark Delivered"
                  >
                    <PackageCheck size={18} />
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(activeOrder.id, 'Cancelled')}
                    className="p-3 border rounded-xl hover:bg-stone-50 text-red-500" title="Cancel Order"
                  >
                    <Ban size={18} />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-4">Shipping To</p>
                <p className="text-sm">{activeOrder.shipping_address}</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest mb-4">Items</p>
              {activeOrder.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm mb-3">
                  <span>{item.quantity} × {item.name}</span>
                  <span>R {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-4 pt-4 flex justify-between font-medium">
                <span>Total</span>
                <span>R {activeOrder.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}