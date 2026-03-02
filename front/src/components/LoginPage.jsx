import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../style/LoginPage.css";
import { Link } from "react-router-dom";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-page-active");
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.classList.remove("login-page-active");
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (email === "admin@weddingplanning.com" && password === "admin") {
        alert("Welcome Admin 👑");
        navigate("/AdminPage");
        setIsLoading(false);
        return;
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("id, email, role")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error || !user) {
        alert("Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (user.role === "user") {
        sessionStorage.setItem("userId_", user.id);
        alert("Login successfully 🎉");
        navigate("/");
        setIsLoading(false);
        return;
      }

      if (user.role === "owner") {
        const { data: owner, error: ownerError } = await supabase
          .from("owners")
          .select("owner_id, user_id, owner_type")
          .eq("user_id", user.id)
          .single();

        if (ownerError || !owner) {
          alert("Owner record not found");
          setIsLoading(false);
          return;
        }

        if (owner.owner_type === "hall") {
          sessionStorage.setItem("ownerId_", user.id);
          navigate("/VenueOwnerPage", { state: { userId: user.id } });
        } 
        else if (owner.owner_type === "DJ") {
          sessionStorage.setItem("userId_", user.id);
          navigate("/DjpackageManagement");
        } 
        else if (owner.owner_type === "cake") {
          sessionStorage.setItem("ownerId_", user.id);
          navigate("/CakeOwnerPage", { state: { userId: user.id } });
          
        }
 else if (owner.owner_type === "photography") {  
          sessionStorage.setItem("userId_", user.id);
          sessionStorage.setItem("idowner",owner.owner_id);
          sessionStorage.setItem("currentEmail", email);
          navigate("/PhotographersPageOwnerhome", { state: { userId: user.id } });
        }
else if (owner.owner_type === "decoration") {
  sessionStorage.setItem("ownerId_", user.id);
  navigate("/DecorationOwnerPage", { state: { userId: user.id } });
}
        else {
          alert("Unknown owner type");
        }

        setIsLoading(false);
        return;
      }

      alert("Unknown role");
      setIsLoading(false);
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="brand-section">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <Link to="/" className="brand-link">
  <h1 className="brand-title">Wedding Planning System</h1>
</Link>
          <p className="brand-subtitle">Your perfect wedding starts here</p>
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

      <div className="login-right-panel">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Login in to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
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
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2"/>
    <path d="M10.7 5.1A9.9 9.9 0 0 1 12 5c5 0 9 4 10 7-0.3 0.8-1 2-2.2 3.2" stroke="currentColor" strokeWidth="2"/>
    <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" stroke="currentColor" strokeWidth="2"/>
  </svg>
                    ) : (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
               )}

                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">Remember me</span>
              </label>
              <button 
                type="button" 
                className="forgot-password"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing in...
                </>
              ) : (
                "Log In"
              )}
            </button>

            <div className="divider">
              <span className="divider-line"></span>
              <span className="divider-text">Don't have an account?</span>
              <span className="divider-line"></span>
            </div>

            <button 
              type="button" 
              className="btn-register"
              onClick={() => navigate("/RegistrationPage")}
            >
              Create New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}