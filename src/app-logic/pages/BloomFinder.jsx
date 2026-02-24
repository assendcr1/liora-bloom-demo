import { useState } from "react";
import { Sparkles, Loader2, Flower2, RefreshCcw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase"; 

export default function BloomFinder() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const findBloom = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      // 1. Invoke the Edge Function you just deployed
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('bloom-finder', {
        body: { prompt: prompt },
      });

      if (aiError) throw aiError;

      // 2. Get full product details from your 'products' table
      const { data: product, error: dbError } = await supabase
        .from('products')
        .select('*')
        .eq('id', aiResponse.product_id)
        .single();

      if (dbError) throw dbError;

      setRecommendation({ 
        ...product, 
        // Based on your screenshot, gallery is an array of strings
        displayImage: product.gallery && product.gallery.length > 0 ? product.gallery[0] : null,
        aiReason: aiResponse.reasoning 
      });

    } catch (err) {
      console.error("Bloom Finder Error:", err);
      alert("The florist is currently arranging fresh ideas. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[#faf9f6]">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-16">
          <Sparkles className="mx-auto mb-6 text-[#c5a059]" size={32} />
          <h1 className="text-5xl md:text-6xl font-serif italic mb-6">Bloom Finder</h1>
          <p className="text-stone-500 text-lg leading-relaxed max-w-xl mx-auto font-light">
            Tell us about the moment you're honoring. Our AI will select the perfect 
            arrangement from our boutique to match your heart's intent.
          </p>
        </div>

        {!recommendation ? (
          <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-stone-100 transition-all">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="I'm looking for something grand and impressive for a 50th anniversary..."
              className="w-full h-32 text-xl font-serif italic border-none outline-none resize-none mb-8 placeholder:text-stone-200 text-stone-800"
            />
            <button 
              onClick={findBloom}
              disabled={loading || !prompt}
              className="w-full bg-stone-900 text-white py-6 rounded-full text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#c5a059] transition-all disabled:bg-stone-100 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Consult the Florist"}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-stone-100 grid md:grid-cols-2 animate-in fade-in zoom-in duration-500">
            <div className="h-96 md:h-full bg-stone-100">
              <img 
                src={recommendation.displayImage} 
                alt={recommendation.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-12 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059] mb-2 inline-block">Perfectly Curated</span>
              <h2 className="text-4xl font-serif italic mb-2">{recommendation.name}</h2>
              <p className="text-stone-400 text-[11px] font-bold uppercase tracking-widest mb-8">
                {recommendation.category} — ${recommendation.price}
              </p>
              
              <div className="bg-stone-50 p-6 rounded-2xl mb-10 border-l-4 border-[#c5a059]">
                <p className="text-stone-600 italic font-serif leading-relaxed">
                  "{recommendation.aiReason}"
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link 
                  to={`/product/${recommendation.id}`}
                  className="w-full py-5 bg-stone-900 text-white rounded-full text-center text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#c5a059] transition-all"
                >
                  View Details
                </Link>
                <button 
                  onClick={() => { setRecommendation(null); setPrompt(""); }}
                  className="text-[10px] font-bold uppercase tracking-widest text-stone-300 hover:text-stone-900 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={12} /> Start Over
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}