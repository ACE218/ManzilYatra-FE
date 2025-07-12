import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Check,
  X,
  AlertCircle,
  Loader
} from "lucide-react";
import { bookingService } from "../services/api";

const BookingModal = ({ isOpen, onClose, destination }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 2,
    specialRequests: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bookingData = {
        ...formData,
        destinationId: destination?.id,
        destinationName: destination?.title,
        packagePrice: parseInt(destination?.price?.replace(/[₹,]/g, "") || "0"),
        bookingDate: new Date().toISOString(),
        status: "PENDING"
      };

      const response = await bookingService.createBooking(bookingData);
      
      if (response.success) {
        showNotification("Booking request submitted successfully! We'll contact you soon.", "success");
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      } else {
        showNotification(response.message || "Booking failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Booking error:", error);
      showNotification("Booking failed. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      email: "",
      phone: "",
      checkInDate: "",
      checkOutDate: "",
      numberOfGuests: 2,
      specialRequests: ""
    });
  };

  const calculateDays = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 1;
  };

  const calculateTotal = () => {
    const basePrice = parseInt(destination?.price?.replace(/[₹,]/g, "") || "0");
    const days = calculateDays();
    const guests = parseInt(formData.numberOfGuests) || 1;
    return basePrice * days * guests;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="booking-modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Notification */}
          <AnimatePresence>
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  right: '20px',
                  background: notification.type === 'error' ? '#fee2e2' : '#d1fae5',
                  color: notification.type === 'error' ? '#dc2626' : '#059669',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 10,
                  border: `1px solid ${notification.type === 'error' ? '#fecaca' : '#a7f3d0'}`
                }}
              >
                {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                Book Your Trip
              </h2>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>
                {destination?.title}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <X size={24} />
            </button>
          </div>

          {/* Destination Info */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  {destination?.title}
                </h3>
                <p style={{ opacity: 0.9, fontSize: '14px' }}>
                  {destination?.duration} • {destination?.subtitle}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>
                  {destination?.price}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  per person
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Personal Information */}
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                Personal Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <div style={{ position: 'relative' }}>
                    <Users size={20} style={iconStyle} />
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={20} style={iconStyle} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={iconStyle} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            </div>

            {/* Travel Details */}
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                Travel Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Check-in Date *</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={20} style={iconStyle} />
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Check-out Date *</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={20} style={iconStyle} />
                    <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Number of Guests *</label>
                  <div style={{ position: 'relative' }}>
                    <Users size={20} style={iconStyle} />
                    <input
                      type="number"
                      name="numberOfGuests"
                      value={formData.numberOfGuests}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label style={labelStyle}>Special Requests (Optional)</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                style={{
                  ...inputStyle,
                  minHeight: '80px',
                  resize: 'vertical',
                  paddingLeft: '16px'
                }}
                placeholder="Any special requirements or requests..."
              />
            </div>

            {/* Price Summary */}
            <div style={{
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                Price Summary
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Base Price per person:</span>
                <span>{destination?.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Number of Days:</span>
                <span>{calculateDays()} days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Number of Guests:</span>
                <span>{formData.numberOfGuests} guests</span>
              </div>
              <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                <span>Total Amount:</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              style={{
                background: isLoading 
                  ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                  : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px'
              }}
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="spin" />
                  Processing Booking...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Book Now
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Styles
const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontWeight: '600',
  color: '#374151',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px 12px 48px',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '16px',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease'
};

const iconStyle = {
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#9ca3af',
  zIndex: 1
};

export default BookingModal;
