import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/HomePage.css';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogout = () => {
  sessionStorage.clear(); 
  setIsLoggedIn(false);
  navigate("/login");
};

  useEffect(() => {
     setIsLoggedIn(!!sessionStorage.getItem("currentEmail"));
     
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const handleScroll = () => {
      const navbar = document.querySelector('.wps-navbar');
      if (!navbar) return; // guard in case element isn't present yet
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
      
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      
    };
  }, []);
const navigate = useNavigate();


  const services = [

      { 
    title: 'Wedding Venues', 
    desc: 'Discover exquisite halls with premium amenities and breathtaking ambiance for your perfect celebration.', 
    icon: '🏛️',
    path: '/VenuesPage'
  },
    { title: 'Music & Entertainment',
       desc: 'World-class DJs and live orchestras to create unforgettable musical experiences.', 
       icon: '🎧' ,
      path: '/DJ' },
    { title: 'Photography & Videography',
       desc: 'Award-winning photographers capturing every precious moment with artistic excellence.',
        icon: '📸' ,
        path: '/PhotographersPage'
      },
    { title: 'Luxury Cakes',
       desc: 'Bespoke wedding cakes crafted by master pastry chefs with premium ingredients.',
        icon: '🍰' ,
       path: '/CakePage'},
    { title: 'Floral Design',
       desc: 'Stunning floral arrangements and sophisticated venue styling by expert designers.',
        icon: '🌹',
        path: '/DecorPage' },
  ];

  const packages = [
    { 
      name: 'Essential Elegance', 
      price: '5,000 ₪', 
      items: [
        'Premium venue for up to 100 guests',
        'Professional DJ with sound system',
        '4 hours of professional photography',
        'Elegant floral decoration',
        'Premium lighting setup'
      ], 
      note: 'Perfect for intimate luxury celebrations' 
    },
    { 
      name: 'Royal Premium', 
      price: '8,500 ₪', 
      items: [
        'Luxury venue for 150 guests',
        'Elite DJ with advanced lighting',
        '6 hours photography + premium album',
        'Designer decoration package',
        'Gourmet catering experience'
      ], 
      note: 'Our most sought-after collection' 
    },
    { 
      name: 'Imperial Luxury', 
      price: '12,000 ₪', 
      items: [
        'Grand ballroom for 200+ guests',
        'Live orchestra & premium DJ',
        'Full day photography + cinematic videography',
        'Haute couture floral design',
        'Five-star catering & champagne service'
      ], 
      note: 'The pinnacle of wedding excellence' 
    },
  ];

  const steps = [
    { number: '1', title: 'Discover & Explore', desc: 'Browse our curated collection of premium venues and elite vendors' },
    { number: '2', title: 'Customize Your Vision', desc: 'Tailor every detail to match your unique wedding dreams' },
    { number: '3', title: 'Secure Your Date', desc: 'Reserve your perfect day with seamless booking experience' },
    { number: '4', title: 'Celebrate in Luxury', desc: 'Experience your dream wedding brought to life flawlessly' }
  ];

  const testimonials = [
    { text: 'WPS transformed our wedding into a fairytale. Every detail was executed with perfection and elegance beyond our expectations.', author: 'Sarah & Ahmed' },
    { text: 'The luxury and attention to detail was extraordinary. Our guests are still talking about how magnificent everything was!', author: 'Layla & Omar' },
    { text: 'From venue to vendors, everything was world-class. WPS made our dream wedding a stunning reality.', author: 'Nour & Khalid' }
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light wps-navbar fixed-top">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
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
              <li className="nav-item"><a className="nav-link active" href="#home">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#services">Services</a></li>
              <li className="nav-item"><a className="nav-link" href="#packages">Packages</a></li>
              <li className="nav-item"><a className="nav-link" href="#how-it-works">How It Works</a></li>
              <li className="nav-item"><a className="nav-link" href="#testimonials">Reviews</a></li>
          
              {/* زر Login / Logout */}
              <li className="nav-item">
                <button
                  className="btn btn-primary-custom"
                  onClick={isLoggedIn ? handleLogout : () => navigate("/login")}
                  style={{
                    color: '#000',
                    fontWeight: '900',
                    fontSize: '.8rem',
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

      {/* Hero */}
      <header id="home" className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-content">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                Plan Your Perfect Palestinian Wedding
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                Experience luxury wedding planning with our curated collection of premium venues, elite vendors, and bespoke services — all orchestrated to perfection.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="d-flex gap-3 flex-wrap"
              >
                <a className="btn btn-primary-custom" href="#packages">Explore Packages</a>
                <a className="btn btn-outline-custom" href="#how-it-works">How It Works</a>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div
                className="hero-image-wrapper"
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              >
                <img
                  src="/1.jpg"
                  alt="Elegant wedding celebration"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <div className="row text-center">
            {[
              { number: '500+', label: 'Premium Venues' },
              { number: '2,000+', label: 'Happy Couples' },
              { number: '50+', label: 'Cities Covered' },
              { number: '4.9/5', label: 'Excellence Rating' }
            ].map((stat, index) => (
              <div key={index} className="col-md-3 col-6 mb-4">
                <motion.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="services">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Luxury Wedding Services
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            From exquisite venues to world-class entertainment, we orchestrate every detail
          </motion.p>
          
          <div className="row g-4">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="col-md-4"
              >
                <div
  className="service-card"
  style={{ cursor: service.path ? 'pointer' : 'default' }}
  onClick={() => {
    if (service.path) {
      navigate(service.path);
    }
  }}
>

                  <div className="service-icon">{service.icon}</div>
                  <h4 className="service-title">{service.title}</h4>
                  <p className="service-desc">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="packages">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Bespoke Wedding Collections
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Meticulously curated packages designed for discerning couples
          </motion.p>
          <div className="see-more-wrapper">
            <button className="see-more-btn" onClick={() => navigate('/Packages')}>See more →</button>
          </div>
          
          <div className="row g-4">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="col-lg-4 col-md-6"
              >
                <div className="package-card">
                  <div className="package-header">
                    <h4 className="package-name">{pkg.name}</h4>
                    <div className="package-price">{pkg.price}</div>
                  </div>
                  <div className="package-features">
                    <ul>
                      {pkg.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
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

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Your Journey to Perfection
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Four seamless steps to your dream wedding
          </motion.p>
          
          <div className="row">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="col-lg-3 col-md-6"
              >
                <div className="step-card">
                  <div className="step-number">{step.number}</div>
                  <h4 className="step-title">{step.title}</h4>
                  <p className="service-desc">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Celebrated Love Stories
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Hear from couples who experienced wedding perfection
          </motion.p>
          
          <div className="row">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="col-lg-4"
              >
                <div className="testimonial-card">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">{testimonial.author}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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