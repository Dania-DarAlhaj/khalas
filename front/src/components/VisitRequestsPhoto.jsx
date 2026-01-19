import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
export default function VisitRequestsPhoto() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
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
    // نحدّث الواجهة بدون إعادة تحميل
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

  return (
    <>
        <nav className="owner-navbar">
      <button onClick={() => navigate("/PhotographersPageOwnerhome")}>Profile</button>
      <button onClick={() => navigate("/PackageManagementPhoto")}>Package Management</button>
      <button onClick={() => navigate("/VisitRequestsPhoto")}>Visit Requests</button>
      <button onClick={() => navigate("/BookingRequestsphoto")}>Booking Requests</button>
      <button onClick={() => navigate("/AddPackagephoto")}>Add Package</button>
      <button onClick={handleLogout}>Logout</button>
    </nav>

    <div style={{ maxWidth: "900px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Visit Requests</h2>

      {loading ? (
        <p>Loading visits...</p>
      ) : visits.length === 0 ? (
        <p>No visits found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#4f46e5", color: "#fff" }}>
          
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Visit Date</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Visit Time</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Created At</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Accept</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Actions</th>

            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id} style={{ textAlign: "center", backgroundColor: "#f9f9f9" }}>
           
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{visit.visit_date}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{visit.visit_time}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{new Date(visit.created_at).toLocaleString()}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{visit.accept ? "Yes" : "No"}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
  {!visit.accept && (
    <button
      onClick={() => handleAccept(visit.id)}
      style={{
        marginRight: "8px",
        padding: "5px 10px",
        backgroundColor: "#10b981",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Accept
    </button>
  )}

  <button
    onClick={() => handleDelete(visit.id)}
    style={{
      padding: "5px 10px",
      backgroundColor: "#ef4444",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    Delete
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
}
