import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { propertyService } from '@/services/api/propertyService';

const ListProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      postcode: ''
    },
    pricePerNight: '',
    maxGuests: '2',
    photos: [],
    amenities: [],
    whatsappNumber: ''
  });

  const malaysianStates = [
    'Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Perak', 'Kedah', 'Kelantan',
    'Terengganu', 'Pahang', 'Negeri Sembilan', 'Malacca', 'Perlis', 'Sabah', 'Sarawak'
  ];

  const availableAmenities = [
    'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Swimming Pool',
    'TV', 'Washing Machine', 'Garden', 'BBQ Area', 'Hot Water',
    'Refrigerator', 'Microwave', 'Coffee Maker', 'Balcony', 'Fireplace'
  ];

  const samplePhotos = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          toast.error('Property title is required');
          return false;
        }
        if (!formData.description.trim()) {
          toast.error('Property description is required');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.location.address.trim() || !formData.location.city.trim() || 
            !formData.location.state.trim() || !formData.location.postcode.trim()) {
          toast.error('All location fields are required');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.pricePerNight || parseFloat(formData.pricePerNight) <= 0) {
          toast.error('Valid price per night is required');
          return false;
        }
        if (!formData.whatsappNumber.trim()) {
          toast.error('WhatsApp number is required');
          return false;
        }
        return true;
      
      case 4:
        if (formData.amenities.length === 0) {
          toast.error('Please select at least one amenity');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {
      const propertyData = {
        ...formData,
        pricePerNight: parseFloat(formData.pricePerNight),
        maxGuests: parseInt(formData.maxGuests),
        photos: samplePhotos,
        status: 'active'
      };

      await propertyService.create(propertyData);
      
      toast.success('Property listed successfully!');
      toast.info('WhatsApp automation has been set up for your property');
      
      navigate('/owner-dashboard');
      
    } catch (error) {
      toast.error('Failed to list property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                Basic Information
              </h2>
              <p className="text-gray-600">Tell us about your homestay property</p>
            </div>

            <Input
              label="Property Title"
              placeholder="e.g., Cozy Traditional House in Kampong Baru"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Property Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                rows={6}
                placeholder="Describe your homestay, its unique features, nearby attractions, and what makes it special..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all duration-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Guests
              </label>
              <select
                value={formData.maxGuests}
                onChange={(e) => handleInputChange('maxGuests', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all duration-200"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                Location Details
              </h2>
              <p className="text-gray-600">Where is your homestay located?</p>
            </div>

            <Input
              label="Street Address"
              placeholder="e.g., 123 Jalan Melur"
              value={formData.location.address}
              onChange={(e) => handleInputChange('location.address', e.target.value)}
              icon="MapPin"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="e.g., Kuala Lumpur"
                value={formData.location.city}
                onChange={(e) => handleInputChange('location.city', e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.location.state}
                  onChange={(e) => handleInputChange('location.state', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all duration-200"
                >
                  <option value="">Select State</option>
                  {malaysianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Postcode"
              placeholder="e.g., 50200"
              value={formData.location.postcode}
              onChange={(e) => handleInputChange('location.postcode', e.target.value)}
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                Pricing & Contact
              </h2>
              <p className="text-gray-600">Set your pricing and contact details</p>
            </div>

            <Input
              label="Price per Night (RM)"
              type="number"
              placeholder="e.g., 150"
              value={formData.pricePerNight}
              onChange={(e) => handleInputChange('pricePerNight', e.target.value)}
              icon="DollarSign"
              required
            />

            <Input
              label="WhatsApp Number"
              type="tel"
              placeholder="e.g., 0123456789"
              value={formData.whatsappNumber}
              onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
              icon="MessageCircle"
              required
            />

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="MessageCircle" size={20} className="text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">WhatsApp Automation</h4>
                  <p className="text-green-700 text-sm">
                    Your WhatsApp number will be used for automated booking confirmations, 
                    check-in reminders, and guest communications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                Amenities & Features
              </h2>
              <p className="text-gray-600">What amenities does your homestay offer?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableAmenities.map(amenity => (
                <label key={amenity} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>

            {formData.amenities.length > 0 && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h4 className="font-semibold text-primary-900 mb-2">Selected Amenities:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map(amenity => (
                    <span key={amenity} className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <ApperIcon name="X" size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                Review & Submit
              </h2>
              <p className="text-gray-600">Review your property details before listing</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                <p className="text-gray-700"><strong>Title:</strong> {formData.title}</p>
                <p className="text-gray-700"><strong>Max Guests:</strong> {formData.maxGuests}</p>
                <p className="text-gray-700"><strong>Price:</strong> RM{formData.pricePerNight}/night</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-700">
                  {formData.location.address}, {formData.location.city}, {formData.location.state} {formData.location.postcode}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                <p className="text-gray-700">WhatsApp: {formData.whatsappNumber}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Amenities ({formData.amenities.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map(amenity => (
                    <span key={amenity} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Info" size={20} className="text-accent-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-accent-900 mb-1">What happens next?</h4>
                  <ul className="text-accent-700 text-sm space-y-1">
                    <li>• Your property will be reviewed and activated within 24 hours</li>
                    <li>• WhatsApp automation will be set up automatically</li>
                    <li>• Guests can start booking immediately after activation</li>
                    <li>• You'll receive booking notifications via WhatsApp</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 font-display">List Your Property</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              icon="ChevronLeft"
              onClick={handlePrevious}
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 5 ? (
            <Button
              variant="primary"
              icon="ChevronRight"
              iconPosition="right"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              icon="Check"
              onClick={handleSubmit}
              loading={loading}
            >
              List Property
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProperty;