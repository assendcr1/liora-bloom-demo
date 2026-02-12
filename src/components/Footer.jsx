// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-100 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
        
        {/* BRAND COLUMN - Much bigger logo */}
        <div className="md:col-span-1">
          <Link to="/" className="inline-block mb-8 group">
            <img 
              src="/logo.png" 
              alt="Liora Bloom Logo" 
              className="h-20 md:h-24 w-auto object-contain" 
            />
          </Link>
          <p className="text-stone-500 text-sm leading-relaxed mb-8 font-light">
            Established September 2025. Meaningful floral design created to brighten life's most special moments through light and happiness.
          </p>
          <div className="flex gap-4">
            <a href="/#instagram" className="text-stone-400 hover:text-#c5a059 transition-colors"><Instagram size={20} /></a>
            <a href="/#facebook" className="text-stone-400 hover:text-#c5a059 transition-colors"><Facebook size={20} /></a>
            <a href="/#mail" className="text-stone-400 hover:text-#c5a059 transition-colors"><Mail size={20} /></a>
          </div>
        </div>

        {/* SHOP COLUMN */}
        <div>
          <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-stone-900">Shop</h4>
          <ul className="space-y-4 text-sm text-stone-500 font-light">
            <li><Link to="/collections" className="hover:text-#c5a059 transition-colors">Our Collections</Link></li>
            <li><Link to="/bloom-finder" className="hover:text-#c5a059 transition-colors">Bloom Finder</Link></li>
            <li><Link to="/account" className="hover:text-#c5a059 transition-colors">My Account</Link></li>
          </ul>
        </div>

        {/* EXPLORE COLUMN */}
        <div>
          <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-stone-900">Explore</h4>
          <ul className="space-y-4 text-sm text-stone-500 font-light">
            <li><Link to="/our-story" className="hover:text-#c5a059 transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-#c5a059 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* CONTACT COLUMN */}
        <div>
          <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-stone-900">Atelier</h4>
          <ul className="space-y-4 text-sm text-stone-500 font-light">
            <li className="flex items-center gap-3">
              <MapPin size={14} /> Sandton, Gauteng
            </li>
            <li>hello@liorabloom.co.za</li>
            <li className="text-[10px] uppercase tracking-widest text-stone-400 pt-4 leading-relaxed">
              © 2025 LIORA Bloom. <br/>All Rights Reserved.
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-stone-50 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
          Pronounced LEE-ur-ruh — "My Light"
        </p>
        <div className="flex gap-8 text-[9px] font-bold uppercase tracking-widest text-stone-400">
          <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}