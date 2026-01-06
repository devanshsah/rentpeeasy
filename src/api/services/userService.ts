import axiosInstance from '../axios';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  // Get user profile
  getProfile: async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userId: string, profileData: Partial<UserProfile>) => {
    const response = await axiosInstance.put(`/users/${userId}`, profileData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user properties
  getUserProperties: async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}/properties`);
    return response.data;
  },

  // Get user favorites
  getFavorites: async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}/favorites`);
    return response.data;
  },

  // Add to favorites
  addToFavorites: async (userId: string, propertyId: string) => {
    const response = await axiosInstance.post(`/users/${userId}/favorites`, { propertyId });
    return response.data;
  },

  // Remove from favorites
  removeFromFavorites: async (userId: string, propertyId: string) => {
    const response = await axiosInstance.delete(`/users/${userId}/favorites/${propertyId}`);
    return response.data;
  },
};
