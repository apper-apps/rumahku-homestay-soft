import { bookings } from '@/services/mockData/bookings.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bookingService = {
  async getAll() {
    await delay(300);
    return [...bookings];
  },

  async getById(id) {
    await delay(250);
    const booking = bookings.find(b => b.Id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return { ...booking };
  },

  async create(bookingData) {
    await delay(500);
    const maxId = Math.max(...bookings.map(b => b.Id), 0);
    const newBooking = {
      ...bookingData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    return { ...newBooking };
  },

  async update(id, updateData) {
    await delay(400);
    const index = bookings.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error('Booking not found');
    }
    bookings[index] = { ...bookings[index], ...updateData };
    return { ...bookings[index] };
  },

  async delete(id) {
    await delay(300);
    const index = bookings.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error('Booking not found');
    }
    const deleted = bookings.splice(index, 1)[0];
    return { ...deleted };
  }
};