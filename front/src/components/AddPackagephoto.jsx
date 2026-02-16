import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../style/AddPackagephoto.css";

export default function AddPackageForm() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    packagename: "",
    price: "",
    numberofphoto: "",
    numberofvidio: "",
    numberofeditedphoto: "",
    imgname: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // تحديث الحقول عند الكتابة
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // اختيار الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormValues((prev) => ({ ...prev, imgname: file.name }));
      
      // عرض المعاينة
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // حفظ الفورم
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("photography").insert([
        {
          user_id: sessionStorage.getItem("userId_"),
          packagename: formValues.packagename,
          price: Number(formValues.price),
          numberofphoto: Number(formValues.numberofphoto),
          numberofvidio: Number(formValues.numberofvidio),
          numberofeditedphoto: Number(formValues.numberofeditedphoto),
          imgurl: formValues.imgname,
        },
      ]);

      if (error) throw error;

      alert("✅ Package added successfully!");
      
      // Reset form
      setFormValues({
        packagename: "",
        price: "",
        numberofphoto: "",
        numberofvidio: "",
        numberofeditedphoto: "",
        imgname: "",
      });
      setImageFile(null);
      setPreviewUrl("");
      
    } catch (error) {
      console.error("Error adding package:", error);
      alert("❌ Error adding package: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="add-package-page">
      {/* Navbar */}
      <nav className="owner-navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-text">Wedding Planning System</span>
          </div>
        </div>
        
        <div className="navbar-right">
          <button onClick={() => navigate("/PhotographersPageOwnerhome")}>👤 Profile</button>
          <button onClick={() => navigate("/PackageManagementPhoto")}>📦 Package Management</button>
          <button onClick={() => navigate("/VisitRequestsPhoto")}>📋 Visit Requests</button>
          <button onClick={() => navigate("/BookingRequestsphoto")}>📅 Booking Requests</button>
          <button className="active-nav-btn" onClick={() => navigate("/AddPackagephoto")}>➕ Add Package</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="visit-container">
        <h2>Add New Photography Package 📸</h2>
        
        <div className="visit-table-container">
          <form onSubmit={handleSubmit} className="package-form">
            {/* Form Grid */}
            <div className="form-grid">
              {/* Package Name */}
              <div className="form-group">
                <label>Package Name:</label>
                <input
                  type="text"
                  name="packagename"
                  value={formValues.packagename}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="Enter package name"
                  required
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formValues.price}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="Enter price"
                  required
                />
              </div>

              {/* Number of Photos */}
              <div className="form-group">
                <label>Number of Photos:</label>
                <input
                  type="number"
                  name="numberofphoto"
                  value={formValues.numberofphoto}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="Enter number of photos"
                  required
                />
              </div>

              {/* Number of Videos */}
              <div className="form-group">
                <label>Number of Videos:</label>
                <input
                  type="number"
                  name="numberofvidio"
                  value={formValues.numberofvidio}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="Enter number of videos"
                  required
                />
              </div>

              {/* Number of Edited Photos */}
              <div className="form-group">
                <label>Number of Edited Photos:</label>
                <input
                  type="number"
                  name="numberofeditedphoto"
                  value={formValues.numberofeditedphoto}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="Enter number of edited photos"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="form-group full-width">
                <label>Image:</label>
                <div className="image-upload-section">
                  <div className="image-preview-area">
                    {previewUrl ? (
                      <div className="image-preview">
                        <img src={previewUrl} alt="Preview" />
                        <button 
                          type="button" 
                          className="remove-image"
                          onClick={() => {
                            setPreviewUrl("");
                            setImageFile(null);
                            setFormValues(prev => ({ ...prev, imgname: "" }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <div className="upload-icon">📷</div>
                        <p>No image selected</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      id="image-upload"
                      required={!previewUrl}
                    />
                    <label htmlFor="image-upload" className="upload-btn">
                      Choose Image
                    </label>
                    
                    {formValues.imgname && (
                      <div className="selected-file">
                        <span>Selected: {formValues.imgname}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Package"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}