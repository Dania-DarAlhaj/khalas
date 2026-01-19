import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../style/PhotographerDetails.css";

export default function PhotographerDetails() {
  const { ownerId } = useParams();
  const userId = sessionStorage.getItem("userId_");

  const [photographer, setPhotographer] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [canRate, setCanRate] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
const [packages, setPackages] = useState([]);
const [loadingPackages, setLoadingPackages] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!ownerId) return;

    fetchPhotographer();
    fetchComments();
    checkReservation();
  }, [ownerId, userId]);

  const fetchPhotographer = async () => {
    try {
      const { data: owner, error: ownerError } = await supabase
        .from("owners")
        .select("owner_id, user_id, rate, description, rating_count")
        .eq("owner_id", ownerId)
        .single();

      if (ownerError) throw ownerError;

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("name, phone, city")
        .eq("id", owner.user_id)
        .single();

      if (userError) throw userError;

      setPhotographer({
        ...owner,
        ...user,
        rate: owner.rate || 0,
        rating_count: owner.rating_count || 0,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load photographer details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    const { data, error } = await supabase
      .from("comments")
      .select(`
        comment_id,
        description,
        created_at,
        users ( name )
      `)
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (!error) setComments(data || []);
    setLoadingComments(false);
  };

  const checkReservation = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("reservations")
      .select("reservations_id")
      .eq("user_id", userId)
      .eq("owner_id", ownerId)
      .eq("status", "accepted")
      .limit(1);

    setCanRate(data && data.length > 0);

    
  };

  /* ================= RATING ================= */

  const handleRating = async (rating) => {
    if (!userId) {
      alert("You must be logged in.");
      return;
    }

    if (!canRate) {
      alert("Rating allowed only for users who booked.");
      return;
    }

    const newCount = photographer.rating_count + 1;
    const newRate =
      (photographer.rate * photographer.rating_count + rating) / newCount;

    const { error } = await supabase
      .from("owners")
      .update({
        rate: newRate.toFixed(1),
        rating_count: newCount,
      })
      .eq("owner_id", ownerId);

    if (!error) {
      setPhotographer((prev) => ({
        ...prev,
        rate: newRate,
        rating_count: newCount,
      }));
      setCanRate(false);
      alert("Thanks for rating ⭐");
    }
    
  };

  /* ================= COMMENTS ================= */

  const handleAddComment = async () => {
    if (!userId) {
      alert("Login required.");
      return;
    }

   

    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: userId,
        owner_id: ownerId,
        description: newComment,
      })
      .select(`
        comment_id,
        description,
        created_at,
        users ( name )
      `)
      .single();

    if (!error) {
      setComments((prev) => [data, ...prev]);
      setNewComment("");
    }
  };

  /* ================= UI ================= */

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="photographer-details-container">
      <div className="card">
        <h1>{photographer.name}</h1>
        <p>📞 {photographer.phone}</p>
        <p>📍 {photographer.city}</p>
        <p>{photographer.description}</p>

        {/* ⭐ Rating */}
        <div className="rating-section">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                color:
                  hoverRating >= star || photographer.rate >= star
                    ? "#FFD700"
                    : "#ccc",
                cursor: canRate ? "pointer" : "not-allowed",
              }}
              onMouseEnter={() => canRate && setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => canRate && handleRating(star)}
            >
              ★
            </span>
          ))}
          <span>
            {photographer.rate.toFixed(1)} ({photographer.rating_count})
          </span>
        </div>

        {!canRate && userId && (
          <p className="warning-msg">
            Rating & comments only for booked users.
          </p>
        )}
      </div>

      {/* 💬 COMMENTS */}
      <div className="comments-section">
        <h3>Comments</h3>

     {userId && (
  <div className="add-comment">
    <textarea
      placeholder={
        canRate
          ? "Write your comment..."
          : "Only users  can comment"
      }
    
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
    />

    <button
      onClick={handleAddComment}
      
    >
      Post Comment
    </button>
  </div>
)}


        {loadingComments ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.comment_id} className="comment-card">
              <strong>{c.users?.name}</strong>
              <span>
                {new Date(c.created_at).toLocaleDateString()}
              </span>
              <p>{c.description}</p>
            </div>
          ))
        )}
      </div>
      {/* 📦 Packages Section */}
<div className="packages-section">
  <h3>Available Packages</h3>

  {loadingPackages ? (
    <p>Loading packages...</p>
  ) : packages.length === 0 ? (
    <p className="no-packages">No packages available.</p>
  ) : (
    <div className="packages-grid">
      {packages.map((pkg) => (
        <div key={pkg.id} className="package-card">
          <img
            src={pkg.imgurl}
            alt={pkg.packagename}
            className="package-img"
          />

          <h4>{pkg.packagename}</h4>

          <p className="price">💰 {pkg.price} ₪</p>

          <ul>
            <li>📸 Photos: {pkg.numberofphoto}</li>
            <li>🎥 Videos: {pkg.numberofvidio}</li>
            <li>✨ Edited Photos: {pkg.numberofeditedphoto}</li>
          </ul>
        </div>
      ))}
    </div>
  )}
</div>

    </div>

    
  );
}
