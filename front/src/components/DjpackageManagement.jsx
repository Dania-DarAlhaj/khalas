import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../style/DjpackageManagement.css";

export default function DjpackageManagement() {
  const navigate = useNavigate();

  const ownerId = sessionStorage.getItem("ownerId_");
  const [djPackages, setDjPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const filteredPackages = djPackages
    .filter((dj) =>
      dj?.packagename?.toLowerCase().includes(searchName.toLowerCase())
    )
    .filter((dj) => searchPrice === "" || dj?.price <= Number(searchPrice));

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPackage, setNewPackage] = useState({
    packagename: "",
    price: "",
    hours: "",
    describtion: "",
    numberofphoto: "",
    numberofeditedphoto: "",
    imgurl: "",
  });

  useEffect(() => {
    const getDjPackages = async () => {
      const { data, error } = await supabase
        .from("dj")
        .select("*")
        .eq("owner_id", ownerId);

      if (error) {
        console.error("Error fetching DJ packages:", error);
        return;
      }

      setDjPackages(data);
    };

    if (ownerId) {
      getDjPackages();
    }
  }, [ownerId]);

  const handleAddPackage = async () => {
    if (!ownerId) return; // Ensure ownerId exists
    const { error } = await supabase
      .from("dj")
      .insert([newPackage]);

    if (error) {
      console.error("Error adding package:", error);
      return;
    }

    setDjPackages([...djPackages, newPackage]);
    setNewPackage({
      packagename: "",
      price: "",
      hours: "",
      describtion: "",
      numberofphoto: "",
      numberofeditedphoto: "",
      imgurl: "",
    });
    setShowAddModal(false);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("dj").delete().eq("id", id);

    if (error) {
      alert("Failed to delete package");
      console.error(error);
      return;
    }

    setDjPackages(djPackages.filter((dj) => dj.id !== id));
  };

  // Start editing
  const handleEdit = (dj) => {
    setEditingId(dj.id);
    setEditData({ ...dj });
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  // Save edit
  const handleSave = async (id) => {
    const { error } = await supabase
      .from("dj")
      .update({
        packagename: editData.packagename,
        price: editData.price,
        hours: editData.hours,
        describtion: editData.describtion,
        numberofphoto: editData.numberofphoto,
        numberofeditedphoto: editData.numberofeditedphoto,
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update package");
      console.error(error);
      return;
    }

    setDjPackages(
      djPackages.map((dj) => (dj.id === id ? { ...editData } : dj))
    );

    setEditingId(null);
    setEditData({});
  };

  // Input change in table
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };
  // لتحديث state الفورم الجديد مباشرة عند أي تغيير
  const handleAddInputChange = (e) => {
    const { name, value } = e.target; // ناخد اسم الحقل والقيمة المدخلة
    setNewPackage({
      ...newPackage, // نحتفظ بالقيم السابقة
      [name]: value, // نحدث الحقل الحالي بالقيمة الجديدة
    });
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="nav">
        <h3 className="logo">Wedding Planner</h3>

        <div className="links">
          <button onClick={() => navigate("/DJowner")} className="btn">
            Home
          </button>

          <button className="btn">Profile</button>

          <button
            onClick={() => navigate("/DjpackageManagement")}
            className="btn"
          >
            Package Management
          </button>
        </div>
      </nav>

      <div className="content">
        <h2>🎧 DJ Packages</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by package name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max price"
            value={searchPrice}
            onChange={(e) => setSearchPrice(e.target.value)}
          />
          <button onClick={() => setShowAddModal(true)}>
            ➕ Add Existing Package
          </button>
        </div>

        {djPackages.length === 0 ? (
          <p className="empty">😶 No packages found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Hours</th>
                <th>Description</th>
                <th>#Photos</th>
                <th>#Edited</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.map((dj) => (
                <tr key={dj.id}>
                  <td>
                    <img
                      src={`/img/dj/${dj.imgurl}`}
                      alt={dj.packagename}
                      className="dj-img"
                    />
                  </td>

                  {/* Inline Edit */}
                  <td>
                    {editingId === dj.id ? (
                      <input
                        type="text"
                        name="packagename"
                        value={editData.packagename}
                        onChange={handleInputChange}
                      />
                    ) : (
                      dj.packagename
                    )}
                  </td>
                  <td>
                    {editingId === dj.id ? (
                      <input
                        type="number"
                        name="price"
                        value={editData.price}
                        onChange={handleInputChange}
                      />
                    ) : (
                      dj.price
                    )}
                  </td>
                  <td>
                    {editingId === dj.id ? (
                      <input
                        type="number"
                        name="hours"
                        value={editData.hours}
                        onChange={handleInputChange}
                      />
                    ) : (
                      dj.hours
                    )}
                  </td>
                  <td>
                    {editingId === dj.id ? (
                      <input
                        type="text"
                        name="describtion"
                        value={editData.describtion}
                        onChange={handleInputChange}
                      />
                    ) : (
                      dj.describtion
                    )}
                  </td>
                  <td>
                    {editingId === dj.id ? (
                      <input
                        type="number"
                        name="numberofphoto"
                        value={editData.numberofphoto}
                        onChange={handleInputChange}
                      />
                    ) : (
                      dj.numberofphoto
                    )}
                  </td>
                  <td>
                    {editingId === dj.id ? (
                      <input
                        type="number"
                        name="numberofeditedphoto"
                        value={editData.numberofeditedphoto}
                        onChange={handleInputChange}
                      />
                    ) : (
                      dj.numberofeditedphoto
                    )}
                  </td>

                  <td className="actions">
                    {editingId === dj.id ? (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleSave(dj.id)}
                        >
                          💾 Save
                        </button>
                        <button
                          className="delete-btn"
                          onClick={handleCancel}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(dj)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(dj.id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {showAddModal && (
          <div className="modal">
            <h3>Add New Package</h3>

            <input
              type="text"
              name="packagename"
              placeholder="Package Name"
              value={newPackage.packagename}
              onChange={handleAddInputChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newPackage.price}
              onChange={handleAddInputChange}
            />
            <input
              type="number"
              name="hours"
              placeholder="Hours"
              value={newPackage.hours}
              onChange={handleAddInputChange}
            />
            <input
              type="text"
              name="describtion"
              placeholder="Description"
              value={newPackage.describtion}
              onChange={handleAddInputChange}
            />
            <input
              type="number"
              name="numberofphoto"
              placeholder="#Photos"
              value={newPackage.numberofphoto}
              onChange={handleAddInputChange}
            />
            <input
              type="number"
              name="numberofeditedphoto"
              placeholder="#Edited"
              value={newPackage.numberofeditedphoto}
              onChange={handleAddInputChange}
            />
            <input
              type="text"
              name="imgurl"
              placeholder="Image filename"
              value={newPackage.imgurl}
              onChange={handleAddInputChange}
            />

            <div className="modal-actions">
              <button onClick={handleAddPackage}>Add</button>
              <button onClick={handleCancelAdd}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
