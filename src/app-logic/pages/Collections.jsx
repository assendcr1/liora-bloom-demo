import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  "All", 
  "Assorted Roses", 
  "Red Roses", 
  "Personalised", 
  "Funeral Packages",
  "Luxury Boxes",
  "Bouquets"
];

const OCCASIONS = [
  "All", "Memorial", "Birthday", "Anniversary", "Romantic", "Congratulations", "Thank You", "Corporate",
];

const TESTIMONIALS = [
  "“The most considered bouquet I’ve ever sent.” — Nandi M.",
  "“Liora Bloom made the moment unforgettable.” — James K.",
  "“Effortless, elegant, emotional.” — Priya S.",
  "“This is not floristry — it’s design.” — Michael R.",
];

export default function Collections() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeOccasion, setActiveOccasion] = useState("All");

  // --- DATA CLEANING HELPERS ---
  const ensureString = (val) => {
    if (!val) return "";
    if (Array.isArray(val)) return val[0] || "";
    if (typeof val === 'string' && val.startsWith('[')) {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed[0] : val;
      } catch (e) {
        return val.replace(/[\[\]"]/g, '').replace(/^"|"$/g, ''); 
      }
    }
    return val;
  };

  const ensureArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.startsWith('[')) {
      try { return JSON.parse(val); } catch (e) { return [val.replace(/[\[\]"]/g, '')]; }
    }
    return val ? [val] : [];
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product) => {
      // Clean the database values before comparing
      const prodCat = ensureString(product.category);
      const prodOccasions = ensureArray(product.occasion).map(o => ensureString(o));

      const categoryMatch =
        activeCategory === "All" ||
        prodCat === activeCategory;

      const occasionMatch =
        activeOccasion === "All" ||
        prodOccasions.includes(activeOccasion);

      return categoryMatch && occasionMatch;
    });
  }, [products, activeCategory, activeOccasion]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50/20">
        <p className="text-stone-400 animate-pulse tracking-[0.5em] uppercase text-[10px] font-black">Curating Collections...</p>
      </div>
    );
  }

  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
      <div className="max-w-3xl mb-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#c5a059] mb-6 animate-in fade-in slide-in-from-bottom-2">Shop</p>
        <h1 className="text-6xl font-light tracking-tight mb-6 text-stone-900">
          Our <span className="italic font-serif">Collections</span>
        </h1>
        <p className="text-stone-500 text-lg leading-relaxed font-light">
          Designed for moments that matter — curated by intent, not abundance.
        </p>
      </div>

      {/* OCCASION FILTERS */}
      <div className="mb-20">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-6">Filter by Intent</p>
        <div className="flex flex-wrap gap-3">
          {OCCASIONS.map((occasion) => (
            <button
              key={occasion}
              onClick={() => setActiveOccasion(occasion)}
              className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-black transition-all duration-500 ${
                activeOccasion === occasion 
                  ? "bg-stone-900 text-white shadow-xl scale-105" 
                  : "bg-white border border-stone-100 text-stone-400 hover:border-stone-300"
              }`}
            >
              {occasion}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-20">
        <aside className="lg:sticky lg:top-32 h-fit">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-8">Classification</p>
          <ul className="space-y-6">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 group ${
                    activeCategory === cat ? "text-stone-900" : "text-stone-300 hover:text-stone-600"
                  }`}
                >
                  <span className={`h-[1px] bg-stone-900 transition-all duration-500 ${activeCategory === cat ? "w-6" : "w-0"}`}></span>
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {filteredProducts.length > 0 ? filteredProducts.map((product) => (
            <div key={product.id} className="group animate-in fade-in duration-700">
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-stone-100 shadow-sm">
                  <img
                    src={ensureString(product.gallery || product.images)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {product.popular && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full">
                      <p className="text-[8px] font-black uppercase tracking-widest text-stone-900">Bestseller</p>
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-black text-[11px] uppercase tracking-widest text-stone-900 mb-1">{product.name}</h3>
                  <p className="text-[9px] uppercase tracking-widest text-[#c5a059] font-bold">{ensureString(product.category)}</p>
                </div>
                <div className="flex items-center gap-1 text-stone-300">
                  <Heart size={12} className="group-hover:text-red-400 transition-colors" />
                  <span className="text-[10px] font-bold">{product.likes || 0}</span>
                </div>
              </div>

              <p className="font-serif italic text-stone-500 text-lg mb-6">
                R {Number(product.price).toFixed(2)}
              </p>

              <button 
                onClick={() => addToCart({
                  ...product,
                  image: ensureString(product.gallery || product.images),
                  quantity: 1
                })}
                className="w-full bg-white border border-stone-100 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg"
              >
                <ShoppingBag size={14} />
                Add to Cart
              </button>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem]">
              <p className="font-serif italic text-stone-400">No arrangements match your current selection.</p>
            </div>
          )}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="mt-60 overflow-hidden border-t border-stone-100 pt-20">
        <div className="flex gap-20 whitespace-nowrap animate-marquee">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((text, index) => (
            <span key={index} className="text-2xl font-light italic text-stone-300 pr-20">{text}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
}