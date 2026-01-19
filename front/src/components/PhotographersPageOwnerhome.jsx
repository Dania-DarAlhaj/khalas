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
        .eq("owner_id", ownerId);

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
        setLoading(true);
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("email, name, phone, city")
          .eq("id", userId)
          .single();
        if (userError) throw userError;

        const { data: owner, error: ownerError } = await supabase
          .from("owners")
          .select("rate, rating_count, description")
          .eq("owner_id", ownerId)
          .single();
        if (ownerError) throw ownerError;

        setUserData(user);
        setOwnerData(owner);

        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          city: user.city || "",
          description: owner.description || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && ownerId) fetchProfileData();
  }, [userId, ownerId]);

  return (
    <div>
      {/* NAVBAR */}
      <nav className="owner-navbar">
        <button onClick={() => navigate("")}>Profile</button>
        <button onClick={() => navigate("/PackageManagementPhoto")}>Package Management</button>
        <button onClick={() => navigate("/VisitRequestsPhoto")}>Visit Requests</button>
        <button onClick={() => navigate("/BookingRequestsphoto")}>Booking Requests</button>
        <button onClick={() => navigate("/AddPackagephoto")}>Add Package</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {/* PROFILE CONTENT */}
      <div style={{ padding: "20px" }}>
        <div className="profile-container">
          <h2 className="profile-title">Profile Information</h2>
          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <>
              {/* User Info */}
              <div className="profile-section">
                <h3>User Information</h3>

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
                    />
                  ) : (
                    <span>{userData?.city}</span>
                  )}
                </div>
              </div>

              {/* Owner Info */}
              <div className="profile-section">
                <h3>Owner Information</h3>

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
                    />
                  ) : (
                    <span className="description">
                      {ownerData?.description || "No description"}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit / Save Buttons */}
              <div style={{ marginTop: "15px" }}>
                {isEditing ? (
                  <>
                    <button onClick={handleSave}>Save</button>
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
                      style={{ marginLeft: "8px" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
