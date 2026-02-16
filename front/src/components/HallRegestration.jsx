// src/pages/HallRegistration.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "../style/HallRegistration.css";

export default function HallRegistration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hallType, setHallType] = useState("");
  const [parking, setParking] = useState(false);
  const [menCapacity, setMenCapacity] = useState("");
  const [womenCapacity, setWomenCapacity] = useState("");
  const [hallInfo, setHallInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Store image names locally before inserting to DB
  const [imageNames, setImageNames] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Get business info from session storage
  const name = sessionStorage.getItem("businessName");
  const phone = sessionStorage.getItem("phone");
  const city = sessionStorage.getItem("city");
  const description = sessionStorage.getItem("description");

  // Add selected image name to the list
  const addImageName = () => {
    if (!currentImage) {
      setError("Please select an image first.");
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(currentImage);
    setPreviewUrls([...previewUrls, previewUrl]);
    
    setImageNames([...imageNames, currentImage.name]); // Add current image name to array
    setCurrentImage(null); // Reset file input
    setError("");
  };

  const removeImage = (index) => {
    const newImageNames = [...imageNames];
    const newPreviewUrls = [...previewUrls];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newImageNames.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setImageNames(newImageNames);
    setPreviewUrls(newPreviewUrls);
  };

  const clearAllImages = () => {
    // Revoke all object URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setImageNames([]);
    setPreviewUrls([]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentImage(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (!email || !password || !hallType || !menCapacity || !womenCapacity || !description) {
      setError("Please complete all fields.");
      setLoading(false);
      return;
    }

    if (imageNames.length === 0) {
      setError("Please add at least one image.");
      setLoading(false);
      return;
    }

    const hallPrice = parseFloat(document.getElementById("hallPrice").value || 0);

    try {
      // Insert user
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([{
          email,
          password,
          role: "owner",
          name,
          phone,
          city,
          verified: true,
        }])
        .select();

      if (userError) throw userError;
      const userId = userData[0].id;

      // Insert owner
      const { data: ownerData, error: ownerError } = await supabase
        .from("owners")
        .insert([{
          user_id: userId,
          owner_type: "hall",
          visible: false,
          description: description,
          rate: 0,
          accept: false
        }])
        .select("owner_id");

      if (ownerError) throw ownerError;
      const ownerId = ownerData[0].owner_id;

      // Insert hall
      const { data: hallData, error: hallError } = await supabase
        .from("hall")
        .insert([{
          owner_id: ownerId,
          hall_type: hallType,
          parking: parking,
          men_capacity: parseInt(menCapacity),
          women_capacity: parseInt(womenCapacity),
          price: hallPrice,
          imgurl: imageNames.join(",") // Store image names as comma-separated string
        }])
        .select();

      if (hallError) throw hallError;

      setHallInfo(hallData[0]);
      setError("");
      
      // Show success message
      alert("Hall registered successfully!");
      
      // Clean up object URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setImageNames([]);
      setPreviewUrls([]);
      
      // Clear form
      setEmail("");
      setPassword("");
      setHallType("");
      setParking(false);
      setMenCapacity("");
      setWomenCapacity("");
      
    } catch (err) {
      console.error("Registration error:", err);
      setError("Error registering hall. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hall-registration-container">
      {/* Decorative Elements */}
      <div className="decorative-element decor-1"></div>
      <div className="decorative-element decor-2"></div>

      <div className="hall-registration-card">
        {/* Progress Indicator */}
        <div className="progress-steps">
          <div className="step completed"></div>
          <div className="step-line completed"></div>
          <div className="step active"></div>
          <div className="step-line"></div>
          <div className="step"></div>
        </div>

        {/* Header */}
        <div className="header-section">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 2H5C3.89543 2 3 2.89543 3 4V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V4C21 2.89543 20.1046 2 19 2Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 2V6C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6V2" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="page-title">Hall Registration</h1>
          <p className="page-subtitle">Complete your hall details to finalize registration</p>
          
          {/* Business Summary */}
          <div className="business-summary">
            <div className="summary-item">
              <span className="summary-label">Business:</span>
              <span className="summary-value">{name || "Not specified"}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">City:</span>
              <span className="summary-value">{city || "Not specified"}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Phone:</span>
              <span className="summary-value">{phone || "Not specified"}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="hall-form" onSubmit={handleSubmit}>
          {/* Email & Password */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Hall Type */}
          <div className="form-group">
            <label className="form-label">Hall Type</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 2H5C3.89543 2 3 2.89543 3 4V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V4C21 2.89543 20.1046 2 19 2Z" 
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <select 
                className="form-select" 
                value={hallType} 
                onChange={e => setHallType(e.target.value)} 
                required
              >
                <option value="">-- Select Type --</option>
                <option value="Indoor Hall">Indoor Hall</option>
                <option value="Outdoor Hall">Outdoor Hall</option>
                <option value="Garden">Garden</option>
                <option value="Hotel">Hotel</option>
              </select>
            </div>
          </div>

          {/* Capacities */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Men Capacity</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
                      stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" 
                      stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  placeholder="e.g., 200"
                  value={menCapacity}
                  onChange={e => setMenCapacity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Women Capacity</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7C13.6569 7 15 5.65685 15 4C15 2.34315 13.6569 1 12 1C10.3431 1 9 2.34315 9 4C9 5.65685 10.3431 7 12 7Z" 
                      stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" 
                      stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M18 10L20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M16 6L18 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  placeholder="e.g., 200"
                  value={womenCapacity}
                  onChange={e => setWomenCapacity(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="form-group">
            <label className="form-label">Price per Event (NIS)</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" 
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="number"
                className="form-input"
                id="hallPrice"
                min="0"
                placeholder="Enter hall price"
              />
            </div>
          </div>

          {/* Parking Option - المعدل */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="parking"
                checked={parking}
                onChange={e => setParking(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <div className="checkbox-title">Private Parking Available</div>
                <div className="checkbox-description">
                  Click the square box only to select
                </div>
              </div>
            </label>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Upload Hall Images</label>
            <div className="image-upload-area">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="image-input"
              />
              <div className="upload-controls">
                <label htmlFor="image-upload" className="upload-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 8L12 3L7 8" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3V15" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Select Image
                </label>
                <button 
                  type="button" 
                  onClick={addImageName}
                  className="add-btn"
                  disabled={!currentImage}
                >
                  Add to List
                </button>
              </div>
              
              {/* Current File Preview */}
              {currentImage && (
                <div className="current-file">
                  <span className="file-name">{currentImage.name}</span>
                  <span className="file-size">
                    {(currentImage.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="image-previews">
                  <div className="previews-header">
                    <span className="previews-count">{previewUrls.length} image{previewUrls.length !== 1 ? 's' : ''} selected</span>
                    <button 
                      type="button" 
                      onClick={clearAllImages}
                      className="clear-all-btn"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="previews-grid">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="preview-item">
                        <img src={url} alt={`Preview ${index + 1}`} className="preview-image" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="remove-image-btn"
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <span className="image-name">{imageNames[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="validation-error">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-next" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : (
              <>
                Register Hall
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Display registered hall info */}
        {hallInfo && (
          <div className="hall-info-summary">
            <div className="info-header">
              <h3>Hall Information</h3>
              <div className="info-status">Registered</div>
              {/* زر واحد بسيط للذهاب إلى صفحة تسجيل الدخول */}
              <button 
                onClick={() => window.location.href = '/login'}
                className="quick-action-btn"
                title="Go to Login"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 17L15 12L10 7" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 12H3" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Hall ID:</span>
                <span className="info-value">{hallInfo.hall_id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">{hallInfo.hall_type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Parking:</span>
                <span className={`info-value ${hallInfo.parking ? 'available' : 'unavailable'}`}>
                  {hallInfo.parking ? "Available" : "Not Available"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Men Capacity:</span>
                <span className="info-value">{hallInfo.men_capacity}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Women Capacity:</span>
                <span className="info-value">{hallInfo.women_capacity}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Owner ID:</span>
                <span className="info-value">{hallInfo.owner_id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Price:</span>
                <span className="info-value">{hallInfo.price ? `${hallInfo.price} NIS` : "Not specified"}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Images:</span>
                <span className="info-value">{hallInfo.imgurl}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}