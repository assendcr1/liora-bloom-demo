// src/pages/ProductDetail.jsx
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
} from "lucide-react";
import { useProducts } from "../context/ProductContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();

  const product = products.find((p) => String(p.id) === String(id));

  // 🔒 ALL HOOKS MUST BE ABOVE CONDITIONAL RETURNS
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("about");
  const [reviews, setReviews] = useState(product?.reviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    text: "",
  });

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products.filter(
      (p) =>
        p.id !== product.id &&
        p.category === product.category
    );
  }, [products, product]);

  // ✅ NOW it is safe to return conditionally
  if (!product) {
    return (
      <section className="px-6 py-40 text-center">
        <p className="text-stone-500 mb-6">Product not found.</p>
        <Link
          to="/collections"
          className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1"
        >
          Return to Shop
        </Link>
      </section>
    );
  }

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setReviews([...reviews, newReview]);
    setNewReview({ name: "", rating: 5, text: "" });
    setShowReviewForm(false);
  };

  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
      {/* GO BACK */}
      <button
        onClick={() => navigate("/collections")}
        className="mb-12 text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1"
      >
        Go back to shop
      </button>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* IMAGE GALLERY */}
        <div>
          <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-stone-100 mb-6">
            <img
              src={product.images?.[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {product.images?.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage(
                      (activeImage - 1 + product.images.length) %
                        product.images.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() =>
                    setActiveImage(
                      (activeImage + 1) % product.images.length
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-4">
            {product.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-24 rounded-xl overflow-hidden border ${
                  activeImage === index
                    ? "border-stone-900"
                    : "border-stone-200"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-#c5a059 mb-6">
            {product.category}
          </p>

          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-8">
            {product.name}
          </h1>

          <p className="text-stone-600 text-lg leading-relaxed mb-8 max-w-xl">
            {product.description}
          </p>

          <p className="font-serif italic text-3xl mb-10">
            R {product.price.toFixed(2)}
          </p>

          {/* PRIMARY ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="flex-1 bg-stone-900 text-white py-5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-#c5a059 transition">
              Buy Now
            </button>
            <button className="flex-1 border border-stone-300 py-5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition flex items-center justify-center gap-2">
              <ShoppingBag size={16} />
              Add to Cart
            </button>
          </div>

          {/* TABS */}
          <div className="border-t border-stone-100 pt-10">
            <div className="flex gap-10 mb-8">
              <button
                onClick={() => setActiveTab("about")}
                className={`text-[11px] uppercase tracking-widest font-bold ${
                  activeTab === "about"
                    ? "text-stone-900"
                    : "text-stone-400"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`text-[11px] uppercase tracking-widest font-bold ${
                  activeTab === "reviews"
                    ? "text-stone-900"
                    : "text-stone-400"
                }`}
              >
                Reviews
              </button>
            </div>

            {activeTab === "about" && (
              <div>
                <p className="text-stone-500 mb-6">
                  {product.about || product.description}
                </p>
                {product.care && (
                  <p className="text-stone-500 text-sm">
                    <strong>Care:</strong> {product.care}
                  </p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={14} className="text-#c5a059400" />
                      ))}
                    </div>
                    <p className="text-stone-600 italic mb-2">
                      “{review.text}”
                    </p>
                    <p className="text-xs uppercase tracking-widest text-stone-400">
                      {review.name}
                    </p>
                  </div>
                ))}

                {!showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1"
                  >
                    Leave a review
                  </button>
                )}

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={newReview.name}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          name: e.target.value,
                        })
                      }
                      className="w-full border-b py-3 outline-none"
                      required
                    />
                    <textarea
                      placeholder="Your review"
                      value={newReview.text}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          text: e.target.value,
                        })
                      }
                      className="w-full border-b py-3 outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-stone-900 text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SHOP SIMILAR */}
      <div className="mt-40">
        <h2 className="text-3xl font-light mb-12">
          Shop <span className="italic font-serif">Similar</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {similarProducts.map((item) => (
            <Link key={item.id} to={`/product/${item.id}`}>
              <div className="group">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-stone-100">
                  <img
                    src={item.images?.[0]}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  {item.name}
                </h3>
                <p className="font-serif italic text-stone-500">
                  R {item.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* TRUST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mt-32">
        <div>
          <ShieldCheck className="mx-auto mb-4 text-#c5a059400" size={36} />
          <p className="text-xs font-black uppercase tracking-widest">
            Authenticated Blooms
          </p>
        </div>
        <div>
          <Truck className="mx-auto mb-4 text-#c5a059400" size={36} />
          <p className="text-xs font-black uppercase tracking-widest">
            Cold-Chain Delivery
          </p>
        </div>
        <div>
          <Leaf className="mx-auto mb-4 text-#c5a059400" size={36} />
          <p className="text-xs font-black uppercase tracking-widest">
            Sustainably Sourced
          </p>
        </div>
      </div>
    </section>
  );
}
