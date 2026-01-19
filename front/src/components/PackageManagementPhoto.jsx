import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

export default function PackageManagementPhoto() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId_");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // لتحديد الصف الجاري تعديله
  const [editValues, setEditValues] = useState({});
const [searchName, setSearchName] = useState("");
const [searchPrice, setSearchPrice] = useState("");

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("photography")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      setPackages(data);
    } catch (err) {
      console.error("Error fetching photography packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchPackages();
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الباقة؟")) return;
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

  return (
    <div>
      {/* Navbar */}
      <nav className="owner-navbar">
        <button onClick={() => navigate("/PhotographersPageOwnerhome")}>Profile</button>
        <button onClick={() => navigate("/PackageManagementPhoto")}>Package Management</button>
        <button onClick={() => navigate("/VisitRequestsPhoto")}>Visit Requests</button>
        <button onClick={() => navigate("/BookingRequestsphoto")}>Booking Requests</button>
        <button onClick={() => navigate("/AddPackagephoto")}>Add Package</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {/* Packages Table */}
      <div className="package-container">
        <div style={{ marginBottom: "10px" }}>
  <input
    type="text"
    placeholder="Search by Package Name..."
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    style={{ marginRight: "10px", padding: "5px" }}
  />
  <input
    type="number"
    placeholder="Search by Price..."
    value={searchPrice}
    onChange={(e) => setSearchPrice(e.target.value)}
    style={{ padding: "5px" }}
  />
</div>

        <h2>My Photography Packages 📸</h2>
        {loading ? (
          <p>Loading packages...</p>
        ) : packages.length === 0 ? (
          <p>No packages found.</p>
        ) : (
          <table className="package-table">
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Price</th>
                <th>Number of Photos</th>
                <th>Number of Videos</th>
                <th>Number of Edited Photos</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.filter((pkg) => {
    return (
      pkg.packagename.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchPrice === "" || pkg.price === Number(searchPrice))
    );
  }).map((pkg) => (
                <tr key={pkg.id}>
                  <td>
                    {editingId === pkg.id ? (
                      <input
                        type="text"
                        name="packagename"
                        value={editValues.packagename}
                        onChange={handleChange}
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
                      />
                    ) : (
                      pkg.numberofeditedphoto
                    )}
                  </td>
                  <td>
                    {pkg.imgurl ? (
                      <img
                        src={pkg.imgurl}
                        alt={pkg.packagename}
                        className="package-img"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td>
                    {editingId === pkg.id ? (
                      <>
                        <button onClick={() => handleSave(pkg.id)}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(pkg)}>Edit</button>
                        <button onClick={() => handleDelete(pkg.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
    </div>
  );
}
