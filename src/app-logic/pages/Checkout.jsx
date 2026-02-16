// src/app-logic/pages/Checkout.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Landmark, Loader2, CheckCircle2, ArrowRight, Truck, Copy, Check, Info } from "lucide-react";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    deliveryDate: "",
    streetAddress: "",
    apartment: "",
    suburb: "",
    city: "Johannesburg",
    postalCode: ""
  });

  // Your Boutique Banking Details
  const bankDetails = {
    bank: "Standard Bank",
    accountName: "Liora Bloom (Pty) Ltd",
    accountNumber: "101 234 567 89",
    branchCode: "051 001",
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompleteOrder = async () => {
    if (!formData.fullName || !formData.streetAddress || !formData.deliveryDate || !formData.phone) {
      alert("Please ensure all delivery details are filled.");
      return;
    }

    setLoading(true);
    const ref = `LB-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const { error } = await supabase.from("orders").insert([{
        user_id: user?.id || null,
        customer_name: formData.fullName,
        customer_email: formData.email,
        order_ref: ref,
        total_amount: parseFloat(cartTotal + 85), // Updated to match your DB column
        status: "pending",
        payment_method: "eft",
        delivery_date: formData.deliveryDate,
        items: cart, 
        shipping_address: {
          street: formData.streetAddress,
          unit: formData.apartment,
          suburb: formData.suburb,
          city: formData.city,
          zip: formData.postalCode,
          phone: formData.phone
        }
      }]);

      if (error) throw error;

      setOrderRef(ref);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      console.error("Order Error:", err);
      alert(`Database Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-[90vh] py-20 flex items-center justify-center px-6 animate-in fade-in zoom-in duration-500">
        <div className="max-w-xl w-full text-center bg-stone-50 p-10 lg:p-16 rounded-[4rem] border border-stone-100 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} />
            </div>
          </div>
          <h2 className="text-4xl font-serif italic text-stone-900 mb-2">Order Placed!</h2>
          <p className="text-stone-500 mb-10 text-sm">Thank you for choosing Liora Bloom.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
            <div className="bg-white p-6 rounded-3xl border border-stone-200">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-black mb-2 text-center">Reference</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-2xl font-mono font-bold text-stone-900">{orderRef}</p>
                <button onClick={() => copyToClipboard(orderRef)} className="text-stone-400 hover:text-stone-900">
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-black mb-3">Bank Account</p>
              <div className="space-y-1 text-[11px] text-stone-800 font-medium">
                <p>Bank: <span className="float-right font-bold">{bankDetails.bank}</span></p>
                <p>Acc: <span className="float-right font-bold">{bankDetails.accountNumber}</span></p>
                <p>Code: <span className="float-right font-bold">{bankDetails.branchCode}</span></p>
              </div>
            </div>
          </div>

          <div className="text-left space-y-3 mb-10 bg-stone-900 text-stone-100 p-8 rounded-[2.5rem]">
            <p className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Info size={14} className="text-[#c5a059]" /> Important
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Use <span className="text-white font-bold">{orderRef}</span> as your payment reference. Please send proof of payment to <span className="text-[#c5a059]">orders@liorabloom.co.za</span>.
            </p>
          </div>

          <button onClick={() => navigate('/')} className="w-full py-6 bg-stone-900 text-white rounded-full text-[10px] uppercase tracking-[0.3em] font-black hover:bg-[#c5a059] transition-all">
            Return to Boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-24 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* LEFT: FORM */}
        <div className="lg:col-span-7 space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-10">
              <Truck size={20} className="text-stone-900" />
              <h2 className="text-3xl font-serif italic">Shipping Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-12">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[9px] uppercase font-black text-stone-400 ml-1 tracking-widest">Recipient's Full Name</label>
                <input className="w-full border-b border-stone-200 py-3 outline-none focus:border-stone-900 bg-transparent" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <input placeholder="Email" value={formData.email} className="border-b border-stone-200 py-3 outline-none focus:border-stone-900 bg-transparent" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input placeholder="Phone" className="border-b border-stone-200 py-3 outline-none focus:border-stone-900 bg-transparent" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <div className="col-span-2">
                <label className="text-[9px] uppercase text-stone-400 block mb-1 font-black tracking-widest">Preferred Delivery Date</label>
                <input type="date" className="w-full border-b border-stone-200 py-3 outline-none focus:border-stone-900 bg-transparent" onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})} />
              </div>
              <div className="col-span-2 mt-4 space-y-8">
                <p className="text-[10px] uppercase text-stone-900 font-black tracking-[0.3em] border-l-2 border-stone-900 pl-4">Physical Address</p>
                <input placeholder="Street Address" className="w-full border-b border-stone-200 py-3 outline-none focus:border-stone-900" onChange={(e) => setFormData({...formData, streetAddress: e.target.value})} />
                <div className="grid grid-cols-2 gap-8">
                  <input placeholder="Apt/Unit (Optional)" className="border-b border-stone-200 py-3 outline-none focus:border-stone-900" onChange={(e) => setFormData({...formData, apartment: e.target.value})} />
                  <input placeholder="Suburb" className="border-b border-stone-200 py-3 outline-none focus:border-stone-900" onChange={(e) => setFormData({...formData, suburb: e.target.value})} />
                  <input placeholder="City" value={formData.city} className="border-b border-stone-200 py-3 outline-none focus:border-stone-900" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  <input placeholder="Postal Code" className="border-b border-stone-200 py-3 outline-none focus:border-stone-900" onChange={(e) => setFormData({...formData, postalCode: e.target.value})} />
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-10">
              <Landmark size={20} className="text-stone-900" />
              <h2 className="text-3xl font-serif italic">Payment</h2>
            </div>
            
            <div className="bg-stone-50 rounded-[3rem] border border-stone-100 p-8 lg:p-12">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <p className="text-xs uppercase font-black tracking-widest mb-1">EFT (Bank Transfer)</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest">Safe & Secure manual payment</p>
                </div>
                <Landmark size={24} className="text-stone-300" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-10 border-t border-stone-200">
                <div className="space-y-4">
                  <p className="text-[9px] uppercase font-black text-stone-400 tracking-widest">Banking Details</p>
                  <div className="text-[13px] space-y-2 text-stone-800">
                    <p className="flex justify-between">Bank: <span className="font-bold">{bankDetails.bank}</span></p>
                    <p className="flex justify-between">Acc: <span className="font-bold">{bankDetails.accountNumber}</span></p>
                    <p className="flex justify-between">Code: <span className="font-bold">{bankDetails.branchCode}</span></p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-stone-100 flex flex-col justify-center italic text-stone-500 text-[10px] leading-relaxed">
                   "Your unique Order Reference will be generated upon completion. Please use it for your payment."
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-5">
          <div className="bg-stone-50 p-12 rounded-[4rem] sticky top-32 border border-stone-100 shadow-sm">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-stone-400 mb-10">Summary</h2>
            <div className="space-y-6 mb-12">
              <div className="flex justify-between items-end">
                <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                <span className="font-serif italic text-xl">R {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest">Courier</span>
                <span className="font-serif italic text-xl">R 85.00</span>
              </div>
              <div className="pt-10 border-t border-stone-200 flex justify-between items-start">
                <div>
                  <p className="text-3xl font-serif italic text-stone-900">Total</p>
                  <p className="text-[9px] text-stone-400 font-black mt-2 tracking-widest uppercase">Inc. VAT</p>
                </div>
                <p className="text-4xl font-serif italic text-stone-900">R {(cartTotal + 85).toFixed(2)}</p>
              </div>
            </div>
            <button onClick={handleCompleteOrder} disabled={loading || cart.length === 0} className="w-full py-7 bg-stone-900 text-white rounded-full text-[11px] uppercase tracking-[0.4em] font-black hover:bg-[#c5a059] transition-all flex justify-center items-center gap-3 shadow-2xl">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Complete Order <ArrowRight size={16}/></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}