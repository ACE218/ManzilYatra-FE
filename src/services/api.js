// API Configuration and Service Layer
const API_BASE_URL = 'http://localhost:8091'; // Backend server URL

// API endpoints based on actual backend controllers
const endpoints = {
  // User authentication endpoints
  login: '/user/login',
  register: '/user/signup',
  logout: '/user/logout',
  
  // Package endpoints
  packages: '/packages',
  createPackage: '/packages/createPackage',
  updatePackage: '/packages/updatePackage',
  deletePackage: '/packages/removePackage',
  
  // Travel endpoints
  travels: '/travels',
  createTravel: '/travels',
  updateTravel: '/travelsUpdate',
  deleteTravel: '/travelsDelete',
  
  // Hotel endpoints
  hotels: '/hotels',
  createHotel: '/hotels',
  updateHotel: '/hotels',
  deleteHotel: '/hotels',
  
  // Route endpoints
  routes: '/routes',
  createRoute: '/routes',
  updateRoute: '/routes',
  deleteRoute: '/routes',
  
  // Booking endpoints
  bookings: '/bookings',
  createBooking: '/bookings',
  
  // Feedback endpoints
  feedback: '/feedback',
  createFeedback: '/feedback',
  
  // Bus endpoints
  buses: '/buses',
  createBus: '/buses',
  updateBus: '/buses',
  deleteBus: '/buses',
  
  // Image endpoints
  uploadImage: '/images/upload',
  deleteImage: '/images/delete',
  listImages: '/images/list',
};

// HTTP client with error handling
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
    this.authKey = localStorage.getItem('authKey') || 'admin123'; // Default admin key
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Set authentication key for admin operations
  setAuthKey(key) {
    this.authKey = key;
    localStorage.setItem('authKey', key);
  }

  // Get request headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, error: error.message };
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Upload file with FormData
  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      body: formData
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API upload failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// API Services
export const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post(endpoints.login, {
        userDto: credentials
      });
      
      if (response.success && response.data.key) {
        apiClient.setToken(response.data.key);
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: 'Login failed. Please check your credentials.' };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post(endpoints.register, userData);
      
      if (response.success) {
        return { success: true, message: 'Registration successful!' };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post(endpoints.logout + `?key=${apiClient.token}`);
      apiClient.setToken(null);
      return { success: true };
    } catch (error) {
      apiClient.setToken(null);
      return { success: true };
    }
  },
};

export const packageService = {
  getAllPackages: async () => {
    try {
      const response = await apiClient.get(endpoints.packages);
      if (response.success) {
        return { success: true, packages: response.data };
      }
      // Return mock data if API fails
      return {
        success: true,
        packages: [
          {
            packageId: 1,
            packageName: "Kerala Backwaters",
            packageDescription: "Experience the serene backwaters of Kerala with traditional houseboats",
            packageCost: 15000,
            packageType: "DELUXE",
            paymentDetails: "Full payment required",
            image: "/src/assets/Alleppey.png"
          },
          {
            packageId: 2,
            packageName: "Rajasthan Heritage",
            packageDescription: "Explore the royal heritage and magnificent palaces of Rajasthan",
            packageCost: 18800,
            packageType: "PREMIUM",
            paymentDetails: "50% advance payment",
            image: "/src/assets/Rajasthan.png"
          }
        ]
      };
    } catch (error) {
      return { success: false, message: 'Failed to fetch packages' };
    }
  },

  createPackage: async (packageData) => {
    try {
      const url = `${endpoints.createPackage}?authKey=${apiClient.authKey}`;
      const response = await apiClient.post(url, packageData);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Failed to create package' };
    } catch (error) {
      return { success: false, message: 'Failed to create package. Please try again.' };
    }
  },

  updatePackage: async (packageData) => {
    try {
      const url = `${endpoints.updatePackage}?authKey=${apiClient.authKey}`;
      const response = await apiClient.put(url, packageData);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Failed to update package' };
    } catch (error) {
      return { success: false, message: 'Failed to update package. Please try again.' };
    }
  },

  deletePackage: async (packageId) => {
    try {
      const url = `${endpoints.deletePackage}?packageId=${packageId}&authKey=${apiClient.authKey}`;
      const response = await apiClient.delete(url);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Failed to delete package' };
    } catch (error) {
      return { success: false, message: 'Failed to delete package. Please try again.' };
    }
  },
};

export const travelService = {
  getAllTravels: async () => {
    try {
      const response = await apiClient.get('/travelsList');
      if (response.success) {
        return { success: true, travels: response.data };
      }
      // Return mock data if API fails
      return {
        success: true,
        travels: [
          {
            travelId: 1,
            travelName: "Kerala Tours",
            agentName: "Rajeev Kumar",
            contact: 9876543210,
            addr: {
              houseNo: "123",
              streetName: "MG Road",
              city: "Kochi",
              state: "Kerala",
              country: "India",
              pincode: "682001"
            }
          }
        ]
      };
    } catch (error) {
      return { success: false, message: 'Failed to fetch travels' };
    }
  },

  createTravel: async (travelData) => {
    try {
      const response = await apiClient.post(`${endpoints.createTravel}?authKey=${apiClient.authKey}`, travelData);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Failed to create travel' };
    } catch (error) {
      return { success: false, message: 'Failed to create travel. Please try again.' };
    }
  },

  updateTravel: async (travelData) => {
    try {
      const response = await apiClient.put(`${endpoints.updateTravel}?authKey=${apiClient.authKey}`, travelData);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Failed to update travel' };
    } catch (error) {
      return { success: false, message: 'Failed to update travel. Please try again.' };
    }
  },

  deleteTravel: async (travelId) => {
    try {
      const response = await apiClient.delete(`${endpoints.deleteTravel}?travelId=${travelId}&authKey=${apiClient.authKey}`);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Failed to delete travel' };
    } catch (error) {
      return { success: false, message: 'Failed to delete travel. Please try again.' };
    }
  },
};

export const hotelService = {
  getAllHotels: async () => {
    try {
      const response = await apiClient.get(endpoints.hotels);
      if (response.success) {
        return { success: true, hotels: response.data };
      }
      // Return mock data if API fails
      return {
        success: true,
        hotels: [
          {
            hotelId: 1,
            hotelName: "Luxury Resort Kerala",
            hotelType: "DELUXE",
            hotelDescription: "5-star luxury resort with spa and pool",
            rent: 3500,
            addr: {
              city: "Alleppey",
              state: "Kerala",
              country: "India"
            }
          }
        ]
      };
    } catch (error) {
      return { success: false, message: 'Failed to fetch hotels' };
    }
  },
};

export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post(endpoints.createBooking, bookingData);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Booking failed' };
    } catch (error) {
      return { success: false, message: 'Booking failed. Please try again.' };
    }
  },

  getBookings: async () => {
    try {
      const response = await apiClient.get(endpoints.bookings);
      if (response.success) {
        return { success: true, bookings: response.data };
      }
      return { success: false, message: 'Failed to fetch bookings' };
    } catch (error) {
      return { success: false, message: 'Failed to fetch bookings.' };
    }
  },
};

export const feedbackService = {
  submitFeedback: async (feedbackData) => {
    try {
      const response = await apiClient.post(endpoints.createFeedback, feedbackData);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Failed to submit feedback' };
    } catch (error) {
      return { success: false, message: 'Failed to submit feedback.' };
    }
  },

  getFeedbacks: async () => {
    try {
      const response = await apiClient.get(endpoints.feedback);
      if (response.success) {
        return { success: true, feedbacks: response.data };
      }
      // Return mock testimonials if API fails
      return {
        success: true,
        feedbacks: [
          {
            feedbackId: 1,
            customerName: "Rajesh Kumar",
            rating: 5,
            feedback: "Excellent service and amazing trip to Kerala!",
            destination: "Kerala"
          }
        ]
      };
    } catch (error) {
      return { success: false, message: 'Failed to fetch feedbacks' };
    }
  },
};

// Admin service for managing authentication keys
export const adminService = {
  setAuthKey: (key) => {
    apiClient.setAuthKey(key);
    localStorage.setItem('adminAuthKey', key);
  },
  
  getAuthKey: () => {
    // First try to get from apiClient, then from localStorage if not set
    if (!apiClient.authKey) {
      const storedKey = localStorage.getItem('adminAuthKey');
      if (storedKey) {
        apiClient.setAuthKey(storedKey);
      }
    }
    return apiClient.authKey;
  },
  
  // Check if user has admin privileges
  isAdmin: () => {
    const key = adminService.getAuthKey();
    return key && key.length > 0;
  },
  
  // Verify admin credentials with backend
  verifyAdmin: async (credentials) => {
    try {
      // For now, since there's no dedicated admin authentication endpoint,
      // we'll use the simple authentication from the client side
      if (credentials.username === "admin" && 
          credentials.password === "admin123" && 
          credentials.authKey === "admin123") {
        
        adminService.setAuthKey(credentials.authKey);
        return { success: true, message: "Successfully authenticated as admin" };
      }
      
      return { success: false, message: "Invalid admin credentials" };
    } catch (error) {
      return { success: false, message: "Failed to verify admin credentials" };
    }
  }
};

// Image service for handling image uploads and management
export const imageService = {
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('authKey', apiClient.authKey);
      
      const response = await apiClient.uploadFile(endpoints.uploadImage, formData);
      
      if (response.success) {
        return { success: true, imageUrl: response.data.imageUrl };
      }
      return { success: false, message: response.data?.error || 'Failed to upload image' };
    } catch (error) {
      return { success: false, message: 'Failed to upload image. Please try again.' };
    }
  },

  deleteImage: async (filename) => {
    try {
      const response = await apiClient.delete(`${endpoints.deleteImage}/${filename}?authKey=${apiClient.authKey}`);
      
      if (response.success) {
        return { success: true, message: 'Image deleted successfully' };
      }
      return { success: false, message: response.data?.error || 'Failed to delete image' };
    } catch (error) {
      return { success: false, message: 'Failed to delete image. Please try again.' };
    }
  },

  listImages: async () => {
    try {
      const response = await apiClient.get(`${endpoints.listImages}?authKey=${apiClient.authKey}`);
      
      if (response.success) {
        return { success: true, images: response.data.images || [] };
      }
      return { success: false, message: response.data?.error || 'Failed to list images' };
    } catch (error) {
      return { success: false, message: 'Failed to list images. Please try again.' };
    }
  }
};

// Export the API client for direct use if needed
export default apiClient;
