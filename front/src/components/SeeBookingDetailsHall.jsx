import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/SeeBookingDetails.css";

export default function ReservationsTable() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // ================= FETCH =================
  useEffect(() => {
    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("reservation_date", { ascending: false });

      if (error) {
        console.error("Error fetching reservations:", error);
      } else {
        setReservations(data);
      }
      setLoading(false);
    };

    fetchReservations();
  }, []);

  // ================= ACCEPT =================
const handleAccept = async (reservationId) => {
  const confirmAccept = window.confirm("Are you sure you want to accept this reservation?");
  if (!confirmAccept) return;

  const { data: updatedData, error: updateError } = await supabase
    .from("reservations")
    .update({ status: true })
    .eq("reservations_id", reservationId)
    .select();

  if (updateError) return alert("Failed to accept reservation");

  setReservations(prev =>
    prev.map(r => r.reservations_id === reservationId ? { ...r, status: true } : r)
  );

  const userId = updatedData[0].user_id;
  const { data: user } = await supabase
    .from("users")
    .select("name,email")
    .eq("id", userId)
    .single();

 
};
  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to reject this reservation?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("reservations_id", id);

    if (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete reservation");
    } else {
      setReservations((prev) =>
        prev.filter((r) => r.reservations_id !== id)
      );
    }
  };

  if (loading) return <p>Loading reservations...</p>;

  return (
    <div className="owner-details-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-text">Wedding Planning System</span>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/VenueOwnerPage", { state: { userId } })}>
            👤 Profile
          </button>
          <button onClick={() => navigate("/VisitFormHall", { state: { userId } })}>
            📋 Visit Form
          </button>
          <button onClick={() => navigate("/OwnerSearchBookings", { state: { userId } })}>
            🔍 Search
          </button>
          <button onClick={() => navigate("/AddBookingByOwnerHall", { state: { userId } })}>
            ➕ Add Booking
          </button>
          <button>📊 See Booking Details</button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* TABLE */}
      <table className="booking-table">
        <thead>
          <tr>
            <th>Reservation Date</th>
            <th>Price</th>
            <th>Description</th>
            <th>Request At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((r) => (
            <tr key={r.reservations_id}>
              <td>{r.reservation_date}</td>
              <td>{r.price}</td>
              <td>{r.describtion}</td>
              <td>{new Date(r.reservation_date).toLocaleDateString()}</td>
              <td>
                {/* ✅ Accept Button */}
                <button
                  className="accept"
                  disabled={r.status}
                  onClick={() => handleAccept(r.reservations_id)}
                >
                  {r.status ? "Accepted" : "Accept"}
                </button>

                {/* ❌ Reject Button */}
                <button
                  className="cancel"
                  onClick={() => handleDelete(r.reservations_id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}