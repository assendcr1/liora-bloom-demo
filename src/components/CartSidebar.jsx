import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartSidebar() {
  const { cart, cartOpen, setCartOpen, removeFromCart, cartTotal } = useCart();

  if (!cartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Sidebar Panel */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-stone-900" />
            <h2 className="text-xs font-black uppercase tracking-widest">Your Arrangement</h2>
            <span className="bg-stone-100 text-[10px] px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <p className="font-serif italic text-stone-400">Your cart is empty.</p>
              <button 
                onClick={() => setCartOpen(false)}
                className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] border-b border-[#c5a059] pb-1"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="flex gap-5 group">
                {/* Product Image */}
                <div className="w-24 aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={item.gallery?.[0] || item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-[12px] font-bold uppercase tracking-wider text-stone-900">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-300 hover:text-red-400 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* ADD-ONS LIST */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.selectedAddons.map((addon, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] text-stone-400 uppercase tracking-tight">
                            <span>+ {addon.name}</span>
                            <span>R {addon.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">Subtotal</span>
                    <span className="font-serif italic text-stone-900">
                      R {item.itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-8 border-t border-stone-100 bg-stone-50/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">Total Amount</span>
              <span className="text-2xl font-light tracking-tighter">
                R {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <button className="w-full bg-stone-900 text-white py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-stone-800 transition shadow-xl shadow-stone-200">
              Proceed to Checkout
            </button>
            
            <p className="text-center text-[9px] text-stone-400 uppercase tracking-widest mt-4">
              Secure payments powered by PayStack
            </p>
          </div>
        )}
      </aside>
    </>
  );
}