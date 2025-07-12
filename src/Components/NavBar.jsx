import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, User, LogIn, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    // If not on home page, navigate to home first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      scrollToSection("hero");
    }
  };

  const navItems = [
    { name: "Home", id: "hero" },
    { name: "Services", id: "services" },
    { name: "Destinations", id: "destinations" },
    { name: "Testimonials", id: "testimonials" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}
    >
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="navbar-logo"
            onClick={handleLogoClick}
          >
            <MapPin className="logo-icon" />
            <h1>
              Manzil<span className="text-gradient">Yatra</span>
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => scrollToSection(item.id)}
                className="nav-link"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="navbar-auth">
            <Link to="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-admin auth-btn"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none'
                }}
              >
                <Settings size={18} />
                Admin
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline auth-btn"
              >
                <LogIn size={18} />
                Login
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary auth-btn"
              >
                <User size={18} />
                Sign Up
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu"
          >
            <div className="mobile-menu-content">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.id)}
                  className="mobile-nav-link"
                >
                  {item.name}
                </motion.button>
              ))}
              <div className="mobile-auth-buttons">
                <Link to="/admin">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                    className="btn mobile-auth-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    <Settings size={18} />
                    Admin
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.1 }}
                    className="btn btn-outline mobile-auth-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn size={18} />
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 2) * 0.1 }}
                    className="btn btn-primary mobile-auth-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: var(--shadow-lg);
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-sm) 0;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          cursor: pointer;
          font-family: var(--font-family-heading);
        }

        .logo-icon {
          color: var(--primary-color);
        }

        .navbar-logo h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .nav-link {
          background: none;
          border: none;
          color: var(--text-primary);
          font-weight: 500;
          cursor: pointer;
          position: relative;
          padding: var(--spacing-xs) 0;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: var(--primary-color);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--gradient-primary);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .navbar-auth {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .auth-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-md);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: var(--spacing-xs);
        }

        .mobile-menu {
          background: var(--background-primary);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .mobile-menu-content {
          padding: var(--spacing-md);
        }

        .mobile-nav-link {
          display: block;
          width: 100%;
          background: none;
          border: none;
          color: var(--text-primary);
          font-weight: 500;
          text-align: left;
          padding: var(--spacing-sm) 0;
          cursor: pointer;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .mobile-nav-link:hover {
          color: var(--primary-color);
        }

        .mobile-auth-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-md);
        }

        .mobile-auth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          width: 100%;
        }

        @media (max-width: 768px) {
          .navbar-links,
          .navbar-auth {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>
    </motion.nav>
  );
}

export default NavBar;
