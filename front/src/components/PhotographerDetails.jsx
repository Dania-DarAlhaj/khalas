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
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [reservationData, setReservationData] = useState({
    reservation_date: "",
    reservation_time: "",
    notes: ""
  });

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

      fetchPackages(owner.user_id);
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

  const fetchPackages = async (userId) => {
    if (!userId) return;
    
    setLoadingPackages(true);
    try {
      const { data, error } = await supabase
        .from("photography")
        .select("id, packagename, price, numberofphoto, numberofvidio, numberofeditedphoto, imgurl")
        .eq("user_id", userId);

      if (error) throw error;
      
      setPackages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPackages(false);
    }
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

  /* ================= RESERVATION ================= */
  const handleReservation = (pkg) => {
    if (!userId) {
      alert("Please login to make a reservation.");
      return;
    }
    setSelectedPackage(pkg);
    setShowReservationForm(true);
  };

  const handleReservationSubmit = async () => {
    if (!selectedPackage || !reservationData.reservation_date || !reservationData.reservation_time) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const { error } = await supabase
        .from("reservations")
        .insert({
          user_id: userId,
          owner_id: ownerId,
          package_id: selectedPackage.id,
          reservation_date: reservationData.reservation_date,
          reservation_time: reservationData.reservation_time,
          notes: reservationData.notes,
          status: "PENDING"
        });

      if (error) throw error;

      alert("Reservation request sent successfully! The photographer will review your request.");
      setShowReservationForm(false);
      setSelectedPackage(null);
      setReservationData({
        reservation_date: "",
        reservation_time: "",
        notes: ""
      });
    } catch (err) {
      console.error(err);
      alert("Failed to make reservation.");
    }
  };

  /* ================= UI ================= */
  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading photographer details...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">❌</div>
      <h2>Error Loading Photographer</h2>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="photographer-details-page">
      {/* Photographer Header */}
      <div className="photographer-header">
        <div className="header-content">
          <div className="photographer-info">
            <h1>{photographer.name}</h1>
            <div className="contact-info">
              <span className="contact-item">
                <i className="icon">📞</i>
                {photographer.phone}
              </span>
              <span className="contact-item">
                <i className="icon">📍</i>
                {photographer.city}
              </span>
            </div>
            <p className="description">{photographer.description}</p>
          </div>
          
          {/* Rating Section */}
          <div className="rating-display">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${hoverRating >= star || photographer.rate >= star ? 'active' : ''}`}
                  onMouseEnter={() => canRate && setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => canRate && handleRating(star)}
                  style={{ cursor: canRate ? 'pointer' : 'default' }}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="rating-details">
              <span className="rating-value">{photographer.rate.toFixed(1)}</span>
              <span className="rating-count">({photographer.rating_count} reviews)</span>
            </div>
          </div>
        </div>
        
       
      </div>

      {/* Packages Section */}
      <section className="packages-section">
        <div className="section-header">
          <h2>📦 Available Packages</h2>


        </div>

        {loadingPackages ? (
          <div className="loading-packages">
            <div className="loading-spinner"></div>
            <p>Loading packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="no-packages">
            <div className="empty-icon">📭</div>
            <h3>No packages available</h3>
            <p>This photographer hasn't added any packages yet.</p>
          </div>
        ) : (
          <div className="packages-grid">
            {packages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className="package-header">
                  <h3 className="package-title">{pkg.packagename}</h3>
                  <div className="package-price">${pkg.price}</div>
                </div>
                
                <div className="package-features">
                  <div className="feature">
                    <i className="feature-icon">📸</i>
                    <div className="feature-content">
                      <span className="feature-label">number of Photos</span>
                      <span className="feature-value">{pkg.numberofphoto}</span>
                    </div>
                  </div>
                  
                  <div className="feature">
                    <i className="feature-icon">🎥</i>
                    <div className="feature-content">
                      <span className="feature-label"> number of Videos</span>
                      <span className="feature-value">{pkg.numberofvidio}</span>
                    </div>
                  </div>
                  
                  <div className="feature">
                    <i className="feature-icon">✨</i>
                    <div className="feature-content">
                      <span className="feature-label">number of Edited Photos</span>
                      <span className="feature-value">{pkg.numberofeditedphoto}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="reserve-btn"
                  onClick={() => handleReservation(pkg)}
                >
                  Reserve This Package
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Comments Section */}
      <section className="comments-section">
        <div className="section-header">
          <h2>💬 Customer Reviews</h2>
          <p className="section-subtitle">See what others are saying about {photographer.name}</p>
        </div>

        {/* Add Comment Form */}
        {userId && (
          <div className="add-comment-card">
            <h4>Add Your Review</h4>
            <textarea
              className="comment-input"
              placeholder={
                 "Share your experience with this photographer..."
                  
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              
              rows={4}
            />
            <div className="comment-actions">
              <button
                className="submit-comment-btn"
                onClick={handleAddComment}
                disabled={  !newComment.trim()}
              >
                Post Review
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        {loadingComments ? (
          <div className="loading-comments">
            <div className="loading-spinner"></div>
            <p>Loading reviews...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <div className="empty-icon">💬</div>
            <h3>No reviews yet</h3>
            <p>Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="comments-grid">
            {comments.map((comment) => (
              <div key={comment.comment_id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-author">
                    <div className="author-avatar">
                      {comment.users?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="author-info">
                      <strong className="author-name">{comment.users?.name || 'Anonymous'}</strong>
                      <span className="comment-date">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="comment-text">{comment.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reservation Modal */}
      {showReservationForm && (
        <div className="modal-overlay">
          <div className="reservation-modal">
            <div className="modal-header">
              <h3>Reserve Package</h3>
              <button 
                className="close-modal"
                onClick={() => setShowReservationForm(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="selected-package-info">
                <h4>{selectedPackage?.packagename}</h4>
                <p className="package-price-modal">${selectedPackage?.price}</p>
              </div>
              
              <div className="reservation-form">
                <div className="form-group">
                  <label>Reservation Date *</label>
                  <input
                    type="date"
                    value={reservationData.reservation_date}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      reservation_date: e.target.value
                    })}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-group">
                  <label>Reservation Time *</label>
                  <input
                    type="time"
                    value={reservationData.reservation_time}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      reservation_time: e.target.value
                    })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Additional Notes (Optional)</label>
                  <textarea
                    value={reservationData.notes}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      notes: e.target.value
                    })}
                    className="form-textarea"
                    placeholder="Any special requests or details..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowReservationForm(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-reservation-btn"
                onClick={handleReservationSubmit}
              >
                Send Reservation Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}