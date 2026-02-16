import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/DjpackageManagement.css";

export default function DjpackageManagement() {
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
      .insert([{ ...newPackage, price: Number(newPackage.price), hours: Number(newPackage.hours), owner_id: ownerId }])
      .select();

    if (error) return alert("Failed to add package: " + error.message);

    setDjPackages([...djPackages, data[0]]);
    setNewPackage({ packagename: "", price: "", hours: "", describtion: "" });
    setShowModal(false);
  };

  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">🎧 DJ Management</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-success" onClick={() => setShowModal(true)}>Add Package</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <h2>🎧 My DJ Packages</h2>

      <div className="mb-3 mt-3">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="form-control"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="form-control mt-2"
        />
      </div>

      {/* جدول الباكجات */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Package Name</th>
            <th>Price</th>
            <th>Hours</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPackages.map((dj) => (
            <tr key={dj.id}>
              <td>{dj.id}</td>
              <td>
                {editingId === dj.id ? (
                  <input type="text" className="form-control" value={editData.packagename}
                    onChange={(e) => setEditData({ ...editData, packagename: e.target.value })} />
                ) : dj.packagename}
              </td>
              <td>
                {editingId === dj.id ? (
                  <input type="number" className="form-control" value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })} />
                ) : dj.price}
              </td>
              <td>
                {editingId === dj.id ? (
                  <input type="number" className="form-control" value={editData.hours}
                    onChange={(e) => setEditData({ ...editData, hours: Number(e.target.value) })} />
                ) : dj.hours}
              </td>
              <td>
                {editingId === dj.id ? (
                  <input type="text" className="form-control" value={editData.describtion}
                    onChange={(e) => setEditData({ ...editData, describtion: e.target.value })} />
                ) : dj.describtion}
              </td>
              <td>
                {editingId === dj.id ? (
                  <>
                    <button className="btn btn-success btn-sm me-1" onClick={() => handleSave(dj.id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm me-1" onClick={() => handleEditClick(dj)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dj.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Add Package */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content-custom">
            <h3>Add New DJ Package</h3>
            <input
              type="text"
              placeholder="Package Name"
              className="form-control mb-2"
              value={newPackage.packagename}
              onChange={(e) => setNewPackage({ ...newPackage, packagename: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="form-control mb-2"
              value={newPackage.price}
              onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Hours"
              className="form-control mb-2"
              value={newPackage.hours}
              onChange={(e) => setNewPackage({ ...newPackage, hours: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="form-control mb-3"
              value={newPackage.describtion}
              onChange={(e) => setNewPackage({ ...newPackage, describtion: e.target.value })}
            />
            <div className="text-end">
              <button className="btn btn-success me-2" onClick={handleAddPackage}>Add</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
