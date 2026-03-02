import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function DecorationOwnerDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [ownerIdVar, setOwnerIdVar] = useState(null);
const cities = ["Ramallah", "Jerusalem", "Bethlehem", "Nablus", "Hebron", "Gaza"]; // عدلي حسب المدن المتوفرة

  const userId = sessionStorage.getItem("ownerId_");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        // جلب بيانات المستخدم
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (userError || !user) {
          console.error("Error fetching user:", userError);
          setLoading(false);
          return;
        }

        setUserData(user);
        setFormData({
          name: user.name,
          email: user.email,
          city: user.city,
          phone: user.phone,
        });

        // جلب بيانات الـ owner
        const { data: owner, error: ownerError } = await supabase
          .from("owners")
          .select("owner_id, description, rate, rating_count")
          .eq("user_id", user.id)
          .single();

        if (ownerError || !owner) {
          console.error("Error fetching owner:", ownerError);
        } else {
          setOwnerData(owner);
          setOwnerIdVar(owner.owner_id);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [userId, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("ownerId_");
    sessionStorage.removeItem("userId_");
    navigate("/login");
  };

  const handleEditToggle = () => setEditing(!editing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          email: formData.email,
          city: formData.city,
          phone: formData.phone,
        })
        .eq("id", userData.id);

      if (error) {
        alert("Failed to update profile: " + error.message);
        return;
      }

      setUserData({ ...userData, ...formData });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving.");
    }
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
  if (!userData) return <p style={{ padding: "40px" }}>No user found.</p>;

  return (
    <div>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.brand}>WPS Owner Panel</div>
        <div style={styles.links}>
          <button
            style={{ ...styles.linkBtn, cursor: "default", fontWeight: "bold" }}
          >
            Profile
          </button>
          <button
            style={styles.linkBtn}
            onClick={() => navigate("/ManageDecorationItems")}
          >
            Manage Items
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Profile Card */}
      <div style={{ padding: "40px" }}>
        <h2>Decoration Owner Profile</h2>
        <div style={styles.card}>
          {/* Editable Fields */}
          <p>
            <strong>Name:</strong>{" "}
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            ) : (
              userData.name
            )}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            ) : (
              userData.email
            )}
          </p>
     <p>
  <strong>City:</strong>{" "}
  {editing ? (
    <select
      name="city"
      value={formData.city}
      onChange={handleChange}
    >
      <option value="">Select City</option>
      {cities.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  ) : (
    userData.city
  )}
</p>
          <p>
            <strong>Phone:</strong>{" "}
            {editing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            ) : (
              userData.phone
            )}
          </p>

          {/* Non-editable Fields */}
          <p><strong>Role:</strong> {userData.role}</p>
          {ownerData ? (
            <>
              <hr />
              <p><strong>Owner ID:</strong> {ownerData.owner_id}</p>
              <p><strong>Description:</strong> {ownerData.description}</p>
              <p><strong>Rate:</strong> {ownerData.rate}</p>
              <p><strong>Rating Count:</strong> {ownerData.rating_count}</p>
            </>
          ) : (
            <p>No owner data found.</p>
          )}

          {/* Buttons */}
          <div style={{ marginTop: "20px" }}>
            {editing ? (
              <>
                <button style={styles.saveBtn} onClick={handleSave}>
                  Save
                </button>
                <button style={styles.cancelBtn} onClick={handleEditToggle}>
                  Cancel
                </button>
              </>
            ) : (
              <button style={styles.editBtn} onClick={handleEditToggle}>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#D4AF37",
    padding: "10px 20px",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1.4rem",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
  },
  logoutBtn: {
    background: "#fff",
    color: "#D4AF37",
    border: "none",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  card: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "500px",
  },
  editBtn: {
    background: "#D4AF37",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
  },
  saveBtn: {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
  },
  cancelBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};