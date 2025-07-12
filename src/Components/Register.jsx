import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  ArrowLeft,
  User,
  Phone,
  Calendar,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Shield,
  Sparkles
} from "lucide-react";
import { authService } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  const navigate = useNavigate();

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 18 || formData.age > 100) {
      newErrors.age = "Age must be between 18 and 100";
    }
    
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit Indian mobile number";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const registerData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        mobile: formData.mobile,
        email: formData.email.toLowerCase(),
        password: formData.password
      };

      const response = await authService.register(registerData);
      console.log("Registration successful:", response);
      
      showNotification("Account created successfully! Redirecting to login...", "success");
      
      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            message: "Registration successful! Please login to continue.",
            email: formData.email 
          } 
        });
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      showNotification(error.message || "Registration failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.4
      }} />

      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 50,
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              border: '1px solid #f3f4f6',
              overflow: 'hidden',
              minWidth: '300px'
            }}
          >
            <div style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: notification.type === 'error' ? '#fef2f2' : '#f0fdf4',
              color: notification.type === 'error' ? '#991b1b' : '#166534',
              borderLeft: `4px solid ${notification.type === 'error' ? '#ef4444' : '#22c55e'}`
            }}>
              {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              <span style={{ fontWeight: '500' }}>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          zIndex: 10
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </motion.div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'white',
          borderRadius: '32px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '48px 32px 32px',
          textAlign: 'center',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.05"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1
          }} />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <UserPlus size={32} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <MapPin size={24} />
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '800', 
                margin: 0,
                background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ManzilYatra
              </h1>
            </div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              margin: '0 0 8px 0' 
            }}>
              Join ManzilYatra!
            </h2>
            <p style={{ 
              fontSize: '16px', 
              opacity: 0.9, 
              margin: 0 
            }}>
              Create your account and start exploring incredible destinations
            </p>
          </motion.div>
        </div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ padding: '48px 32px' }}
        >
          <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
            {/* Name Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <User size={16} />
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '16px',
                    paddingLeft: '48px',
                    borderRadius: '12px',
                    border: `2px solid ${errors.name ? '#ef4444' : '#e5e7eb'}`,
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? '#ef4444' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f9fafb';
                  }}
                />
                <User style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} size={18} />
              </div>
              {errors.name && (
                <span style={{
                  display: 'block',
                  color: '#ef4444',
                  fontSize: '14px',
                  marginTop: '6px'
                }}>
                  {errors.name}
                </span>
              )}
            </div>

            {/* Age and Mobile Row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              {/* Age Field */}
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  <Calendar size={16} />
                  Age
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    min="18"
                    max="100"
                    style={{
                      width: '100%',
                      padding: '16px',
                      paddingLeft: '48px',
                      borderRadius: '12px',
                      border: `2px solid ${errors.age ? '#ef4444' : '#e5e7eb'}`,
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: '#f9fafb'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.age ? '#ef4444' : '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = '#f9fafb';
                    }}
                  />
                  <Calendar style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} size={18} />
                </div>
                {errors.age && (
                  <span style={{
                    display: 'block',
                    color: '#ef4444',
                    fontSize: '14px',
                    marginTop: '6px'
                  }}>
                    {errors.age}
                  </span>
                )}
              </div>

              {/* Mobile Field */}
              <div style={{ flex: 2 }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  <Phone size={16} />
                  Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    style={{
                      width: '100%',
                      padding: '16px',
                      paddingLeft: '48px',
                      borderRadius: '12px',
                      border: `2px solid ${errors.mobile ? '#ef4444' : '#e5e7eb'}`,
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: '#f9fafb'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.mobile ? '#ef4444' : '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = '#f9fafb';
                    }}
                  />
                  <Phone style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} size={18} />
                </div>
                {errors.mobile && (
                  <span style={{
                    display: 'block',
                    color: '#ef4444',
                    fontSize: '14px',
                    marginTop: '6px'
                  }}>
                    {errors.mobile}
                  </span>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <Mail size={16} />
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  style={{
                    width: '100%',
                    padding: '16px',
                    paddingLeft: '48px',
                    borderRadius: '12px',
                    border: `2px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`,
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#ef4444' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f9fafb';
                  }}
                />
                <Mail style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} size={18} />
              </div>
              {errors.email && (
                <span style={{
                  display: 'block',
                  color: '#ef4444',
                  fontSize: '14px',
                  marginTop: '6px'
                }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <Lock size={16} />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  style={{
                    width: '100%',
                    padding: '16px',
                    paddingLeft: '48px',
                    paddingRight: '48px',
                    borderRadius: '12px',
                    border: `2px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`,
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#ef4444' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f9fafb';
                  }}
                />
                <Lock style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span style={{
                  display: 'block',
                  color: '#ef4444',
                  fontSize: '14px',
                  marginTop: '6px'
                }}>
                  {errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <Shield size={16} />
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={{
                    width: '100%',
                    padding: '16px',
                    paddingLeft: '48px',
                    paddingRight: '48px',
                    borderRadius: '12px',
                    border: `2px solid ${errors.confirmPassword ? '#ef4444' : '#e5e7eb'}`,
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f9fafb';
                  }}
                />
                <Shield style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} size={18} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span style={{
                  display: 'block',
                  color: '#ef4444',
                  fontSize: '14px',
                  marginTop: '6px'
                }}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '16px',
                background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                marginBottom: '24px'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Creating Account...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{
            position: 'relative',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: '#e5e7eb'
            }} />
            <span style={{
              background: 'white',
              padding: '0 16px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              or
            </span>
          </div>

          {/* Login Link */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#6b7280', 
              margin: '0 0 8px 0',
              fontSize: '14px' 
            }}>
              Already have an account?
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f3f4f6';
                e.target.style.color = '#4338ca';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#667eea';
              }}
            >
              <Shield size={16} />
              Sign In
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;