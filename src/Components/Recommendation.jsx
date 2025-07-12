import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Camera, 
  Users,
  Calendar,
  ArrowRight,
  Thermometer,
  Mountain,
  Wifi,
  RefreshCw
} from "lucide-react";
import { packageService } from "../services/api";
import BookingModal from "./BookingModal";

const API_BASE_URL = 'http://localhost:8888'; // For console logging

import Shimla from "../assets/shimla.png";
import Rishikesh from "../assets/Rishikesh.png";
import Mysore from "../assets/Mysore.png";
import Alleppey from "../assets/Alleppey.png";
import Kerala from "../assets/kerala.png";
import Jaipur from "../assets/Jaipur.png";
import Rajasthan from "../assets/Rajasthan.png";
// Keep Destination1 as fallback for API packages
import Destination1 from "../assets/Destination1.png";

function Recommendation() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [likedDestinations, setLikedDestinations] = useState(new Set());
  const [apiPackages, setApiPackages] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch packages from API on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      setConnectionStatus('checking');
      
      console.log("Attempting to fetch packages from:", `${API_BASE_URL}/packages`);
      const response = await packageService.getAllPackages();
      console.log("API Response:", response);
      
      if (response.success) {
        setApiPackages(response.packages || []);
        setConnectionStatus('connected');
        console.log("Successfully connected to backend, found", response.packages?.length || 0, "packages");
      } else {
        setConnectionStatus('disconnected');
        console.error("Failed to fetch packages:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { name: "All Destinations", filter: "all" },
    { name: "Hill Stations", filter: "hills" },
    { name: "Beaches", filter: "beach" },
    { name: "Heritage", filter: "heritage" },
    { name: "Adventure", filter: "adventure" }
  ];

  const destinations = [
    {
      id: 1,
      image: Shimla,
      title: "Shimla, Himachal Pradesh",
      subtitle: "Experience the queen of hill stations with colonial architecture and scenic beauty",
      price: "₹18,500",
      originalPrice: "₹22,000",
      duration: "4 Days 3 Nights",
      rating: 4.8,
      reviews: 1250,
      category: "hills",
      highlights: ["Mall Road", "Jakhu Temple", "Ridge Ground"],
      bestTime: "Mar-Jun, Sep-Dec",
      temperature: "15-25°C",
      difficulty: "Easy",
      groupSize: "2-8 people"
    },
    {
      id: 2,
      image: Rishikesh,
      title: "Rishikesh, Uttarakhand",
      subtitle: "Yoga capital of the world with thrilling river rafting adventures",
      price: "₹14,200",
      originalPrice: "₹16,800",
      duration: "3 Days 2 Nights",
      rating: 4.7,
      reviews: 980,
      category: "adventure",
      highlights: ["River Rafting", "Laxman Jhula", "Beatles Ashram"],
      bestTime: "Oct-Jun",
      temperature: "10-30°C",
      difficulty: "Moderate",
      groupSize: "4-12 people"
    },
    {
      id: 3,
      image: Mysore,
      title: "Mysore, Karnataka",
      subtitle: "City of palaces with rich cultural heritage and beautiful gardens",
      price: "₹13,500",
      originalPrice: "₹15,200",
      duration: "3 Days 2 Nights",
      rating: 4.6,
      reviews: 720,
      category: "heritage",
      highlights: ["Mysore Palace", "Chamundi Hill", "Brindavan Gardens"],
      bestTime: "Oct-Mar",
      temperature: "18-32°C",
      difficulty: "Easy",
      groupSize: "2-10 people"
    },
    {
      id: 4,
      image: Alleppey,
      title: "Alleppey, Kerala",
      subtitle: "Venice of the East with serene backwaters and houseboat cruises",
      price: "₹16,800",
      originalPrice: "₹19,500",
      duration: "4 Days 3 Nights",
      rating: 4.9,
      reviews: 1580,
      category: "beach",
      highlights: ["Houseboat Stay", "Backwater Cruise", "Kumrakom Bird Sanctuary"],
      bestTime: "Nov-Feb",
      temperature: "23-32°C",
      difficulty: "Easy",
      groupSize: "2-6 people"
    },
    {
      id: 5,
      image: Kerala,
      title: "Goa Beaches",
      subtitle: "Golden beaches, vibrant nightlife, and Portuguese colonial charm",
      price: "₹12,500",
      originalPrice: "₹14,800",
      duration: "3 Days 2 Nights",
      rating: 4.5,
      reviews: 2100,
      category: "beach",
      highlights: ["Baga Beach", "Old Goa Churches", "Spice Plantations"],
      bestTime: "Nov-Apr",
      temperature: "20-32°C",
      difficulty: "Easy",
      groupSize: "2-8 people"
    },
    {
      id: 6,
      image: Jaipur,
      title: "Jaipur, Rajasthan",
      subtitle: "Pink City with majestic forts, palaces, and royal heritage",
      price: "₹19,200",
      originalPrice: "₹22,500",
      duration: "4 Days 3 Nights",
      rating: 4.8,
      reviews: 1650,
      category: "heritage",
      highlights: ["Amber Fort", "City Palace", "Hawa Mahal"],
      bestTime: "Oct-Mar",
      temperature: "8-25°C",
      difficulty: "Easy",
      groupSize: "2-12 people"
    }
  ];

  // Combine API packages with static destinations
  const getAllDestinations = () => {
    const combinedData = [...destinations];
    
    // Add API packages to the list
    if (apiPackages && apiPackages.length > 0) {
      const apiDestinations = apiPackages.map(pkg => {
        // Choose appropriate image based on package name
        let fallbackImage = Destination1;
        const packageName = pkg.packageName?.toLowerCase() || '';
        
        if (packageName.includes('shimla') || packageName.includes('hill')) {
          fallbackImage = Shimla;
        } else if (packageName.includes('rishikesh') || packageName.includes('adventure')) {
          fallbackImage = Rishikesh;
        } else if (packageName.includes('mysore') || packageName.includes('karnataka')) {
          fallbackImage = Mysore;
        } else if (packageName.includes('alleppey') || packageName.includes('backwater')) {
          fallbackImage = Alleppey;
        } else if (packageName.includes('kerala')) {
          fallbackImage = Kerala;
        } else if (packageName.includes('jaipur') || packageName.includes('pink city')) {
          fallbackImage = Jaipur;
        } else if (packageName.includes('rajasthan') || packageName.includes('heritage')) {
          fallbackImage = Rajasthan;
        }

        return {
          id: `api-${pkg.packageId}`,
          image: pkg.image || fallbackImage,
          title: pkg.packageName,
          subtitle: pkg.packageDescription,
          price: `₹${pkg.packageCost?.toLocaleString()}`,
          originalPrice: `₹${Math.floor(pkg.packageCost * 1.2)?.toLocaleString()}`,
          duration: "3-5 Days", // Default duration
          rating: 4.5, // Default rating
          reviews: 100, // Default reviews
          category: pkg.packageType?.toLowerCase() === 'premium' ? 'heritage' : 'all',
          highlights: ["Package Tour", "Guided Experience", "All Inclusive"],
          bestTime: "All Year",
          temperature: "Variable",
          difficulty: "Easy",
          groupSize: "2-8 people",
          isFromAPI: true
        };
      });
      combinedData.unshift(...apiDestinations);
    }
    
    return combinedData;
  };

  const allDestinations = getAllDestinations();
  const filteredDestinations = activeCategory === 0 
    ? allDestinations 
    : allDestinations.filter(dest => dest.category === categories[activeCategory].filter);

  const toggleLike = (id) => {
    const newLiked = new Set(likedDestinations);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedDestinations(newLiked);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section id="destinations" className="destinations-section section">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header text-center"
        >
          <h2 className="section-title">
            Explore <span className="text-gradient">Incredible India</span>
          </h2>
          <p className="section-subtitle">
            Discover handpicked destinations across India with our curated travel experiences
          </p>
          
          {/* Connection Status Indicator */}
          <motion.div
            className="connection-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              background: connectionStatus === 'connected' 
                ? 'rgba(16, 185, 129, 0.1)' 
                : connectionStatus === 'disconnected'
                ? 'rgba(239, 68, 68, 0.1)'
                : 'rgba(107, 114, 128, 0.1)',
              color: connectionStatus === 'connected' 
                ? '#10b981' 
                : connectionStatus === 'disconnected'
                ? '#ef4444'
                : '#6b7280',
              border: `1px solid ${connectionStatus === 'connected' 
                ? '#10b981' 
                : connectionStatus === 'disconnected'
                ? '#ef4444'
                : '#6b7280'}20`
            }}
          >
            {connectionStatus === 'checking' && <RefreshCw size={16} className="spin" />}
            {connectionStatus === 'connected' && <Wifi size={16} />}
            {connectionStatus === 'disconnected' && <Wifi size={16} style={{ opacity: 0.5 }} />}
            
            {connectionStatus === 'checking' && 'Connecting to backend...'}
            {connectionStatus === 'connected' && `Backend connected • ${apiPackages.length} packages loaded`}
            {connectionStatus === 'disconnected' && 'Backend offline • Showing demo data'}
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="category-filter"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={index}
              className={`category-btn ${activeCategory === index ? 'active' : ''}`}
              onClick={() => setActiveCategory(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
          
          {/* Refresh Button */}
          <motion.button
            className="refresh-btn"
            onClick={fetchPackages}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            Refresh
          </motion.button>
        </motion.div>

        {/* Destinations Grid */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner-large"></div>
            <p>Loading amazing destinations...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="destinations-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredDestinations.map((destination) => (
              <motion.div
                key={destination.id}
                variants={cardVariants}
                className="destination-card card"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-image-container">
                  <img 
                    src={destination.image} 
                    alt={destination.title}
                    className="card-image"
                  />
                  
                  {/* API Badge */}
                  {destination.isFromAPI && (
                    <div className="api-badge">
                      <span>Live</span>
                    </div>
                  )}
                  
                  <div className="card-overlay">
                    <motion.button
                      className={`like-btn ${likedDestinations.has(destination.id) ? 'liked' : ''}`}
                      onClick={() => toggleLike(destination.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart 
                        size={20} 
                        fill={likedDestinations.has(destination.id) ? 'currentColor' : 'none'}
                      />
                    </motion.button>
                    <div className="price-badge">
                      <span className="original-price">{destination.originalPrice}</span>
                      <span className="current-price">{destination.price}</span>
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <h3 className="destination-title">{destination.title}</h3>
                    <div className="rating">
                      <Star size={16} fill="#fbbf24" color="#fbbf24" />
                      <span>{destination.rating}</span>
                      <span className="reviews">({destination.reviews})</span>
                    </div>
                  </div>

                  <p className="destination-subtitle">{destination.subtitle}</p>

                  <div className="destination-highlights">
                    {destination.highlights.slice(0, 3).map((highlight, index) => (
                      <span key={index} className="highlight-tag">
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="destination-info">
                    <div className="info-item">
                      <Clock size={16} />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="info-item">
                      <Users size={16} />
                      <span>{destination.groupSize}</span>
                    </div>
                    <div className="info-item">
                      <Thermometer size={16} />
                      <span>{destination.temperature}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="price-info">
                      <div className="best-time">Best: {destination.bestTime}</div>
                    </div>
                    <motion.button
                      className="book-btn btn btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedDestination(destination);
                        setShowBookingModal(true);
                      }}
                    >
                      Book Now
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        )}

        {/* Show connection status */}
        <motion.div
          className="api-status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {apiPackages.length > 0 ? (
            <div className="status-success">
              ✅ Connected to ManzilYatra Backend
            </div>
          ) : (
            <div className="status-info">
              ℹ️ Using demo data - Backend connection available
            </div>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .destinations-section {
          background: var(--background-primary);
          position: relative;
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

        .category-filter {
          display: flex;
          justify-content: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-2xl);
          flex-wrap: wrap;
        }

        .category-btn {
          padding: var(--spacing-sm) var(--spacing-lg);
          border: 2px solid var(--primary-color);
          background: transparent;
          color: var(--primary-color);
          border-radius: var(--radius-2xl);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-btn.active,
        .category-btn:hover {
          background: var(--primary-color);
          color: white;
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--spacing-xl);
        }

        .destination-card {
          overflow: hidden;
          background: var(--background-primary);
          position: relative;
        }

        .card-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .destination-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.7) 100%);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--spacing-md);
        }

        .like-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }

        .like-btn.liked {
          color: #ef4444;
          background: rgba(255, 255, 255, 1);
        }

        .price-badge {
          background: rgba(255, 255, 255, 0.95);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-lg);
          text-align: right;
        }

        .original-price {
          font-size: 0.875rem;
          color: var(--text-light);
          text-decoration: line-through;
          display: block;
        }

        .current-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .card-content {
          padding: var(--spacing-lg);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .destination-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          font-family: var(--font-family-heading);
        }

        .rating {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.875rem;
          color: var(--text-secondary);
          flex-shrink: 0;
        }

        .reviews {
          color: var(--text-light);
        }

        .destination-subtitle {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: var(--spacing-md);
          font-size: 0.9rem;
        }

        .destination-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
        }

        .highlight-tag {
          background: var(--background-accent);
          color: var(--primary-color);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-lg);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .destination-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-md);
          background: var(--background-secondary);
          border-radius: var(--radius-lg);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-md);
        }

        .best-time {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .book-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-lg);
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .destinations-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }

          .category-filter {
            gap: var(--spacing-xs);
          }

          .category-btn {
            padding: var(--spacing-xs) var(--spacing-md);
            font-size: 0.875rem;
          }

          .destination-info {
            grid-template-columns: 1fr;
          }

          .card-footer {
            flex-direction: column;
            align-items: stretch;
            gap: var(--spacing-sm);
          }

          .book-btn {
            width: 100%;
            justify-content: center;
          }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
        }

        .loading-spinner-large {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(37, 99, 235, 0.1);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 1s ease-in-out infinite;
          margin-bottom: var(--spacing-md);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .api-status {
          margin-top: var(--spacing-xl);
          text-align: center;
        }

        .status-success,
        .status-info {
          display: inline-block;
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-color);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-info {
          background: rgba(37, 99, 235, 0.1);
          color: var(--primary-color);
          border: 1px solid rgba(37, 99, 235, 0.3);
        }

        .api-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .connection-status {
          width: fit-content;
          margin: 0 auto;
        }
      `}</style>
      
      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedDestination(null);
        }}
        destination={selectedDestination}
      />
    </section>
  );
}

export default Recommendation;
