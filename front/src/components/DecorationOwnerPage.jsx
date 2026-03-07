import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import '../style/DecorationOwnerPage.css'; // راح نضيف ملف CSS جديد

export default function DecorationOwnerDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [ownerIdVar, setOwnerIdVar] = useState(null);
  
  const cities = ["Ramallah", "Jerusalem", "Bethlehem", "Nablus", "Hebron", "Gaza", "Jenin", "Tulkarm", "Qalqilya", "Salfit", "Tubas", "Jericho"];

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
          name: user.name || "",
          email: user.email || "",
          city: user.city || "",
          phone: user.phone || "",
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
          setFormData(prev => ({
            ...prev,
            description: owner.description || "",
          }));
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

  const handleEditToggle = () => setEditMode(!editMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // تحديث بيانات المستخدم
      const { error: userError } = await supabase
        .from("users")
        .update({
          name: formData.name,
          email: formData.email,
          city: formData.city,
          phone: formData.phone,
        })
        .eq("id", userData.id);

      if (userError) {
        alert("Failed to update profile: " + userError.message);
        return;
      }

      // تحديث وصف owner إذا كان موجود
      if (ownerData && formData.description !== ownerData.description) {
        const { error: ownerError } = await supabase
          .from("owners")
          .update({
            description: formData.description,
          })
          .eq("owner_id", ownerData.owner_id);

        if (ownerError) {
          alert("Failed to update description: " + ownerError.message);
          return;
        }
      }

      setUserData({ ...userData, ...formData });
      if (ownerData) {
        setOwnerData({ ...ownerData, description: formData.description });
      }
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving.");
    }
  };

  if (loading) return (
    <div className="decoration-loading">
      <p>Loading your profile...</p>
    </div>
  );
  
  if (!userData) return (
    <div className="decoration-loading">
      <p>No user found. Please login again.</p>
    </div>
  );

  return (
    <div className="decoration-owner-page">
      {/* Navbar - نفس تصميم VenueOwnerPage */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-text">Wedding Planning System</span>
        </div>
        <div className="navbar-right">
          <button className={editMode ? "active" : ""} onClick={() => setEditMode(true)}>
            👤 Profile
          </button>
          <button onClick={() => navigate("/ManageDecorationItems", { state: { ownerId: ownerIdVar } })}>
            🎨 Manage Items
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Page Title */}
      <h2>Decoration Owner Dashboard</h2>
      
      {/* Profile Section */}
      <div className="section">
        <p>Business Owner Information</p>
        
        <div className="form-grid">
          {/* Owner Fields - 2 columns */}
          <label>
            <span>Full Name</span>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              disabled={!editMode}
              placeholder="Enter your full name"
            />
          </label>

          <label>
            <span>Email</span>
            <input 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Enter your email"
            />
          </label>

          <label>
            <span>Phone</span>
            <input 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Enter your phone number"
            />
          </label>

          <label>
            <span>City</span>
            <select 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              disabled={!editMode}
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </label>

          {/* Description - Full width */}
          <label style={{ gridColumn: "1 / -1" }}>
            <span>Business Description</span>
            <textarea 
              name="description" 
              value={formData.description || ""} 
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Describe your decoration business..."
              rows="4"
            />
          </label>

          {/* Non-editable fields - Read only */}
          <label>
            <span>Role</span>
            <input 
              value={userData.role || "decoration_owner"} 
              disabled={true}
              className="readonly-field"
            />
          </label>

          {ownerData && (
            <>
              <label>
                <span>⭐ Rating</span>
                <input 
                  value={`${ownerData.rate || 0} / 5 (${ownerData.rating_count || 0} reviews)`} 
                  disabled={true}
                  className="readonly-field"
                />
              </label>
              
              <label>
                <span>🆔 Owner ID</span>
                <input 
                  value={ownerData.owner_id || "N/A"} 
                  disabled={true}
                  className="readonly-field"
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <button className="edit-btn" onClick={handleEditToggle}>
        {editMode ? "Cancel" : "Edit Profile"}
      </button>

      {editMode && (
        <button type="button" className="save-btn" onClick={handleSave}>
          Save All Changes
        </button>
      )}
    </div>
  );
}