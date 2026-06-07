import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'https://pizza-palace-backend-q5wp.onrender.com';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Configure global axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user details if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API_URL}/auth/profile`);
        setUser(data);
      } catch (error) {
        console.error('Failed to load user profile', error);
        // Token expired or invalid
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        addresses: data.addresses
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        addresses: data.addresses
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.put(`${API_URL}/auth/profile`, profileData);
      if (data.token) {
        setToken(data.token);
      }
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        addresses: data.addresses
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      return { success: false, message };
    }
  };

  // Address operations
  const addAddress = async (addressData) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/address`, addressData);
      setUser((prev) => ({ ...prev, addresses: data }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add address';
      return { success: false, message };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const { data } = await axios.delete(`${API_URL}/auth/address/${addressId}`);
      setUser((prev) => ({ ...prev, addresses: data }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete address';
      return { success: false, message };
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const { data } = await axios.put(`${API_URL}/auth/address/${addressId}/default`);
      setUser((prev) => ({ ...prev, addresses: data }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to set default address';
      return { success: false, message };
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      updateProfile,
      addAddress,
      deleteAddress,
      setDefaultAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
};
