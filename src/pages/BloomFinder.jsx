import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function BloomFinder() {
  return (
    <section className="min-h-screen pt-32 px-6 md:px-12 bg-[#faf9f6]">
      <div className="max-w-4xl mx-auto text-center">
        
        <Sparkles className="mx-auto mb-8 text-#c5a059400" size={40} />

        <h1 className="text-6xl font-light italic font-serif mb-8">
          Bloom Finder
        </h1>

        <p className="text-stone-600 text-lg leading-relaxed mb-16">
          Describe the moment, emotion, or intention behind your gift.
          Bloom Finder will guide you to the most fitting floral expression
          from our current collection.
        </p>

        {/* PLACEHOLDER AI INPUT */}
        <div className="bg-white rounded-[3rem] shadow-2xl p-12">
          <textarea
            placeholder="e.g. I want something calm, elegant, and reassuring for a difficult moment..."
            className="w-full h-40 border-b border-stone-300 py-4 outline-none focus:border-#c5a059 transition resize-none mb-10"
          />

          <button className="w-full bg-stone-900 text-white py-5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-#c5a059 transition">
            Find My Bloom
          </button>
        </div>

        <div className="mt-16">
          <Link
            to="/collections"
            className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1"
          >
            Browse Collections Instead
          </Link>
        </div>
      </div>
    </section>
  );
}
