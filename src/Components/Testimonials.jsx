import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Quote, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";

import avatar from "../assets/avatar.jpg";
import avatar2 from "../assets/avatar2.jpg";
import avatar3 from "../assets/avatar3.jpg";

function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Mumbai, Maharashtra",
      profession: "Software Engineer",
      avatar: avatar,
      rating: 5,
      tripDestination: "Kerala Backwaters",
      tripDate: "December 2024",
      review: "ManzilYatra made our Kerala trip absolutely magical! The houseboat experience was beyond our expectations. The team's attention to detail and personalized service made our honeymoon unforgettable. Highly recommend for anyone looking for authentic Indian travel experiences.",
      highlights: ["Excellent Service", "Great Value", "Memorable Experience"]
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Delhi, NCR",
      profession: "Travel Blogger",
      avatar: avatar2,
      rating: 5,
      tripDestination: "Rajasthan Heritage Tour",
      tripDate: "November 2024",
      review: "As a travel blogger, I've worked with many agencies, but ManzilYatra stands out! Their knowledge of hidden gems in Rajasthan was impressive. From the desert camps in Jaisalmer to the palaces of Udaipur, every moment was perfectly curated. The cultural experiences they arranged were authentic and enriching.",
      highlights: ["Cultural Authenticity", "Hidden Gems", "Professional Team"]
    },
    {
      id: 3,
      name: "Arjun Patel",
      location: "Ahmedabad, Gujarat",
      profession: "Business Owner",
      avatar: avatar3,
      rating: 5,
      tripDestination: "Himachal Adventure",
      tripDate: "October 2024",
      review: "Our family adventure trip to Himachal was planned flawlessly by ManzilYatra. From trekking in Manali to the serene valleys of Spiti, every detail was taken care of. The kids loved the adventure activities, and we parents appreciated the safety measures. A perfect blend of adventure and comfort!",
      highlights: ["Family Friendly", "Adventure Planning", "Safety First"]
    },
    {
      id: 4,
      name: "Meera Iyer",
      location: "Bangalore, Karnataka",
      profession: "Doctor",
      avatar: avatar,
      rating: 5,
      tripDestination: "Goa Beach Holiday",
      tripDate: "January 2025",
      review: "After a hectic year at the hospital, I needed a perfect getaway. ManzilYatra's Goa package was exactly what I needed - beautiful beaches, excellent accommodation, and well-planned activities. The team was responsive and made sure I had a stress-free vacation. Will definitely book again!",
      highlights: ["Stress-free Planning", "Perfect Accommodation", "Responsive Team"]
    },
    {
      id: 5,
      name: "Vikram Singh",
      location: "Jaipur, Rajasthan",
      profession: "Photographer",
      avatar: avatar2,
      rating: 5,
      tripDestination: "Northeast India Expedition",
      tripDate: "March 2024",
      review: "As a photographer, I needed access to unique locations and ManzilYatra delivered beyond expectations! Their Northeast India expedition took me to breathtaking landscapes I never knew existed. The local guides were knowledgeable, and the off-beat destinations were photographer's paradise. Incredible experience!",
      highlights: ["Unique Destinations", "Local Expertise", "Photographer Friendly"]
    },
    {
      id: 6,
      name: "Anita Desai",
      location: "Pune, Maharashtra",
      profession: "Teacher",
      avatar: avatar3,
      rating: 5,
      tripDestination: "Uttarakhand Spiritual Journey",
      tripDate: "April 2024",
      review: "My spiritual journey to Uttarakhand with ManzilYatra was transformative. From the peaceful ashrams of Rishikesh to the divine temples of Badrinath, every stop was meaningful. The team understood my spiritual needs and created an itinerary that nourished my soul. A truly enlightening experience!",
      highlights: ["Spiritual Focus", "Meaningful Itinerary", "Soul Nourishing"]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
    <section id="testimonials" className="testimonials-section section">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header text-center"
        >
          <h2 className="section-title">
            What Our <span className="text-gradient">Travelers Say</span>
          </h2>
          <p className="section-subtitle">
            Real stories from real travelers who experienced the magic of India with us
          </p>
        </motion.div>

        <div className="testimonials-container">
          {/* Featured Testimonial */}
          <motion.div
            className="featured-testimonial"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="testimonial-navigation">
              <motion.button
                className="nav-btn prev-btn"
                onClick={prevTestimonial}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
              
              <motion.button
                className="nav-btn next-btn"
                onClick={nextTestimonial}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="testimonial-content"
              >
                <div className="testimonial-header">
                  <div className="quote-icon">
                    <Quote size={32} />
                  </div>
                  <div className="trip-info">
                    <div className="trip-badge">
                      <MapPin size={16} />
                      {testimonials[currentTestimonial].tripDestination}
                    </div>
                    <div className="trip-date">
                      <Calendar size={16} />
                      {testimonials[currentTestimonial].tripDate}
                    </div>
                  </div>
                </div>

                <div className="testimonial-body">
                  <div className="rating">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>

                  <blockquote className="testimonial-text">
                    "{testimonials[currentTestimonial].review}"
                  </blockquote>

                  <div className="testimonial-highlights">
                    {testimonials[currentTestimonial].highlights.map((highlight, index) => (
                      <span key={index} className="highlight-tag">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="testimonial-footer">
                  <div className="author-info">
                    <img 
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      className="author-avatar"
                    />
                    <div className="author-details">
                      <h4 className="author-name">{testimonials[currentTestimonial].name}</h4>
                      <p className="author-profession">{testimonials[currentTestimonial].profession}</p>
                      <p className="author-location">{testimonials[currentTestimonial].location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Testimonial Grid */}
          <motion.div
            className="testimonials-grid"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={cardVariants}
                className={`testimonial-card card ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>

                <p className="card-review">
                  "{testimonial.review.substring(0, 120)}..."
                </p>

                <div className="card-author">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="card-avatar"
                  />
                  <div>
                    <h5 className="card-name">{testimonial.name}</h5>
                    <p className="card-location">{testimonial.location}</p>
                  </div>
                </div>

                <div className="card-trip">
                  <MapPin size={14} />
                  {testimonial.tripDestination}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial Indicators */}
          <div className="testimonial-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonials-section {
          background: var(--background-secondary);
          position: relative;
          overflow: hidden;
        }

        .testimonials-section::before {
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

        .testimonials-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .featured-testimonial {
          position: relative;
          background: var(--background-primary);
          border-radius: var(--radius-2xl);
          padding: var(--spacing-2xl);
          margin-bottom: var(--spacing-2xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .testimonial-navigation {
          position: absolute;
          top: var(--spacing-lg);
          right: var(--spacing-lg);
          display: flex;
          gap: var(--spacing-sm);
        }

        .nav-btn {
          background: var(--background-accent);
          border: 1px solid var(--primary-color);
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--primary-color);
          transition: all 0.3s ease;
        }

        .nav-btn:hover {
          background: var(--primary-color);
          color: white;
        }

        .testimonial-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-lg);
        }

        .quote-icon {
          color: var(--primary-color);
          opacity: 0.7;
        }

        .trip-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .trip-badge,
        .trip-date {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .rating {
          display: flex;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
        }

        .testimonial-text {
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-lg);
          font-style: italic;
        }

        .testimonial-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-lg);
        }

        .highlight-tag {
          background: var(--background-accent);
          color: var(--primary-color);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-lg);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .testimonial-footer {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          padding-top: var(--spacing-lg);
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .author-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--primary-color);
        }

        .author-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xs);
        }

        .author-profession,
        .author-location {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .testimonial-card {
          padding: var(--spacing-lg);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .testimonial-card.active {
          border-color: var(--primary-color);
          background: var(--background-accent);
        }

        .card-rating {
          display: flex;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
        }

        .card-review {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-md);
          font-size: 0.9rem;
        }

        .card-author {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .card-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .card-name {
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          font-size: 0.9rem;
        }

        .card-location {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .card-trip {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.8rem;
          color: var(--primary-color);
          font-weight: 500;
        }

        .testimonial-indicators {
          display: flex;
          justify-content: center;
          gap: var(--spacing-xs);
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: var(--primary-color);
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .featured-testimonial {
            padding: var(--spacing-lg);
          }

          .testimonial-navigation {
            position: static;
            justify-content: center;
            margin-bottom: var(--spacing-lg);
          }

          .testimonial-header {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .trip-info {
            align-self: flex-start;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .author-info {
            flex-direction: column;
            text-align: center;
            gap: var(--spacing-sm);
          }
        }
      `}</style>
    </section>
  );
}

export default Testimonials;