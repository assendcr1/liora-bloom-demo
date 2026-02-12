// src/pages/Home.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Flower, ShieldCheck, Truck, Leaf, Sun, Heart } from "lucide-react";
import { useState } from "react";
import { useProducts } from "../context/ProductContext";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const { products } = useProducts();

  // ONLY show popular products (controlled by admin)
  const popularProducts = products.filter(
    (p) => p.popular === true
  );

  return (
    <>
      {/* SECTION 1: HERO */}
      <header className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-stone-200">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/11166470/pexels-photo-11166470.jpeg"
            className="w-full h-full object-cover"
            alt="Liora Bloom Background"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-6"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/90 mb-6">
            Lighting the world, one bouquet at a time
          </p>
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter mb-6 text-white">
            Liora <span className="italic font-serif">Bloom</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-white mb-12 font-light">
            Luxury floral arrangements designed to bring light, happiness, and meaningful connection to life's special moments.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/collections"
              className="bg-stone-900 text-white px-12 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-#c5a059 transition"
            >
              Browse Collections
            </Link>

            <Link
              to="/bloom-finder"
              className="bg-white text-stone-900 px-12 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-stone-50 transition"
            >
              Try Bloom Finder
            </Link>
          </div>
        </motion.div>
      </header>

      {/* SECTION 2: PHILOSOPHY + BLOOM FINDER BRIDGE */}
      <section className="relative pt-40 pb-24 px-6 bg-[#faf9f6] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-#c5a059100/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-stone-200/60 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-#c5a059 mb-8">
              Our Philosophy
            </p>

            <h2 className="text-4xl md:text-5xl font-light leading-tight font-serif italic text-stone-800 mb-10">
              Floral design, treated as a discipline of warmth, emotion, and intentional light.
            </h2>

            <p className="text-stone-500 text-lg font-light max-w-xl leading-relaxed mb-12">
              Pronounced LEE-ur-ruh, our name means "my light." Every arrangement is thoughtfully designed 
              with the belief that a single gesture of beauty can illuminate someone's entire day.
            </p>

            <Link
              to="/our-story"
              className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-#c5a059 transition-colors"
            >
              Learn More About Our Mission
            </Link>
          </div>

          <div className="bg-white rounded-[3rem] p-14 shadow-2xl border border-stone-100 text-center">
            <div className="flex justify-center mb-8">
              <Sun className="text-#c5a059" size={36} />
            </div>

            <p className="text-2xl md:text-3xl font-light leading-relaxed font-serif italic text-stone-800 mb-10">
              “Bloom Finder bridges emotion and design — guiding you to the floral expression that best shares your light.”
            </p>

            <div className="flex flex-col gap-4 items-center">
              <Link
                to="/bloom-finder"
                className="bg-stone-900 text-white px-12 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-#c5a059 transition"
              >
                Explore Bloom Finder
              </Link>

              <span className="text-[10px] uppercase tracking-widest text-stone-400">
                Personalised • Intuitive • Meaningful
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MOST POPULAR (ADMIN CONTROLLED) */}
      <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl font-light uppercase">
            Signature <span className="italic font-serif">Creations</span>
          </h2>
          <Link
            to="/collections"
            className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {popularProducts.map((item) => (
            <div key={item.id} className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={item.images?.[0]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={item.name}
                />
              </div>
              <h3 className="mt-5 font-bold text-[13px] uppercase tracking-wider group-hover:text-#c5a059 transition-colors">
                {item.name}
              </h3>
              <p className="text-stone-400 text-[10px] uppercase tracking-widest mt-1">
                R {item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: TRUST / LOGISTICS STRIP */}
      <section className="px-6 py-24 bg-white border-y border-stone-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div>
            <Heart className="mx-auto mb-6 text-#c5a059400" size={40} strokeWidth={1} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">
              Intentional Care
            </h4>
            <p className="text-stone-400 text-sm font-light">
              Every design is arranged with artistry and genuine purpose.
            </p>
          </div>
          <div>
            <Truck className="mx-auto mb-6 text-#c5a059400" size={40} strokeWidth={1} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">
              Local Delivery
            </h4>
            <p className="text-stone-400 text-sm font-light">
              Same-day delivery service across Gauteng regions.
            </p>
          </div>
          <div>
            <Leaf className="mx-auto mb-6 text-#c5a059400" size={40} strokeWidth={1} />
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">
              Sustainably Sourced
            </h4>
            <p className="text-stone-400 text-sm font-light">
              Carefully selected blooms for quality and seasonal beauty.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: ORIGINAL BLOOM FINDER CTA */}
      <section className="px-6 py-32 bg-stone-900 text-white rounded-[4rem] mx-4 md:mx-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-light mb-10 tracking-tighter">
              Bloom <span className="italic font-serif text-#c5a059300">Finder</span>
            </h2>

            <p className="text-stone-400 text-lg mb-10 font-light leading-relaxed">
              Describe a mood, a celebration, or a moment of comfort. Our AI system helps you translate your feelings into the perfect custom floral creation.
            </p>

            <textarea
              className="w-full bg-white/5 border border-white/10 p-6 rounded-[2rem] text-white h-40 mb-8 outline-none focus:border-#c5a059400 transition"
              placeholder="Tell us about the person or moment you are celebrating..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <Link
              to="/bloom-finder"
              className="inline-block bg-white text-stone-900 px-14 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-#c5a059100 transition"
            >
              Continue to Bloom Finder
            </Link>
          </div>

          <div className="hidden lg:flex items-center justify-center opacity-30">
            <Flower size={160} />
          </div>
        </div>
      </section>

      {/* SECTION 6: OUR STORY PREVIEW */}
      <section className="px-6 py-32 max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center border-t border-stone-100 mt-24">
        <img
          src="https://images.pexels.com/photos/35176658/pexels-photo-35176658.jpeg"
          className="rounded-[3rem] shadow-xl"
          alt="Liora Founder Story"
        />
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] text-#c5a059 mb-6">
            Our Heritage
          </h2>
          <h3 className="text-5xl font-light mb-6 italic font-serif">
            Lighting life's moments
          </h3>
          <p className="text-stone-600 text-lg mb-8 leading-relaxed">
            What began as a vision to spread positivity has grown into a floral design house dedicated to the belief that every bloom should carry meaning.
          </p>
          <Link
            to="/our-story"
            className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-#c5a059 transition-colors"
          >
            Read Our Story
          </Link>
        </div>
      </section>

      {/* SECTION 7: NEWSLETTER */}
      <section className="px-6 py-32 bg-stone-100/50 text-center">
        <h3 className="text-5xl font-light mb-6">
          Join the <span className="italic font-serif">Bloom Letter</span>
        </h3>
        <p className="text-stone-500 mb-12 max-w-xl mx-auto">
          Seasonal updates, special collections, and floral inspirations to brighten your inbox.
        </p>

        <form className="flex flex-col md:flex-row gap-4 justify-center max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-6 py-4 rounded-full border border-stone-300 outline-none focus:border-#c5a059 bg-white"
          />
          <button
            type="submit"
            className="bg-stone-900 text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-#c5a059 transition shadow-md"
          >
            Subscribe
          </button>
        </form>
      </section>
    </>
  );
}