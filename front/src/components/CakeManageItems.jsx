import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import '../style/CakeManageItems.css';

export default function CakeManageItems() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId_"); 
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [fileName, setFileName] = useState("");
  const [cakeName, setCakeName] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const fetchCakes = async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("cakes")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching cakes:", error);
    } else {
      setCakes(data);
      setFilteredCakes(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCakes();
  }, [userId]);

  // update filtered cakes when search text changes
  useEffect(() => {
    const filtered = cakes.filter(cake =>
      cake.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCakes(filtered);
  }, [searchText, cakes]);

  // add new cake
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!fileName || !cakeName) return alert("Please fill all fields!");
    if (!userId) return alert("User not logged in!");

    setAdding(true);
    try {
      const { error } = await supabase.from("cakes").insert([
        {
          user_id: userId,
          imgurl: fileName,
          name: cakeName
        },
      ]);

      if (error) throw error;

      setFileName("");
      setCakeName("");
      fetchCakes(); 
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (cakeId) => {
    if (!window.confirm("Are you sure you want to delete this cake?")) return;

    try {
      const { error } = await supabase
        .from("cakes")
        .delete()
        .eq("id", cakeId);

      if (error) throw error;

      fetchCakes(); 
    } catch (err) {
      console.error("Error deleting cake:", err);
      alert("Failed to delete cake 😬");
    }
  };

  return (
    <div>
      {/* === NAVBAR === */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-text">Wedding Planning System</span>
          </div>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/CakeOwnerPage")}>👤 Profile</button>
          <button onClick={() => navigate("/CakeManageItems")}>📋 Manage Items</button>
          <button onClick={() => navigate("/CakeVisit")}>📋 Visit Form</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="content-container">
        {/* === ADD NEW CAKE FORM === */}
        <div className="form-section">
          <h2 className="section-header">➕ Add New Cake</h2>
          <form className="add-form" onSubmit={handleAddItem}>
            <div className="form-group">
              <label>Cake Name</label>
              <input
                type="text"
                placeholder="Enter cake name"
                value={cakeName}
                onChange={(e) => setCakeName(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Select Image</label>
              <div className="file-input-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                  required
                  className="file-input"
                  id="cake-image"
                />
                <label htmlFor="cake-image" className="file-input-label">
                  📁 Choose Image
                </label>
                {fileName && (
                  <span className="file-name">{fileName}</span>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={adding}
            >
              {adding ? "Adding..." : "Add Cake"}
            </button>
          </form>
        </div>

        {/* === YOUR CAKES LIST === */}
        <div className="cakes-section">
          <div className="section-header-container">
            <h2 className="section-header">🍰 Your Cakes</h2>
            <input
              type="text"
              placeholder="Search by cake name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading cakes...</p>
            </div>
          ) : filteredCakes.length === 0 ? (
            <div className="empty-state">
              <p>📭 No cakes found</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="cakes-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCakes.map((cake) => (
                    <tr key={cake.id}>
                      <td>{cake.name}</td>
                      <td>
                        <div className="cake-image-container">
                          <img 
                            src={`/img/cake/${cake.imgurl}`} 
                            alt={cake.name}
                            className="cake-image"
                          />
                        </div>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDelete(cake.id)} 
                          className="delete-btn"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}