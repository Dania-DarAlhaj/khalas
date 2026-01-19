import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import '../style/CakeOwnerPage.css';

export default function CakeOwnerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;
  const [ownerData, setOwnerData] = useState(null);
  const [cakes, setCakes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [cakeEdits, setCakeEdits] = useState({});
  const [cakeImages, setCakeImages] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchOwnerWithUser = async () => {
      const { data, error } = await supabase
        .from("owners")
        .select(`
          *,
          users:user_id (id, name, email, phone, city)
        `)
        .eq("user_id", userId)
        .single();

      if (!error) {
        setOwnerData(data);
        setFormData({
          owner_type: data.owner_type,
          description: data.description,
          rate: data.rate,
          name: data.users?.name || "",
          phone: data.users?.phone || "",
          city: data.users?.city || ""
        });

        const { data: cakeData } = await supabase
          .from("cakes")
          .select("*")
          .eq("user_id", data.user_id);

        setCakes(cakeData || []);
        const images = {};
        cakeData?.forEach(cake => {
          images[cake.id] = cake.imgurl ? cake.imgurl.split(",") : [];
        });
        setCakeImages(images);

        const edits = {};
        cakeData?.forEach(cake => {
          edits[cake.id] = {
            cake_name: cake.cake_name,
            price: cake.price
          };
        });
        setCakeEdits(edits);
      }
    };

    fetchOwnerWithUser();
  }, [userId, navigate]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCakeChange = (cakeId, e) => {
    setCakeEdits(prev => ({ ...prev, [cakeId]: { ...prev[cakeId], [e.target.name]: e.target.value } }));
  };

  const handleSaveAll = async () => {
    await supabase.from("owners").update({
      owner_type: formData.owner_type,
      description: formData.description,
      rate: formData.rate
    }).eq("owner_id", ownerData.owner_id);

    await supabase.from("users").update({
      name: formData.name,
      phone: formData.phone,
      city: formData.city
    }).eq("id", ownerData.user_id);

    for (const cakeId in cakeEdits) {
      const c = cakeEdits[cakeId];
      await supabase.from("cakes").update({
        cake_name: c.cake_name,
        price: parseFloat(c.price)
      }).eq("id", cakeId);
    }

    alert("All changes saved!");
    setEditMode(false);
    setOwnerData({
      ...ownerData,
      owner_type: formData.owner_type,
      description: formData.description,
      rate: formData.rate,
      users: { ...ownerData.users, name: formData.name, phone: formData.phone, city: formData.city }
    });
    setCakes(prev => prev.map(c => ({ ...c, ...cakeEdits[c.id] })));
  };

  const handleRemoveImage = (cakeId, index) => {
    setCakeImages(prev => {
      if (prev[cakeId].length <= 1) return prev;
      const newImages = [...prev[cakeId]];
      newImages.splice(index, 1);
      return { ...prev, [cakeId]: newImages };
    });
  };

  const formatCakeName = (name) =>
    name.replace(/\s+/g, "_");

  const handleAddImages = (cakeId, e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setCakeImages(prev => ({
      ...prev,
      [cakeId]: [...prev[cakeId], ...urls]
    }));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  if (!ownerData) return <p>Loading owner data...</p>;

  return (
    <div className="owner-details-page">

      {/* === NAVBAR === */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="logo-text">Wedding Planing System</span>
          </div>
        </div>
        <div className="navbar-right">
          <button onClick={() => setEditMode(true)}>👤 Profile</button>
          <button onClick={() => navigate("/CakeManageItems", { state: { userId } })}>📋 Manage Items</button>
          <button onClick={() => navigate("/Cakevisit", { state: { userId } })}>📋 Visit Form</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* === PAGE TITLE === */}
      <h2>Owner & Cake Details</h2>

      {/* === OWNER INFO SECTION === */}
      <form className="section">
        <p>Information about the business</p>

        <div className="form-grid">
          <label>
            <span>Description</span>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>

          <label>
            <span>Rate</span>
            <input
              name="rate"
              type="number"
              value={formData.rate}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>

          <label>
            <span>Shop Name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>

          <label>
            <span>Email</span>
            <input
              value={ownerData.users?.email}
              disabled
            />
          </label>

          <label>
            <span>Phone</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode}
            />
          </label>

          <label>
            <span>City</span>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!editMode}
            >
              <option value="">Select a city</option>
              <option value="Ramallah">Ramallah</option>
              <option value="Jerusalem">Jerusalem</option>
              <option value="Bethlehem">Bethlehem</option>
              <option value="Nablus">Nablus</option>
              <option value="Gaza">Gaza</option>
              <option value="Hebron">Hebron</option>
              <option value="Jenin">Jenin</option>
              <option value="Tulkarm">Tulkarm</option>
              <option value="Qalqilya">Qalqilya</option>
              <option value="Salfit">Salfit</option>
              <option value="Tubas">Tubas</option>
              <option value="Jericho">Jericho</option>
            </select>
          </label>
        </div>
      </form>

      {/* === CAKE CARDS === */}
      {cakes.map(cake => (
        <div key={cake.id} className="cake-card">
          <label>
            <span>Cake Name</span>
            <input
              name="cake_name"
              value={cakeEdits[cake.id]?.cake_name || ""}
              onChange={(e) => handleCakeChange(cake.id, e)}
              disabled={!editMode}
            />
          </label>

          <label>
            <span>Price</span>
            <input
              name="price"
              type="number"
              value={cakeEdits[cake.id]?.price || ""}
              onChange={(e) => handleCakeChange(cake.id, e)}
              disabled={!editMode}
            />
          </label>

          <div className="cake-images">
            {cakeImages[cake.id]?.map((_, index) => (
              <div key={index} className="cake-image-wrapper">
                <img
                  src={`/img/cake/${formatCakeName(cake.imgurl)}`}
                  alt={`${cake.cake_name} ${index + 1}`}
                />

                {editMode && cakeImages[cake.id]?.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(cake.id, index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {editMode && (
              <input
                type="file"
                multiple
                onChange={(e) => handleAddImages(cake.id, e)}
              />
            )}
          </div>
        </div>
      ))}

      {/* === ACTION BUTTONS === */}
      <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel" : "Edit All"}
      </button>

      {editMode && (
        <button type="button" className="save-btn" onClick={handleSaveAll}>
          Save All Changes
        </button>
      )}
    </div>
  );
}