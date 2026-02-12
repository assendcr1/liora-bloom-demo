import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, X, ShieldCheck, LogOut, Menu } from "lucide-react"; // Added Menu icon
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export const NAVBAR_HEIGHT = 88;

export default function Navbar() {
  const navigate = useNavigate();
  const { cart, removeFromCart, cartOpen, setCartOpen } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/collections?search=${query}`);
    }
  };

  const cartCount = cart?.length || 0;

  // Helper to close menu and navigate
  const closeAndNavigate = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b border-stone-100"
        style={{ height: NAVBAR_HEIGHT }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* MOBILE HAMBURGER - Left side on mobile */}
          <button 
            className="md:hidden text-stone-600 hover:text-black transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* LOGO */}
          <Link to="/" className="group flex items-center h-full absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <img 
              src="/logo.png" 
              alt="Liora Bloom Logo" 
              className="h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          </Link>

          {/* MENU (Desktop) */}
          <ul className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest text-stone-600">
            <li className="hover:text-black transition-colors"><Link to="/">Home</Link></li>
            <li className="hover:text-black transition-colors"><Link to="/collections">Collections</Link></li>
            <li className="hover:text-black transition-colors"><Link to="/bloom-finder">Bloom Finder</Link></li>
            <li className="hover:text-black transition-colors"><Link to="/our-story">Our Story</Link></li>
            <li className="hover:text-black transition-colors"><Link to="/contact">Contact</Link></li>
            
            {isAdmin && (
              <li className="text-[#c5a059] hover:text-[#c5a059] transition-colors">
                <Link to="/admin" className="flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* ACTIONS */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search flowers..."
                className="pl-10 pr-4 py-2 rounded-full border border-stone-200 text-sm outline-none focus:border-stone-400 transition-all w-48 focus:w-64"
              />
            </div>

            <div className="flex items-center gap-4 border-l pl-4 md:pl-6 border-stone-100">
              {user ? (
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate("/account")} className="flex items-center gap-2 hover:text-[#c5a059] transition-colors">
                    <User size={18} />
                    <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline">
                      Hi, {user.name?.split(" ")[0]}
                    </span>
                  </button>
                  <button onClick={logout} className="text-stone-300 hover:text-[#c5a059] transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate("/login")} className="hover:text-[#c5a059] transition-colors">
                  <User size={18} />
                </button>
              )}
            </div>

            <button onClick={() => setCartOpen(true)} className="relative hover:text-[#c5a059] transition-colors">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c5a059] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN - Hidden on desktop */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen py-8' : 'max-h-0'}`}>
           <ul className="flex flex-col items-center gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-600">
              <li onClick={() => setIsMobileMenuOpen(false)}><Link to="/">Home</Link></li>
              <li onClick={() => setIsMobileMenuOpen(false)}><Link to="/collections">Collections</Link></li>
              <li onClick={() => setIsMobileMenuOpen(false)}><Link to="/bloom-finder">Bloom Finder</Link></li>
              <li onClick={() => setIsMobileMenuOpen(false)}><Link to="/our-story">Our Story</Link></li>
              <li onClick={() => setIsMobileMenuOpen(false)}><Link to="/contact">Contact</Link></li>
              {isAdmin && (
                <li onClick={() => setIsMobileMenuOpen(false)} className="text-[#c5a059]">
                  <Link to="/admin">Admin Dashboard</Link>
                </li>
              )}
           </ul>
        </div>
      </nav>

      {/* CART SIDEBAR - Keeping your original logic */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-[420px] bg-white h-full p-8 shadow-2xl relative animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10 border-b pb-6">
              <h2 className="text-2xl font-serif italic">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="hover:rotate-90 transition-transform"><X /></button>
            </div>

            {cartCount === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center pb-20">
                <ShoppingBag size={48} className="text-stone-200 mb-4" />
                <p className="text-stone-500 italic font-serif">Your cart is empty.</p>
                <Link to="/collections" onClick={() => setCartOpen(false)} className="mt-6 underline text-xs uppercase tracking-widest font-bold">
                  Browse Collections
                </Link>
              </div>
            ) : (
              <div className="flex flex-col h-[calc(100%-120px)]">
                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-start group">
                      <div>
                        <p className="font-bold text-sm group-hover:text-[#c5a059] transition-colors">{item.name}</p>
                        <p className="italic text-stone-500 text-xs mt-1">R {(item.sale_price || item.price).toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-[#c5a059] font-bold">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="pt-8 border-t border-stone-100">
                  <div className="flex justify-between mb-6">
                    <span className="uppercase text-[10px] tracking-widest font-bold">Subtotal</span>
                    <span className="font-serif italic text-xl">
                      R {cart.reduce((acc, item) => acc + (item.sale_price || item.price), 0).toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={() => { setCartOpen(false); navigate("/cart"); }}
                    className="w-full bg-stone-900 text-white py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#c5a059] transition-colors"
                  >
                    View Cart & Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}