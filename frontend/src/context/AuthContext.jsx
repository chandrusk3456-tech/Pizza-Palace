import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user details if token exists in localStorage
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/profile');
        setUser(data);
      } catch (error) {
        console.error('Failed to load user profile', error);
        // Token expired or invalid
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
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
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
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
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData);
      if (data.token) {
        localStorage.setItem('token', data.token);
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
      const { data } = await api.post('/auth/address', addressData);
      setUser((prev) => ({ ...prev, addresses: data }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add address';
      return { success: false, message };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const { data } = await api.delete(`/auth/address/${addressId}`);
      setUser((prev) => ({ ...prev, addresses: data }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete address';
      return { success: false, message };
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const { data } = await api.put(`/auth/address/${addressId}/default`);
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
