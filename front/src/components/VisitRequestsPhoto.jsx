import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../style/VisitRequestsPhoto.css";

export default function VisitRequestsPhoto() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    visit_date: "",
    visit_time: ""
  });
  const navigate = useNavigate();
  const ownerId = sessionStorage.getItem("ownerId_");

  useEffect(() => {
    const fetchVisits = async () => {
      if (!ownerId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("visit")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching visits:", error.message);
      } else {
        setVisits(data);
      }
      setLoading(false);
    };

    fetchVisits();
  }, [ownerId]);

  const handleAccept = async (id) => {
    const { error } = await supabase
      .from("visit")
      .update({ accept: true })
      .eq("id", id);

    if (error) {
      alert("Error accepting visit");
    } else {
      setVisits((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, accept: true } : v
        )
      );
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this visit?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("visit")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting visit");
    } else {
      setVisits((prev) => prev.filter((v) => v.id !== id));
    }
  };

  // Edit functions
  const handleEdit = (visit) => {
    setEditingId(visit.id);
    setEditValues({
      visit_date: visit.visit_date,
      visit_time: visit.visit_time
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({
      visit_date: "",
      visit_time: ""
    });
  };

  const handleSave = async (id) => {
    try {
      const { error } = await supabase
        .from("visit")
        .update({
          visit_date: editValues.visit_date,
          visit_time: editValues.visit_time
        })
        .eq("id", id);

      if (error) throw error;

      setVisits((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, ...editValues } : v
        )
      );
      setEditingId(null);
      alert("Visit updated successfully!");
    } catch (err) {
      console.error("Error updating visit:", err);
      alert("Failed to update visit");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  // تنسيق الوقت
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  // تنسيق تاريخ الإنشاء
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

  return (
    <div className="visit-requests-page">
      {/* Navbar */}
      <nav className="owner-navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-text">Wedding Planning System</span>
          </div>
        </div>
        
        <div className="navbar-right">
          <button onClick={() => navigate("/PhotographersPageOwnerhome")}>👤 Profile</button>
          <button onClick={() => navigate("/PackageManagementPhoto")}>📦 Package Management</button>
          <button onClick={() => navigate("/VisitRequestsPhoto")}>📋 Visit Requests</button>
          <button onClick={() => navigate("/BookingRequestsphoto")}>📅 Booking Requests</button>
          <button onClick={() => navigate("/AddPackagephoto")}>➕ Add Package</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="visit-container">
        <h2>Visit Requests 📅</h2>

        {loading ? (
          <p className="loading-text">Loading visits...</p>
        ) : visits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>No visit requests found.</p>
          </div>
        ) : (
          <div className="visit-table-container">
            <table className="visit-table">
              <thead>
                <tr>
                  <th>
                    <div className="header-title">VISIT DATE</div>
                    <div className="header-subtitle">VISIT TIME</div>
                  </th>
                  <th>
                    <div className="header-title">REQUESTED AT</div>
                  </th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => {
                  const requestedAt = formatCreatedAt(visit.created_at);
                  return (
                    <tr key={visit.id}>
                      <td className="visit-date-time-cell">
                        <div className="visit-date-main">
                          {editingId === visit.id ? (
                            <input
                              type="date"
                              name="visit_date"
                              value={editValues.visit_date}
                              onChange={handleChange}
                              className="edit-input date-input"
                            />
                          ) : (
                            formatDate(visit.visit_date)
                          )}
                        </div>
                        <div className="visit-time-value">
                          {editingId === visit.id ? (
                            <input
                              type="time"
                              name="visit_time"
                              value={editValues.visit_time}
                              onChange={handleChange}
                              className="edit-input time-input"
                            />
                          ) : (
                            formatTime(visit.visit_time)
                          )}
                        </div>
                      </td>
                      
                      <td className="requested-at-cell">
                        <div className="requested-at-date">{requestedAt.date}</div>
                        <div className="requested-at-time">{requestedAt.time}</div>
                      </td>
                      
                      <td className="status-cell">
                        <span className={`status-badge ${visit.accept ? 'status-accepted' : 'status-pending'}`}>
                          {visit.accept ? "ACCEPTED" : "PENDING"}
                        </span>
                      </td>
                      
                      <td className="actions-cell">
                        {editingId === visit.id ? (
                          <>
                            <button
                              onClick={() => handleSave(visit.id)}
                              className="save-btn"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(visit)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(visit.id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                            {!visit.accept && (
                              <button
                                onClick={() => handleAccept(visit.id)}
                                className="accept-btn"
                              >
                                Accept
                              </button>
                            )}
                          </>
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