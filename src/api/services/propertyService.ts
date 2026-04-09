import axiosInstance from '../axios';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  type?: string;
  page?: number;
  limit?: number;
}

export const propertyService = {
  // Get all properties
  getAllProperties: async (filters?: PropertyFilters) => {
    const response = await axiosInstance.get('/properties', { params: filters });
    return response.data;
  },

  // Get property by ID
  getPropertyById: async (id: string) => {
    const response = await axiosInstance.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property
  createProperty: async (propertyData: Partial<Property>) => {
    const response = await axiosInstance.post('/properties', propertyData);
    return response.data;
  },

  // Update property
  updateProperty: async (id: string, propertyData: Partial<Property>) => {
    const response = await axiosInstance.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id: string) => {
    const response = await axiosInstance.delete(`/properties/${id}`);
    return response.data;
  },

  // Search properties
  searchProperties: async (query: string) => {
    const response = await axiosInstance.get('/properties/search', { params: { q: query } });
    return response.data;
  },
};
