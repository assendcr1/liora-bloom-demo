// src/pages/user/UserReviews.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Star, Trash2 } from "lucide-react";

export default function UserReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  // Removed unused loading state

  const fetchMyReviews = async () => {
    if (!user) return;
    try {
      // We join with 'products' to show the name of the item reviewed
      const { data, error } = await supabase
        .from("Reviews")
        .select(`
          *,
          products (
            name
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchMyReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      const { error } = await supabase
        .from("Reviews")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      fetchMyReviews();
    } catch (err) {
      alert("Error deleting review");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif italic mb-10">My Reviews</h1>

      {reviews.length > 0 ? (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm relative group"
            >
              <button 
                onClick={() => deleteReview(review.id)}
                className="absolute top-8 right-8 text-stone-300 hover:text-#c5a059 transition-colors"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? "fill-#c5a059400 text-#c5a059400" : "text-stone-200"}
                  />
                ))}
              </div>

              <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
                Reviewed: {review.products?.name || "Unknown Product"}
              </p>
              
              <h3 className="text-lg font-light mb-4">"{review.comment}"</h3>
              
              <p className="text-[10px] text-stone-300 uppercase tracking-tighter">
                Posted on {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200">
          <p className="text-stone-400">You haven't written any reviews yet.</p>
        </div>
      )}
    </div>
  );
}