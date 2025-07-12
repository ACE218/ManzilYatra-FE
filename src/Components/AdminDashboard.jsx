import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  MapPin,
  Hotel,
  Users,
  Save,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Image,
  Upload,
  Lock,
  LogIn
} from "lucide-react";
import { 
  packageService, 
  travelService, 
  hotelService, 
  adminService,
  feedbackService,
  imageService
} from "../services/api";

const AdminDashboard = () => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
    authKey: ""
  });

  const [activeTab, setActiveTab] = useState("packages");
  const [data, setData] = useState({
    packages: [],
    travels: [],
    hotels: [],
    feedbacks: []
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Form states
  const [packageForm, setPackageForm] = useState({
    packageId: "",
    packageName: "",
    packageDescription: "",
    packageCost: "",
    packageType: "STANDARD",
    paymentDetails: "",
    imageUrl: ""
  });

  // Check authentication on mount
  useEffect(() => {
    const storedAuthKey = localStorage.getItem('adminAuthKey');
    if (storedAuthKey) {
      setIsAuthenticated(true);
      setShowAuthModal(false);
      adminService.setAuthKey(storedAuthKey);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = async () => {
    try {
      const result = await adminService.verifyAdmin(adminCredentials);
      
      if (result.success) {
        setIsAuthenticated(true);
        setShowAuthModal(false);
        showNotification("Successfully logged in!", "success");
      } else {
        showNotification("Invalid credentials. Please try again.", "error");
      }
    } catch (error) {
      showNotification("Login failed. Please try again.", "error");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAuthModal(true);
    localStorage.removeItem('adminAuthKey');
    adminService.setAuthKey("");
    setAdminCredentials({ username: "", password: "", authKey: "" });
    showNotification("Logged out successfully!", "success");
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Make sure the auth key is set
      const authKey = adminService.getAuthKey();
      if (!authKey) {
        throw new Error("Authentication key not found");
      }

      switch (activeTab) {
        case "packages":
          const packagesResponse = await packageService.getAllPackages();
          if (packagesResponse.success) {
            setData(prev => ({ ...prev, packages: packagesResponse.packages }));
          } else {
            throw new Error(packagesResponse.message || "Failed to load packages");
          }
          break;
        case "travels":
          const travelsResponse = await travelService.getAllTravels();
          if (travelsResponse.success) {
            setData(prev => ({ ...prev, travels: travelsResponse.travels }));
          } else {
            throw new Error(travelsResponse.message || "Failed to load travels");
          }
          break;
        case "hotels":
          const hotelsResponse = await hotelService.getAllHotels();
          if (hotelsResponse.success) {
            setData(prev => ({ ...prev, hotels: hotelsResponse.hotels }));
          } else {
            throw new Error(hotelsResponse.message || "Failed to load hotels");
          }
          break;
        case "feedbacks":
          const feedbacksResponse = await feedbackService.getFeedbacks();
          if (feedbacksResponse.success) {
            setData(prev => ({ ...prev, feedbacks: feedbacksResponse.feedbacks }));
          } else {
            throw new Error(feedbacksResponse.message || "Failed to load feedbacks");
          }
          break;
      }
    } catch (error) {
      console.error("Data loading error:", error);
      showNotification(`Failed to load data: ${error.message}`, "error");
      
      // If authentication error occurs, prompt for login again
      if (error.message.includes("Authentication") || error.message.includes("auth")) {
        setIsAuthenticated(false);
        setShowAuthModal(true);
      }
    }
    setLoading(false);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleCreate = (type) => {
    setModalType("create");
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalType("edit");
    if (activeTab === "packages") {
      setPackageForm(item);
    }
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setModalType("delete");
    setShowModal(true);
  };

  const filteredData = () => {
    const currentData = data[activeTab] || [];
    if (!searchTerm) return currentData;
    
    return currentData.filter(item => {
      const searchFields = [];
      
      if (activeTab === "packages") {
        searchFields.push(item.packageName, item.packageDescription);
      } else if (activeTab === "travels") {
        searchFields.push(item.travelName, item.agentName);
      } else if (activeTab === "hotels") {
        searchFields.push(item.hotelName, item.hotelDescription);
      } else if (activeTab === "feedbacks") {
        searchFields.push(item.customerName, item.feedback);
      }
      
      return searchFields.some(field => 
        field && field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const tabs = [
    { id: "packages", label: "Packages", icon: Package },
    { id: "travels", label: "Travels", icon: MapPin },
    { id: "hotels", label: "Hotels", icon: Hotel },
    { id: "feedbacks", label: "Feedbacks", icon: Users },
  ];

  // Authentication Modal
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <AnimatePresence>
          {showAuthModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '48px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <Lock size={32} color="white" />
                </div>
                <h2 style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: '#1f2937',
                  marginBottom: '8px' 
                }}>
                  Admin Login
                </h2>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                  Enter your credentials to access the admin dashboard
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials(prev => ({
                      ...prev,
                      username: e.target.value
                    }))}
                    placeholder="Enter username"
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                    placeholder="Enter password"
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Admin Key
                  </label>
                  <input
                    type="password"
                    value={adminCredentials.authKey}
                    onChange={(e) => setAdminCredentials(prev => ({
                      ...prev,
                      authKey: e.target.value
                    }))}
                    placeholder="Enter admin key"
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px'
                  }}
                >
                  <LogIn size={20} />
                  Login to Dashboard
                </motion.button>

                <div style={{
                  background: '#f3f4f6',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#6b7280',
                  textAlign: 'center'
                }}>
                  <strong>Demo Credentials:</strong><br />
                  Username: admin<br />
                  Password: admin123<br />
                  Admin Key: admin123
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                overflow: 'hidden'
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
                {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
                <span style={{ fontWeight: '500' }}>{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%)'
    }}>
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
              overflow: 'hidden'
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
              {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
              <span style={{ fontWeight: '500' }}>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          border: '1px solid #f3f4f6'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '32px',
            color: 'white'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  margin: '0 0 8px 0' 
                }}>
                  Admin Dashboard
                </h1>
                <p style={{ 
                  fontSize: '16px', 
                  opacity: 0.9,
                  margin: 0 
                }}>
                  Manage your travel packages, hotels, and bookings
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <X size={16} />
                Logout
              </motion.button>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              marginTop: '32px',
              overflowX: 'auto'
            }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 24px',
                    border: 'none',
                    background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    color: 'white',
                    borderBottom: activeTab === tab.id ? '3px solid white' : '3px solid transparent',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: activeTab === tab.id ? '600' : '500',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    backdropFilter: activeTab === tab.id ? 'blur(10px)' : 'none'
                  }}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div style={{ padding: '32px' }}>
            {/* Controls Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              marginBottom: '32px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                flex: '1',
                maxWidth: '400px'
              }}>
                <div style={{ position: 'relative' }}>
                  <Search style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} size={20} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      borderRadius: '16px',
                      border: '2px solid #e5e7eb',
                      fontSize: '16px',
                      background: '#f9fafb',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadData}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? "Loading..." : "Refresh"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCreate(activeTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Plus size={16} />
                  Add {activeTab.slice(0, -1)}
                </motion.button>
              </div>
            </div>

            {/* Data Display */}
            <div style={{
              background: '#f9fafb',
              borderRadius: '16px',
              padding: '24px',
              minHeight: '400px'
            }}>
              {loading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '300px',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #e5e7eb',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading {activeTab}...</p>
                </div>
              ) : filteredData().length === 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '300px',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <Package size={48} style={{ color: '#9ca3af' }} />
                  <p style={{ color: '#6b7280', fontSize: '18px', fontWeight: '500' }}>
                    No {activeTab} found
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                    Get started by creating your first {activeTab.slice(0, -1)}
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <div style={{
                    display: 'grid',
                    gap: '16px',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                  }}>
                    {filteredData().map((item, index) => (
                      <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          background: 'white',
                          borderRadius: '16px',
                          padding: '24px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                          border: '1px solid #e5e7eb',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                        }}
                      >
                        {activeTab === "packages" && (
                          <>
                            {item.imageUrl && (
                              <img
                                src={`http://localhost:8091/images/${item.imageUrl}`}
                                alt={item.packageName}
                                style={{
                                  width: '100%',
                                  height: '150px',
                                  objectFit: 'cover',
                                  borderRadius: '12px',
                                  marginBottom: '16px'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              color: '#1f2937',
                              marginBottom: '8px'
                            }}>
                              {item.packageName}
                            </h3>
                            <p style={{
                              color: '#6b7280',
                              fontSize: '14px',
                              marginBottom: '16px',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {item.packageDescription}
                            </p>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '16px'
                            }}>
                              <span style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#059669'
                              }}>
                                ₹{item.packageCost?.toLocaleString()}
                              </span>
                              <span style={{
                                padding: '4px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                borderRadius: '20px',
                                background: item.packageType === 'PREMIUM' ? '#f3e8ff' : '#f3f4f6',
                                color: item.packageType === 'PREMIUM' ? '#7c3aed' : '#374151'
                              }}>
                                {item.packageType}
                              </span>
                            </div>
                          </>
                        )}

                        {/* Action Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          justifyContent: 'flex-end'
                        }}>
                          <button
                            onClick={() => handleEdit(item)}
                            style={{
                              padding: '8px 16px',
                              color: '#667eea',
                              background: '#f0f7ff',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#dbeafe'}
                            onMouseLeave={(e) => e.target.style.background = '#f0f7ff'}
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            style={{
                              padding: '8px 16px',
                              color: '#dc2626',
                              background: '#fef2f2',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                            onMouseLeave={(e) => e.target.style.background = '#fef2f2'}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CRUD Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '24px'
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'white',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {modalType === "delete" ? (
                <div style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#fef2f2',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                  }}>
                    <AlertCircle size={32} color="#dc2626" />
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '16px'
                  }}>
                    Delete {activeTab.slice(0, -1)}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '16px',
                    marginBottom: '32px'
                  }}>
                    Are you sure you want to delete this {activeTab.slice(0, -1)}? This action cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        padding: '12px 24px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      disabled={loading}
                      style={{
                        padding: '12px 24px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1
                      }}
                    >
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{
                    padding: '32px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {modalType === "create" ? "Create" : "Edit"} {activeTab.slice(0, -1)}
                    </h3>
                  </div>
                  
                  <div style={{
                    padding: '32px',
                    maxHeight: '60vh',
                    overflowY: 'auto'
                  }}>
                    {activeTab === "packages" && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '8px'
                          }}>
                            Package Name *
                          </label>
                          <input
                            type="text"
                            value={packageForm.packageName}
                            onChange={(e) => setPackageForm(prev => ({
                              ...prev,
                              packageName: e.target.value
                            }))}
                            placeholder="Enter package name"
                            style={{
                              width: '100%',
                              padding: '16px',
                              borderRadius: '12px',
                              border: '2px solid #e5e7eb',
                              fontSize: '16px',
                              outline: 'none'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '8px'
                          }}>
                            Description *
                          </label>
                          <textarea
                            value={packageForm.packageDescription}
                            onChange={(e) => setPackageForm(prev => ({
                              ...prev,
                              packageDescription: e.target.value
                            }))}
                            placeholder="Enter package description"
                            rows={4}
                            style={{
                              width: '100%',
                              padding: '16px',
                              borderRadius: '12px',
                              border: '2px solid #e5e7eb',
                              fontSize: '16px',
                              outline: 'none',
                              resize: 'vertical'
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '8px'
                            }}>
                              Cost (₹) *
                            </label>
                            <input
                              type="number"
                              value={packageForm.packageCost}
                              onChange={(e) => setPackageForm(prev => ({
                                ...prev,
                                packageCost: e.target.value
                              }))}
                              placeholder="0"
                              style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '2px solid #e5e7eb',
                                fontSize: '16px',
                                outline: 'none'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '8px'
                            }}>
                              Package Type
                            </label>
                            <select
                              value={packageForm.packageType}
                              onChange={(e) => setPackageForm(prev => ({
                                ...prev,
                                packageType: e.target.value
                              }))}
                              style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '2px solid #e5e7eb',
                                fontSize: '16px',
                                outline: 'none',
                                background: 'white'
                              }}
                            >
                              <option value="STANDARD">Standard</option>
                              <option value="PREMIUM">Premium</option>
                              <option value="DELUXE">Deluxe</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '8px'
                          }}>
                            Payment Details
                          </label>
                          <input
                            type="text"
                            value={packageForm.paymentDetails}
                            onChange={(e) => setPackageForm(prev => ({
                              ...prev,
                              paymentDetails: e.target.value
                            }))}
                            placeholder="Payment terms and conditions"
                            style={{
                              width: '100%',
                              padding: '16px',
                              borderRadius: '12px',
                              border: '2px solid #e5e7eb',
                              fontSize: '16px',
                              outline: 'none'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '8px'
                          }}>
                            Package Image
                          </label>
                          <div style={{
                            border: '2px dashed #e5e7eb',
                            borderRadius: '12px',
                            padding: '24px',
                            textAlign: 'center'
                          }}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const filename = await handleImageUpload(file);
                                  if (filename) {
                                    setPackageForm(prev => ({
                                      ...prev,
                                      imageUrl: filename
                                    }));
                                  }
                                }
                              }}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: 'none',
                                background: '#f9fafb',
                                borderRadius: '8px'
                              }}
                            />
                            {packageForm.imageUrl && (
                              <div style={{ marginTop: '16px' }}>
                                <img
                                  src={`http://localhost:8091/images/${packageForm.imageUrl}`}
                                  alt="Preview"
                                  style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{
                    padding: '32px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '16px'
                  }}>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        padding: '12px 24px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleFormSubmit(packageForm)}
                      disabled={loading || !packageForm.packageName || !packageForm.packageDescription}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading || !packageForm.packageName || !packageForm.packageDescription ? 0.5 : 1
                      }}
                    >
                      {loading ? 'Saving...' : (modalType === "create" ? "Create" : "Update")}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add CSS animation for spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
