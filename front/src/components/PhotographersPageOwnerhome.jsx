import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import "../style/PhotographersPageOwnerhome.css";

export default function PhotographersPageOwnerhome() {
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId_");
  const ownerId = sessionStorage.getItem("ownerId_");

  const [userData, setUserData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    description: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // Save edited data
  const handleSave = async () => {
    try {
      await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
        })
        .eq("id", userId);

      await supabase
        .from("owners")
        .update({
          description: formData.description,
        })
        .eq("user_id", userId);

      setUserData({ ...userData, ...formData });
      setOwnerData({ ...ownerData, description: formData.description });

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("email, name, phone, city")
          .eq("id", userId)
          .single();
        
        if (userError) {
          console.error("User fetch error:", userError);
          throw userError;
        }

        const { data: owner, error: ownerError } = await supabase
          .from("owners")
          .select("rate, rating_count, description")
          .eq("user_id", userId)
          .single();
        
        // Owner data is optional
        if (ownerError) {
          console.warn("Owner data not found, continuing without it:", ownerError);
        }

        setUserData(user);
        setOwnerData(owner || { rate: 0, rating_count: 0, description: "" });

        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          city: user.city || "",
          description: (owner?.description) || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfileData();
  }, [userId]);

  return (
    <div className="photographer-owner-page">
      {/* NAVBAR (EXACTLY like Hall page) */}
      <nav className="owner-navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-text">Wedding Planning System</span>
          </div>
        </div>
        
        <div className="navbar-right">
          <button onClick={() => navigate("/PhotographersPageOwnerhome")}>👤 Profile</button>
          <button onClick={() => navigate("/PackageManagementPhoto")}>📦 Package Management</button>

          <button onClick={() => navigate("/BookingRequestsphoto")}>📅 Booking Requests</button>
          <button onClick={() => navigate("/AddPackagephoto")}>➕ Add Package</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* PROFILE CONTENT */}
      <div className="profile-container">
        <h2 className="profile-title">Photographer Profile</h2>
        
        {loading ? (
          <p className="loading-text">Loading profile...</p>
        ) : (
          <>
            {/* User Info */}
            <div className="profile-section">
              <h3>Personal Information</h3>

              <div className="profile-field">
                <label>Email</label>
                <span>{userData?.email}</span>
              </div>

              <div className="profile-field">
                <label>Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                ) : (
                  <span>{userData?.name}</span>
                )}
              </div>

              <div className="profile-field">
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <span>{userData?.phone}</span>
                )}
              </div>

              <div className="profile-field">
                <label>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                ) : (
                  <span>{userData?.city}</span>
                )}
              </div>
            </div>

            {/* Owner Info */}
            <div className="profile-section">
              <h3>Business Information</h3>

              <div className="profile-field">
                <label>Rate</label>
                <span>⭐ {ownerData?.rate || "No ratings yet"}</span>
              </div>

              <div className="profile-field">
                <label>Rating Count</label>
                <span>{ownerData?.rating_count}</span>
              </div>

              <div className="profile-field">
                <label>Description</label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your photography services..."
                  />
                ) : (
                  <span className="description">
                    {ownerData?.description || "No description provided"}
                  </span>
                )}
              </div>
            </div>

            {/* Edit / Save Buttons */}
            <div className="action-buttons">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="save-btn">Save Changes</button>
                  <button
                    onClick={() => {
                      setFormData({
                        name: userData.name,
                        phone: userData.phone,
                        city: userData.city,
                        description: ownerData.description,
                      });
                      setIsEditing(false);
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}