import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isAfter, isBefore } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const CalendarWidget = ({ 
  selectedDates = { checkIn: null, checkOut: null }, 
  onDateSelect, 
  bookedDates = [], 
  className = '' 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handleDateClick = (date) => {
    if (isBefore(date, new Date())) return;
    if (bookedDates.some(bookedDate => isSameDay(bookedDate, date))) return;

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      // Start new selection
      onDateSelect({ checkIn: date, checkOut: null });
      setSelectingCheckOut(true);
    } else if (selectedDates.checkIn && !selectedDates.checkOut) {
      // Select check-out date
      if (isAfter(date, selectedDates.checkIn)) {
        onDateSelect({ ...selectedDates, checkOut: date });
        setSelectingCheckOut(false);
      } else {
        // If selected date is before check-in, make it the new check-in
        onDateSelect({ checkIn: date, checkOut: null });
      }
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const dayOfWeek = days.length % 7;
      if (dayOfWeek === 0) {
        days.push([]);
      }
      days[Math.floor(days.length / 7) * 7 ? days.length - 1 : days.length] = days[Math.floor(days.length / 7) * 7 ? days.length - 1 : days.length] || [];
      days[days.length - 1].push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const getDayClassName = (date) => {
    const baseClass = "calendar-day";
    const isPast = isBefore(date, new Date());
    const isBooked = bookedDates.some(bookedDate => isSameDay(bookedDate, date));
    const isCheckIn = selectedDates.checkIn && isSameDay(date, selectedDates.checkIn);
    const isCheckOut = selectedDates.checkOut && isSameDay(date, selectedDates.checkOut);
    const isInRange = selectedDates.checkIn && selectedDates.checkOut && 
                     isAfter(date, selectedDates.checkIn) && 
                     isBefore(date, selectedDates.checkOut);

    if (isPast || isBooked) return `${baseClass} booked`;
    if (isCheckIn || isCheckOut) return `${baseClass} selected`;
    if (isInRange) return `${baseClass} bg-primary-100 text-primary-700`;
    if (!isSameMonth(date, currentMonth)) return `${baseClass} text-gray-300`;
    return `${baseClass} available`;
  };

  const calendarDays = renderCalendarDays();

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ApperIcon name="ChevronLeft" size={20} />
        </button>
        
        <h3 className="text-lg font-bold text-gray-900 font-display">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        
        <button
          onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ApperIcon name="ChevronRight" size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.flat().map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            className={getDayClassName(date)}
            disabled={isBefore(date, new Date()) || bookedDates.some(bookedDate => isSameDay(bookedDate, date))}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary-200 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-gray-600">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-500 rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </div>

      {selectedDates.checkIn && (
        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">Check-in:</span>
              <p className="font-semibold text-primary-700">
                {format(selectedDates.checkIn, 'MMM dd, yyyy')}
              </p>
            </div>
            {selectedDates.checkOut && (
              <div>
                <span className="text-sm text-gray-600">Check-out:</span>
                <p className="font-semibold text-primary-700">
                  {format(selectedDates.checkOut, 'MMM dd, yyyy')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;