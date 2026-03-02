import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../style/Decore_item.css"; 

export default function OwnerDecorationPanel() {
  const navigate = useNavigate();
  const [ownerId, setOwnerId] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newType, setNewType] = useState("");
  const [newImage, setNewImage] = useState(null);
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
    if (!newType || !newImage) return alert("Please fill all fields!");

    const fileName = newImage.name; // Only store the filename

    try {
      const { data, error } = await supabase
        .from("decoration_item")
        .insert({ owner_id: ownerId, decoration_type: newType, imgname: fileName });

      if (error) throw error;

      if (data?.[0]) setDecorations((prev) => [...prev, data[0]]);
      setNewType("");
      setNewImage(null);
    } catch (err) {
      console.error("Error adding decoration:", err);
      alert("Error adding decoration!");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">WPS Owner Panel</div>
        <div className="links">
          <button className="linkBtn profile">Profile</button>
          <button className="linkBtn" onClick={() => navigate("/ManageDecorationItems")}>
            Manage Items
          </button>
          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="main-container">
        {/* Items Table */}
        <div className="items-section">
          <h2>Decorations</h2>
          {loading ? (
            <p>Loading decorations...</p>
          ) : decorations.length > 0 ? (
            <table className="decorations-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {decorations.map((item) => (
                  <tr key={item.id}>
                    <td>{item.decoration_type}</td>
                    <td>
                      <img
                        src={`/img/decor/${item.imgname}`}
                        alt={item.decoration_type}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    </td>
                    <td>
                      <button className="deleteBtn" onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No decorations found.</p>
          )}
        </div>

        {/* Add New Decoration */}
        <div className="add-item-section">
          <h2>Add New Decoration</h2>
          <form onSubmit={handleAddItem}>
            <label>
              Decoration Type:
              <select value={newType} onChange={(e) => setNewType(e.target.value)}>
                <option value="">-- Select Decoration Type --</option>
                <option value="Car Decoration">Car Decoration</option>
                <option value="Lights">Lights</option>
                <option value="Flowers">Flowers</option>
                <option value="Candles">Candles</option>
                <option value="Extra Decor">Extra Decor</option>
              </select>
            </label>

            <label>
              Image:
              <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
            </label>

            <button type="submit" className="saveBtn">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}