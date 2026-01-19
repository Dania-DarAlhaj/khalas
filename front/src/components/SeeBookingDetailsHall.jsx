import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import '../style/SeeBookingDetails.css';

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

  if (loading) return <p>Loading reservations...</p>;

  return (
    <div className="owner-details-page">
      {/* === NAVBAR === */}
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">Wedding Planing System</span>
      </div>
      <div className="navbar-right">
        <button onClick={() => navigate("/VenueOwnerPage", { state: { userId } })}>👤 Profile</button>
        <button onClick={() => navigate("/VisitFormHall", { state: { userId } })}>📋 Visit Form</button>
        <button onClick={() => navigate("/OwnerSearchBookings", { state: { userId } })}>🔍 Search</button>
        <button onClick={() => navigate("/AddBookingByOwnerHall", { state: { userId } })}>➕ Add Booking</button>
        <button>📊 See Booking Details</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
<table className="booking-table">
  <thead>
    <tr>
   
      <th>Reservation Date</th>
      <th>Price</th>
      <th>Description</th>
      <th>Requst At</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {reservations.map(r => (
      <tr key={r.reservations_id}>
      
        <td>{r.reservation_date}</td>
        <td>{r.price}</td>

        <td>{r.describtion}</td>
       <td>{new Date(r.reservation_date).toLocaleDateString()}</td>

        <td>
          <button className="edit">Edit</button>
          <button className="cancel">Cancel</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
