import React, { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CalendarWidget from '@/components/molecules/CalendarWidget';
import { bookingService } from '@/services/api/bookingService';

const BookingWidget = ({ property }) => {
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  // Mock booked dates
  const bookedDates = [
    new Date(2024, 2, 15),
    new Date(2024, 2, 16),
    new Date(2024, 2, 22),
    new Date(2024, 2, 23),
  ];

  useEffect(() => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      const nights = differenceInDays(selectedDates.checkOut, selectedDates.checkIn);
      const basePrice = nights * property.pricePerNight;
      const serviceFee = basePrice * 0.1;
      const cleaningFee = 50;
      const total = basePrice + serviceFee + cleaningFee;
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [selectedDates, property.pricePerNight]);

  const handleDateSelect = (dates) => {
    setSelectedDates(dates);
    if (dates.checkOut) {
      setShowCalendar(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (guests > property.maxGuests) {
      toast.error(`Maximum ${property.maxGuests} guests allowed`);
      return;
    }

    setLoading(true);

try {
      const bookingData = {
        propertyId: property.Id,
        guestId: 'user-123', // Mock user ID
        checkIn: selectedDates.checkIn,
        checkOut: selectedDates.checkOut,
        guests,
        totalAmount: totalPrice,
        paymentStatus: 'pending',
        bookingStatus: 'pending'
      };

      await bookingService.create(bookingData);
      
      // Simulate WhatsApp notification
      const message = `Booking confirmed for ${property.title}! Check-in: ${selectedDates.checkIn.toLocaleDateString()}, Check-out: ${selectedDates.checkOut.toLocaleDateString()}. Total: RM${totalPrice}`;
      
      toast.success('Booking confirmed! WhatsApp notification sent.');
      
      // Reset form
      setSelectedDates({ checkIn: null, checkOut: null });
      setGuests(2);
      
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBayarCashPayment = () => {
    // Simulate BayarCash payment gateway
    toast.info('Redirecting to BayarCash payment gateway...');
    
    setTimeout(() => {
      handleBooking();
    }, 2000);
  };

  const nights = selectedDates.checkIn && selectedDates.checkOut 
    ? differenceInDays(selectedDates.checkOut, selectedDates.checkIn)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 sticky top-8">
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary-600 font-display">
            RM{property.pricePerNight}
          </span>
          <span className="text-gray-600">/ night</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <ApperIcon name="Star" size={16} className="text-yellow-500" fill="currentColor" />
          <span className="text-sm font-medium">4.8</span>
          <span className="text-sm text-gray-600">(24 reviews)</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dates
          </label>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-left hover:border-primary-300 transition-colors duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ApperIcon name="Calendar" size={18} className="text-gray-400" />
                <span className={selectedDates.checkIn ? 'text-gray-900' : 'text-gray-400'}>
                  {selectedDates.checkIn && selectedDates.checkOut
                    ? `${selectedDates.checkIn.toLocaleDateString()} - ${selectedDates.checkOut.toLocaleDateString()}`
                    : 'Select dates'
                  }
                </span>
              </div>
              <ApperIcon name="ChevronDown" size={18} className="text-gray-400" />
            </div>
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all duration-200"
          >
            {[...Array(property.maxGuests)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showCalendar && (
        <div className="mb-6">
          <CalendarWidget
            selectedDates={selectedDates}
            onDateSelect={handleDateSelect}
            bookedDates={bookedDates}
          />
        </div>
      )}

      {totalPrice > 0 && (
        <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>RM{property.pricePerNight} × {nights} nights</span>
            <span>RM{property.pricePerNight * nights}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Service fee</span>
            <span>RM{Math.round(property.pricePerNight * nights * 0.1)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cleaning fee</span>
            <span>RM50</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>RM{totalPrice}</span>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleBayarCashPayment}
        loading={loading}
        disabled={!selectedDates.checkIn || !selectedDates.checkOut}
      >
        {totalPrice > 0 ? `Book Now - RM${totalPrice}` : 'Select Dates'}
      </Button>

      <div className="mt-4 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ApperIcon name="Shield" size={16} className="text-green-500" />
          <span>Secure payment with BayarCash</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <ApperIcon name="MessageCircle" size={16} className="text-green-500" />
          <span>WhatsApp confirmation included</span>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;