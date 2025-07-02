import { properties } from '@/services/mockData/properties.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
async getAll() {
    await delay(300);
    
    // Validate and sanitize all properties
    const sanitizedProperties = properties.map(property => ({
      ...property,
      photos: Array.isArray(property.photos) ? property.photos : [],
      title: property.title || 'Property Title Not Available',
      location: property.location || 'Location Not Available',
      price: typeof property.price === 'number' ? property.price : 0,
      rating: typeof property.rating === 'number' ? property.rating : 0,
      status: property.status || 'unavailable'
    }));
    
    return sanitizedProperties;
  },

async getById(id) {
    await delay(250);
    const property = properties.find(p => p.Id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Validate and sanitize property data
    const sanitizedProperty = {
      ...property,
      photos: Array.isArray(property.photos) ? property.photos : [],
      title: property.title || 'Property Title Not Available',
      location: property.location || 'Location Not Available',
      price: typeof property.price === 'number' ? property.price : 0,
      rating: typeof property.rating === 'number' ? property.rating : 0,
      status: property.status || 'unavailable'
    };
    
    return sanitizedProperty;
  },

  async create(propertyData) {
    await delay(500);
    const maxId = Math.max(...properties.map(p => p.Id), 0);
    const newProperty = {
      ...propertyData,
      Id: maxId + 1,
      status: 'active'
    };
    properties.push(newProperty);
    return { ...newProperty };
  },

  async update(id, updateData) {
    await delay(400);
    const index = properties.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    properties[index] = { ...properties[index], ...updateData };
    return { ...properties[index] };
  },

  async delete(id) {
    await delay(300);
    const index = properties.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    const deleted = properties.splice(index, 1)[0];
    return { ...deleted };
  }
};