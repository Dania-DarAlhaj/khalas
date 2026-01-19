import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function OwnerReservations() {
  const ownerId = sessionStorage.getItem("ownerId_");
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchReservations = async () => {
      if (!ownerId) return;

      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });

      if (!error) setReservations(data);
      setLoading(false);
    };

    fetchReservations();
  }, [ownerId]);

  

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // ================= UI =================
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

</>
  );
}
