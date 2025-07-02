import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { propertyService } from '@/services/api/propertyService';
import { bookingService } from '@/services/api/bookingService';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPlan] = useState('basic'); // Mock current plan
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [propertiesData, bookingsData] = await Promise.all([
        propertyService.getAll(),
        bookingService.getAll()
      ]);
      
      setProperties(propertiesData);
      setBookings(bookingsData);
      
      // Calculate stats
      const totalRevenue = bookingsData
        .filter(booking => booking.bookingStatus === 'confirmed')
        .reduce((sum, booking) => sum + booking.totalAmount, 0);
      
      setStats({
        totalProperties: propertiesData.length,
        totalBookings: bookingsData.length,
        monthlyRevenue: totalRevenue,
        occupancyRate: 75 // Mock calculation
      });
      
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.update(bookingId, { bookingStatus: newStatus });
      
      setBookings(prev => prev.map(booking => 
        booking.Id === bookingId 
          ? { ...booking, bookingStatus: newStatus }
          : booking
      ));
      
      toast.success(`Booking ${newStatus} successfully`);
      
      // Simulate WhatsApp notification
      if (newStatus === 'confirmed') {
        toast.info('WhatsApp confirmation sent to guest');
      }
      
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const getPlanLimits = () => {
    switch (currentPlan) {
      case 'free': return { properties: 1, features: ['Basic listing', 'WhatsApp notifications'] };
      case 'basic': return { properties: 5, features: ['Up to 5 properties', 'WhatsApp automation', 'Basic analytics'] };
      case 'pro': return { properties: Infinity, features: ['Unlimited properties', 'Advanced automation', 'Full analytics', 'Priority support'] };
      default: return { properties: 1, features: [] };
    }
  };

  const planLimits = getPlanLimits();
  const canAddProperty = properties.length < planLimits.properties;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading type="dashboard" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadDashboardData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">
              Owner Dashboard
            </h1>
            <p className="text-gray-600">Manage your homestay properties and bookings</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Badge variant={currentPlan} size="md">
              {currentPlan.toUpperCase()} PLAN
            </Badge>
            <Button
              variant="primary"
              icon="Plus"
              onClick={() => navigate('/list-property')}
              disabled={!canAddProperty}
            >
              {canAddProperty ? 'Add Property' : 'Upgrade to Add More'}
            </Button>
          </div>
        </div>

        {/* Plan Status */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-white p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</h3>
              <p className="text-primary-100">
                {properties.length} / {planLimits.properties === Infinity ? '∞' : planLimits.properties} properties used
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="accent"
                icon="Package"
                onClick={() => navigate('/plans')}
              >
                Manage Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Properties</p>
                <p className="text-3xl font-bold text-gray-900 font-display">{stats.totalProperties}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Home" size={24} className="text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 font-display">{stats.totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={24} className="text-secondary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-primary-600 font-display">RM{stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-accent-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-3xl font-bold text-green-600 font-display">{stats.occupancyRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="BarChart3" size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Properties Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-display">My Properties</h2>
              <Button
                variant="outline"
                size="sm"
                icon="Plus"
                onClick={() => navigate('/list-property')}
                disabled={!canAddProperty}
              >
                Add Property
              </Button>
            </div>

            {properties.length === 0 ? (
              <Empty
                type="properties"
                title="No properties listed yet"
                description="Start earning by listing your first homestay property."
                actionText="List Your First Property"
                onAction={() => navigate('/list-property')}
              />
            ) : (
              <div className="space-y-4">
                {properties.map(property => (
                  <div key={property.Id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-4">
                      <img
                        src={property.photos[0]}
                        alt={property.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{property.location.city}, {property.location.state}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 font-semibold">RM{property.pricePerNight}/night</span>
                          <Badge variant="success" size="sm">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-display">Recent Bookings</h2>
              <Button variant="outline" size="sm" icon="Calendar">
                View All
              </Button>
            </div>

            {bookings.length === 0 ? (
              <Empty
                type="bookings"
                title="No bookings yet"
                description="Bookings will appear here once guests start booking your properties."
                actionText="Promote Your Properties"
                onAction={() => navigate('/browse')}
              />
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map(booking => (
                  <div key={booking.Id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">Booking #{booking.Id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={booking.bookingStatus === 'confirmed' ? 'success' : booking.bookingStatus === 'pending' ? 'warning' : 'error'}
                        size="sm"
                      >
                        {booking.bookingStatus}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-primary-600 font-semibold">RM{booking.totalAmount}</span>
                      {booking.bookingStatus === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(booking.Id, 'cancelled')}
                          >
                            Decline
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusChange(booking.Id, 'confirmed')}
                          >
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Automation Status */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="MessageCircle" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900">WhatsApp Automation Active</h3>
              <p className="text-green-700">Automatic notifications are being sent to guests for booking confirmations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <ApperIcon name="Check" size={16} />
              <span>Booking confirmations</span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <ApperIcon name="Check" size={16} />
              <span>Check-in reminders</span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <ApperIcon name="Check" size={16} />
              <span>Payment notifications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;