import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Null safety check
  if (!property) {
    return null;
  }

  const handleClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

const handleWhatsApp = (e) => {
    e.stopPropagation();
    const message = `Halo, saya tertarik dengan properti ${property?.title || 'ini'} di ${property?.location || 'lokasi ini'}. Bisakah saya mendapat informasi lebih lanjut?`;
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Get primary image with fallback
  const primaryImage = property?.photos?.[0] || '/placeholder-property.jpg';

  return (
    <div 
      className="property-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        {imageLoading && !imageError && (
          <div className="w-full h-48 bg-gray-200 animate-pulse flex items-center justify-center">
            <ApperIcon name="ImageIcon" size={32} className="text-gray-400" />
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
            <ApperIcon name="ImageOff" size={32} className="mb-2" />
            <span className="text-sm">Gambar tidak tersedia</span>
          </div>
        ) : (
          <img
            src={primaryImage}
            alt={property?.title || 'Property'}
            className={`property-image w-full h-48 object-cover transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        
<div className="absolute top-4 left-4">
          <Badge
            variant={property?.status === 'active' ? 'success' : 'warning'}
          >
            {property?.status === 'active' ? 'Tersedia' : 'Tidak Tersedia'}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors duration-200"
            title="Chat WhatsApp"
          >
            <ApperIcon name="MessageCircle" size={16} />
          </button>
</div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {property?.title || 'Properti Tidak Diketahui'}
        </h3>
<div className="flex items-center text-gray-600 mb-3">
          <ApperIcon name="MapPin" size={16} className="mr-2" />
          <span className="text-sm">
            {property?.location?.city || property?.location?.address || property?.location || 'Lokasi tidak tersedia'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">
              RM {property?.pricePerNight ? property.pricePerNight.toLocaleString('id-ID') : '0'}
            </span>
            <span className="text-gray-500 text-sm ml-1">/malam</span>
          </div>
          
          <div className="flex items-center text-yellow-500">
            <ApperIcon name="Star" size={16} className="mr-1 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {property?.rating || (property?.pricePerNight ? Math.min(4.8, Math.max(3.5, 4.0 + (property.pricePerNight / 1000))).toFixed(1) : '4.0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PropertyCard;