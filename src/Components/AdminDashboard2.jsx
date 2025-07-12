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
  const [modalType, setModalType] = useState("create");
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
        loadAvailableImages();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className={`p-4 flex items-center gap-3 ${
              notification.type === 'error' 
                ? 'bg-red-50 text-red-800 border-l-4 border-red-500' 
                : 'bg-green-50 text-green-800 border-l-4 border-green-500'
            }`}>
              {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
              <span className="font-medium">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-indigo-100 font-light">
                  Manage your travel ecosystem with powerful tools
                </p>
              </div>
              
              {/* Auth Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <Key size={20} className="text-white" />
                  <span className="font-semibold text-white">Authentication</span>
                </div>
                <div className="relative">
                  <input
                    type={showAuthKey ? "text" : "password"}
                    value={authKey}
                    onChange={(e) => handleAuthKeyChange(e.target.value)}
                    placeholder="Enter admin key"
                    className="w-full px-4 py-3 pr-12 rounded-xl border-0 bg-white/90 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-white/50 transition-all"
                  />
                  <button
                    onClick={() => setShowAuthKey(!showAuthKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showAuthKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-8 py-6 text-sm font-semibold transition-all duration-300 border-b-3 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-indigo-600 bg-white'
                      : 'text-gray-600 border-transparent hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadData}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  <motion.div
                    animate={loading ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                  >
                    <Settings size={18} />
                  </motion.div>
                  Refresh
                </motion.button>

                {activeTab !== 'feedbacks' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCreate(activeTab)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus size={18} />
                    Add {activeTab.slice(0, -1)}
                  </motion.button>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-16 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading {activeTab}...</h3>
                  <p className="text-gray-500">Please wait while we fetch your data</p>
                </div>
              ) : filteredData().length === 0 ? (
                <div className="p-16 text-center">
                  <Package size={64} className="mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No {activeTab} found</h3>
                  <p className="text-gray-500 mb-8">
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold"
                    >
                      <Plus size={18} />
                      Add {activeTab.slice(0, -1)}
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        {/* Table headers based on active tab */}
                        {activeTab === 'packages' && (
                          <>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cost</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                          </>
                        )}
                        {/* Add other tab headers as needed */}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredData().map((item, index) => (
                        <motion.tr
                          key={item.packageId || item.travelId || item.hotelId || item.feedbackId || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {activeTab === 'packages' && (
                            <>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.packageId}</td>
                              <td className="px-6 py-4">
                                {item.imageUrl ? (
                                  <img 
                                    src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8888${item.imageUrl}`}
                                    alt={item.packageName}
                                    className="w-16 h-12 object-cover rounded-lg shadow-sm"
                                  />
                                ) : (
                                  <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Image size={16} className="text-gray-400" />
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.packageName}</td>
                              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                {item.packageDescription}
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                ₹{item.packageCost?.toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                  item.packageType === 'PREMIUM' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.packageType}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
