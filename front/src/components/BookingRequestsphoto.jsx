import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../style/BookingRequestsPhoto.css";

export default function BookingRequestsphoto() {
  const ownerId = sessionStorage.getItem("ownerId_");
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    reservation_date: "",
    reservation_time: ""
  });

  // ================= FETCH =================
  useEffect(() => {
    const fetchBookings = async () => {
      if (!ownerId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          user:user_id (
            name,
            email,
            phone
          ),
          package:package_id (
            name,
            price
          )
        `)
        .eq("owner_id", ownerId)
        .eq("status", "PENDING") // فقط الحجوزات المعلقة
        .order("created_at", { ascending: false });

      if (!error) {
        setBookings(data);
      } else {
        console.error("Error fetching bookings:", error);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [ownerId]);

  // ================= HANDLE ACTIONS =================
  const handleAccept = async (id) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ 
          status: "ACCEPTED",
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      // إزالة الحجز من القائمة
      setBookings(prev => prev.filter(booking => booking.id !== id));
      alert("Booking accepted successfully!");
    } catch (error) {
      console.error("Error accepting booking:", error);
      alert("Failed to accept booking");
    }
  };

  const handleReject = async (id) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ 
          status: "CANCELLED",
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      // إزالة الحجز من القائمة
      setBookings(prev => prev.filter(booking => booking.id !== id));
      alert("Booking rejected successfully!");
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking");
    }
  };

  const handleEdit = (booking) => {
    setEditingId(booking.id);
    setEditValues({
      reservation_date: booking.reservation_date,
      reservation_time: booking.reservation_time
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({
      reservation_date: "",
      reservation_time: ""
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({
          reservation_date: editValues.reservation_date,
          reservation_time: editValues.reservation_time,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      // تحديث الحجز في القائمة
      setBookings(prev =>
        prev.map(booking =>
          booking.id === id 
            ? { 
                ...booking, 
                reservation_date: editValues.reservation_date,
                reservation_time: editValues.reservation_time
              } 
            : booking
        )
      );
      
      setEditingId(null);
      alert("Booking updated successfully!");
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // ================= FORMAT FUNCTIONS =================
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  const formatCreatedAt = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
    return { date: formattedDate, time: formattedTime };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // ================= UI =================
  return (
    <div className="booking-requests-page">
      {/* Navbar */}
      <nav className="booking-navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-text">Wedding Planning System</span>
          </div>
        </div>
        
        <div className="navbar-right">
          <button onClick={() => navigate("/PhotographersPageOwnerhome")}>👤 Profile</button>
          <button onClick={() => navigate("/PackageManagementPhoto")}>📦 Packages</button>
          <button onClick={() => navigate("/VisitRequestsPhoto")}>📋 Visits</button>
          <button className="active-nav-btn" onClick={() => navigate("/BookingRequestsphoto")}>🔄 Booking Requests</button>
          <button onClick={() => navigate("/AddPackagephoto")}>➕ Add Package</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="booking-container">
        <h2>📋 Booking Requests</h2>
        <p className="page-subtitle">Manage pending booking requests from customers</p>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading booking requests...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No Pending Requests</h3>
            <p className="empty-state-sub">When customers book your packages, they will appear here.</p>
          </div>
        ) : (
          <div className="booking-table-container">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>
                    <div className="header-title">BOOKING DATE</div>
                    <div className="header-subtitle">BOOKING TIME</div>
                  </th>
                  <th>
                    <div className="header-title">REQUESTED AT</div>
                  </th>
                  <th>
                    <div className="header-title">CUSTOMER</div>
                    <div className="header-subtitle">PACKAGE & PRICE</div>
                  </th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const requestedAt = formatCreatedAt(booking.created_at);
                  return (
                    <tr key={booking.id}>
                      {/* Booking Date & Time */}
                      <td className="booking-date-time-cell">
                        <div className="booking-date-main">
                          {editingId === booking.id ? (
                            <input
                              type="date"
                              name="reservation_date"
                              value={editValues.reservation_date}
                              onChange={handleChange}
                              className="edit-input date-input"
                            />
                          ) : (
                            formatDate(booking.reservation_date)
                          )}
                        </div>
                        <div className="booking-time-value">
                          {editingId === booking.id ? (
                            <input
                              type="time"
                              name="reservation_time"
                              value={editValues.reservation_time}
                              onChange={handleChange}
                              className="edit-input time-input"
                            />
                          ) : (
                            formatTime(booking.reservation_time)
                          )}
                        </div>
                      </td>
                      
                      {/* Requested At */}
                      <td className="requested-at-cell">
                        <div className="requested-at-date">{requestedAt.date}</div>
                        <div className="requested-at-time">{requestedAt.time}</div>
                      </td>
                      
                      {/* Customer & Package Info */}
                      <td className="customer-package-cell">
                        <div className="customer-name">
                          {booking.user?.name || "N/A"}
                        </div>
                        <div className="customer-contact">
                          📧 {booking.user?.email || "N/A"}
                        </div>
                        <div className="customer-contact">
                          📞 {booking.user?.phone || "N/A"}
                        </div>
                        <div className="package-info">
                          <strong>{booking.package?.name || "N/A"}</strong>
                        </div>
                        <div className="package-price">
                          {formatCurrency(booking.package?.price || 0)}
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="status-cell">
                        <span className="status-badge status-pending">
                          {booking.status}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="actions-cell">
                        {editingId === booking.id ? (
                          <div className="edit-actions">
                            <button
                              onClick={() => handleSaveEdit(booking.id)}
                              className="save-btn"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="booking-actions">
                            <button
                              onClick={() => handleAccept(booking.id)}
                              className="accept-btn"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(booking.id)}
                              className="reject-btn"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleEdit(booking)}
                              className="edit-btn"
                            >
                              Edit Date/Time
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}