import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../style/RegistrationPage.css";

export default function RegistrationPage() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    // Validate password presence
    if (!password) {
      setMessage("Please enter a password.");
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    
    const { data, error } = await supabase.auth.signUp(
      {
        email,
        password,
      },
      {
        data: { role },
        emailRedirectTo: "http://localhost:3000/VerifyPage",
      }
    );

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    sessionStorage.setItem("pendingEmail", email);
    sessionStorage.setItem("pendingPassword", password);
    sessionStorage.setItem("pendingRole", role);
    sessionStorage.setItem("linkSentTime", Date.now());

    navigate("/VerifyPage");
    setMessage("Check your email for the verification link.");
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-left-panel">
        <div className="brand-section">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="brand-title">Wedding Planning System</h1>
          <p className="brand-subtitle">Join our community today</p>
        </div>
        <div className="features-list">
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">Easy Booking Management</span>
          </div>
          <div className="feature">
            <span className="feature-icon">✨</span>
            <span className="feature-text">Premium Venue Selection</span>
          </div>
          <div className="feature">
            <span className="feature-icon">👰</span>
            <span className="feature-text">Complete Wedding Planning</span>
          </div>
        </div>
      </div>

      <div className="register-right-panel">
        <div className="register-card">
          <div className="register-header">
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtitle">Join us and start your journey</p>
          </div>

          <form onSubmit={handleContinue} className="register-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div className="role-selection">
                <div className="role-option">
                  <input
                    type="radio"
                    id="role-user"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                    className="role-input"
                  />
                  <label htmlFor="role-user" className="role-label">
                    <div className="role-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill="#C9A961"/>
                        <path d="M20 21c0-3.314-3.134-6-7-6s-7 2.686-7 6" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="role-name">User</div>
                    <div className="role-desc">Browse & Book Services</div>
                  </label>
                </div>

                <div className="role-option">
                  <input
                    type="radio"
                    id="role-owner"
                    name="role"
                    value="owner"
                    checked={role === "owner"}
                    onChange={(e) => setRole(e.target.value)}
                    className="role-input"
                  />
                  <label htmlFor="role-owner" className="role-label">
                    <div className="role-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="7" width="18" height="12" rx="2" fill="#D4A574"/>
                        <path d="M8 7V5a4 4 0 018 0v2" stroke="#4A3A28" strokeWidth="1.5" strokeLinecap="round"/>
                        <rect x="3" y="7" width="18" height="4" fill="white" opacity="0.2"/>
                      </svg>
                    </div>
                    <div className="role-name">Business Owner</div>
                    <div className="role-desc">Manage Your Services</div>
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-register" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {message && (
              <div className={`message-box ${message.toLowerCase().includes('error') ? 'message-error' : 'message-success'}`}>
                {message}
              </div>
            )}

            <div className="divider">
              <span className="divider-line"></span>
              <span className="divider-text">Already have an account?</span>
              <span className="divider-line"></span>
            </div>

            <button 
              type="button" 
              className="btn-login-link"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>

            <div className="terms">
              <p>By creating an account, you agree to our <button type="button" className="terms-link">Terms of Service</button> and <button type="button" className="terms-link">Privacy Policy</button></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}