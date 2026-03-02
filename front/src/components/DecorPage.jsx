import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import '../style/DecorPage.css';
import { supabase } from '../supabaseClient';
export default function DecorationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState([]);
 const locationOptions = [
  "Ramallah",
  "Bethlehem",
  "Jerusalem",
  "Hebron",
  "Nablus",
  "Jenin" ,
  "Tulkarm",
  "Qalqilya",
  "Salfit",
  "Tubas",
  "Jericho"
];
  const decorationTypes = [
    "Groom's Car Decoration",
    "Wedding Favors",
    "Wedding Entrance Decor",
    "Table Centerpieces",
    "Flower Arrangements",
    "Stage Decoration",
    "Lighting Setup",
    "Custom Signage",
    "Photo Booth Setup"
  ];

  const [decorationServices, setDecorationServices] = useState([]);
  const [loadingDecor, setLoadingDecor] = useState(true);
  const [errorDecor, setErrorDecor] = useState(null);

const getFilteredServices = () => {
  return decorationServices.filter((service) => {

    const name = service.owners?.users?.name?.toLowerCase() || "";
    const city = service.owners?.users?.city?.toLowerCase() || "";
    const type = service.decoration_type?.toLowerCase() || "";

    const search = searchTerm.toLowerCase();

    // search by name OR city
    const matchesSearch =
      name.includes(search) ||
      city.includes(search);

    // filter by location dropdown
    const matchesLocation =
      selectedLocation === "all" ||
      city === selectedLocation.toLowerCase();

    // filter by decoration types (multi select)
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.includes(service.decoration_type);

    return matchesSearch && matchesLocation && matchesType;
  });
};

useEffect(() => {
  const fetchDecorations = async () => {
    setLoadingDecor(true);
    try {
      const { data, error } = await supabase
        .from('decoration_item')
        .select(`
          *,
          owners (
            user_id,
            users (
              name,
              city,
              phone
            )
          )
        `);

      if (error) {
        setErrorDecor(error.message);
      } else {
        console.log('Fetched decorations with owner & user:', data);
        setDecorationServices(data);
      }
    } catch (err) {
      setErrorDecor(err.message);
    }
    setLoadingDecor(false);
  };

  fetchDecorations();
}, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light wps-navbar">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #8B7355 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                color: 'var(--white)',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)'
              }}
            >
              WPS
            </motion.div>
            <span className="brand-primary">Wedding Planning System</span>
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto align-items-lg-center">
        <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link " href="/Venuespage">Venues</a></li>
              <li className="nav-item"><a className="nav-link" href="/DecorPage">Decoration</a></li>
              <li className="nav-item"><a className="nav-link" href="/DJ">DJ</a></li>
              <li className="nav-item"><a className="nav-link" href="/CakePage">Cakes</a></li>
              <li className="nav-item"><a className="nav-link" href="/PhotographersPage">Photography</a></li>
              <li className="nav-item ms-3"><a className="btn btn-primary-custom" href="/login">Log in</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="decoration-page">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="page-title">Wedding Decoration Services</h1>
            <p className="page-subtitle">Transform your wedding venue into a magical celebration space</p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            className="search-filter-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="container">
              <div className="search-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by service name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="filter-group">
                    <label className="filter-label">Location</label>
                <select
  className="filter-select"
  value={selectedLocation}
  onChange={(e) => setSelectedLocation(e.target.value)}
>
  <option value="all">All Locations</option>

  {locationOptions.map((city, index) => (
    <option key={index} value={city}>
      {city}
    </option>
  ))}
</select>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="filter-group">
                    <label className="filter-label">Decoration Types (Select multiple)</label>
                    <div className="type-filters">
                      {decorationTypes.map(type => (
                      <button
  key={type}
  className={`type-chip ${selectedTypes.includes(type) ? 'active' : ''}`}
  onClick={() => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  }}
>
  {type}
</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
<div className="services-grid">
 {getFilteredServices().length > 0 ? (
    getFilteredServices().map((service, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
     <div className="service-card simple-card">

  <div className="service-image-wrapper">
    <img 
      src={service.imgname ? `/img/decor/${service.imgname}` : '/img/Decor.jpg'} 
      alt={service.decoration_type} 
      className="service-image" 
    />
  </div>

  <div className="service-types">
    <span className="service-type-badge">
      {service.decoration_type}
    </span>
  </div>

  <div className="service-owner-info">
    <h5>{service.owners?.users?.name}</h5>
    <p>📍 {service.owners?.users?.city}</p>
    <p>📞 {service.owners?.users?.phone}</p>
  </div>

</div>
      </motion.div>
    ))
  ) : (
    <div className="no-results">
      <p>No decoration services found.</p>
    </div>
  )}
</div>


        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="brand-primary" style={{fontSize: '1.6rem', marginBottom: '1rem'}}>Wedding Planning System</div>
              <p style={{color: '#c9c5c0', fontFamily: 'Lato, sans-serif'}}>Your trusted partner in orchestrating extraordinary Palestinian wedding celebrations with unparalleled elegance and sophistication.</p>
            </div>
            <div className="col-lg-2 col-md-4 mb-4">
              <h5 className="footer-heading">Company</h5>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-4 mb-4">
              <h5 className="footer-heading">Support</h5>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-4 mb-4">
              <h5 className="footer-heading">Vendors</h5>
              <ul className="footer-links">
                <li><a href="#">List Your Venue</a></li>
                <li><a href="#">Join as Vendor</a></li>
                <li><a href="#">Vendor Resources</a></li>
              </ul>
            </div>
            <div className="col-lg-2 mb-4">
              <h5 className="footer-heading">Connect</h5>
              <ul className="footer-links">
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Wedding Planning System. All rights reserved. Crafted with excellence.</p>
          </div>
        </div>
      </footer>

    
    </div>
  );
}