import { useState } from "react";
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
    imgname: "", // اسم الصورة فقط
  });

  const [imageFile, setImageFile] = useState(null); // هذا لتخزين الملف مؤقتًا

  // تحديث الحقول عند الكتابة
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // اختيار الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // نخزن الملف مؤقتًا
      setFormValues((prev) => ({ ...prev, imgname: file.name })); // نضع اسم الملف في الفورم
    }
  };

  // حفظ الفورم
  const handleSubmit = async (e) => {
    e.preventDefault();

    // إدخال البيانات في Supabase
    const { error } = await supabase.from("photography").insert([
      {
        user_id: sessionStorage.getItem("userId_"),
        packagename: formValues.packagename,
        price: Number(formValues.price),
        numberofphoto: Number(formValues.numberofphoto),
        numberofvidio: Number(formValues.numberofvidio),
        numberofeditedphoto: Number(formValues.numberofeditedphoto),
        imgurl: formValues.imgname, // يخزن اسم الملف فقط
      },
    ]);

    if (error) {
      alert("Error adding package: " + error.message);
    } else {
      alert("Package added successfully!");
      setFormValues({
        packagename: "",
        price: "",
        numberofphoto: "",
        numberofvidio: "",
        numberofeditedphoto: "",
        imgname: "",
      });
      setImageFile(null);
    }
  };
 // Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
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
      <h2>Add New Photography Package 📸</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
        <div>
          <label>Package Name:</label>
          <input
            type="text"
            name="packagename"
            value={formValues.packagename}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formValues.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Number of Photos:</label>
          <input
            type="number"
            name="numberofphoto"
            value={formValues.numberofphoto}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Number of Videos:</label>
          <input
            type="number"
            name="numberofvidio"
            value={formValues.numberofvidio}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Number of Edited Photos:</label>
          <input
            type="number"
            name="numberofeditedphoto"
            value={formValues.numberofeditedphoto}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formValues.imgname && <p>Selected file: {formValues.imgname}</p>}
        </div>

        <button type="submit">Save Package</button>
      </form>
    </div>
  );
}
