import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Send,
  ArrowUp,
  Plane,
  Shield,
  Award,
  Clock
} from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    quickLinks: [
      { name: "Home", href: "#hero" },
      { name: "Destinations", href: "#destinations" },
      { name: "Services", href: "#services" },
      { name: "About Us", href: "#about" },
      { name: "Contact", href: "#contact" }
    ],
    destinations: [
      { name: "Kerala", href: "#" },
      { name: "Rajasthan", href: "#" },
      { name: "Himachal Pradesh", href: "#" },
      { name: "Goa", href: "#" },
      { name: "Uttarakhand", href: "#" },
      { name: "Karnataka", href: "#" }
    ],
    services: [
      { name: "Flight Booking", href: "#" },
      { name: "Hotel Reservation", href: "#" },
      { name: "Tour Packages", href: "#" },
      { name: "Travel Insurance", href: "#" },
      { name: "Visa Assistance", href: "#" },
      { name: "Car Rental", href: "#" }
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cancellation Policy", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Support", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" }
  ];

  const achievements = [
    { icon: Award, text: "50K+ Happy Customers" },
    { icon: Shield, text: "100% Secure Booking" },
    { icon: Clock, text: "24/7 Customer Support" },
    { icon: Plane, text: "200+ Destinations" }
  ];

  return (
    <footer id="contact" className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="container">
          <motion.div
            className="newsletter-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="newsletter-text">
              <h3>Ready for Your Next Adventure?</h3>
              <p>Subscribe to get exclusive deals and travel inspiration delivered to your inbox</p>
            </div>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <motion.button
                  type="submit"
                  className="subscribe-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubscribed}
                >
                  {isSubscribed ? "Subscribed!" : <><Send size={18} /> Subscribe</>}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <motion.div
              className="footer-section company-info"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="company-logo">
                <MapPin className="logo-icon" />
                <h2>Manzil<span className="text-gradient">Yatra</span></h2>
              </div>
              <p className="company-description">
                Your trusted partner for exploring the incredible diversity and beauty of India. 
                From the Himalayas to the backwaters of Kerala, we make your travel dreams come true.
              </p>
              
              <div className="contact-info">
                <div className="contact-item">
                  <Phone size={18} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="contact-item">
                  <Mail size={18} />
                  <span>info@manzilyatra.com</span>
                </div>
                <div className="contact-item">
                  <MapPin size={18} />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>

              <div className="social-links">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={social.label}
                    >
                      <IconComponent size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="footer-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4>Quick Links</h4>
              <ul className="footer-links">
                {footerLinks.quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Popular Destinations */}
            <motion.div
              className="footer-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4>Popular Destinations</h4>
              <ul className="footer-links">
                {footerLinks.destinations.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              className="footer-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4>Our Services</h4>
              <ul className="footer-links">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              className="footer-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4>Support</h4>
              <ul className="footer-links">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Achievements Section */}
          <motion.div
            className="achievements-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="achievements-grid">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={index} className="achievement-item">
                    <IconComponent size={24} />
                    <span>{achievement.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2024 ManzilYatra. All rights reserved. Made with ❤️ for travelers.</p>
            <motion.button
              className="scroll-to-top"
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
          opacity: 0.3;
        }

        .newsletter-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: var(--spacing-2xl) 0;
          position: relative;
          z-index: 2;
        }

        .newsletter-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-xl);
        }

        .newsletter-text h3 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: var(--spacing-sm);
          font-family: var(--font-family-heading);
        }

        .newsletter-text p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
        }

        .newsletter-form {
          flex-shrink: 0;
        }

        .input-group {
          display: flex;
          gap: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.1);
          padding: var(--spacing-xs);
          border-radius: var(--radius-xl);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .input-group input {
          background: transparent;
          border: none;
          color: white;
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: 1rem;
          min-width: 300px;
          outline: none;
        }

        .input-group input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .subscribe-btn {
          background: var(--gradient-secondary);
          color: white;
          border: none;
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--radius-lg);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .subscribe-btn:disabled {
          background: var(--accent-color);
          cursor: not-allowed;
        }

        .footer-main {
          padding: var(--spacing-2xl) 0;
          position: relative;
          z-index: 2;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: var(--spacing-2xl);
          margin-bottom: var(--spacing-2xl);
        }

        .footer-section h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: var(--spacing-md);
          color: white;
          font-family: var(--font-family-heading);
        }

        .company-info {
          max-width: 400px;
        }

        .company-logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .company-logo h2 {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0;
        }

        .logo-icon {
          color: var(--secondary-color);
        }

        .company-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: var(--spacing-lg);
        }

        .contact-info {
          margin-bottom: var(--spacing-lg);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: var(--spacing-sm);
        }

        .social-links {
          display: flex;
          gap: var(--spacing-sm);
        }

        .social-link {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: var(--spacing-sm);
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: var(--secondary-color);
          padding-left: var(--spacing-xs);
        }

        .achievements-section {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: var(--spacing-lg);
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
        }

        .achievement-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .footer-bottom {
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: var(--spacing-lg) 0;
          position: relative;
          z-index: 2;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-bottom p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .scroll-to-top {
          background: var(--primary-color);
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .scroll-to-top:hover {
          background: var(--primary-dark);
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-xl);
          }

          .company-info {
            grid-column: 1 / -1;
            max-width: none;
          }
        }

        @media (max-width: 768px) {
          .newsletter-content {
            flex-direction: column;
            text-align: center;
            gap: var(--spacing-lg);
          }

          .input-group {
            flex-direction: column;
            width: 100%;
          }

          .input-group input {
            min-width: auto;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }

          .achievements-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-bottom-content {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .achievements-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;