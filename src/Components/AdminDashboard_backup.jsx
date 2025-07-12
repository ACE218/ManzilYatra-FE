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
  Bus,
  Users,
  Settings,
  Save,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Image,
  Upload,
  Download
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
  const [activeTab, setActiveTab] = useState("packages");
  const [data, setData] = useState({
    packages: [],
    travels: [],
    hotels: [],
    feedbacks: []
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // create, edit, delete
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [authKey, setAuthKey] = useState(adminService.getAuthKey());
  const [showAuthKey, setShowAuthKey] = useState(false);

  // Image management states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [availableImages, setAvailableImages] = useState([]);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

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

  const [travelForm, setTravelForm] = useState({
    travelId: "",
    travelName: "",
    agentName: "",
    contact: "",
    addr: {
      houseNo: "",
      streetName: "",
      city: "",
      state: "",
      country: "India",
      pincode: ""
    }
  });

  const [hotelForm, setHotelForm] = useState({
    hotelId: "",
    hotelName: "",
    hotelType: "STANDARD",
    hotelDescription: "",
    rent: "",
    addr: {
      houseNo: "",
      streetName: "",
      city: "",
      state: "",
      country: "India",
      pincode: ""
    }
  });

  useEffect(() => {
    loadData();
    if (activeTab === "packages") {
      loadAvailableImages();
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "packages":
          const packagesResponse = await packageService.getAllPackages();
          if (packagesResponse.success) {
            setData(prev => ({ ...prev, packages: packagesResponse.packages }));
          }
          break;
        case "travels":
          const travelsResponse = await travelService.getAllTravels();
          if (travelsResponse.success) {
            setData(prev => ({ ...prev, travels: travelsResponse.travels }));
          }
          break;
        case "hotels":
          const hotelsResponse = await hotelService.getAllHotels();
          if (hotelsResponse.success) {
            setData(prev => ({ ...prev, hotels: hotelsResponse.hotels }));
          }
          break;
        case "feedbacks":
          const feedbacksResponse = await feedbackService.getFeedbacks();
          if (feedbacksResponse.success) {
            setData(prev => ({ ...prev, feedbacks: feedbacksResponse.feedbacks }));
          }
          break;
      }
    } catch (error) {
      showNotification("Failed to load data", "error");
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
    resetForms();
    setModalType("create");
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalType("edit");
    
    // Populate form based on type
    if (activeTab === "packages") {
      setPackageForm(item);
      setImagePreview(item.imageUrl || "");
    } else if (activeTab === "travels") {
      setTravelForm(item);
    } else if (activeTab === "hotels") {
      setHotelForm(item);
    }
    
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setModalType("delete");
    setShowModal(true);
  };

  const resetForms = () => {
    setPackageForm({
      packageId: "",
      packageName: "",
      packageDescription: "",
      packageCost: "",
      packageType: "STANDARD",
      paymentDetails: "",
      imageUrl: ""
    });
    
    setImagePreview("");
    setSelectedImage(null);
    setShowImageGallery(false);
    
    setTravelForm({
      travelId: "",
      travelName: "",
      agentName: "",
      contact: "",
      addr: {
        houseNo: "",
        streetName: "",
        city: "",
        state: "",
        country: "India",
        pincode: ""
      }
    });

    setHotelForm({
      hotelId: "",
      hotelName: "",
      hotelType: "STANDARD",
      hotelDescription: "",
      rent: "",
      addr: {
        houseNo: "",
        streetName: "",
        city: "",
        state: "",
        country: "India",
        pincode: ""
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let response;
      
      if (activeTab === "packages") {
        if (modalType === "create") {
          response = await packageService.createPackage(packageForm);
        } else if (modalType === "edit") {
          response = await packageService.updatePackage(packageForm);
        } else if (modalType === "delete") {
          response = await packageService.deletePackage(selectedItem.packageId);
        }
      } else if (activeTab === "travels") {
        if (modalType === "create") {
          response = await travelService.createTravel(travelForm);
        } else if (modalType === "edit") {
          response = await travelService.updateTravel(travelForm);
        } else if (modalType === "delete") {
          response = await travelService.deleteTravel(selectedItem.travelId);
        }
      }
      
      if (response && response.success) {
        showNotification(`${activeTab.slice(0, -1)} ${modalType}d successfully!`, "success");
        setShowModal(false);
        loadData();
      } else {
        showNotification(response?.message || `Failed to ${modalType} ${activeTab.slice(0, -1)}`, "error");
      }
    } catch (error) {
      showNotification(`Failed to ${modalType} ${activeTab.slice(0, -1)}`, "error");
    }
    setLoading(false);
  };

  const handleAuthKeyChange = (newKey) => {
    setAuthKey(newKey);
    adminService.setAuthKey(newKey);
  };

  // Image management functions
  const loadAvailableImages = async () => {
    const response = await imageService.listImages();
    if (response.success) {
      setAvailableImages(response.images);
    }
  };

  const handleImageUpload = async (file) => {
    setImageUploading(true);
    try {
      const response = await imageService.uploadImage(file);
      if (response.success) {
        setPackageForm(prev => ({ ...prev, imageUrl: response.imageUrl }));
        setImagePreview(response.imageUrl);
        showNotification("Image uploaded successfully!", "success");
        loadAvailableImages(); // Refresh available images
      } else {
        showNotification(response.message || "Failed to upload image", "error");
      }
    } catch (error) {
      showNotification("Failed to upload image", "error");
    }
    setImageUploading(false);
  };

  const handleImageSelect = (imageUrl) => {
    setPackageForm(prev => ({ ...prev, imageUrl }));
    setImagePreview(imageUrl);
    setShowImageGallery(false);
  };

  const handleImageDelete = async (imageUrl) => {
    const filename = imageUrl.split('/').pop();
    const response = await imageService.deleteImage(filename);
    if (response.success) {
      showNotification("Image deleted successfully!", "success");
      loadAvailableImages();
      // If the deleted image was selected, clear it
      if (packageForm.imageUrl === imageUrl) {
        setPackageForm(prev => ({ ...prev, imageUrl: "" }));
        setImagePreview("");
      }
    } else {
      showNotification(response.message || "Failed to delete image", "error");
    }
  };

  const handleRemoveSelectedImage = () => {
    setPackageForm(prev => ({ ...prev, imageUrl: "" }));
    setImagePreview("");
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 1000,
              background: notification.type === 'error' ? '#ef4444' : '#10b981',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '24px',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '32px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              margin: '0 0 8px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Admin Dashboard
            </h1>
            <p style={{ 
              fontSize: '18px', 
              margin: 0, 
              opacity: 0.9,
              fontWeight: '300'
            }}>
              Manage your travel packages, destinations, and bookings
            </p>
          </div>

          {/* Auth Key Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '8px'
            }}>
              <Key size={20} />
              <span style={{ fontWeight: '600', fontSize: '14px' }}>Authentication Key</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showAuthKey ? "text" : "password"}
                value={authKey}
                onChange={(e) => handleAuthKeyChange(e.target.value)}
                placeholder="Enter admin key"
                style={{
                  padding: '12px 45px 12px 16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  width: '220px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#333',
                  fontWeight: '500'
                }}
              />
              <button
                onClick={() => setShowAuthKey(!showAuthKey)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showAuthKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 40px'
        }}>
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '20px 32px',
                  border: 'none',
                  background: 'none',
                  color: activeTab === tab.id ? '#667eea' : '#64748b',
                  borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}
              >
                <tab.icon size={22} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '40px' }}>
          {/* Search and Actions Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {/* Search Section */}
            <div style={{
              flex: '1',
              maxWidth: '500px',
              position: 'relative'
            }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 55px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  background: '#fafbfc'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {activeTab !== 'feedbacks' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCreate(activeTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 28px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Plus size={20} />
                  Add {activeTab.slice(0, -1)}
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadData}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 24px',
                  background: 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                >
                  <Settings size={18} />
                </motion.div>
                {loading ? 'Refreshing...' : 'Refresh'}
            </div>
          </div>

          {/* Data Display Section */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f1f5f9'
          }}>
            {loading ? (
              <div style={{
                padding: '80px',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #f1f5f9',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    margin: '0 auto 24px'
                  }}
                />
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Loading {activeTab}...
                </h3>
                <p style={{ color: '#94a3b8' }}>Please wait while we fetch the data</p>
              </div>
            ) : filteredData().length === 0 ? (
              <div style={{
                padding: '80px',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <Package size={64} style={{ 
                  margin: '0 auto 24px', 
                  opacity: 0.3,
                  color: '#cbd5e1'
                }} />
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  No {activeTab} found
                </h3>
                <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
                  {searchTerm ? 
                    `No results found for "${searchTerm}"` : 
                    `Start by adding your first ${activeTab.slice(0, -1)}`
                  }
                </p>
                {activeTab !== 'feedbacks' && !searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCreate(activeTab)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <Plus size={16} />
                    Add {activeTab.slice(0, -1)}
                  </motion.button>
                )}
              </div>
            ) : (
              /* Data Table */
              <div style={{ overflow: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{ 
                      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                      borderBottom: '2px solid #e2e8f0'
                    }}>
                    {activeTab === 'packages' && (
                      <>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Image</th>
                        <th style={tableHeaderStyle}>Name</th>
                        <th style={tableHeaderStyle}>Description</th>
                        <th style={tableHeaderStyle}>Cost</th>
                        <th style={tableHeaderStyle}>Type</th>
                        <th style={tableHeaderStyle}>Actions</th>
                      </>
                    )}
                    {activeTab === 'travels' && (
                      <>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Travel Name</th>
                        <th style={tableHeaderStyle}>Agent</th>
                        <th style={tableHeaderStyle}>Contact</th>
                        <th style={tableHeaderStyle}>City</th>
                        <th style={tableHeaderStyle}>Actions</th>
                      </>
                    )}
                    {activeTab === 'hotels' && (
                      <>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Hotel Name</th>
                        <th style={tableHeaderStyle}>Type</th>
                        <th style={tableHeaderStyle}>Rent</th>
                        <th style={tableHeaderStyle}>City</th>
                        <th style={tableHeaderStyle}>Actions</th>
                      </>
                    )}
                    {activeTab === 'feedbacks' && (
                      <>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Customer</th>
                        <th style={tableHeaderStyle}>Rating</th>
                        <th style={tableHeaderStyle}>Feedback</th>
                        <th style={tableHeaderStyle}>Destination</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredData().map((item, index) => (
                    <motion.tr
                      key={item.packageId || item.travelId || item.hotelId || item.feedbackId || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      {activeTab === 'packages' && (
                        <>
                          <td style={tableCellStyle}>{item.packageId}</td>
                          <td style={tableCellStyle}>
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8888${item.imageUrl}`}
                                alt={item.packageName}
                                style={{
                                  width: '60px',
                                  height: '40px',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '60px',
                                height: '40px',
                                background: '#f3f4f6',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                color: '#6b7280'
                              }}>
                                No Image
                              </div>
                            )}
                          </td>
                          <td style={tableCellStyle}>{item.packageName}</td>
                          <td style={tableCellStyle}>
                            {item.packageDescription?.length > 50 
                              ? `${item.packageDescription.substring(0, 50)}...` 
                              : item.packageDescription}
                          </td>
                          <td style={tableCellStyle}>₹{item.packageCost?.toLocaleString()}</td>
                          <td style={tableCellStyle}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              background: item.packageType === 'PREMIUM' ? '#dbeafe' : '#f3f4f6',
                              color: item.packageType === 'PREMIUM' ? '#1d4ed8' : '#374151'
                            }}>
                              {item.packageType}
                            </span>
                          </td>
                          <td style={tableCellStyle}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleEdit(item)}
                                style={actionButtonStyle}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                style={{...actionButtonStyle, background: '#fee2e2', color: '#dc2626'}}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeTab === 'travels' && (
                        <>
                          <td style={tableCellStyle}>{item.travelId}</td>
                          <td style={tableCellStyle}>{item.travelName}</td>
                          <td style={tableCellStyle}>{item.agentName}</td>
                          <td style={tableCellStyle}>{item.contact}</td>
                          <td style={tableCellStyle}>{item.addr?.city}</td>
                          <td style={tableCellStyle}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleEdit(item)}
                                style={actionButtonStyle}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                style={{...actionButtonStyle, background: '#fee2e2', color: '#dc2626'}}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeTab === 'hotels' && (
                        <>
                          <td style={tableCellStyle}>{item.hotelId}</td>
                          <td style={tableCellStyle}>{item.hotelName}</td>
                          <td style={tableCellStyle}>{item.hotelType}</td>
                          <td style={tableCellStyle}>₹{item.rent?.toLocaleString()}</td>
                          <td style={tableCellStyle}>{item.addr?.city}</td>
                          <td style={tableCellStyle}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleEdit(item)}
                                style={actionButtonStyle}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                style={{...actionButtonStyle, background: '#fee2e2', color: '#dc2626'}}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeTab === 'feedbacks' && (
                        <>
                          <td style={tableCellStyle}>{item.feedbackId}</td>
                          <td style={tableCellStyle}>{item.customerName}</td>
                          <td style={tableCellStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {"⭐".repeat(item.rating)}
                              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                ({item.rating})
                              </span>
                            </div>
                          </td>
                          <td style={tableCellStyle}>
                            {item.feedback?.length > 100 
                              ? `${item.feedback.substring(0, 100)}...` 
                              : item.feedback}
                          </td>
                          <td style={tableCellStyle}>{item.destination}</td>
                        </>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit/Delete */}
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
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {modalType === 'delete' 
                    ? `Delete ${activeTab.slice(0, -1)}` 
                    : `${modalType === 'create' ? 'Create' : 'Edit'} ${activeTab.slice(0, -1)}`}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              {modalType === 'delete' ? (
                <div>
                  <p style={{ marginBottom: '24px', color: '#6b7280', fontSize: '16px' }}>
                    Are you sure you want to delete this {activeTab.slice(0, -1)}? This action cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        padding: '12px 24px',
                        border: '2px solid #e5e7eb',
                        background: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{
                        padding: '12px 24px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Package Form */}
                  {activeTab === 'packages' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Package ID</label>
                        <input
                          type="number"
                          value={packageForm.packageId}
                          onChange={(e) => setPackageForm({...packageForm, packageId: parseInt(e.target.value)})}
                          style={inputStyle}
                          placeholder="Enter package ID"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Package Name</label>
                        <input
                          type="text"
                          value={packageForm.packageName}
                          onChange={(e) => setPackageForm({...packageForm, packageName: e.target.value})}
                          style={inputStyle}
                          placeholder="Enter package name"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                          value={packageForm.packageDescription}
                          onChange={(e) => setPackageForm({...packageForm, packageDescription: e.target.value})}
                          style={{...inputStyle, minHeight: '100px', resize: 'vertical'}}
                          placeholder="Enter package description"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>Cost (₹)</label>
                          <input
                            type="number"
                            value={packageForm.packageCost}
                            onChange={(e) => setPackageForm({...packageForm, packageCost: parseInt(e.target.value)})}
                            style={inputStyle}
                            placeholder="Enter cost"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>Type</label>
                          <select
                            value={packageForm.packageType}
                            onChange={(e) => setPackageForm({...packageForm, packageType: e.target.value})}
                            style={inputStyle}
                          >
                            <option value="STANDARD">Standard</option>
                            <option value="DELUXE">Deluxe</option>
                            <option value="PREMIUM">Premium</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Payment Details</label>
                        <input
                          type="text"
                          value={packageForm.paymentDetails}
                          onChange={(e) => setPackageForm({...packageForm, paymentDetails: e.target.value})}
                          style={inputStyle}
                          placeholder="Enter payment details"
                        />
                      </div>
                      
                      {/* Image Management Section */}
                      <div>
                        <label style={labelStyle}>Package Image</label>
                        
                        {/* Current Image Preview */}
                        {imagePreview && (
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ 
                              position: 'relative', 
                              display: 'inline-block',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '8px'
                            }}>
                              <img 
                                src={imagePreview.startsWith('http') ? imagePreview : `http://localhost:8888${imagePreview}`}
                                alt="Preview"
                                style={{
                                  width: '200px',
                                  height: '120px',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                              <button
                                type="button"
                                onClick={handleRemoveSelectedImage}
                                style={{
                                  position: 'absolute',
                                  top: '4px',
                                  right: '4px',
                                  background: '#dc2626',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Image Upload and Gallery */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          {/* Upload New Image */}
                          <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            border: '2px dashed #d1d5db',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: imageUploading ? '#f9fafb' : 'transparent'
                          }}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file);
                                }
                              }}
                              style={{ display: 'none' }}
                              disabled={imageUploading}
                            />
                            <Upload size={16} />
                            {imageUploading ? 'Uploading...' : 'Upload New Image'}
                          </label>
                          
                          {/* Browse Gallery */}
                          <button
                            type="button"
                            onClick={() => setShowImageGallery(true)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 16px',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                              background: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Image size={16} />
                            Browse Gallery
                          </button>
                        </div>
                        
                        {/* Image URL Input (for manual entry) */}
                        <div style={{ marginTop: '12px' }}>
                          <input
                            type="text"
                            value={packageForm.imageUrl}
                            onChange={(e) => {
                              setPackageForm({...packageForm, imageUrl: e.target.value});
                              setImagePreview(e.target.value);
                            }}
                            style={inputStyle}
                            placeholder="Or enter image URL manually"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Travel Form */}
                  {activeTab === 'travels' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>Travel Name</label>
                          <input
                            type="text"
                            value={travelForm.travelName}
                            onChange={(e) => setTravelForm({...travelForm, travelName: e.target.value})}
                            style={inputStyle}
                            placeholder="Enter travel name"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>Agent Name</label>
                          <input
                            type="text"
                            value={travelForm.agentName}
                            onChange={(e) => setTravelForm({...travelForm, agentName: e.target.value})}
                            style={inputStyle}
                            placeholder="Enter agent name"
                          />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Contact Number</label>
                        <input
                          type="number"
                          value={travelForm.contact}
                          onChange={(e) => setTravelForm({...travelForm, contact: parseInt(e.target.value)})}
                          style={inputStyle}
                          placeholder="Enter contact number"
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                        <div>
                          <label style={labelStyle}>House No.</label>
                          <input
                            type="text"
                            value={travelForm.addr.houseNo}
                            onChange={(e) => setTravelForm({
                              ...travelForm, 
                              addr: {...travelForm.addr, houseNo: e.target.value}
                            })}
                            style={inputStyle}
                            placeholder="House no."
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Street Name</label>
                          <input
                            type="text"
                            value={travelForm.addr.streetName}
                            onChange={(e) => setTravelForm({
                              ...travelForm, 
                              addr: {...travelForm.addr, streetName: e.target.value}
                            })}
                            style={inputStyle}
                            placeholder="Street name"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={labelStyle}>City</label>
                          <input
                            type="text"
                            value={travelForm.addr.city}
                            onChange={(e) => setTravelForm({
                              ...travelForm, 
                              addr: {...travelForm.addr, city: e.target.value}
                            })}
                            style={inputStyle}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>State</label>
                          <input
                            type="text"
                            value={travelForm.addr.state}
                            onChange={(e) => setTravelForm({
                              ...travelForm, 
                              addr: {...travelForm.addr, state: e.target.value}
                            })}
                            style={inputStyle}
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Pincode</label>
                          <input
                            type="text"
                            value={travelForm.addr.pincode}
                            onChange={(e) => setTravelForm({
                              ...travelForm, 
                              addr: {...travelForm.addr, pincode: e.target.value}
                            })}
                            style={inputStyle}
                            placeholder="Pincode"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    marginTop: '32px'
                  }}>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        padding: '12px 24px',
                        border: '2px solid #e5e7eb',
                        background: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        opacity: loading ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Save size={16} />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Image Gallery Modal */}
      <AnimatePresence>
        {showImageGallery && (
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
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              padding: '20px'
            }}
            onClick={() => setShowImageGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  Image Gallery
                </h2>
                <button
                  onClick={() => setShowImageGallery(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Image Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                {availableImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      border: packageForm.imageUrl === imageUrl ? '3px solid #667eea' : '2px solid #e5e7eb',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img
                      src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:8888${imageUrl}`}
                      alt={`Gallery ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover'
                      }}
                      onClick={() => handleImageSelect(imageUrl)}
                    />
                    
                    {/* Action buttons */}
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      display: 'flex',
                      gap: '4px'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageSelect(imageUrl);
                        }}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageDelete(imageUrl);
                        }}
                        style={{
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {availableImages.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6b7280'
                }}>
                  <Image size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                  <p>No images available. Upload some images first.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Styles
const tableHeaderStyle = {
  padding: '16px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#374151',
  fontSize: '14px',
  borderBottom: '2px solid #e5e7eb'
};

const tableCellStyle = {
  padding: '16px',
  color: '#6b7280',
  fontSize: '14px'
};

const actionButtonStyle = {
  padding: '8px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  background: '#f3f4f6',
  color: '#374151',
  transition: 'all 0.2s ease'
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontWeight: '600',
  color: '#374151',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '16px',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease'
};

export default AdminDashboard;
