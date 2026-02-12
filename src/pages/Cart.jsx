// src/pages/Cart.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowRight, ShoppingCart, X } from "lucide-react";

export default function Cart() {
  const { cart, cartTotal, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Handle the logic for the "Proceed" button
  const handleProceedToCheckout = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-16">
        <h1 className="text-5xl font-serif italic text-stone-900">Your Cart</h1>
        <span className="bg-stone-100 text-stone-500 px-4 py-1 rounded-full text-sm font-medium">
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* List of Items */}
          <div className="lg:col-span-7 space-y-8">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-6 pb-8 border-b border-stone-100">
                <div className="w-24 h-32 rounded-2xl overflow-hidden bg-stone-50">
                  <img src={item.images?.[0]} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-xl font-serif italic">{item.name}</h3>
                    <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      {item.sale_price ? (
                        <div className="flex gap-3 items-center">
                          <p className="font-bold text-#c5a059">R {Number(item.sale_price).toFixed(2)}</p>
                          <p className="text-stone-300 line-through text-xs">R {Number(item.price).toFixed(2)}</p>
                        </div>
                      ) : (
                        <p className="font-bold text-stone-900">R {Number(item.price).toFixed(2)}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-300 hover:text-#c5a059 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-stone-50 p-10 rounded-[3rem] sticky top-32">
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-stone-400 mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>R {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 italic">Calculated at checkout</span>
                </div>
                <div className="h-px bg-stone-200 my-4" />
                <div className="flex justify-between text-2xl font-serif italic text-stone-900">
                  <span>Total</span>
                  <span>R {cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                className="w-full py-6 bg-stone-900 text-white rounded-full text-xs uppercase tracking-[0.3em] font-black hover:bg-#c5a059400 transition-all flex items-center justify-center gap-3 shadow-xl shadow-stone-200"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <p className="text-center mt-6">
                <Link to="/collections" className="text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-stone-900 underline underline-offset-8 transition-all">
                  Continue Browsing
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-32 bg-stone-50 rounded-[4rem] border border-dashed border-stone-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <ShoppingCart className="text-stone-200" size={32} />
          </div>
          <p className="text-stone-400 font-serif italic text-2xl mb-8">Your flower box is currently empty</p>
          <Link to="/collections" className="inline-block bg-stone-900 text-white px-12 py-5 rounded-full text-xs uppercase tracking-widest font-black hover:bg-#c5a059400 transition-all">
            Shop Collections
          </Link>
        </div>
      )}

      {/* Auth Gateway Popup */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-8 right-8 text-stone-300 hover:text-stone-900"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-#c5a05950 text-#c5a059400 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={24} />
            </div>

            <h2 className="text-3xl font-serif italic mb-4">Almost there...</h2>
            <p className="text-stone-500 mb-8 text-sm leading-relaxed">
              You need to create an account to place an order and track your delivery.
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => navigate("/signup")} 
                className="w-full bg-stone-900 text-white py-5 rounded-full text-xs uppercase font-black tracking-widest hover:bg-#c5a059400 transition-all"
              >
                Create Account / Login
              </button>
              
              <button 
                onClick={() => navigate("/checkout")} 
                className="w-full py-4 text-stone-400 text-[10px] uppercase font-bold tracking-[0.2em] hover:text-stone-900 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}