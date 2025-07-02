import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const message = `Hi! I'm interested in your homestay: ${property.title}`;
    const whatsappUrl = `https://wa.me/60${property.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className="property-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={property.photos[0]}
          alt={property.title}
          className="property-image w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="success" size="sm">
            Available
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ApperIcon name="MessageCircle" size={16} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 font-display line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <ApperIcon name="MapPin" size={16} />
          <span className="text-sm">{property.location.city}, {property.location.state}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-600 mb-4">
          <ApperIcon name="Users" size={16} />
          <span className="text-sm">Up to {property.maxGuests} guests</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              <ApperIcon name="Check" size={12} />
              {amenity}
            </div>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-xs text-gray-400">+{property.amenities.length - 3} more</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-primary-600 font-display">
              RM{property.pricePerNight}
            </span>
            <span className="text-gray-600 text-sm ml-1">/ night</span>
          </div>
          
          <div className="flex items-center gap-1 text-yellow-500">
            <ApperIcon name="Star" size={16} fill="currentColor" />
            <span className="text-sm font-semibold">4.8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;