import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Landmark, CreditCard, QrCode, Ticket, Zap, Loader2 } from "lucide-react";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("eft");
  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    deliveryDate: "",
    address: "",
    suburb: "",
    postalCode: ""
  });

  const paymentOptions = [
    { id: 'eft', label: 'EFT (Bank Transfer)', icon: <Landmark size={18}/>, disabled: false },
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18}/>, disabled: true },
    { id: 'scan', label: 'Scan2Pay', icon: <QrCode size={18}/>, disabled: true },
    { id: 'payflex', label: 'PayFlex', icon: <Zap size={18}/>, disabled: true },
  ];

  const handleCompleteOrder = async () => {
    if (!formData.fullName || !formData.address || !formData.deliveryDate) {
      alert("Please fill in all delivery details.");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        user_id: user?.id || null, // null if guest
        customer_name: formData.fullName,
        customer_email: formData.email,
        total: cartTotal + 85, // Including Gauteng shipping
        status: "pending",
        payment_method: method,
        delivery_date: formData.deliveryDate,
        items: cart, // Stores the full array of products purchased
        shipping_address: {
          street: formData.address,
          suburb: formData.suburb,
          zip: formData.postalCode,
          phone: formData.phone
        }
      };

      const { data, error } = await supabase
        .from("orders")
        .insert([orderPayload])
        .select();

      if (error) throw error;

      // Success Flow
      clearCart();
      alert("Order placed successfully! Please check your email for EFT instructions.");
      navigate("/account"); // Redirect to orders page
    } catch (err) {
      console.error("Order Error:", err);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-24 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left: Forms */}
        <div className="lg:col-span-7 space-y-16">
          <section>
            <h2 className="text-3xl font-serif italic mb-8">Delivery Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <input 
                placeholder="Full Name" 
                className="col-span-2 border-b py-3 outline-none focus:border-#c5a059"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
              <input 
                placeholder="Email Address" 
                value={formData.email}
                className="border-b py-3 outline-none focus:border-#c5a059"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input 
                placeholder="Phone Number" 
                className="border-b py-3 outline-none focus:border-#c5a059"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <div className="col-span-2">
                <label className="text-[10px] uppercase text-stone-400 block mb-1">Preferred Delivery Date</label>
                <input 
                  type="date" 
                  className="w-full border-b py-3 outline-none focus:border-#c5a059"
                  onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                />
              </div>
              <input 
                placeholder="Street Address" 
                className="col-span-2 border-b py-3 outline-none focus:border-#c5a059"
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <input 
                placeholder="Suburb" 
                className="border-b py-3 outline-none focus:border-#c5a059"
                onChange={(e) => setFormData({...formData, suburb: e.target.value})}
              />
              <input 
                placeholder="Postal Code" 
                className="border-b py-3 outline-none focus:border-#c5a059"
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
              />
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-serif italic mb-8">Payment Method</h2>
            <div className="grid grid-cols-1 gap-3">
              {paymentOptions.map((opt) => (
                <button
                  key={opt.id}
                  disabled={opt.disabled}
                  onClick={() => setMethod(opt.id)}
                  className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${
                    opt.disabled ? 'opacity-40 cursor-not-allowed bg-stone-50' : 
                    method === opt.id ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-100 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {opt.icon}
                    <span className="text-xs uppercase tracking-widest font-bold">{opt.label}</span>
                  </div>
                  {opt.disabled && <span className="text-[8px] border px-2 py-0.5 rounded-full uppercase">Coming Soon</span>}
                </button>
              ))}
            </div>

            {method === "eft" && (
              <div className="mt-8 bg-stone-50 p-8 rounded-[2rem] border border-stone-200">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-4">Banking Details</h3>
                <div className="space-y-2 text-sm text-stone-800">
                  <p>Bank: <strong>Standard Bank</strong></p>
                  <p>Account: <strong>Lily & Bloom (Pty) Ltd</strong></p>
                  <p>Number: <strong>101 234 567 89</strong></p>
                  <p>Reference: <strong className="text-#c5a059 underline">Order {formData.phone || 'Phone'}</strong></p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5">
          <div className="bg-stone-50 p-10 rounded-[3rem] sticky top-32">
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-stone-400 mb-8">Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-stone-500 text-xs">
                <span>Subtotal</span>
                <span>R {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-xs">
                <span>Shipping (Gauteng)</span>
                <span>R 85.00</span>
              </div>
              <div className="h-px bg-stone-200 my-4" />
              <div className="flex justify-between text-2xl font-serif italic text-stone-900">
                <span>Total</span>
                <span>R {(cartTotal + 85).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCompleteOrder}
              disabled={loading || cart.length === 0}
              className="w-full bg-stone-900 text-white py-6 rounded-full text-xs uppercase tracking-[0.2em] font-black hover:bg-#c5a059 transition-all flex justify-center items-center gap-2 shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Complete Order"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}