import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, Users, Plane, Star, ChevronLeft, ChevronRight } from "lucide-react";

// Import destination-specific images
import HeroImage from "../assets/hero.png";
import Rajasthan from "../assets/Rajasthan.png";
import Kerala from "../assets/kerala.png";
import Shimla from "../assets/shimla.png";
import Rishikesh from "../assets/Rishikesh.png";
import Jaipur from "../assets/Jaipur.png";
import Alleppey from "../assets/Alleppey.png";

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1
  });

  const heroSlides = [
    {
      title: "Discover Incredible India",
      subtitle: "Experience the magic of diverse landscapes, rich culture, and unforgettable adventures",
      image: HeroImage,
      highlight: "20% Off"
    },
    {
      title: "Rajasthan's Royal Heritage",
      subtitle: "Explore the royal palaces and forts of magnificent Rajasthan",
      image: Rajasthan,
      highlight: "Premium Tours"
    },
    {
      title: "Kerala's Serene Backwaters",
      subtitle: "Serene houseboat experience through God's own country",
      image: Kerala,
      highlight: "Nature Escapes"
    },
    {
      title: "Shimla Hill Station Escape",
      subtitle: "Experience the queen of hill stations with colonial architecture and scenic beauty",
      image: Shimla,
      highlight: "Hill Retreats"
    },
    {
      title: "Rishikesh Adventure Trek",
      subtitle: "Yoga capital of the world with thrilling river rafting adventures",
      image: Rishikesh,
      highlight: "Adventure Tours"
    },
    {
      title: "Jaipur, The Pink City",
      subtitle: "Pink City with majestic forts, palaces, and royal heritage",
      image: Jaipur,
      highlight: "Heritage Tours"
    },
    {
      title: "Alleppey Houseboat Experience",
      subtitle: "Venice of the East with serene backwaters and houseboat cruises",
      image: Alleppey,
      highlight: "Luxury Stays"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search data:", searchData);
    // Implement search logic
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.section
      id="hero"
      className="hero-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background Slider */}
      <div className="hero-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="hero-slide"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: `url(${heroSlides[currentSlide].image})`,
            }}
          />
        </AnimatePresence>
        <div className="hero-overlay" />
        
        {/* Slide Navigation */}
        <button 
          className="slide-nav-btn prev-btn"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          className="slide-nav-btn next-btn"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Slide Indicators */}
        <div className="slide-indicators">
          {heroSlides.map((_, index) => (
            <button 
              key={index}
              className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Main Content */}
          <div className="hero-text">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="badge-icon" />
              {heroSlides[currentSlide].highlight}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSlide}`}
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`subtitle-${currentSlide}`}
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
            </AnimatePresence>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Travelers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">200+</div>
                <div className="stat-label">Destinations</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.8★</div>
                <div className="stat-label">Customer Rating</div>
              </div>
            </motion.div>
          </div>

          {/* Search Card */}
          <motion.div
            className="hero-search-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="search-header">
              <h3>Plan Your Perfect Trip</h3>
              <p>Find the best destinations and deals</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
              <div className="search-row">
                <div className="search-field">
                  <label>
                    <MapPin className="field-icon" />
                    Destination
                  </label>
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={searchData.destination}
                    onChange={(e) => handleInputChange("destination", e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <label>
                    <Calendar className="field-icon" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => handleInputChange("checkIn", e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <label>
                    <Calendar className="field-icon" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => handleInputChange("checkOut", e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <label>
                    <Users className="field-icon" />
                    Guests
                  </label>
                  <select
                    value={searchData.guests}
                    onChange={(e) => handleInputChange("guests", parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <motion.button
                type="submit"
                className="search-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search className="button-icon" />
                Search Trips
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <motion.div
          className="slide-indicators"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button
            className="nav-button prev"
            onClick={() => setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
            aria-label="Previous Slide"
          >
            <ChevronLeft />
          </button>
          <button
            className="nav-button next"
            onClick={() => setCurrentSlide((currentSlide + 1) % heroSlides.length)}
            aria-label="Next Slide"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -2;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.8) 0%, rgba(147, 51, 234, 0.6) 100%);
          z-index: -1;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-2xl);
          align-items: center;
          min-height: 80vh;
        }

        .hero-text {
          color: white;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-2xl);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .badge-icon {
          color: var(--secondary-color);
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: var(--spacing-md);
          font-family: var(--font-family-heading);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: var(--spacing-xl);
          max-width: 500px;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          gap: var(--spacing-xl);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
          margin-top: var(--spacing-xs);
        }

        .hero-search-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-2xl);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .search-header {
          text-align: center;
          margin-bottom: var(--spacing-lg);
        }

        .search-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
        }

        .search-header p {
          color: var(--text-secondary);
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .search-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
        }

        .search-field {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .search-field label {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .field-icon {
          color: var(--primary-color);
          width: 16px;
          height: 16px;
        }

        .search-field input,
        .search-field select {
          padding: var(--spacing-sm);
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-field input:focus,
        .search-field select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .search-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          background: var(--gradient-primary);
          color: white;
          border: none;
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--radius-lg);
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-button:hover {
          box-shadow: var(--shadow-lg);
        }

        .button-icon {
          width: 20px;
          height: 20px;
        }

        .slide-indicators {
          position: absolute;
          bottom: var(--spacing-lg);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: var(--spacing-xs);
          z-index: 10;
        }

        .slide-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
          margin: 0 4px;
        }

        .slide-dot.active {
          background: white;
          transform: scale(1.2);
        }

        .slide-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .slide-nav-btn:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: translateY(-50%) scale(1.1);
        }

        .prev-btn {
          left: 20px;
        }

        .next-btn {
          right: 20px;
        }

        .navigation-buttons {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          padding: 0 var(--spacing-md);
          z-index: 10;
        }

        .nav-button {
          background: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: var(--radius-full);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 1);
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-xl);
            text-align: center;
          }

          .search-row {
            grid-template-columns: 1fr;
          }

          .hero-stats {
            justify-content: center;
            gap: var(--spacing-lg);
          }

          .hero-search-card {
            padding: var(--spacing-lg);
          }
        }
      `}</style>
    </motion.section>
  );
}

export default Hero;
