import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../style/DjpackageManagement.css";

export default function DjpackageManagement() {
  const navigate = useNavigate();
  const userId = Number(sessionStorage.getItem("userId_"));
  const [djPackages, setDjPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [newPackage, setNewPackage] = useState({
    packagename: "",
    price: "",
    hours: "",
    describtion: "",
  });

  // Logout function
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDjPackages = async () => {
      const { data: ownerData, error: ownerError } = await supabase
        .from("owners")
        .select("owner_id, user_id")
        .eq("user_id", userId)
        .single();

      if (ownerError || !ownerData) {
        console.error("Owner not found", ownerError);
        setLoading(false);
        return;
      }

      const ownerId = ownerData.owner_id;

      const { data: djData, error: djError } = await supabase
        .from("dj")
        .select("*")
        .eq("owner_id", ownerId);

      if (djError) {
        console.error("DJ packages error", djError);
        setLoading(false);
        return;
      }

      setDjPackages(djData || []);
      setLoading(false);
    };

    if (userId) fetchDjPackages();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  const filteredPackages = djPackages.filter((dj) => {
    const matchesName = dj.packagename
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesPrice = maxPrice ? dj.price <= Number(maxPrice) : true;
    return matchesName && matchesPrice;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    const { error } = await supabase.from("dj").delete().eq("id", id);
    if (error) return alert("Failed to delete package: " + error.message);

    setDjPackages(djPackages.filter((dj) => dj.id !== id));
  };

  const handleEditClick = (dj) => {
    setEditingId(dj.id);
    setEditData({
      packagename: dj.packagename,
      price: dj.price,
      hours: dj.hours,
      describtion: dj.describtion,
    });
  };

  const handleSave = async (id) => {
    const { error } = await supabase.from("dj").update(editData).eq("id", id);
    if (error) return alert("Failed to update package: " + error.message);

    setDjPackages(djPackages.map((item) =>
      item.id === id ? { ...item, ...editData } : item
    ));
    setEditingId(null);
  };

  const handleCancel = () => setEditingId(null);

  // Add Package functions
  const handleAddPackage = async () => {
    if (!newPackage.packagename || !newPackage.price) {
      return alert("Package name and price are required!");
    }

    // جلب owner_id
    const { data: ownerData } = await supabase
      .from("owners")
      .select("owner_id")
      .eq("user_id", userId)
      .single();

    const ownerId = ownerData.owner_id;

    const { data, error } = await supabase
      .from("dj")
      .insert([{ 
        ...newPackage, 
        price: Number(newPackage.price), 
        hours: Number(newPackage.hours), 
        owner_id: ownerId 
      }])
      .select();

    if (error) return alert("Failed to add package: " + error.message);

    setDjPackages([...djPackages, data[0]]);
    setNewPackage({ packagename: "", price: "", hours: "", describtion: "" });
    setShowModal(false);
  };

  return (
    <div className="dj-management-page">
      {/* NAVBAR */}
      <nav className="owner-navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-text">Wedding Planning System</span>
          </div>
        </div>
        
        <div className="navbar-right">
          <button className="active">📦 Package Management</button>
          <button onClick={() => setShowModal(true)}>➕ Add Package</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="packages-container">
        <div className="packages-header">
          <h2 className="packages-title">DJ Package Management</h2>
          
          {/* Search Section - مرتبة جنب بعض */}
          <div className="search-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="search-box">
              <span className="search-icon">💰</span>
              <input
                type="number"
                placeholder="price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Packages Table */}
        <div className="table-wrapper">
          <table className="packages-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Package Name</th>
                <th>Price</th>
                <th>Hours</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.map((dj) => (
                <tr key={dj.id}>
                  <td>#{dj.id}</td>
                  <td>
                    {editingId === dj.id ? (
                      <input 
                        type="text" 
                        className="edit-input" 
                        value={editData.packagename}
                        onChange={(e) => setEditData({ ...editData, packagename: e.target.value })} 
                      />
                    ) : dj.packagename}
                  </td>
                  <td>
                    {editingId === dj.id ? (
                      <input 
                        type="number" 
                        className="edit-input" 
                        value={editData.price}
                        onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })} 
                      />
                    ) : (
                      <span className="price-value">${dj.price}</span>
                    )}
                  </td>
                  <td>
                    {editingId === dj.id ? (
                      <input 
                        type="number" 
                        className="edit-input" 
                        value={editData.hours}
                        onChange={(e) => setEditData({ ...editData, hours: Number(e.target.value) })} 
                      />
                    ) : (
                      <span className="hours-value">{dj.hours}h</span>
                    )}
                  </td>
                  <td>
                    {editingId === dj.id ? (
                      <input 
                        type="text" 
                        className="edit-input" 
                        value={editData.describtion}
                        onChange={(e) => setEditData({ ...editData, describtion: e.target.value })} 
                      />
                    ) : (
                      <span className="description-text">{dj.describtion || "—"}</span>
                    )}
                  </td>
                  <td>
                    {editingId === dj.id ? (
                      <div className="action-group">
                        <button className="action-btn save-btn" onClick={() => handleSave(dj.id)} title="Save">
                          ✓
                        </button>
                        <button className="action-btn cancel-btn" onClick={handleCancel} title="Cancel">
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="action-group">
                        <button className="action-btn edit-btn" onClick={() => handleEditClick(dj)} title="Edit">
                          ✎
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(dj.id)} title="Delete">
                          🗑
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredPackages.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-data">
                    No packages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Package */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Add New DJ Package</h3>
            <div className="modal-body">
              <div className="modal-input-group">
                <label>Package Name</label>
                <input
                  type="text"
                  placeholder="e.g. Premium Wedding Package"
                  className="modal-input"
                  value={newPackage.packagename}
                  onChange={(e) => setNewPackage({ ...newPackage, packagename: e.target.value })}
                />
              </div>
              <div className="modal-input-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="modal-input"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                />
              </div>
              <div className="modal-input-group">
                <label>Hours</label>
                <input
                  type="number"
                  placeholder="e.g. 4"
                  className="modal-input"
                  value={newPackage.hours}
                  onChange={(e) => setNewPackage({ ...newPackage, hours: e.target.value })}
                />
              </div>
              <div className="modal-input-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe your package..."
                  className="modal-textarea"
                  value={newPackage.describtion}
                  onChange={(e) => setNewPackage({ ...newPackage, describtion: e.target.value })}
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-btn save-btn" onClick={handleAddPackage}>Add Package</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}