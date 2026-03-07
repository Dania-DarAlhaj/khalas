import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../style/Decore_item.css"; 

export default function OwnerDecorationPanel() {
  const navigate = useNavigate();
  const [ownerId, setOwnerId] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [newType, setNewType] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const userId = sessionStorage.getItem("ownerId_"); // contains user ID

  // Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // Fetch owner ID and decorations
  useEffect(() => {
    const fetchOwnerAndDecorations = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data: ownerData, error: ownerError } = await supabase
          .from("owners")
          .select("owner_id")
          .eq("user_id", userId)
          .single();

        if (ownerError) throw ownerError;

        if (ownerData?.owner_id) {
          setOwnerId(ownerData.owner_id);
          await loadDecorations(ownerData.owner_id);
        }
      } catch (err) {
        console.error("Error fetching owner:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerAndDecorations();
  }, [userId]);

  // Load decorations for owner
  const loadDecorations = async (ownerIdFetched) => {
    try {
      const { data, error } = await supabase
        .from("decoration_item")
        .select("id, owner_id, decoration_type, imgname")
        .eq("owner_id", ownerIdFetched);

      if (error) throw error;

      setDecorations(data || []);
    } catch (err) {
      console.error("Error fetching decorations:", err);
      setDecorations([]);
    }
  };

  // Delete decoration
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this decoration?")) return;

    try {
      const { error } = await supabase.from("decoration_item").delete().eq("id", itemId);
      if (error) throw error;

      setDecorations((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error deleting decoration:", err);
    }
  };

  // Add new decoration (only store image name)
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newType || !newImage) {
      alert("Please fill all fields!");
      return;
    }

    const fileName = newImage.name; // Only store the filename

    try {
      const { data, error } = await supabase
        .from("decoration_item")
        .insert([{ 
          owner_id: ownerId, 
          decoration_type: newType, 
          imgname: fileName 
        }])
        .select();

      if (error) throw error;

      if (data?.[0]) {
        setDecorations((prev) => [...prev, data[0]]);
      }
      
      setNewType("");
      setNewImage(null);
      setShowModal(false);
    } catch (err) {
      console.error("Error adding decoration:", err);
      alert("Error adding decoration!");
    }
  };

  // Filter decorations based on search
  const filteredDecorations = decorations.filter(item =>
    item.decoration_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Go to profile page
  const goToProfile = () => {
    navigate("/DecorationOwnerPage");
  };

  return (
    <div className="dj-management-page">
      {/* Navbar - مع إضافة زر Profile */}
      <nav className="owner-navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-text">Wedding Planning System</span>
          </div>
        </div>
        
        <div className="navbar-right">
          {}
          <button onClick={goToProfile}>
            👤 Profile
          </button>
          <button className="active">
            🎨 Manage Items
          </button>
          <button onClick={() => setShowModal(true)}>
            ➕ Add Decoration
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="packages-container">
        <div className="packages-header">
          <h2 className="packages-title">Decoration Items Management</h2>
          
          {/* Search Section */}
          <div className="search-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="table-wrapper">
          <table className="packages-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Decoration Type</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="no-data">
                    Loading decorations...
                  </td>
                </tr>
              ) : filteredDecorations.length > 0 ? (
                filteredDecorations.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>
                      <span className="type-badge">{item.decoration_type}</span>
                    </td>
                    <td>
                      <div className="image-container">
                        <img
                          src={`/img/decor/${item.imgname}`}
                          alt={item.decoration_type}
                          className="decoration-image"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="action-group">
                        <button 
                          className="action-btn delete-btn" 
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    {searchTerm ? "No matching decorations found" : "No decorations found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Decoration */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Add New Decoration Item</h3>
            <form onSubmit={handleAddItem}>
              <div className="modal-body">
                <div className="modal-input-group">
                  <label>Decoration Type</label>
                  <select 
                    className="modal-input"
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value)}
                    required
                  >
                    <option value="">-- Select Decoration Type --</option>
                    <option value="Car Decoration">🚗 Car Decoration</option>
                    <option value="Lights">💡 Lights</option>
                    <option value="Flowers">🌸 Flowers</option>
                    <option value="Candles">🕯️ Candles</option>
                    <option value="Extra Decor">✨ Extra Decor</option>
                  </select>
                </div>

                <div className="modal-input-group">
                  <label>Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="modal-input"
                    onChange={(e) => setNewImage(e.target.files[0])}
                    required
                  />
                  {newImage && (
                    <div className="image-preview">
                      <img 
                        src={URL.createObjectURL(newImage)} 
                        alt="Preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn save-btn">
                  Add Decoration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}