// OwnerPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../style/OwnerPage.css";

export default function OwnerPage() {
  const navigate = useNavigate();

  const email = sessionStorage.getItem("pendingEmail");
  const password = sessionStorage.getItem("pendingPassword");
  const role = sessionStorage.getItem("pendingRole");

  const [ownerType, setOwnerType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [businessNameError, setBusinessNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleBusinessNameChange = (e) => {
    const value = e.target.value;
    setBusinessName(value);
    
    if (value && !/^[A-Za-z0-9 ]+$/.test(value)) {
      setBusinessNameError("Business name can only contain letters, numbers, and spaces.");
    } else {
      setBusinessNameError("");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
    
    if (value && value.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
    } else if (value && !/^05(6|9)/.test(value)) {
      setPhoneError("Phone number must start with 056 or 059.");
    } else {
      setPhoneError("");
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!ownerType || !businessName || !phone || !city) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const businessRegex = /^[A-Za-z0-9 ]+$/;
    if (!businessRegex.test(businessName)) {
      setError("Business name can only contain letters, numbers, and spaces.");
      setLoading(false);
      return;
    }

    const phoneRegex = /^05(6|9)\d{7}$/;
    if (!phoneRegex.test(phone)) {
      setError("Invalid phone number format. Must be 10 digits starting with 056 or 059.");
      setLoading(false);
      return;
    }

    // Save to sessionStorage
    sessionStorage.setItem("pendingRole", ownerType);
    sessionStorage.setItem("businessName", businessName);
    sessionStorage.setItem("phone", phone);
    sessionStorage.setItem("city", city);
    sessionStorage.setItem("pendingEmail", email);
    sessionStorage.setItem("pendingPassword", password);
    sessionStorage.setItem("description", description);

    // Handle cake owner
    if (ownerType === "cake") {
      const userObj = {
        email,
        password,
        role: "cake",
        name: businessName,
        phone,
        city,
        verified: true
      };

      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert([userObj])
          .select();

        if (userError) throw userError;

        const ownerData = {
          user_id: userData[0].id,
          owner_type: "cake",
          visible: false
        };

        const { error: ownerError } = await supabase
          .from("owners")
          .insert([ownerData]);

        if (ownerError) throw ownerError;

        alert("Your request has been sent to the admin. Please wait for approval.");
        navigate("/");
      } catch (error) {
        console.error("Error:", error);
        setError("Error saving your information. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Navigation for other types
    setLoading(false);
    switch (ownerType) {
      case "DJ":
        navigate("/dj-page");
        break;
      case "decoration":
        navigate("/DecorationPage");
        break;
      case "hall":
        navigate("/HallRegestration");
        break;
      case "photography":
        navigate("/photography-page");
        break;
      default:
        setError("Please select a valid business type.");
    }
  };

  // SVG Icons for Business Types
  const businessIcons = {
    cake: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    photography: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    hall: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="7" width="18" height="12" rx="2" fill="currentColor" opacity="0.3"/>
        <path d="M8 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="3" y="7" width="18" height="4" fill="currentColor" opacity="0.2"/>
      </svg>
    ),
    DJ: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    decoration: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 10L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 10L14 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  };

  return (
    <div className="owner-page-container">
      {/* Decorative Elements */}
      <div className="decorative-element decor-1"></div>
      <div className="decorative-element decor-2"></div>

      <div className="owner-card">
        {/* Progress Indicator */}
        <div className="progress-steps">
          <div className="step active"></div>
          <div className="step-line"></div>
          <div className="step"></div>
          <div className="step-line"></div>
          <div className="step"></div>
        </div>

        {/* Header */}
        <div className="header-section">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21L21 21M19 21H14M5 21L3 21M5 21H10M9 7H15M9 11H15M12 21V17" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="page-title">Business Information</h1>
          <p className="page-subtitle">Complete your profile to start offering services</p>
        </div>

        {/* Form */}
        <form className="owner-form" onSubmit={handleNext}>
          {/* Business Name */}
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                  <path d="M3 21H21M3 21V5H21V21M3 21L9 14H15L21 21M9 7H9.01M15 7H15.01M9 11H9.01M15 11H15.01" 
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your business name"
                value={businessName}
                onChange={handleBusinessNameChange}
                required
              />
            </div>
            {businessNameError && <div className="validation-error">{businessNameError}</div>}
            <span className="validation-hint">Letters, numbers, and spaces only</span>
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                  <path d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92C18.75 20.92 16.68 20.2 15 19M22 16.92C20.74 16.75 19.52 16.42 18.41 15.95C17.95 15.75 17.45 15.68 16.97 15.75C15.88 15.93 14.81 16.17 13.77 16.46C12.27 16.9 10.89 17.56 9.62 18.46L7 21C6.09 21.74 4.96 22 3.86 22C2.86 22 1.92 21.83 1 21.5L5.5 17C5.67 16.83 5.83 16.67 6 16.5C6.9 15.6 7.93 14.82 9.07 14.22C10.18 13.63 11.39 13.2 12.67 12.93C13.17 12.83 13.67 12.76 14.13 12.58C15.21 12.18 16.26 11.68 17.26 11.08C17.91 10.67 18.54 10.23 19.15 9.75C20.36 8.77 21.47 7.67 22 6.46V6.46C22 5.91 21.55 5.46 21 5.46H18.04C16.5 5.46 15.09 6.33 14.46 7.7C14.25 8.17 14.1 8.67 13.95 9.17C13.42 10.96 12.13 12.55 10.5 13.5C9.5 14.05 8.5 14.5 7.5 15" 
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="tel"
                className="form-input"
                placeholder="05X XXXXXXX"
                value={phone}
                onChange={handlePhoneChange}
                maxLength="10"
                required
              />
            </div>
            {phoneError && <div className="validation-error">{phoneError}</div>}
            <span className="validation-hint">10 digits starting with 056 or 059</span>
          </div>

          {/* City */}
          <div className="form-group">
            <label className="form-label">City</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" 
                    stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" 
                    stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <select
                className="form-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="">-- Choose your city --</option>
                <option value="Ramallah">Ramallah</option>
                <option value="Hebron">Hebron</option>
                <option value="Nablus">Nablus</option>
                <option value="Tulkarm">Tulkarm</option>
                <option value="Qalqilya">Qalqilya</option>
                <option value="Jenin">Jenin</option>
                <option value="Bethlehem">Bethlehem</option>
                <option value="Jericho">Jericho</option>
                <option value="Salfit">Salfit</option>
                <option value="Tubas">Tubas</option>
              </select>
            </div>
          </div>

          {/* Business Type */}
          <div className="form-group">
            <label className="form-label">Business Type</label>
            <div className="select-options">
              {[
                { value: "cake", label: "Cake", icon: businessIcons.cake },
                { value: "photography", label: "Photography", icon: businessIcons.photography },
                { value: "hall", label: "Hall", icon: businessIcons.hall },
                { value: "DJ", label: "DJ", icon: businessIcons.DJ },
                { value: "decoration", label: "Decoration", icon: businessIcons.decoration }
              ].map((type) => (
                <div key={type.value} className="option-item">
                  <input
                    type="radio"
                    id={`type-${type.value}`}
                    name="ownerType"
                    value={type.value}
                    checked={ownerType === type.value}
                    onChange={(e) => setOwnerType(e.target.value)}
                    className="option-radio"
                  />
                  <label htmlFor={`type-${type.value}`} className="option-label">
                    <div className="option-icon">{type.icon}</div>
                    <div className="option-name">{type.label}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Business Description</label>
            <textarea
              className="form-textarea"
              placeholder="Describe your services, experience, and what makes your business special..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <span className="validation-hint">Optional: HTML is allowed for formatting</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="validation-error" style={{ marginTop: '0.5rem' }}>
              {error}
            </div>
          )}

          {/* Next Button */}
          <button type="submit" className="btn-next" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : (
              <>
                Continue
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}