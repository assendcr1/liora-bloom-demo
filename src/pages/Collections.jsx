import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { useProducts } from "../context/ProductContext";

// Updated categories to match the Liora Blooms price list
const CATEGORIES = [
  "All", 
  "Assorted Roses", 
  "Red Roses", 
  "Personalised", 
  "Funeral Packages"
];

const OCCASIONS = [
  "All",
  "Memorial",
  "Birthday",
  "Anniversary",
  "Romantic",
  "Congratulations",
  "Thank You",
  "Corporate",
];

const TESTIMONIALS = [
  "“The most considered bouquet I’ve ever sent.” — Nandi M.",
  "“Liora Bloom made the moment unforgettable.” — James K.",
  "“Effortless, elegant, emotional.” — Priya S.",
  "“This is not floristry — it’s design.” — Michael R.",
];

export default function Collections() {
  const { products, loading } = useProducts();

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeOccasion, setActiveOccasion] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "All" ||
        product.category === activeCategory;

      const occasionMatch =
        activeOccasion === "All" ||
        (Array.isArray(product.occasion)
          ? product.occasion.includes(activeOccasion)
          : product.occasion === activeOccasion);

      return categoryMatch && occasionMatch;
    });
  }, [products, activeCategory, activeOccasion]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-400 animate-pulse tracking-widest uppercase text-xs">Loading Collections...</p>
      </div>
    );
  }

  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="max-w-3xl mb-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#c5a059] mb-6">
          Shop
        </p>
        <h1 className="text-6xl font-light tracking-tight mb-6">
          Our <span className="italic font-serif">Collections</span>
        </h1>
        <p className="text-stone-500 text-lg leading-relaxed">
          Designed for moments that matter — curated by intent, not abundance.
        </p>
      </div>

      {/* SHOP BY OCCASION */}
      <div className="mb-20">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">
          Shop by Occasion
        </p>
        <div className="flex flex-wrap gap-4">
          {OCCASIONS.map((occasion) => (
            <button
              key={occasion}
              onClick={() => setActiveOccasion(occasion)}
              className={`px-6 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold transition ${
                activeOccasion === occasion
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {occasion}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-20">
        {/* SIDEBAR */}
        <aside>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">
            Categories
          </p>
          <ul className="space-y-4">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm font-bold uppercase tracking-wider transition ${
                    activeCategory === cat
                      ? "text-stone-900"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group text-left">
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-stone-100">
                  <img
                    src={product.gallery?.[0] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {product.popular && (
                    <span className="absolute top-4 left-4 bg-white/90 text-stone-900 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      Most chosen this week
                    </span>
                  )}
                </div>
              </Link>

              {/* LIKE + NAME */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-[13px] uppercase tracking-wider">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 text-stone-500">
                  <Heart size={14} />
                  <span className="text-xs">
                    {product.likes || 0}
                  </span>
                </div>
              </div>

              <p className="font-serif italic text-stone-500 mb-4">
                R {Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>

              <button className="w-full bg-white border border-stone-200 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition flex items-center justify-center gap-2">
                <ShoppingBag size={14} />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIAL MARQUEE */}
      <div className="mt-40 overflow-hidden border-t border-stone-100 pt-20">
        <div className="whitespace-nowrap animate-marquee flex gap-20">
          {TESTIMONIALS.map((text, index) => (
            <span
              key={index}
              className="text-xl font-light italic text-stone-500"
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}