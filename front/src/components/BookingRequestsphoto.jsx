import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../style/BookingRequestsPhoto.css";

export default function BookingRequestsphoto() {
  const ownerId = sessionStorage.getItem("idowner");
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!ownerId) {
        console.error("No ownerId found in sessionStorage");
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("reservations")
        .select(`
          reservations_id,
          user_id,
          owner_id,
          reservation_date,
          price,
          describtion,
          status,
          users ( name, city, phone ),
          package_reservation ( reservations_id , photography_id , photography ( packagename ) )
        `)
        .eq("owner_id", ownerId);

      if (error) {
        console.error("Error fetching bookings:", error.message);
      } else {
        setBookings(data);
      }

      setLoading(false);
    };

    fetchBookings();
  }, [ownerId]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleAction = async (reservationId, newStatus) => {
    // تحديث الـ status في جدول reservations
    const { data, error } = await supabase
      .from("reservations")
      .update({ status: newStatus })
      .eq("reservations_id", reservationId);

    if (error) {
      console.error("Error updating status:", error.message);
    } else {
      // تحديث الواجهة بدون إعادة تحميل الصفحة
      setBookings((prev) =>
        prev.map((booking) =>
          booking.reservations_id === reservationId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    }
  };

  return (
    <div className="booking-requests-page">

      <nav className="booking-navbar">
        <div className="navbar-right">
         <button onClick={() => navigate("/PhotographersPageOwnerhome")}>👤 Profile</button>
          <button onClick={() => navigate("/PackageManagementPhoto")}>📦 Package Management</button>

          <button onClick={() => navigate("/BookingRequestsphoto")}>📅 Booking Requests</button>
          <button onClick={() => navigate("/AddPackagephoto")}>➕ Add Package</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="booking-container">
        <h2>Booking Requests</h2>
        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Description</th>
                <th>Price</th>
                <th>Package Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.reservations_id}>
                  <td>{booking.users?.name}</td>
                  <td>{booking.users?.city}</td>
                  <td>{booking.users?.phone}</td>
                  <td>{booking.reservation_date}</td>
                  <td>{booking.describtion}</td>
                  <td>{booking.price} ₪</td>
                  <td>{booking.package_reservation?.[0]?.photography?.packagename}</td>
                  <td>
                    {booking.status ? (
                      <span className="status-badge status-pending">Accepted</span>
                    ) : (
                      <div className="booking-actions">
                        <button
                          className="accept-btn"
                          onClick={() => handleAction(booking.reservations_id, true)}
                        >
                          Accept
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleAction(booking.reservations_id, false)}
                        >
                          Reject
                        </button>
                      </div>
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