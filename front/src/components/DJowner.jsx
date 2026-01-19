import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function VisitFormHall() {
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId_");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error) setUser(data);
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <h3 style={styles.logo}>Wedding Planner</h3>

        <div style={styles.links}>
          <button  style={styles.btn}>
            Home
          </button>

          <button onClick={() => navigate("/DJprofile")} style={styles.btn}>
            Profile
          </button>

          <button onClick={() => navigate("/DjpackageManagement")} style={styles.btn}>
            Package Management
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ padding: "20px" }}>
        <h2>Welcome 👋</h2>

        {user ? (
          <p>
            👤 User: <strong>{user.name}</strong>
          </p>
        ) : (
          <p>👤 User: not logged in</p>
        )}
      </div>
    </div>
  );
}

/* styles */
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#222",
    color: "#fff",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "15px",
  },
  btn: {
    background: "transparent",
    border: "1px solid #fff",
    color: "#fff",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: "6px",
  },
};
