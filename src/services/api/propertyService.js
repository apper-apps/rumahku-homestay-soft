import { toast } from 'react-toastify';

export const propertyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "location_address" } },
          { field: { Name: "location_city" } },
          { field: { Name: "location_state" } },
          { field: { Name: "location_postcode" } },
          { field: { Name: "price_per_night" } },
          { field: { Name: "max_guests" } },
          { field: { Name: "photos" } },
          { field: { Name: "amenities" } },
          { field: { Name: "whatsapp_number" } },
          { field: { Name: "status" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "ASC" }
        ]
      };

const response = await apperClient.fetchRecords('property', params);

      if (!response || !response.success) {
        const errorMessage = response?.message || 'Failed to fetch properties';
        console.error(errorMessage);
        toast.error(errorMessage);
        return [];
      }
      // Transform database fields to frontend format
      const properties = response.data.map(property => ({
        Id: property.Id,
        title: property.title || 'Property Title Not Available',
        description: property.description || '',
        location: {
          address: property.location_address || '',
          city: property.location_city || '',
          state: property.location_state || '',
          postcode: property.location_postcode || ''
        },
        pricePerNight: property.price_per_night || 0,
        maxGuests: property.max_guests || 1,
        photos: property.photos ? property.photos.split(',').filter(p => p.trim()) : [],
        amenities: property.amenities ? property.amenities.split(',').filter(a => a.trim()) : [],
        whatsappNumber: property.whatsapp_number || '',
        status: property.status || 'inactive'
      }));

      return properties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "location_address" } },
          { field: { Name: "location_city" } },
          { field: { Name: "location_state" } },
          { field: { Name: "location_postcode" } },
          { field: { Name: "price_per_night" } },
          { field: { Name: "max_guests" } },
          { field: { Name: "photos" } },
          { field: { Name: "amenities" } },
          { field: { Name: "whatsapp_number" } },
          { field: { Name: "status" } }
        ]
      };

const response = await apperClient.getRecordById('property', parseInt(id), params);

      if (!response || !response.success || !response.data) {
        const errorMessage = response?.message || 'Property not found';
        throw new Error(errorMessage);
      }
      const property = response.data;
      
      // Transform database fields to frontend format
      return {
        Id: property.Id,
        title: property.title || 'Property Title Not Available',
        description: property.description || '',
        location: {
          address: property.location_address || '',
          city: property.location_city || '',
          state: property.location_state || '',
          postcode: property.location_postcode || ''
        },
        pricePerNight: property.price_per_night || 0,
        maxGuests: property.max_guests || 1,
        photos: property.photos ? property.photos.split(',').filter(p => p.trim()) : [],
        amenities: property.amenities ? property.amenities.split(',').filter(a => a.trim()) : [],
        whatsappNumber: property.whatsapp_number || '',
        status: property.status || 'inactive'
      };
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  },

  async create(propertyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform frontend format to database fields (only Updateable fields)
      const dbData = {
        Name: propertyData.title || '',
        title: propertyData.title || '',
        description: propertyData.description || '',
        location_address: propertyData.location?.address || '',
        location_city: propertyData.location?.city || '',
        location_state: propertyData.location?.state || '',
        location_postcode: propertyData.location?.postcode || '',
        price_per_night: propertyData.pricePerNight || 0,
        max_guests: propertyData.maxGuests || 1,
        photos: Array.isArray(propertyData.photos) ? propertyData.photos.join(',') : '',
        amenities: Array.isArray(propertyData.amenities) ? propertyData.amenities.join(',') : '',
        whatsapp_number: propertyData.whatsappNumber || '',
        status: propertyData.status || 'active'
      };

      const params = {
        records: [dbData]
      };

const response = await apperClient.createRecord('property', params);

      if (!response || !response.success) {
        const errorMessage = response?.message || 'Failed to create property';
        console.error(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create property');
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform frontend format to database fields (only Updateable fields)
      const dbData = {
        Id: parseInt(id),
        ...(updateData.title && { Name: updateData.title, title: updateData.title }),
        ...(updateData.description && { description: updateData.description }),
        ...(updateData.location?.address && { location_address: updateData.location.address }),
        ...(updateData.location?.city && { location_city: updateData.location.city }),
        ...(updateData.location?.state && { location_state: updateData.location.state }),
        ...(updateData.location?.postcode && { location_postcode: updateData.location.postcode }),
        ...(updateData.pricePerNight && { price_per_night: updateData.pricePerNight }),
        ...(updateData.maxGuests && { max_guests: updateData.maxGuests }),
        ...(updateData.photos && { photos: Array.isArray(updateData.photos) ? updateData.photos.join(',') : updateData.photos }),
        ...(updateData.amenities && { amenities: Array.isArray(updateData.amenities) ? updateData.amenities.join(',') : updateData.amenities }),
        ...(updateData.whatsappNumber && { whatsapp_number: updateData.whatsappNumber }),
        ...(updateData.status && { status: updateData.status })
      };

      const params = {
        records: [dbData]
      };

const response = await apperClient.updateRecord('property', params);

      if (!response || !response.success) {
        const errorMessage = response?.message || 'Failed to update property';
        console.error(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update property');
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

const response = await apperClient.deleteRecord('property', params);

      if (!response || !response.success) {
        const errorMessage = response?.message || 'Failed to delete property';
        console.error(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  }
};