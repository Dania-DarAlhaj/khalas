import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import '../style/PhotographerDetails.css';
export default function PhotographerDetails() {
  const { ownerId } = useParams();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // فحص تسجيل الدخول
  const userId = sessionStorage.getItem("userId_"); // نفس اللي مخزنه عند تسجيل الدخول

  useEffect(() => {
    if (!ownerId) return;

    const fetchPhotographer = async () => {
      setLoading(true);
      try {
        const { data: ownerData, error: ownerError } = await supabase
          .from("owners")
          .select("owner_id, user_id, rate, description, rating_count")
          .eq("owner_id", ownerId)
          .single();

        if (ownerError) throw ownerError;

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, name, phone, city")
          .eq("id", ownerData.user_id)
          .single();

        if (userError) throw userError;

        setPhotographer({
          owner_id: ownerData.owner_id,
          user_id: ownerData.user_id,
          name: userData.name,
          phone: userData.phone,
          city: userData.city,
          rate: ownerData.rate,
          description: ownerData.description,
          rating_count: ownerData.rating_count,
        });
      } catch (err) {
        console.error("Error fetching photographer details:", err);
        setError("Failed to load photographer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographer();
  }, [ownerId]);

  if (loading) return <p>Loading photographer details...</p>;
  if (error) return <p>{error}</p>;
  if (!photographer) return <p>No photographer found.</p>;

  const getStarColor = (starNumber) => {
    if (hoverRating >= starNumber) return "#FFD700";
    if (!hoverRating && photographer.rate >= starNumber) return "#FFD700";
    return "#ccc";
  };

  const handleRating = async (rating) => {
    if (!userId) {
      alert("You must be logged in to rate this photographer.");
      return;
    }

    setUserRating(rating);

    try {
      const newRate = ((photographer.rate * photographer.rating_count + rating) / (photographer.rating_count + 1)).toFixed(1);
      const newCount = photographer.rating_count + 1;

      const { error } = await supabase
        .from("owners")
        .update({ rate: newRate, rating_count: newCount })
        .eq("owner_id", photographer.owner_id);

      if (error) throw error;

      setPhotographer(prev => ({
        ...prev,
        rate: parseFloat(newRate),
        rating_count: newCount
      }));

      alert("Thank you for your rating!");
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("Failed to submit rating.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{photographer.name}</h1>
      <p><strong>Phone:</strong> {photographer.phone}</p>
      <p><strong>City:</strong> {photographer.city}</p>
      <p><strong>Description:</strong> {photographer.description}</p>

      {/* تقييم النجوم */}
      <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            style={{
              fontSize: "2rem",
              cursor: userId ? "pointer" : "not-allowed", // يظهر للغير مسجل كـ غير قابل للنقر
              color: getStarColor(star),
              marginRight: "5px"
            }}
            onMouseEnter={() => userId && setHoverRating(star)}
            onMouseLeave={() => userId && setHoverRating(0)}
            onClick={() => handleRating(star)}
            title={userId ? `Rate ${star} stars` : "Log in to rate"}
          >
            ★
          </span>
        ))}
        <span style={{ marginLeft: "10px", fontSize: "1rem", color: "#555" }}>
          {photographer.rate.toFixed(1)} ({photographer.rating_count} reviews)
        </span>
      </div>

      <p><strong>User ID:</strong> {photographer.user_id}</p>
      <p><strong>Owner ID:</strong> {photographer.owner_id}</p>
    </div>
  );
}
