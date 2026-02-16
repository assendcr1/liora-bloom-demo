// src/pages/admin/Orders.jsx
import { useState } from "react";
import { X, Truck, Ban, PackageCheck } from "lucide-react";
import { useOrders } from "../../context/OrderContext";

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const [activeOrder, setActiveOrder] = useState(null);

  return (
    <>
      <h1 className="text-4xl font-light italic font-serif mb-12">Orders</h1>

      <div className="bg-white rounded-3xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-5 text-left">Ref / ID</th>
              <th className="p-5 text-left">Customer</th>
              <th className="p-5">Total</th>
              <th className="p-5">Status</th>
              <th className="p-5">Date</th>
              <th className="p-5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-20 text-center text-stone-400 italic">No orders found yet.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="p-5">
                    <p className="font-mono text-xs font-bold text-stone-900">{order.order_ref || 'N/A'}</p>
                    <p className="text-[10px] text-stone-400 font-mono">#{order.id.toString().slice(0, 8)}</p>
                  </td>
                  <td className="p-5">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-xs text-stone-400">{order.customer_email}</p>
                  </td>
                  {/* Updated to total_amount */}
                  <td className="p-5 text-center font-serif italic">
                    R {order.total_amount ? order.total_amount.toFixed(2) : "0.00"}
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
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
                      className="text-xs font-bold uppercase tracking-tighter hover:text-[#c5a059] transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {activeOrder && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-10 lg:p-14 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              onClick={() => setActiveOrder(null)}
              className="absolute top-10 right-10 p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-12">
               <h2 className="text-3xl font-serif italic mb-2">Order {activeOrder.order_ref}</h2>
               <p className="text-stone-400 text-xs uppercase tracking-[0.2em]">Internal ID: {activeOrder.id}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-12 border-b border-stone-100 pb-12">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-6">Update Status</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => updateOrderStatus(activeOrder.id, 'Shipped')}
                    className="flex-1 flex flex-col items-center gap-2 p-4 border rounded-2xl hover:border-stone-900 transition-all group"
                  >
                    <Truck size={20} className="group-hover:text-[#c5a059]" />
                    <span className="text-[10px] uppercase font-bold">Ship</span>
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(activeOrder.id, 'Delivered')}
                    className="flex-1 flex flex-col items-center gap-2 p-4 border rounded-2xl hover:border-stone-900 transition-all group"
                  >
                    <PackageCheck size={20} className="group-hover:text-green-600" />
                    <span className="text-[10px] uppercase font-bold">Deliver</span>
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(activeOrder.id, 'Cancelled')}
                    className="flex-1 flex flex-col items-center gap-2 p-4 border rounded-2xl hover:border-red-500 transition-all group"
                  >
                    <Ban size={20} className="group-hover:text-red-500" />
                    <span className="text-[10px] uppercase font-bold text-red-500">Cancel</span>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-6">Delivery Address</p>
                <div className="text-sm text-stone-600 space-y-1">
                  <p className="font-bold text-stone-900">{activeOrder.customer_name}</p>
                  <p>{activeOrder.shipping_address?.street}</p>
                  <p>{activeOrder.shipping_address?.unit && `Unit: ${activeOrder.shipping_address.unit}`}</p>
                  <p>{activeOrder.shipping_address?.suburb}, {activeOrder.shipping_address?.city}</p>
                  <p className="pt-2 font-mono text-xs">{activeOrder.shipping_address?.phone}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest font-black text-stone-400 mb-6">Order Manifest</p>
              <div className="bg-stone-50 rounded-3xl p-8 space-y-4">
                {activeOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                       <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[10px] border">{item.quantity}</span>
                       <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-serif italic text-stone-500">R {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-stone-200 mt-6 pt-6 flex justify-between items-end">
                  <span className="text-[10px] uppercase font-black tracking-widest">Grand Total</span>
                  <span className="text-3xl font-serif italic text-stone-900">R {activeOrder.total_amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}