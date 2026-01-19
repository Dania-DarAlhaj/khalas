import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import '../style/VisitFormHall.css';


export default function VisitFormHall() {
  const navigate = useNavigate();
  const ownerId = sessionStorage.getItem("ownerId_");

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch visits for this owner
  useEffect(() => {
    const fetchVisits = async () => {
      const { data, error } = await supabase
        .from("visit")
        .select("*")
        .eq("owner_id", ownerId)
        .order("visit_date", { ascending: true });

      if (error) {
        console.error("Error fetching visits:", error);
      } else {
        setVisits(data);
      }
      setLoading(false);
    };

    fetchVisits();
  }, [ownerId]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };
const handleAccept = async (visitId) => {
  const { error } = await supabase
    .from("visit")
    .update({ accept: true })
    .eq("id", visitId);

  if (error) {
    console.error("Error accepting visit:", error);
    alert("Something went wrong 😬");
  } else {
    // Update UI without refresh
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId ? { ...v, accept: true } : v
      )
    );
  }
};
// في ملف VisitFormHall.js - استبدل الكود القديم بهذا:

return (
  <div>
    {/* === NAVBAR === */}
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <span className="logo-text">Wedding Planning System</span>
        </div>
      </div>
 <div className="navbar-right">
  <button onClick={() => navigate("/VenueOwnerPage", { state: { ownerId } })}>👤 Profile</button>
  <button onClick={() => navigate("/VisitFormHall", { state: { ownerId } })}>📋 Visit Form</button>
  <button onClick={() => navigate(`/OwnerSearchBookings/${ownerId}`)}>🔍 Search</button>
  <button onClick={() => navigate("/AddBookingByOwnerHall", { state: { ownerId } })}>➕ Add Booking</button>
  <button onClick={() => navigate("/SeeBookingDetailsHall", { state: { ownerId } })}>📊 See Bookings Details</button>
  <button className="logout-btn" onClick={handleLogout}>Logout</button>
</div>

    </nav>

    {/* === CONTENT === */}
    <div className="content-container">
      <h2 className="page-header">📅 Visits</h2>

      {loading ? (
        <p className="loading-state">Loading visits...</p>
      ) : visits.length === 0 ? (
        <p className="empty-state">No visits yet 😴</p>
      ) : (
        <table className="visits-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id}>
                <td>{visit.visit_date}</td>
                <td>{visit.visit_time}</td>
                <td>{new Date(visit.created_at).toLocaleString()}</td>
                <td>
                  {visit.accept ? (
                    <span className="status-badge status-accepted">Accepted</span>
                  ) : (
                    <span className="status-badge status-rejected">Rejected</span>
                  )}
                </td>
                <td>
                  {!visit.accept && (
                    <button className="action-button" onClick={() => handleAccept(visit.id)}>
                      Accept
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);
}
