import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import "../style/PackageManagementPhoto.css";

export default function PackageManagementPhoto() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId_") || sessionStorage.getItem("ownerId_");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchPrice, setSearchPrice] = useState("");

  const fetchPackages = async () => {
    if (!userId) {
      console.warn("PackageManagementPhoto: No userId found in sessionStorage");
      setError("User not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Fetching photography packages for userId:", userId);
      
      const { data, error } = await supabase
        .from("photography")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Supabase error fetching photography packages:", error);
        setError("Failed to load packages: " + (error.message || "Unknown error"));
        throw error;
      }
      
      console.log("Photography packages fetched:", data);
      setPackages(data || []);
    } catch (err) {
      console.error("Error fetching photography packages:", err);
      setError("Error loading packages. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPackages();
    } else {
      setLoading(false);
      setError("User ID not found in session. Please log in again.");
    }
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      const { error } = await supabase.from("photography").delete().eq("id", id);
      if (error) throw error;
      fetchPackages();
    } catch (err) {
      console.error("Error deleting package:", err);
    }
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    setEditValues({
      packagename: pkg.packagename,
      price: pkg.price,
      numberofphoto: pkg.numberofphoto,
      numberofvidio: pkg.numberofvidio,
      numberofeditedphoto: pkg.numberofeditedphoto,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSave = async (id) => {
    try {
      const { error } = await supabase
        .from("photography")
        .update(editValues)
        .eq("id", id);
      if (error) throw error;
      setEditingId(null);
      setEditValues({});
      fetchPackages();
    } catch (err) {
      console.error("Error updating package:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesName = pkg.packagename
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesPrice = 
      searchPrice === "" || 
      pkg.price === Number(searchPrice) || 
      pkg.price.toString().includes(searchPrice);
    return matchesName && matchesPrice;
  });

  return (
    <div className="package-management-page">
      {/* Navbar - Exactly like Hall page */}
      <nav className="owner-navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-text">Wedding Planning System</span>
          </div>
        </div>
        
        <div className="navbar-right">
          <button onClick={() => navigate("/PhotographersPageOwnerhome")}>👤 Profile</button>
          <button onClick={() => navigate("/PackageManagementPhoto")}>📦 Package Management</button>
     
          <button onClick={() => navigate("/BookingRequestsphoto")}>📅 Booking Requests</button>
          <button onClick={() => navigate("/AddPackagephoto")}>➕ Add Package</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="package-container">
        <h2>My Photography Packages 📸</h2>
        
        {error && (
          <div style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            marginBottom: "20px",
            borderRadius: "4px"
          }}>
            {error}
          </div>
        )}
        
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Package Name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Search by Price..."
            value={searchPrice}
            onChange={(e) => setSearchPrice(e.target.value)}
          />
        </div>

        {/* Packages Table */}
        {loading ? (
          <p>Loading packages...</p>
        ) : !userId ? (
          <div style={{ color: "#d32f2f", padding: "20px" }}>
            <p>No user ID found. Please log in again.</p>
            <button onClick={() => navigate("/login")} style={{ padding: "10px 20px", cursor: "pointer" }}>
              Go to Login
            </button>
          </div>
        ) : filteredPackages.length === 0 ? (
          <p>{packages.length === 0 ? "No packages created yet. " : "No packages match your search."}</p>
        ) : (
          <div className="package-table-container">
            <table className="package-table">
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Price ($)</th>
                  <th># Photos</th>
                  <th># Videos</th>
                  <th># Edited Photos</th>
               
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>
                      {editingId === pkg.id ? (
                        <input
                          type="text"
                          name="packagename"
                          value={editValues.packagename}
                          onChange={handleChange}
                          placeholder="Package Name"
                        />
                      ) : (
                        pkg.packagename
                      )}
                    </td>
                    <td>
                      {editingId === pkg.id ? (
                        <input
                          type="number"
                          name="price"
                          value={editValues.price}
                          onChange={handleChange}
                          placeholder="Price"
                        />
                      ) : (
                        `$${pkg.price}`
                      )}
                    </td>
                    <td>
                      {editingId === pkg.id ? (
                        <input
                          type="number"
                          name="numberofphoto"
                          value={editValues.numberofphoto}
                          onChange={handleChange}
                          placeholder="Number of Photos"
                        />
                      ) : (
                        pkg.numberofphoto
                      )}
                    </td>
                    <td>
                      {editingId === pkg.id ? (
                        <input
                          type="number"
                          name="numberofvidio"
                          value={editValues.numberofvidio}
                          onChange={handleChange}
                          placeholder="Number of Videos"
                        />
                      ) : (
                        pkg.numberofvidio
                      )}
                    </td>
                    <td>
                      {editingId === pkg.id ? (
                        <input
                          type="number"
                          name="numberofeditedphoto"
                          value={editValues.numberofeditedphoto}
                          onChange={handleChange}
                          placeholder="Edited Photos"
                        />
                      ) : (
                        pkg.numberofeditedphoto
                      )}
                    </td>
                  
                    <td className="actions-cell">
                      {editingId === pkg.id ? (
                        <>
                          <button 
                            onClick={() => handleSave(pkg.id)} 
                            className="save-btn"
                          >
                            Save
                          </button>
                          <button 
                            onClick={handleCancel} 
                            className="cancel-btn"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleEdit(pkg)} 
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(pkg.id)} 
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}