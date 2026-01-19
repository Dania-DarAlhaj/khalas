import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import '../style/VenuesPage.css';
import { supabase } from '../supabaseClient';
import Chatbot from './chatbot';


import { useNavigate, Link } from "react-router-dom";

export default function VenuesPage() {

  /* ================= STATES ================= */
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');

  const [chatOpen, setChatOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };
 


useEffect(() => {
  const fetchVenues = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("hall")
      .select(`
        *,
        owners:owner_id (
          rate,
          rating_count,
          description,
          users:user_id ( city )
        )
      `);

    if (error) {
      console.error(error);
    } else {
      setVenues(data || []);
    }

    setLoading(false);
  };

  fetchVenues();
}, []);



const fetchFilteredVenues = async (filters) => {
  try {
    const { data, error } = await supabase
      .from("hall")
      .select(`
        *,
        owners:owner_id (
          rate,
          rating_count,
          description,
          users:user_id ( city )
        )
      `);

    if (error) console.error(error);

    let filtered = data || [];

    if (filters.city) {
      filtered = filtered.filter(v => v.owners?.users?.city === filters.city);
    }
    if (filters.min_capacity) {
      filtered = filtered.filter(v => (v.men_capacity + v.women_capacity) >= filters.min_capacity);
    }
    if (filters.parking) {
      filtered = filtered.filter(v => v.parking === true);
    }

    return filtered;
  } catch (err) {
    console.error(err);
    return [];
  }
};





 const navigate = useNavigate();
  /* ================= FILTERS ================= */
  const locations = ['all', 'Ramallah', 'Nablus', 'Bethlehem', 'Hebron', "Jerusalem", "Jenin", "Tulkarm", "Qalqilya", "Salfit", "Tubas", "Jericho"];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: 'Under 7,000 ₪' },
    { value: 'medium', label: '7,000 - 9,000 ₪' },
    { value: 'high', label: 'Over 9,000 ₪' }
  ];

  const capacityRanges = [
    { value: 'all', label: 'All Capacities' },
    { value: 'small', label: 'Under 250 guests' },
    { value: 'medium', label: '250 - 350 guests' },
    { value: 'large', label: 'Over 350 guests' }
  ];

  const filteredVenues = venues.filter(v => {
    const q = (searchTerm || '').trim().toLowerCase();
    const totalCapacity = (Number(v.men_capacity) || 0) + (Number(v.women_capacity) || 0);
    const city = v.location || v.owners?.users?.city || '';
    const name = v.name || '';
    const type = v.hall_type || '';
    const ownerDesc = v.owners?.description || '';

    const matchSearch = !q || [name, city, type, ownerDesc].some(field => field.toLowerCase().includes(q));

    const matchLocation = selectedLocation === 'all' || city === selectedLocation;

    const price = Number(v.price) || 0;
    const matchPrice =
      selectedPrice === 'all' ||
      (selectedPrice === 'low' && price < 7000) ||
      (selectedPrice === 'medium' && price >= 7000 && price <= 9000) ||
      (selectedPrice === 'high' && price > 9000);

    const matchCapacity =
      selectedCapacity === 'all' ||
      (selectedCapacity === 'small' && totalCapacity < 250) ||
      (selectedCapacity === 'medium' && totalCapacity >= 250 && totalCapacity <= 350) ||
      (selectedCapacity === 'large' && totalCapacity > 350);

    return matchSearch && matchLocation && matchPrice && matchCapacity;
  });



  /* ================= FONT & NAVBAR SCROLL ================= */
  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem("currentEmail"));
    
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600&display=swap';
    link.rel = 'stylesheet';
    if (!document.head.querySelector('link[href*="Playfair"]')) {
      document.head.appendChild(link);
    }

    const handleScroll = () => {
      const navbar = document.querySelector('.wps-navbar');
      if (navbar) {
        window.scrollY > 50
          ? navbar.classList.add('navbar-scrolled')
          : navbar.classList.remove('navbar-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ================= UI ================= */
  return (
    <div>

      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-light wps-navbar fixed-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
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
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)'
              }}
            >
              WPS
            </motion.div>
            <span className="brand-primary">Wedding Planning System</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link active" to="/VenuesPage">Venues</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/DecorPage">Decoration</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/DJ">DJ</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/CakePage">Cakes</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/PhotographersPage">Photography</Link></li>
              
              {/* زر Login / Logout */}
              <li className="nav-item">
                <button
                  className="btn btn-primary-custom"
                  onClick={isLoggedIn ? handleLogout : () => navigate("/login")}
                  style={{
                    color: '#000',
                    fontWeight: '800',
                    fontSize: '1rem',
                    textShadow: '0 2px 4px rgba(255,255,255,0.5)',
                    letterSpacing: '0.5px'
                  }}
                >
                  {isLoggedIn ? "Logout" : "Log in"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <div className="venues-page">
        <div className="container">

          <h1 className="page-title">Luxury Wedding Venues</h1>
          <p className="page-subtitle">Discover the most exquisite venues for your dream wedding</p>

          {/* SEARCH */}
          <input
            type="text"
            className="search-input"
            placeholder="Search venues by name, location, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* FILTERS */}
          <div className="row mt-4">
            <div className="col-md-4">
              <select className="filter-select" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
                <option value="all">All Locations</option>
                {locations.slice(1).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="col-md-4">
              <select className="filter-select" value={selectedPrice} onChange={e => setSelectedPrice(e.target.value)}>
                {priceRanges.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div className="col-md-4">
              <select className="filter-select" value={selectedCapacity} onChange={e => setSelectedCapacity(e.target.value)}>
                {capacityRanges.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
{/* VENUES */}
{loading ? (
  <p className="text-center my-5">Loading venues...</p>
) : filteredVenues.length === 0 ? (
  <p className="text-center my-5">No venues found matching your criteria.</p>
) : (
  <div className="venues-grid">
    {filteredVenues.map((v, i) => (
      <motion.div
        key={v.hall_id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <div className="venue-card">
          <div className="venue-image-wrapper">
            <img
              src={v.imgurl ? `/img/hall/${v.imgurl.split(",")[0].trim()}` : "/images/Venue.jpg"}
              alt={v.hall_type}
              className="venue-image"
            />
          </div>

          <div className="venue-content">
            <h3 className="venue-name">{v.hall_type}</h3>

            <div className="venue-rating">
              <span className="rating-stars">⭐</span>
              <span className="rating-number">{(v.owners?.rate ?? 0).toFixed(1)}/5</span>
              <span className="rating-reviews">({v.owners?.rating_count ?? 0} reviews)</span>
            </div>

            <p className="venue-description">{v.owners?.description}</p>

            <div className="venue-details">
              <div className="venue-detail-item">
                <div className="detail-icon">📍</div>
                <div className="detail-label">Location</div>
                <div className="detail-value">{v.owners?.users?.city}</div>
              </div>
              <div className="venue-detail-item">
                <div className="detail-icon">👥</div>
                <div className="detail-label">Capacity</div>
                <div className="detail-value">{v.men_capacity + v.women_capacity}</div>
              </div>
              {v.parking && (
                <div className="venue-detail-item">
                  <div className="detail-icon">🅿️</div>
                  <div className="detail-label">Parking</div>
                  <div className="detail-value">Available</div>
                </div>
              )}
            </div>

            <div className="venue-price">
              {v.price?.toLocaleString()} ₪
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate(`/venue/${v.owner_id}`)}
            >
              see more
            </button>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
)}

        </div>
      </div>

      {/* ================= FOOTER ================= */}
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

      {/* ================= CHATBOT ================= */}
   
        <div className="chatbot-container">
  

  <button
    className="chatbot-toggle"
    onClick={() => setChatOpen(!chatOpen)}
  >
    {chatOpen ? '✕' : '💬'}
  </button>
</div>

    
    </div>
  );
}