import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/UserProfile.css';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const cities = [
  "Nablus",
  "Ramallah",
  "Jerusalem",
  "Bethlehem",
  "Hebron",
  "Jenin",
  "Tulkarm",
  "Qalqilya",
  "Salfit",
  "Jericho"
];
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const userId = sessionStorage.getItem("userId_");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.log("No user ID found in session");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("name, email, phone, city")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUserData(data);
        setEditedData(data);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
    setMessage({ type: '', text: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!userId) return;

    setSaveLoading(true);
    setMessage({ type: '', text: '' });

    // Validate required fields
    if (!editedData.name || !editedData.email || !editedData.phone || !editedData.city) {
      setMessage({ type: 'error', text: 'All fields are required' });
      setSaveLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      setSaveLoading(false);
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({
        name: editedData.name,
        email: editedData.email,
        phone: editedData.phone,
        city: editedData.city
      })
      .eq("id", userId);

    setSaveLoading(false);

    if (error) {
      console.error("Error updating user:", error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } else {
      setUserData(editedData);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userId_");
    navigate('/login');
  };

  if (loading) return (
    <div className="profile-loading-container">
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!userData) return (
    <div className="profile-error-container">
      <div className="alert alert-danger">User not found</div>
      <button className="btn btn-primary-custom" onClick={() => navigate('/')}>
        Go Back Home
      </button>
    </div>
  );

  return (
    <div className="user-profile-page">
     

      {/* Profile Content */}
      <div className="container profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>View and manage your personal information</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
          </div>
        )}

        <div className="row">
          <div className="col-md-4">
            <div className="profile-sidebar">
              <div className="profile-avatar">
                <span className="avatar-initials">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <h3 className="profile-name">{userData?.name || 'User Name'}</h3>
              <p className="profile-email">{userData?.email}</p>
              <p className="profile-member-since">
                Member since: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="col-md-8">
            <div className="profile-details-card">
              <h4 className="details-title">Personal Information</h4>
              
              <div className="details-grid">
                {/* Name Field */}
                <div className="detail-item">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedData.name || ''}
                      onChange={handleChange}
                      className="form-control edit-input"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p>{userData?.name || 'Not provided'}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="detail-item">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedData.email || ''}
                      onChange={handleChange}
                      className="form-control edit-input"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p>{userData?.email || 'Not provided'}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="detail-item">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedData.phone || ''}
                      onChange={handleChange}
                      className="form-control edit-input"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p>{userData?.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* City Field */}
                <div className="detail-item">
                  <label>City</label>
                  {isEditing ? (
                    <select
  name="city"
  value={editedData.city || ''}
  onChange={handleChange}
  className="form-control edit-input"
>
  <option value="">Select your city</option>
  {cities.map((city, index) => (
    <option key={index} value={city}>
      {city}
    </option>
  ))}
</select>
                  ) : (
                    <p>{userData?.city || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button 
                      className="btn btn-save-profile" 
                      onClick={handleSave}
                      disabled={saveLoading}
                    >
                      {saveLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button 
                      className="btn btn-cancel-edit" 
                      onClick={handleCancel}
                      disabled={saveLoading}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-edit-profile" onClick={handleEdit}>
                      <span className="me-2">✎</span> Edit Profile
                    </button>
                    <button className="btn btn-go-home" onClick={() => navigate('/')}>
                      Back to Home
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="profile-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Wedding Planning System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}