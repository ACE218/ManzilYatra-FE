import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Plane, 
  Hotel, 
  Camera, 
  Shield, 
  CreditCard, 
  MapPin, 
  Users, 
  Clock 
} from "lucide-react";

function Service() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      icon: Plane,
      title: "Flight Bookings",
      description: "Book domestic and international flights with best prices and instant confirmation.",
      color: "#3b82f6",
      features: ["Best Price Guarantee", "24/7 Support", "Instant Booking"]
    },
    {
      icon: Hotel,
      title: "Hotel Reservations",
      description: "Luxury hotels to budget stays - find perfect accommodation for your journey.",
      color: "#10b981", 
      features: ["Verified Hotels", "Free Cancellation", "Best Locations"]
    },
    {
      icon: Camera,
      title: "Guided Tours",
      description: "Expert-guided tours to explore India's rich heritage and natural beauty.",
      color: "#f59e0b",
      features: ["Local Experts", "Cultural Insights", "Small Groups"]
    },
    {
      icon: MapPin,
      title: "Custom Itineraries",
      description: "Personalized travel plans crafted by our experts based on your preferences.",
      color: "#ef4444",
      features: ["Tailored Plans", "Local Experiences", "Flexible Booking"]
    },
    {
      icon: Shield,
      title: "Travel Insurance",
      description: "Comprehensive travel protection for a worry-free journey across India.",
      color: "#8b5cf6",
      features: ["Medical Coverage", "Trip Cancellation", "24/7 Assistance"]
    },
    {
      icon: CreditCard,
      title: "Flexible Payment",
      description: "Multiple payment options including EMI, digital wallets, and pay later.",
      color: "#06b6d4",
      features: ["EMI Options", "Secure Payments", "Instant Refunds"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="services" className="services-section section">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header text-center"
        >
          <h2 className="section-title">
            Why Choose <span className="text-gradient">Manzil Yatra</span>?
          </h2>
          <p className="section-subtitle">
            Experience seamless travel planning with our comprehensive services designed for modern travelers
          </p>
        </motion.div>

        <motion.div
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="service-card card"
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="service-icon-container">
                  <motion.div
                    className="service-icon"
                    style={{ backgroundColor: `${service.color}15` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent 
                      size={32} 
                      color={service.color}
                    />
                  </motion.div>
                </div>

                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <ul className="service-features">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="service-feature">
                        <div 
                          className="feature-dot" 
                          style={{ backgroundColor: service.color }}
                        ></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.div
                  className="service-overlay"
                  style={{ backgroundColor: service.color }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="services-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <Users size={24} color="#3b82f6" />
              </div>
              <div className="stat-content">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <MapPin size={24} color="#10b981" />
              </div>
              <div className="stat-content">
                <div className="stat-number">200+</div>
                <div className="stat-label">Destinations</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Clock size={24} color="#f59e0b" />
              </div>
              <div className="stat-content">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Customer Support</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .services-section {
          background: var(--background-secondary);
          position: relative;
          overflow: hidden;
        }

        .services-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(180deg, var(--background-primary) 0%, var(--background-secondary) 100%);
        }

        .section-header {
          margin-bottom: var(--spacing-2xl);
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin-bottom: var(--spacing-md);
          font-family: var(--font-family-heading);
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .service-card {
          position: relative;
          padding: var(--spacing-xl);
          background: var(--background-primary);
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
          cursor: pointer;
        }

        .service-icon-container {
          margin-bottom: var(--spacing-lg);
        }

        .service-icon {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--spacing-md);
        }

        .service-content {
          position: relative;
          z-index: 2;
        }

        .service-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
          font-family: var(--font-family-heading);
        }

        .service-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-lg);
        }

        .service-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .service-feature {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-xs);
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .service-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }

        .services-stats {
          background: var(--background-primary);
          padding: var(--spacing-xl);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-lg);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          text-align: left;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-lg);
          background: var(--background-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-number {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: var(--spacing-xs);
        }

        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }

          .service-card {
            padding: var(--spacing-lg);
          }

          .services-stats {
            padding: var(--spacing-lg);
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }

          .stat-item {
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}

export default Service;