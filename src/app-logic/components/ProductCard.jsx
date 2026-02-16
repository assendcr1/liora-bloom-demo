import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isOnSale = product.sale_price && Number(product.sale_price) < Number(product.price);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent clicking the card from triggering other events
    addToCart(product);
    navigate("/cart"); // Direct link to cart as requested
  };

  return (
    <div className="group bg-white rounded-[2rem] border border-stone-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
      <div className="relative aspect-[4/5] overflow-hidden">
        {isOnSale && (
          <span className="absolute top-4 left-4 z-10 bg-#c5a059 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            Sale
          </span>
        )}
        <img 
          src={product.images?.[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-serif italic text-2xl text-stone-900">{product.name}</h3>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">{product.category}</p>
          </div>
          <div className="text-right">
            {isOnSale ? (
              <>
                <p className="text-stone-300 line-through text-xs italic">R {Number(product.price).toFixed(2)}</p>
                <p className="text-#c5a059 font-bold text-lg">R {Number(product.sale_price).toFixed(2)}</p>
              </>
            ) : (
              <p className="font-bold text-lg text-stone-900">R {Number(product.price).toFixed(2)}</p>
            )}
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full py-4 bg-stone-900 text-white rounded-full text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-#c5a059400 transition-all active:scale-95"
        >
          <ShoppingBag size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}