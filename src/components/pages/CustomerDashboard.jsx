import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { bookingService } from '@/services/api/bookingService';
import { propertyService } from '@/services/api/propertyService';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const bookingsData = await bookingService.getAll();
      setBookings(bookingsData);
      
      // Load property details for each booking
      const propertyIds = [...new Set(bookingsData.map(booking => booking.propertyId))];
      const propertiesData = {};
      
      for (const propertyId of propertyIds) {
        try {
          const property = await propertyService.getById(parseInt(propertyId));
          propertiesData[propertyId] = property;
        } catch (err) {
          console.error('Failed to load property:', propertyId);
        }
      }
      
      setProperties(propertiesData);
      
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(booking => 
          new Date(booking.checkIn) > now && 
          booking.bookingStatus === 'confirmed'
        );
      case 'past':
        return bookings.filter(booking => 
          new Date(booking.checkOut) < now
        );
      case 'cancelled':
        return bookings.filter(booking => 
          booking.bookingStatus === 'cancelled'
        );
      default:
        return bookings;
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'primary';
      default: return 'default';
    }
  };

  const handleWhatsApp = (booking) => {
    const property = properties[booking.propertyId];
    if (!property) return;
    
    const message = `Hi! I have a booking (#${booking.Id}) for ${property.title} on ${new Date(booking.checkIn).toLocaleDateString()}. I'd like to confirm the details.`;
    const whatsappUrl = `https://wa.me/60${property.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredBookings = getFilteredBookings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading type="dashboard" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadBookings} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">
              My Bookings
            </h1>
            <p className="text-gray-600">Manage your homestay reservations and travel plans</p>
          </div>
          
          <Button
            variant="primary"
            icon="Search"
            onClick={() => navigate('/browse')}
          >
            Find Homestays
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 font-display">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={24} className="text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Stays</p>
                <p className="text-3xl font-bold text-secondary-600 font-display">
                  {bookings.filter(b => new Date(b.checkIn) > new Date() && b.bookingStatus === 'confirmed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="MapPin" size={24} className="text-secondary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-accent-600 font-display">
                  RM{bookings.reduce((sum, booking) => sum + booking.totalAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CreditCard" size={24} className="text-accent-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'upcoming', label: 'Upcoming', icon: 'Calendar' },
                { id: 'past', label: 'Past Stays', icon: 'History' },
                { id: 'cancelled', label: 'Cancelled', icon: 'X' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <ApperIcon name={tab.icon} size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {filteredBookings.length === 0 ? (
              <Empty
                type="bookings"
                title={`No ${activeTab} bookings`}
                description={
                  activeTab === 'upcoming' 
                    ? "You don't have any upcoming stays. Start planning your next Malaysian adventure!"
                    : activeTab === 'past'
                    ? "Your travel history will appear here after you complete your stays."
                    : "You don't have any cancelled bookings."
                }
                actionText="Browse Homestays"
                onAction={() => navigate('/browse')}
              />
            ) : (
              <div className="space-y-6">
                {filteredBookings.map(booking => {
                  const property = properties[booking.propertyId];
                  
                  return (
                    <div key={booking.Id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Property Image */}
                        {property && (
                          <div className="md:w-48 md:flex-shrink-0">
                            <img
                              src={property.photos[0]}
                              alt={property.title}
                              className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
                              onClick={() => navigate(`/property/${property.Id}`)}
                            />
                          </div>
                        )}

                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1 font-display">
                                {property ? property.title : 'Property Not Found'}
                              </h3>
                              {property && (
                                <p className="text-gray-600 flex items-center gap-1">
                                  <ApperIcon name="MapPin" size={16} />
                                  {property.location.city}, {property.location.state}
                                </p>
                              )}
                            </div>
                            <Badge variant={getBookingStatusColor(booking.bookingStatus)} size="sm">
                              {booking.bookingStatus}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Check-in</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(booking.checkIn).toLocaleDateString('en-MY', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Check-out</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(booking.checkOut).toLocaleDateString('en-MY', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="text-2xl font-bold text-primary-600 font-display">
                                RM{booking.totalAmount.toLocaleString()}
                              </p>
                            </div>

                            <div className="flex gap-3">
                              {property && booking.bookingStatus === 'confirmed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  icon="MessageCircle"
                                  onClick={() => handleWhatsApp(booking)}
                                >
                                  Contact Host
                                </Button>
                              )}
                              {property && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  icon="Eye"
                                  onClick={() => navigate(`/property/${property.Id}`)}
                                >
                                  View Property
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-white p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Ready for Your Next Adventure?</h3>
              <p className="text-primary-100">
                Discover more authentic Malaysian homestays and create unforgettable memories
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="accent"
                icon="Search"
                onClick={() => navigate('/browse')}
              >
                Browse Homestays
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;