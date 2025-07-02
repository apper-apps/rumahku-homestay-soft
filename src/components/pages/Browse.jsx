import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import { propertyService } from '@/services/api/propertyService';

const Browse = () => {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: { min: 0, max: 1000 },
    guests: 1,
    amenities: []
  });
  const [showFilters, setShowFilters] = useState(false);

  const amenitiesList = [
    'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Swimming Pool',
    'TV', 'Washing Machine', 'Garden', 'BBQ Area', 'Hot Water'
  ];

  useEffect(() => {
    loadProperties();
    
    // Handle initial search params from navigation
    if (location.state?.searchParams) {
      const searchParams = location.state.searchParams;
      setFilters(prev => ({
        ...prev,
        location: searchParams.location || '',
        guests: searchParams.guests || 1
      }));
    }
    
    if (location.state?.location) {
      setFilters(prev => ({
        ...prev,
        location: location.state.location
      }));
    }
  }, [location.state]);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

const loadProperties = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await propertyService.getAll();
      setProperties(data || []);
    } catch (err) {
      console.error('Failed to load properties:', err);
      setError('Failed to load properties. Please try again.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Location filter - handle potential undefined location objects
    if (filters.location) {
      filtered = filtered.filter(property => {
        const locationCity = property.location?.city || '';
        const locationState = property.location?.state || '';
        const title = property.title || '';
        
        return locationCity.toLowerCase().includes(filters.location.toLowerCase()) ||
               locationState.toLowerCase().includes(filters.location.toLowerCase()) ||
               title.toLowerCase().includes(filters.location.toLowerCase());
      });
    }

    // Price filter
    filtered = filtered.filter(property =>
      (property.pricePerNight || 0) >= filters.priceRange.min &&
      (property.pricePerNight || 0) <= filters.priceRange.max
    );

    // Guests filter
    filtered = filtered.filter(property => (property.maxGuests || 1) >= filters.guests);

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property => {
        const propertyAmenities = property.amenities || [];
        return filters.amenities.every(amenity =>
          propertyAmenities.includes(amenity)
        );
      });
    }

    setFilteredProperties(filtered);
  };

  const handleSearch = (searchParams) => {
    setFilters(prev => ({
      ...prev,
      location: searchParams.location || '',
      guests: searchParams.guests || 1
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      priceRange: { min: 0, max: 1000 },
      guests: 1,
      amenities: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                icon="Filter"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                Filters ({filteredProperties.length} results)
              </Button>
            </div>

            <div className={`bg-white rounded-xl shadow-lg p-6 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 font-display">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range (per night)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min</label>
                    <input
                      type="number"
                      value={filters.priceRange.min}
                      onChange={(e) => handleFilterChange('priceRange', {
                        ...filters.priceRange,
                        min: parseInt(e.target.value) || 0
                      })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                      placeholder="RM 0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max</label>
                    <input
                      type="number"
                      value={filters.priceRange.max}
                      onChange={(e) => handleFilterChange('priceRange', {
                        ...filters.priceRange,
                        max: parseInt(e.target.value) || 1000
                      })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                      placeholder="RM 1000"
                    />
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Guests
                </label>
                <select
                  value={filters.guests}
                  onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  {filteredProperties.length} homestays found
                </h2>
                {filters.location && (
                  <p className="text-gray-600 mt-1">in {filters.location}</p>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border border-gray-200 rounded-lg px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none">
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            <PropertyGrid
              properties={filteredProperties}
              loading={loading}
              error={error}
              onRetry={loadProperties}
              emptyTitle="No homestays found"
              emptyDescription="Try adjusting your filters or search criteria to find more options."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;