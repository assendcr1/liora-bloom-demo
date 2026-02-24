import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Leaf,
  Star,
  ChevronLeft,
  ChevronRight,
  Hash
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
// Assuming you have a Cart Context, if not, I can help you create one next
import { useCart } from "../context/CartContext"; 

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart(); // Accessing cart functionality

  const product = products.find((p) => String(p.id) === String(id));

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

  // --- HOOKS ---
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("about");
  const [reviews, setReviews] = useState(product?.reviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, text: "" });

  const productImages = useMemo(() => {
    return ensureArray(product?.gallery || product?.images);
  }, [product]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    const currentCat = ensureString(product.category);
    return products.filter(
      (p) => p.id !== product.id && ensureString(p.category) === currentCat
    ).slice(0, 3);
  }, [products, product]);

  if (!product) {
    return (
      <section className="px-6 py-40 text-center">
        <p className="text-stone-500 mb-6 font-serif italic">Arrangement not found in our current collection.</p>
        <Link to="/collections" className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1">
          Return to Shop
        </Link>
      </section>
    );
  }

  // --- FUNCTIONAL BUTTON HANDLERS ---
  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: product.id,
      name: product.name,
      price: product.price,
      image: ensureString(product.gallery || product.images),
      quantity: 1
    });
    // Optional: Provide feedback or open cart drawer
  };

  const handleBuyNow = () => {
    // 1. Add to cart first
    handleAddToCart();
    // 2. Immediately navigate to checkout
    navigate('/checkout');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setReviews([...reviews, newReview]);
    setNewReview({ name: "", rating: 5, text: "" });
    setShowReviewForm(false);
  };

  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
      <button
        onClick={() => navigate("/collections")}
        className="mb-12 text-[11px] font-black uppercase tracking-widest border-b border-stone-200 hover:border-black transition-all pb-1"
      >
        Go back to shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* IMAGE GALLERY */}
        <div>
          <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-stone-100 mb-6 shadow-2xl">
            <img
              src={productImages[activeImage] || "https://via.placeholder.com/600x800?text=No+Image"}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {productImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((activeImage - 1 + productImages.length) % productImages.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setActiveImage((activeImage + 1) % productImages.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === index ? "border-stone-900 scale-105" : "border-transparent opacity-60"
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="lg:sticky lg:top-32">
          <p className="text-[10px] uppercase font-black tracking-[0.5em] text-[#c5a059] mb-4">
            {ensureString(product.category)}
          </p>

          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-8 text-stone-900">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-6 mb-8">
             <p className="font-serif italic text-4xl text-stone-900">
                R {Number(product.price).toFixed(2)}
             </p>
             {product.sku && (
               <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest flex items-center gap-1">
                 <Hash size={10} /> {product.sku}
               </span>
             )}
          </div>

          <p className="text-stone-500 text-lg leading-relaxed mb-12 max-w-xl font-light">
            {product.description}
          </p>

          {/* PRIMARY ACTIONS - NOW FUNCTIONAL */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-stone-900 text-white py-6 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#c5a059] transition-all transform hover:-translate-y-1 shadow-xl"
            >
              Express Checkout
            </button>
            <button 
              onClick={handleAddToCart}
              className="flex-1 border border-stone-200 py-6 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
          </div>

          {/* TABS */}
          <div className="border-t border-stone-100 pt-10">
            <div className="flex gap-12 mb-8 border-b border-stone-50 pb-4">
              {["about", "care", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                    activeTab === tab ? "text-stone-900 border-b-2 border-stone-900" : "text-stone-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="min-h-[150px]">
              {activeTab === "about" && (
                <p className="text-stone-500 leading-relaxed font-light">
                  {product.about || "No additional details available for this arrangement."}
                </p>
              )}

              {activeTab === "care" && (
                <div className="bg-stone-50 p-6 rounded-2xl">
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {product.care || "Standard cold-water floral care applies to this arrangement."}
                  </p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8">
                  {reviews.length > 0 ? reviews.map((review, index) => (
                    <div key={index} className="border-b border-stone-50 pb-6">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={10} className="fill-[#c5a059] text-[#c5a059]" />
                        ))}
                      </div>
                      <p className="text-stone-600 italic mb-2 text-sm">“{review.text}”</p>
                      <p className="text-[9px] uppercase tracking-widest font-black text-stone-400">{review.name}</p>
                    </div>
                  )) : <p className="text-stone-400 text-sm italic">No reviews yet for this bouquet.</p>}

                  {!showReviewForm ? (
                    <button onClick={() => setShowReviewForm(true)} className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-1 hover:text-[#c5a059] transition">
                      Write a review
                    </button>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4 bg-stone-50 p-6 rounded-3xl">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm outline-none"
                        required
                      />
                      <textarea
                        placeholder="Your thoughts..."
                        value={newReview.text}
                        onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                        className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm min-h-[100px] outline-none"
                        required
                      />
                      <button type="submit" className="bg-stone-900 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Submit
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SHOP SIMILAR */}
      <div className="mt-48">
        <h2 className="text-4xl font-light mb-16 tracking-tight text-stone-900">
          From the same <span className="italic font-serif text-[#c5a059]">Collection</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {similarProducts.map((item) => (
            <Link key={item.id} to={`/product/${item.id}`} className="group">
              <div className="aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 bg-stone-100 shadow-sm transition-all group-hover:shadow-xl">
                <img
                  src={ensureString(item.gallery || item.images)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2">
                {item.name}
              </h3>
              <p className="font-serif italic text-stone-500 text-lg">
                R {Number(item.price).toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* TRUST ICONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mt-40 pt-20 border-t border-stone-100">
        <div>
          <ShieldCheck className="mx-auto mb-6 text-[#c5a059]" size={32} strokeWidth={1} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900">Authenticated Blooms</p>
        </div>
        <div>
          <Truck className="mx-auto mb-6 text-[#c5a059]" size={32} strokeWidth={1} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900">Cold-Chain Delivery</p>
        </div>
        <div>
          <Leaf className="mx-auto mb-6 text-[#c5a059]" size={32} strokeWidth={1} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900">Sustainably Sourced</p>
        </div>
      </div>
    </section>
  );
}