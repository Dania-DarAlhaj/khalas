import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [admin, setAdmin] = useState({
    id: 1,
    name: 'System Administrator',
    email: 'admin@weddingplanning.com',
    role: 'Super Admin',
    avatar: 'SA'
  });

  const [stats, setStats] = useState({
    totalVenues: 12,
    totalCustomers: 156,
    pendingApprovals: 8,
    totalRevenue: 125000,
    activeBookings: 24,
    totalServiceProviders: 45,
    pendingPayments: 15000
  });

  const [customers, setCustomers] = useState([
    { id: 1, name: 'Ahmad Khalil', email: 'ahmad.k@email.com', phone: '+970-59-111-2222', bookings: 1, totalSpent: 5000, joinDate: '2024-02-01', status: 'Active' },
    { id: 2, name: 'Layla Salem', email: 'layla.s@email.com', phone: '+970-59-222-3333', bookings: 2, totalSpent: 8500, joinDate: '2024-01-15', status: 'Active' },
    { id: 3, name: 'Omar Taha', email: 'omar.t@email.com', phone: '+970-59-333-4444', bookings: 1, totalSpent: 6200, joinDate: '2024-03-10', status: 'Active' },
    { id: 4, name: 'Noor Mahmoud', email: 'noor.m@email.com', phone: '+970-59-444-5555', bookings: 0, totalSpent: 0, joinDate: '2024-03-20', status: 'Inactive' }
  ]);

  const [serviceProviders, setServiceProviders] = useState([
    { id: 1, name: 'Elite Catering', type: 'Catering', email: 'info@elitecatering.com', phone: '+970-59-555-6666', status: 'Active', rating: 4.8 },
    { id: 2, name: 'Perfect Photos', type: 'Photography', email: 'contact@perfectphotos.com', phone: '+970-59-666-7777', status: 'Active', rating: 4.9 },
    { id: 3, name: 'Floral Dreams', type: 'Flowers', email: 'hello@floraldreams.com', phone: '+970-59-777-8888', status: 'Pending', rating: 4.7 },
    { id: 4, name: 'Sound Masters', type: 'Music/DJ', email: 'info@soundmasters.com', phone: '+970-59-888-9999', status: 'Active', rating: 4.6 }
  ]);

  const [payments, setPayments] = useState([
    { id: 1, booking: 101, customer: 'Ahmad Khalil', amount: 2500, commission: 375, netAmount: 2125, date: '2024-03-01', status: 'Completed', method: 'Credit Card' },
    { id: 2, booking: 102, customer: 'Layla Salem', amount: 1800, commission: 270, netAmount: 1530, date: '2024-03-05', status: 'Pending', method: 'Bank Transfer' },
    { id: 3, booking: 103, customer: 'Omar Taha', amount: 3500, commission: 525, netAmount: 2975, date: '2024-03-08', status: 'Completed', method: 'Cash' },
    { id: 4, booking: 104, customer: 'Noor Mahmoud', amount: 2000, commission: 300, netAmount: 1700, date: '2024-03-10', status: 'Refunded', method: 'Credit Card' }
  ]);

  const [activityLog, setActivityLog] = useState([
    { id: 1, user: 'Admin', action: 'Approved service provider: Floral Dreams', timestamp: '2024-03-15 10:30 AM', type: 'approval' },
    { id: 2, user: 'Ahmad Khalil', action: 'Created new booking #101', timestamp: '2024-03-15 09:15 AM', type: 'booking' },
    { id: 3, user: 'Admin', action: 'Processed payment #1', timestamp: '2024-03-13 02:30 PM', type: 'payment' },
    { id: 4, user: 'Admin', action: 'Suspended customer: Noor Mahmoud', timestamp: '2024-03-12 04:15 PM', type: 'suspension' },
    { id: 5, user: 'Omar Taha', action: 'Left review for Crystal Events', timestamp: '2024-03-12 01:30 PM', type: 'review' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New service provider registration: Floral Dreams', time: '1h', type: 'order' },
    { id: 2, text: 'Payment received for booking #101 - 2500 ILS', time: '2h', type: 'success' },
    { id: 3, text: 'System backup completed successfully', time: '1d', type: 'info' }
  ]);

  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const messagesEndRef = useRef(null);

  const approveServiceProvider = (id) => {
    setServiceProviders(prev => prev.map(s => s.id === id ? { ...s, status: 'Active' } : s));
    setNotifications(prev => [{ id: Date.now(), text: `Service provider approved: ${serviceProviders.find(s => s.id === id)?.name}`, time: 'now', type: 'success' }, ...prev]);
    setStats(prev => ({ ...prev, pendingApprovals: Math.max(0, prev.pendingApprovals - 1) }));
    setActivityLog(prev => [{ id: Date.now(), user: 'Admin', action: `Approved service provider: ${serviceProviders.find(s => s.id === id)?.name}`, timestamp: new Date().toLocaleString(), type: 'approval' }, ...prev]);
  };

  const suspendServiceProvider = (id) => {
    setServiceProviders(prev => prev.map(s => s.id === id ? { ...s, status: 'Suspended' } : s));
    setNotifications(prev => [{ id: Date.now(), text: `Service provider suspended: ${serviceProviders.find(s => s.id === id)?.name}`, time: 'now', type: 'warning' }, ...prev]);
    setActivityLog(prev => [{ id: Date.now(), user: 'Admin', action: `Suspended service provider: ${serviceProviders.find(s => s.id === id)?.name}`, timestamp: new Date().toLocaleString(), type: 'suspension' }, ...prev]);
  };

  const deleteServiceProvider = (id) => {
    const provider = serviceProviders.find(s => s.id === id);
    setServiceProviders(prev => prev.filter(s => s.id !== id));
    setNotifications(prev => [{ id: Date.now(), text: `Service provider deleted: ${provider?.name}`, time: 'now', type: 'warning' }, ...prev]);
    setActivityLog(prev => [{ id: Date.now(), user: 'Admin', action: `Deleted service provider: ${provider?.name}`, timestamp: new Date().toLocaleString(), type: 'deletion' }, ...prev]);
  };

  const suspendCustomer = (id) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'Suspended' } : c));
    setNotifications(prev => [{ id: Date.now(), text: `Customer suspended: ${customers.find(c => c.id === id)?.name}`, time: 'now', type: 'warning' }, ...prev]);
    setActivityLog(prev => [{ id: Date.now(), user: 'Admin', action: `Suspended customer: ${customers.find(c => c.id === id)?.name}`, timestamp: new Date().toLocaleString(), type: 'suspension' }, ...prev]);
  };

  const processPayment = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Completed' } : p));
    setNotifications(prev => [{ id: Date.now(), text: `Payment #${id} processed successfully`, time: 'now', type: 'success' }, ...prev]);
    setActivityLog(prev => [{ id: Date.now(), user: 'Admin', action: `Processed payment #${id}`, timestamp: new Date().toLocaleString(), type: 'payment' }, ...prev]);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [notifications]);

  useEffect(() => {
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Lato:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
      
      :root {
        --primary: #8B7355;
        --gold: #D4AF37;
        --rose-gold: #B76E79;
        --light: #FAF8F5;
        --dark: #2C2416;
        --cream: #FFF9F0;
        --shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
        --shadow-md: 0 8px 30px rgba(0,0,0,0.08);
        --shadow-lg: 0 20px 60px rgba(0,0,0,0.12);
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body { 
        background: linear-gradient(135deg, #FAF8F5 0%, #FFF9F0 100%);
        font-family: 'Lato', sans-serif;
        color: var(--dark);
        overflow-x: hidden;
      }
      
      .wps-navbar {
        background: rgba(255,255,255,0.98) !important;
        backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.06);
        border-bottom: 1px solid rgba(212,175,55,0.1);
        padding: 1rem 0;
        position: fixed;
        top: 0; 
        left: 0; 
        right: 0; 
        z-index: 999;
        transition: all 0.3s ease;
      }
      
      .wps-navbar.navbar-scrolled {
        padding: 0.6rem 0;
        box-shadow: 0 12px 40px rgba(0,0,0,0.1);
      }
      
      .brand-primary { 
        font-family: 'Playfair Display', serif; 
        color: var(--dark); 
        font-weight: 700; 
        letter-spacing: 0.5px;
        font-size: 1.3rem;
      }
      
      .nav-link { 
        color: #3D3427 !important; 
        font-weight: 500; 
        margin: 0 0.8rem;
        position: relative;
        transition: all 0.3s ease;
      }
      
      .nav-link:hover {
        color: var(--gold) !important;
      }
      
      .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--gold), var(--primary));
      }
      
      .admin-hero { 
        padding-top: 120px; 
        padding-bottom: 2rem;
        position: relative;
      }
      
      .hero-gradient {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 300px;
        background: linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(139,115,85,0.05) 100%);
        z-index: -1;
        border-radius: 0 0 50px 50px;
      }
      
      .stats-card { 
        border-radius: 20px; 
        box-shadow: var(--shadow-md);
        background: white;
        padding: 1.8rem 1.5rem;
        border: 1px solid rgba(212,175,55,0.1);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }
      
      .stats-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--gold), var(--primary));
        transform: scaleX(0);
        transition: transform 0.4s ease;
      }
      
      .stats-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
      }
      
      .stats-card:hover::before {
        transform: scaleX(1);
      }
      
      .stats-icon {
        width: 60px;
        height: 60px;
        border-radius: 16px;
        background: linear-gradient(135deg, var(--gold) 0%, var(--primary) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        margin: 0 auto 1rem;
        box-shadow: 0 8px 20px rgba(212,175,55,0.3);
      }
      
      .stats-value {
        font-family: 'Playfair Display', serif;
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--gold) 0%, var(--primary) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .profile-card { 
        border-radius: 20px; 
        background: white;
        padding: 2rem;
        box-shadow: var(--shadow-md);
        border: 1px solid rgba(212,175,55,0.1);
        position: relative;
        overflow: hidden;
      }
      
      .profile-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 120px;
        background: linear-gradient(135deg, var(--gold) 0%, var(--primary) 100%);
        z-index: 0;
      }
      
      .profile-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--gold);
        margin: 0 auto;
        position: relative;
        z-index: 1;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        border: 4px solid white;
      }
      
      .profile-content {
        position: relative;
        z-index: 1;
        margin-top: 1rem;
      }
      
      .section-card { 
        background: white;
        border-radius: 20px;
        padding: 2rem;
        box-shadow: var(--shadow-md);
        border: 1px solid rgba(212,175,55,0.1);
        transition: all 0.3s ease;
        margin-bottom: 2rem;
      }
      
      .section-card:hover {
        box-shadow: var(--shadow-lg);
      }
      
      .section-header {
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--dark);
        margin-bottom: 1.5rem;
        position: relative;
        padding-bottom: 0.8rem;
      }
      
      .section-header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, var(--gold), var(--primary));
        border-radius: 2px;
      }
      
      .status-pill { 
        padding: 0.4rem 1rem;
        border-radius: 50px;
        font-weight: 600;
        font-size: 0.85rem;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        transition: all 0.3s ease;
      }
      
      .status-pill::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      
      .status-pending { 
        background: linear-gradient(135deg, #FFF4CE 0%, #FFE8A3 100%);
        color: #8A6B00;
        border: 1px solid rgba(138,107,0,0.2);
      }
      
      .status-pending::before {
        background: #8A6B00;
      }
      
      .status-active { 
        background: linear-gradient(135deg, #E8F7EE 0%, #D1F0DD 100%);
        color: #1F7A34;
        border: 1px solid rgba(31,122,52,0.2);
      }
      
      .status-active::before {
        background: #1F7A34;
      }
      
      .status-suspended { 
        background: linear-gradient(135deg, #FDECEA 0%, #FBD5D0 100%);
        color: #8A1E10;
        border: 1px solid rgba(138,30,16,0.2);
      }
      
      .status-suspended::before {
        background: #8A1E10;
      }
      
      .status-inactive { 
        background: linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%);
        color: #666;
        border: 1px solid rgba(102,102,102,0.2);
      }
      
      .status-inactive::before {
        background: #666;
      }
      
      .status-completed, .status-resolved { 
        background: linear-gradient(135deg, #E8F7EE 0%, #D1F0DD 100%);
        color: #1F7A34;
        border: 1px solid rgba(31,122,52,0.2);
      }
      
      .status-completed::before, .status-resolved::before {
        background: #1F7A34;
      }
      
      .status-refunded { 
        background: linear-gradient(135deg, #FDECEA 0%, #FBD5D0 100%);
        color: #8A1E10;
        border: 1px solid rgba(138,30,16,0.2);
      }
      
      .status-refunded::before {
        background: #8A1E10;
      }
      
      .quick-action { 
        border: 1px solid rgba(0,0,0,0.08);
        padding: 1rem;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-weight: 500;
      }
      
      .quick-action:hover {
        background: linear-gradient(135deg, var(--cream) 0%, white 100%);
        border-color: var(--gold);
        transform: translateX(5px);
        box-shadow: var(--shadow-sm);
      }
      
      .quick-action-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, var(--gold) 0%, var(--primary) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
      }
      
      .btn-primary-custom {
        background: linear-gradient(135deg, var(--gold) 0%, var(--primary) 100%);
        border: none;
        color: white;
        border-radius: 50px;
        padding: 0.7rem 1.8rem;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(212,175,55,0.3);
      }
      
      .btn-primary-custom:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(212,175,55,0.4);
      }
      
      .btn-outline-custom {
        border: 2px solid var(--gold);
        color: var(--gold);
        background: transparent;
        border-radius: 50px;
        padding: 0.6rem 1.6rem;
        font-weight: 600;
        transition: all 0.3s ease;
      }
      
      .btn-outline-custom:hover {
        background: linear-gradient(135deg, var(--gold) 0%, var(--primary) 100%);
        color: white;
        border-color: transparent;
      }
      
      .table-custom {
        border-collapse: separate;
        border-spacing: 0 0.5rem;
      }
      
      .table-custom thead th {
        background: linear-gradient(135deg, var(--cream) 0%, white 100%);
        border: none;
        padding: 1rem;
        font-weight: 700;
        color: var(--dark);
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 0.5px;
      }
      
      .table-custom tbody tr {
        background: white;
        box-shadow: var(--shadow-sm);
        transition: all 0.3s ease;
      }
      
      .table-custom tbody tr:hover {
        box-shadow: var(--shadow-md);
        transform: scale(1.01);
      }
      
      .table-custom tbody td {
        padding: 1.2rem 1rem;
        border: none;
        vertical-align: middle;
      }
      
      .table-custom tbody tr td:first-child {
        border-radius: 12px 0 0 12px;
      }
      
      .table-custom tbody tr td:last-child {
        border-radius: 0 12px 12px 0;
      }
      
      .notification-item {
        background: white;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 0.8rem;
        border-left: 4px solid var(--gold);
        box-shadow: var(--shadow-sm);
        transition: all 0.3s ease;
      }
      
      .notification-item:hover {
        box-shadow: var(--shadow-md);
        transform: translateX(5px);
      }
      
      .notification-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
      }
      
      .notification-order {
        background: linear-gradient(135deg, #FFF4CE 0%, #FFE8A3 100%);
      }
      
      .notification-success {
        background: linear-gradient(135deg, #E8F7EE 0%, #D1F0DD 100%);
      }
      
      .notification-info {
        background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
      }
      
      .notification-warning {
        background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
      }
      
      .tab-nav {
        display: flex;
        gap: 0.5rem;
        background: var(--cream);
        padding: 0.5rem;
        border-radius: 50px;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }
      
      .tab-button {
        padding: 0.7rem 1.5rem;
        border-radius: 50px;
        border: none;
        background: transparent;
        color: var(--dark);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
      }
      
      .tab-button.active {
        background: linear-gradient(135deg, var(--gold) 0%, var(--primary) 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(212,175,55,0.3);
      }
      
      .modal-custom {
        background: white;
        border-radius: 24px;
        padding: 2.5rem;
        box-shadow: var(--shadow-lg);
        border: 1px solid rgba(212,175,55,0.1);
        max-width: 540px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      }
      
      .modal-header-custom {
        font-family: 'Playfair Display', serif;
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        color: var(--dark);
      }
      
      .form-control-custom {
        border: 2px solid rgba(0,0,0,0.08);
        border-radius: 12px;
        padding: 0.8rem 1rem;
        transition: all 0.3s ease;
      }
      
      .form-control-custom:focus {
        border-color: var(--gold);
        box-shadow: 0 0 0 4px rgba(212,175,55,0.1);
        outline: none;
      }
      
      footer { 
        margin-top: 4rem;
        background: linear-gradient(135deg, #2C2416 0%, #1a1410 100%);
        color: #fff;
        padding: 3rem 0 2rem;
        position: relative;
      }
      
      footer::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
      }
      
      @media (max-width: 768px) { 
        .admin-hero { 
          padding-top: 140px;
        }
        
        .stats-card {
          padding: 1.2rem 1rem;
        }
        
        .section-card {
          padding: 1.5rem;
        }
        
        .profile-card {
          padding: 1.5rem;
        }
        
        .table-custom {
          font-size: 0.9rem;
        }
        
        .tab-nav {
          overflow-x: auto;
          flex-wrap: nowrap;
        }
      }
      
      ::-webkit-scrollbar {
        width: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: var(--light);
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, var(--gold) 0%, var(--primary) 100%);
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, var(--primary) 0%, var(--gold) 100%);
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'admin-page-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    const handleScroll = () => {
      const nav = document.querySelector('.wps-navbar');
      if (!nav) return;
      if (window.scrollY > 40) nav.classList.add('navbar-scrolled'); 
      else nav.classList.remove('navbar-scrolled');
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      const el = document.getElementById('admin-page-styles');
      if (el) el.remove();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderOverview = () => (
    <div className="row g-4">
      <div className="col-md-6 col-lg-3">
        <motion.div 
          className="stats-card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="stats-icon">🏛️</div>
          <div className="text-muted mb-2" style={{ fontWeight: 600 }}>Total Services</div>
          <div className="stats-value">{stats.totalVenues}</div>
        </motion.div>
      </div>
      <div className="col-md-6 col-lg-3">
        <motion.div 
          className="stats-card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stats-icon">👥</div>
          <div className="text-muted mb-2" style={{ fontWeight: 600 }}>Total Customers</div>
          <div className="stats-value">{stats.totalCustomers}</div>
        </motion.div>
      </div>
      <div className="col-md-6 col-lg-3">
        <motion.div 
          className="stats-card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stats-icon">⏳</div>
          <div className="text-muted mb-2" style={{ fontWeight: 600 }}>Pending Approvals</div>
          <div className="stats-value">{stats.pendingApprovals}</div>
        </motion.div>
      </div>
      <div className="col-md-6 col-lg-3">
        <motion.div 
          className="stats-card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stats-icon">💰</div>
          <div className="text-muted mb-2" style={{ fontWeight: 600 }}>Total Revenue</div>
          <div className="stats-value">{stats.totalRevenue.toLocaleString()}</div>
          <div className="text-muted small">ILS</div>
        </motion.div>
      </div>
      <div className="col-md-6 col-lg-3">
        <motion.div 
          className="stats-card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stats-icon">📅</div>
          <div className="text-muted mb-2" style={{ fontWeight: 600 }}>Active Bookings</div>
          <div className="stats-value">{stats.activeBookings}</div>
        </motion.div>
      </div>
      <div className="col-md-6 col-lg-3">
        <motion.div 
          className="stats-card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="stats-icon">🎯</div>
          <div className="text-muted mb-2" style={{ fontWeight: 600 }}>Service Providers</div>
          <div className="stats-value">{stats.totalServiceProviders}</div>
        </motion.div>
      </div>
      <div className="col-md-6 col-lg-3">
        <motion.div 
          className="stats-card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="stats-icon">💳</div>
          <div className="text-muted mb-2" style={{ fontWeight: 600 }}>Pending Payments</div>
          <div className="stats-value">{stats.pendingPayments.toLocaleString()}</div>
          <div className="text-muted small">ILS</div>
        </motion.div>
      </div>
    </div>
  );

  const renderServiceProviders = () => (
    <div className="section-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="section-header mb-0">Service Providers Management</h5>
        <div className="d-flex gap-2">
          <select 
            className="form-select form-control-custom" 
            style={{ width: 'auto' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-custom">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Contact</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceProviders.filter(v => filterStatus === 'all' || v.status === filterStatus).map(provider => (
              <tr key={provider.id}>
                <td style={{ fontWeight: 600 }}>{provider.name}</td>
                <td>{provider.type}</td>
                <td>
                  <div style={{ fontSize: '0.9rem' }}>
                    <div>{provider.email}</div>
                    <div className="text-muted">{provider.phone}</div>
                  </div>
                </td>
                <td>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>⭐ {provider.rating}</span>
                </td>
                <td>
                  <span className={`status-pill status-${provider.status.toLowerCase()}`}>
                    {provider.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    {provider.status === 'Pending' && (
                      <button 
                        className="btn btn-sm btn-success" 
                        style={{ borderRadius: 8 }}
                        onClick={() => approveServiceProvider(provider.id)}
                        title="Approve"
                      >
                        ✓
                      </button>
                    )}
                    {provider.status === 'Active' && (
                      <button 
                        className="btn btn-sm btn-warning" 
                        style={{ borderRadius: 8 }}
                        onClick={() => suspendServiceProvider(provider.id)}
                        title="Suspend"
                      >
                        ⏸
                      </button>
                    )}
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      style={{ borderRadius: 8 }}
                      onClick={() => openModal('viewProvider', provider)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      style={{ borderRadius: 8 }}
                      onClick={() => deleteServiceProvider(provider.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="section-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="section-header mb-0">Customer Management</h5>
      </div>

      <div className="table-responsive">
        <table className="table table-custom">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Bookings</th>
              <th>Total Spent</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td style={{ fontWeight: 600 }}>{customer.name}</td>
                <td>
                  <div style={{ fontSize: '0.9rem' }}>
                    <div>{customer.email}</div>
                    <div className="text-muted">{customer.phone}</div>
                  </div>
                </td>
                <td>{customer.bookings}</td>
                <td>{customer.totalSpent.toLocaleString()} ILS</td>
                <td>{customer.joinDate}</td>
                <td>
                  <span className={`status-pill status-${customer.status.toLowerCase()}`}>
                    {customer.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      style={{ borderRadius: 8 }}
                      onClick={() => openModal('viewCustomer', customer)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    {customer.status === 'Active' && (
                      <button 
                        className="btn btn-sm btn-warning" 
                        style={{ borderRadius: 8 }}
                        onClick={() => suspendCustomer(customer.id)}
                        title="Suspend"
                      >
                        ⏸
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="section-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="section-header mb-0">Payments & Commissions</h5>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div style={{ 
            background: 'linear-gradient(135deg, #E8F7EE 0%, #D1F0DD 100%)', 
            padding: '1.5rem', 
            borderRadius: 16,
            border: '1px solid rgba(31,122,52,0.2)'
          }}>
            <div className="text-muted mb-2" style={{ fontWeight: 600 }}>Total Revenue</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1F7A34' }}>
              {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} ILS
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div style={{ 
            background: 'linear-gradient(135deg, #FFF4CE 0%, #FFE8A3 100%)', 
            padding: '1.5rem', 
            borderRadius: 16,
            border: '1px solid rgba(138,107,0,0.2)'
          }}>
            <div className="text-muted mb-2" style={{ fontWeight: 600 }}>Total Commission</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8A6B00' }}>
              {payments.reduce((sum, p) => sum + p.commission, 0).toLocaleString()} ILS
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div style={{ 
            background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', 
            padding: '1.5rem', 
            borderRadius: 16,
            border: '1px solid rgba(21,101,192,0.2)'
          }}>
            <div className="text-muted mb-2" style={{ fontWeight: 600 }}>Net to Providers</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1565C0' }}>
              {payments.reduce((sum, p) => sum + p.netAmount, 0).toLocaleString()} ILS
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-custom">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Commission (15%)</th>
              <th>Net Amount</th>
              <th>Date</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td style={{ fontWeight: 600 }}>#{payment.id}</td>
                <td>{payment.customer}</td>
                <td>{payment.amount.toLocaleString()} ILS</td>
                <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{payment.commission.toLocaleString()} ILS</td>
                <td style={{ fontWeight: 600 }}>{payment.netAmount.toLocaleString()} ILS</td>
                <td>{payment.date}</td>
                <td>{payment.method}</td>
                <td>
                  <span className={`status-pill status-${payment.status.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      style={{ borderRadius: 8 }}
                      onClick={() => openModal('viewPayment', payment)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    {payment.status === 'Pending' && (
                      <button 
                        className="btn btn-sm btn-success" 
                        style={{ borderRadius: 8 }}
                        onClick={() => processPayment(payment.id)}
                        title="Process Payment"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderActivityLog = () => (
    <div className="section-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="section-header mb-0">Activity Log</h5>
        <button className="btn btn-outline-custom" onClick={() => alert('Logs exported')}>
          📥 Export Logs
        </button>
      </div>

      <div style={{ maxHeight: 600, overflowY: 'auto' }}>
        {activityLog.map(log => (
          <div key={log.id} className="notification-item">
            <div className="d-flex align-items-start gap-3">
              <div className={`notification-icon notification-${
                log.type === 'approval' ? 'success' :
                log.type === 'payment' ? 'success' :
                log.type === 'suspension' ? 'warning' :
                'info'
              }`}>
                {log.type === 'approval' && '✓'}
                {log.type === 'payment' && '💰'}
                {log.type === 'suspension' && '⏸'}
                {log.type === 'deletion' && '🗑️'}
              </div>
              <div className="flex-grow-1">
                <div style={{ fontSize: '.95rem', fontWeight: 500 }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{log.user}</span> {log.action}
                </div>
                <div className="text-muted small mt-1">{log.timestamp}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light wps-navbar">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              style={{
                width: 52, 
                height: 52, 
                borderRadius: 14,
                background: 'linear-gradient(135deg, #D4AF37 0%, #8B7355 100%)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff', 
                fontWeight: 700,
                fontSize: '1.5rem',
                boxShadow: '0 8px 20px rgba(212,175,55,0.3)'
              }}
            >
              W
            </motion.div>
            <span className="ms-3 brand-primary">Wedding Planning System</span>
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link active" href="/admin">Admin</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="admin-hero container">
        <div className="hero-gradient"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <div className="row align-items-center mb-5">
            <div className="col-lg-8">
              <h1 style={{ 
                fontFamily: 'Playfair Display', 
                fontSize: '3rem', 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #D4AF37 0%, #8B7355 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                Admin Dashboard
              </h1>
              <p className="text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                Complete system control and management for the Wedding Planning Platform
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <div className="d-inline-flex align-items-center gap-3 p-3" style={{
                background: 'white',
                borderRadius: 20,
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
              }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{admin.name}</div>
                  <div className="text-muted" style={{ fontSize: '.95rem' }}>{admin.role}</div>
                </div>
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 16, 
                  background: 'linear-gradient(135deg,#D4AF37 0%,#8B7355 100%)', 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  boxShadow: '0 8px 20px rgba(212,175,55,0.3)'
                }}>
                  {admin.avatar}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="container my-5">
        <div className="row g-4">
          {/* Sidebar */}
          <aside className="col-lg-3">
            {/* Profile Card */}
            <motion.div 
              className="profile-card mb-4" 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="profile-avatar">{admin.avatar}</div>
              <div className="profile-content text-center">
                <h4 style={{ fontFamily: 'Playfair Display', fontWeight: 700, marginTop: '1rem' }}>
                  {admin.name}
                </h4>
                <div className="mb-3">
                  <span className="status-pill status-active">
                    {admin.role}
                  </span>
                </div>
              </div>
              
              <div style={{ background: 'var(--cream)', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
                <div className="mb-3">
                  <div className="text-muted small mb-1">Email</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{admin.email}</div>
                </div>
                <div>
                  <div className="text-muted small mb-1">Access Level</div>
                  <div style={{ fontWeight: 600 }}>Full Control</div>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <button className="btn btn-outline-danger" style={{ borderRadius: 50 }} onClick={() => alert('Log out')}>
                  🚪 Logout
                </button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="section-card mb-4" 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h6 className="section-header" style={{ fontSize: '1.2rem' }}>Quick Actions</h6>
              <div className="d-grid gap-3">
                <div className="quick-action" onClick={() => setActiveTab('services')}>
                  <div className="quick-action-icon">🎯</div>
                  <div>Manage Services</div>
                </div>
                <div className="quick-action" onClick={() => setActiveTab('payments')}>
                  <div className="quick-action-icon">💰</div>
                  <div>Payments</div>
                </div>
                <div className="quick-action" onClick={() => setActiveTab('activity')}>
                  <div className="quick-action-icon">📜</div>
                  <div>Activity Log</div>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div 
              className="section-card" 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h6 className="section-header" style={{ fontSize: '1.2rem' }}>System Alerts</h6>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} className="notification-item">
                    <div className="d-flex align-items-start gap-3">
                      <div className={`notification-icon notification-${n.type}`}>
                        {n.type === 'order' && '📦'}
                        {n.type === 'success' && '✅'}
                        {n.type === 'info' && 'ℹ️'}
                        {n.type === 'warning' && '⚠️'}
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontSize: '.95rem', fontWeight: 500 }}>{n.text}</div>
                        <div className="text-muted small mt-1">{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          </aside>

          {/* Main Content Area */}
          <section className="col-lg-9">
            {/* Tab Navigation */}
            <div className="tab-nav">
              <button 
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📊 Overview
              </button>
              <button 
                className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                🎯 Services
              </button>
              <button 
                className={`tab-button ${activeTab === 'customers' ? 'active' : ''}`}
                onClick={() => setActiveTab('customers')}
              >
                👥 Customers
              </button>
              <button 
                className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                💰 Payments
              </button>
              <button 
                className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                📜 Activity Log
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'services' && renderServiceProviders()}
                {activeTab === 'customers' && renderCustomers()}
                {activeTab === 'payments' && renderPayments()}
                {activeTab === 'activity' && renderActivityLog()}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <div style={{ 
                fontFamily: 'Playfair Display', 
                color: 'var(--gold)', 
                fontSize: '1.5rem', 
                fontWeight: 700,
                marginBottom: '0.8rem'
              }}>
                Wedding Planning System
              </div>
              <p className="text-muted mb-0" style={{ color: '#c9c5c0' }}>
                Complete administrative control for managing the wedding planning platform.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex gap-4 justify-content-md-end flex-wrap">
                <div>
                  <div className="text-muted small mb-2" style={{ fontWeight: 600 }}>Company</div>
                  <div className="text-muted small">About • Careers • Blog</div>
                </div>
                <div>
                  <div className="text-muted small mb-2" style={{ fontWeight: 600 }}>Support</div>
                  <div className="text-muted small">Help • Contact • Terms</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-muted small mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            © {new Date().getFullYear()} Wedding Planning System — Admin Dashboard
          </div>
        </div>
      </footer>

      {/* View Details Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
            style={{ zIndex: 2000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="modal-custom" 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h5 className="modal-header-custom">
                {modalType === 'viewProvider' && '🎯 Service Provider Details'}
                {modalType === 'viewCustomer' && '👤 Customer Details'}
                {modalType === 'viewPayment' && '💰 Payment Details'}
              </h5>
              
              {selectedItem && (
                <div>
                  {modalType === 'viewProvider' && (
                    <div>
                      <div className="mb-3">
                        <label className="text-muted small">Name</label>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedItem.name}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Service Type</label>
                        <div>{selectedItem.type}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Email</label>
                        <div>{selectedItem.email}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Phone</label>
                        <div>{selectedItem.phone}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Rating</label>
                        <div style={{ color: 'var(--gold)', fontWeight: 600 }}>⭐ {selectedItem.rating}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Status</label>
                        <div>
                          <span className={`status-pill status-${selectedItem.status.toLowerCase()}`}>
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {modalType === 'viewCustomer' && (
                    <div>
                      <div className="mb-3">
                        <label className="text-muted small">Name</label>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedItem.name}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Email</label>
                        <div>{selectedItem.email}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Phone</label>
                        <div>{selectedItem.phone}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Total Bookings</label>
                        <div>{selectedItem.bookings}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Total Spent</label>
                        <div>{selectedItem.totalSpent.toLocaleString()} ILS</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Join Date</label>
                        <div>{selectedItem.joinDate}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Status</label>
                        <div>
                          <span className={`status-pill status-${selectedItem.status.toLowerCase()}`}>
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {modalType === 'viewPayment' && (
                    <div>
                      <div className="mb-3">
                        <label className="text-muted small">Payment ID</label>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>#{selectedItem.id}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Customer</label>
                        <div>{selectedItem.customer}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Total Amount</label>
                        <div style={{ fontWeight: 600, fontSize: '1.2rem' }}>{selectedItem.amount.toLocaleString()} ILS</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Commission (15%)</label>
                        <div style={{ color: 'var(--gold)', fontWeight: 600 }}>{selectedItem.commission.toLocaleString()} ILS</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Net Amount to Provider</label>
                        <div style={{ fontWeight: 600 }}>{selectedItem.netAmount.toLocaleString()} ILS</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Payment Date</label>
                        <div>{selectedItem.date}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Payment Method</label>
                        <div>{selectedItem.method}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Status</label>
                        <div>
                          <span className={`status-pill status-${selectedItem.status.toLowerCase()}`}>
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="d-flex justify-content-end gap-3 mt-4">
                <button 
                  className="btn btn-outline-custom" 
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}