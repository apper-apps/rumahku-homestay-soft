import { toast } from 'react-toastify';

export const bookingService = {
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
          { field: { Name: "property_id" } },
          { field: { Name: "guest_id" } },
          { field: { Name: "check_in" } },
          { field: { Name: "check_out" } },
          { field: { Name: "guests" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "payment_status" } },
          { field: { Name: "booking_status" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('booking', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to frontend format
      const bookings = response.data.map(booking => ({
        Id: booking.Id,
        propertyId: booking.property_id,
        guestId: booking.guest_id,
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        guests: booking.guests,
        totalAmount: booking.total_amount,
        paymentStatus: booking.payment_status,
        bookingStatus: booking.booking_status,
        createdAt: booking.created_at
      }));

      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
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
          { field: { Name: "property_id" } },
          { field: { Name: "guest_id" } },
          { field: { Name: "check_in" } },
          { field: { Name: "check_out" } },
          { field: { Name: "guests" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "payment_status" } },
          { field: { Name: "booking_status" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await apperClient.getRecordById('booking', parseInt(id), params);

      if (!response || !response.data) {
        throw new Error('Booking not found');
      }

      const booking = response.data;
      
      // Transform database fields to frontend format
      return {
        Id: booking.Id,
        propertyId: booking.property_id,
        guestId: booking.guest_id,
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        guests: booking.guests,
        totalAmount: booking.total_amount,
        paymentStatus: booking.payment_status,
        bookingStatus: booking.booking_status,
        createdAt: booking.created_at
      };
    } catch (error) {
      console.error(`Error fetching booking with ID ${id}:`, error);
      throw error;
    }
  },

  async create(bookingData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform frontend format to database fields (only Updateable fields)
      const dbData = {
        Name: `Booking for Property ${bookingData.propertyId}`,
        property_id: parseInt(bookingData.propertyId),
        guest_id: bookingData.guestId || '',
        check_in: bookingData.checkIn instanceof Date ? bookingData.checkIn.toISOString().split('T')[0] : bookingData.checkIn,
        check_out: bookingData.checkOut instanceof Date ? bookingData.checkOut.toISOString().split('T')[0] : bookingData.checkOut,
        guests: bookingData.guests || 1,
        total_amount: bookingData.totalAmount || 0,
        payment_status: bookingData.paymentStatus || 'pending',
        booking_status: bookingData.bookingStatus || 'pending',
        created_at: new Date().toISOString()
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('booking', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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

      throw new Error('Failed to create booking');
    } catch (error) {
      console.error("Error creating booking:", error);
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
        ...(updateData.propertyId && { property_id: parseInt(updateData.propertyId) }),
        ...(updateData.guestId && { guest_id: updateData.guestId }),
        ...(updateData.checkIn && { check_in: updateData.checkIn instanceof Date ? updateData.checkIn.toISOString().split('T')[0] : updateData.checkIn }),
        ...(updateData.checkOut && { check_out: updateData.checkOut instanceof Date ? updateData.checkOut.toISOString().split('T')[0] : updateData.checkOut }),
        ...(updateData.guests && { guests: updateData.guests }),
        ...(updateData.totalAmount && { total_amount: updateData.totalAmount }),
        ...(updateData.paymentStatus && { payment_status: updateData.paymentStatus }),
        ...(updateData.bookingStatus && { booking_status: updateData.bookingStatus })
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('booking', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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

      throw new Error('Failed to update booking');
    } catch (error) {
      console.error("Error updating booking:", error);
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

      const response = await apperClient.deleteRecord('booking', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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
      console.error("Error deleting booking:", error);
      throw error;
    }
  }
};