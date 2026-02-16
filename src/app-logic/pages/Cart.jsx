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

  const handleProceedToCheckout = () => {
    // If user is not logged in, show the modal with Login/Guest options
    if (!user) {
      setShowAuthModal(true);
    } else {
      // If logged in, go straight to checkout
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
            {cart.map((item) => (
              <div key={item.cartItemId} className="flex gap-6 pb-8 border-b border-stone-100">
                <div className="w-24 h-32 rounded-2xl overflow-hidden bg-stone-50">
                  <img 
                    src={item.gallery?.[0] || item.image || item.images?.[0]} 
                    className="w-full h-full object-cover" 
                    alt={item.name} 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-xl font-serif italic">{item.name}</h3>
                    <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">{item.category}</p>
                    
                    {/* Display Addons */}
                    {item.selectedAddons?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.selectedAddons.map((addon, i) => (
                          <p key={i} className="text-[10px] text-stone-400 italic">
                            + {addon.name} (R {Number(addon.price).toFixed(2)})
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end">
                    <p className="font-bold text-stone-900">
                      R {Number(item.itemTotal).toFixed(2)}
                    </p>
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-stone-300 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
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
                className="w-full py-6 bg-stone-900 text-white rounded-full text-xs uppercase tracking-[0.3em] font-black hover:bg-[#c5a059] transition-all flex items-center justify-center gap-3 shadow-xl shadow-stone-200"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-32 bg-stone-50 rounded-[4rem] border border-dashed border-stone-200">
          <p className="text-stone-400 font-serif italic text-2xl mb-8">Your flower box is currently empty</p>
          <Link to="/collections" className="inline-block bg-stone-900 text-white px-12 py-5 rounded-full text-xs uppercase tracking-widest font-black hover:bg-[#c5a059] transition-all">
            Shop Collections
          </Link>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center relative shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8 flex justify-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-900">
                <ShoppingCart size={32} />
              </div>
            </div>

            <h2 className="text-3xl font-serif italic text-stone-900 mb-4">Almost there...</h2>
            <p className="text-stone-500 mb-8 text-sm leading-relaxed">
              Sign in to save your order to your account, or proceed as a guest to complete your purchase.
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => navigate("/login")}
                className="w-full py-5 bg-stone-900 text-white rounded-full text-xs uppercase tracking-[0.2em] font-black hover:bg-[#c5a059] transition-all shadow-lg"
              >
                Login or Sign Up
              </button>
              
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-stone-100 flex-1"></div>
                <span className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">OR</span>
                <div className="h-px bg-stone-100 flex-1"></div>
              </div>

              <button 
                onClick={() => navigate("/checkout")}
                className="w-full py-4 text-stone-400 hover:text-stone-900 text-[10px] uppercase tracking-[0.2em] font-black transition-colors"
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