import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Packages.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Packages() {
  const navigate = useNavigate();

  const packages = [
    { name: 'Essential Elegance', price: '5,000 ₪', numericPrice: 5000, location: 'Ramallah', items: ['Premium venue for up to 100 guests','Professional DJ with sound system','4 hours of professional photography','Elegant floral decoration','Premium lighting setup'], note: 'Perfect for intimate luxury celebrations' },
    { name: 'Royal Premium', price: '8,500 ₪', numericPrice: 8500, location: 'Jerusalem', items: ['Luxury venue for 150 guests','Elite DJ with advanced lighting','6 hours photography + premium album','Designer decoration package','Gourmet catering experience'], note: 'Our most sought-after collection' },
    { name: 'Imperial Luxury', price: '12,000 ₪', numericPrice: 12000, location: 'Bethlehem', items: ['Grand ballroom for 200+ guests','Live orchestra & premium DJ','Full day photography + cinematic videography','Haute couture floral design','Five-star catering & champagne service'], note: 'The pinnacle of wedding excellence' },
  ];

  const [locationQuery, setLocationQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredPackages = packages.filter(pkg => {
    const matchLocation = locationQuery.trim() === '' || pkg.location.toLowerCase().includes(locationQuery.trim().toLowerCase());
    const matchPrice = maxPrice === '' || pkg.numericPrice <= Number(maxPrice);
    return matchLocation && matchPrice;
  });

  return (
    <div>
      <section className="packages">
        <div className="container">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1rem', flexWrap: 'wrap'}}>
            <div>
              <h2 className="section-title">Bespoke Wedding Collections</h2>
              <p className="section-subtitle">Meticulously curated packages designed for discerning couples</p>
            </div>
            <div>
              <button className="btn btn-outline-custom" onClick={() => navigate('/')}>Back to Home</button>
            </div>
          </div>

          <div className="packages-search">
            <input className="search-input" placeholder="Search by location (e.g. Ramallah)" value={locationQuery} onChange={e => setLocationQuery(e.target.value)} />
            <input className="search-input" type="number" placeholder="Max price ₪" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            <div className="search-actions">
              <button className="btn btn-filter btn-primary-custom" onClick={() => { /* filtering is live; kept small for accessibility */ }}>Filter</button>
            </div>
          </div>

          <div className="row g-4">
            {filteredPackages.map((pkg, index) => (
              <motion.div key={pkg.name} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.2 }} viewport={{ once: true }} className="col-lg-4 col-md-6">
                <div className="package-card">
                  <div className="package-header">
                    <h4 className="package-name">{pkg.name}</h4>
                    <div className="package-price">{pkg.price}</div>
                    <div style={{fontSize:'0.9rem', color:'var(--text-light)', marginTop:'6px'}}>{pkg.location}</div>
                  </div>
                  <div className="package-features">
                    <ul>
                      {pkg.items.map((item, idx) => (<li key={idx}>{item}</li>))}
                    </ul>
                    <div className="package-note">{pkg.note}</div>
                    <button className="btn btn-primary-custom w-100 mt-3">Select Collection</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (same as HomePage) */}
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
                <li><a href="">List Your Venue</a></li>
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
