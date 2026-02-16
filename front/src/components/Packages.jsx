import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Packages.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Packages() {
  const navigate = useNavigate();

  const locations = [
    "Ramallah",
    "Nablus",
    "Bethlehem",
    "Hebron",
    "Jericho",
    "Tulkarm",
    "Qalqilya",
    "Jenin",
    "Salfit",
    "Tubas"
  ];

  const packages = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Wedding Package ${i + 1}`,
    image: `/img/hall/hall${i + 1}.jpg`,
    location: locations[i % locations.length],

    prices: {
      hall: 2000 + i * 50,
      dj: 300 + i * 20,
      photography: 500 + i * 30,
    },

    dj: {
      packageName: `DJ Package ${i + 1}`,
      djName: `DJ ${["Omar", "Ahmad", "Rami", "Khaled", "Yazan"][i % 5]}`,
      hours: 4 + (i % 5),
    },

    photography: {
      packageName: `Photo Pack ${i + 1}`,
      photos: 300 + i * 20,
      videos: 1 + (i % 3),
      editedPhotos: 40 + i * 5,
    },

    hall: {
      name: `Luxury Hall ${i + 1}`,
      menCapacity: 120 + i * 5,
      womenCapacity: 120 + i * 5,
    },
  }));

  // ======================= STATE للفلترة ========================
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");

  const filteredPackages = packages.filter(pkg => {
    const total = pkg.prices.hall + pkg.prices.dj + pkg.prices.photography;
    const locationMatch = selectedLocation ? pkg.location === selectedLocation : true;
    const minMatch = minPrice ? total >= parseInt(minPrice) : true;
   
    return locationMatch && minMatch ;
  });

  return (
    <section className="packages py-5">
      <div className="container">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div>
            <h2 className="section-title">Wedding Packages</h2>
            <p className="section-subtitle">DJ • Photography • Wedding Hall</p>
          </div>
          <button className="btn btn-outline-custom" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>

        {/* FILTERS */}
        <div className="mb-4 d-flex flex-wrap gap-2 align-items-center">
          <select
            className="form-select"
            style={{ width: "200px" }}
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <input
            type="number"
            className="form-control"
            placeholder=" Total Price"
            style={{ width: "150px" }}
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />

       
          <button className="btn btn-secondary" onClick={() => { setSelectedLocation(""); setMinPrice("");  }}>
            Reset Filters
          </button>
        </div>

        {/* CARDS */}
        <div className="row g-4">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className="col-xl-3 col-lg-4 col-md-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
              >
                <div className="package-card h-100 shadow-sm">

                  {/* IMAGE */}
                  <img
                    src={pkg.image}
                    alt={pkg.hall.name}
                    className="w-100"
                    style={{ height: "180px", objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                  />

                  {/* LOCATION */}
                  <div className="text-center py-2 location-badge">
                    📍 {pkg.location}, Palestine
                  </div>

                  {/* PRICES */}
                  <div className="p-3 price-details">
                    <p className="mb-1">🏛️ Hall: ₪{pkg.prices.hall}</p>
                    <p className="mb-1">🎧 DJ: ₪{pkg.prices.dj}</p>
                    <p className="mb-1">📸 Photography: ₪{pkg.prices.photography}</p>
                    <hr />
                    <p className="fw-bold">💰 Total: ₪{pkg.prices.hall + pkg.prices.dj + pkg.prices.photography}</p>
                  </div>

                  {/* DJ DETAILS */}
                  <div className="p-3 mb-2">
                    <strong>🎧 DJ</strong>
                    <p className="mb-1">Package: {pkg.dj.packageName}</p>
                    <p className="mb-1">Name: {pkg.dj.djName}</p>
                    <p className="mb-1">Hours: {pkg.dj.hours}</p>
                  </div>

                  {/* Photography DETAILS */}
                  <div className="p-3 mb-2">
                    <strong>📸 Photography</strong>
                    <p className="mb-1">Package: {pkg.photography.packageName}</p>
                    <p className="mb-1">Photos: {pkg.photography.photos}</p>
                    <p className="mb-1">Videos: {pkg.photography.videos}</p>
                    <p className="mb-1">Edited: {pkg.photography.editedPhotos}</p>
                  </div>

                  {/* Hall DETAILS */}
                  <div className="p-3 mb-3">
                    <strong>🏛️ Hall</strong>
                    <p className="mb-1">Name: {pkg.hall.name}</p>
                    <p className="mb-1">Men: {pkg.hall.menCapacity}</p>
                    <p className="mb-1">Women: {pkg.hall.womenCapacity}</p>
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center">No packages match your filter criteria.</p>
          )}
        </div>

      </div>
    </section>
  );
}
