import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Browse from "@/components/pages/Browse";
import BookingWidget from "@/components/organisms/BookingWidget";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { propertyService } from "@/services/api/propertyService";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState(new Set());
  const [imagesLoading, setImagesLoading] = useState(new Set());
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await propertyService.getById(id);
      
      // Validate property data
      if (!data) {
        throw new Error('Data properti tidak ditemukan');
      }
      
      // Ensure photos array exists
      if (!data.photos || !Array.isArray(data.photos)) {
        data.photos = [];
      }
      
      setProperty(data);
      
      // Initialize image loading states
      const loadingSet = new Set();
      data.photos.forEach((_, index) => {
        loadingSet.add(index);
      });
      setImagesLoading(loadingSet);
      
    } catch (err) {
      console.error('Property loading error:', err);
      setError(err.message || 'Gagal memuat detail properti');
    } finally {
      setLoading(false);
    }
};

  const handleImageError = (index) => {
    setImageErrors(prev => new Set([...prev, index]));
    setImagesLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleImageLoad = (index) => {
    setImagesLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleWhatsApp = () => {
    const message = `Halo, saya tertarik dengan properti ${property?.title || 'ini'} di ${property?.location || 'lokasi ini'}. Bisakah saya mendapat informasi lebih lanjut?`;
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || 'Properti',
        text: `Lihat properti ${property?.title || 'ini'} di ${property?.location || 'lokasi ini'}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading type="properties" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error 
            message={error} 
            onRetry={loadProperty}
            type="notfound"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => navigate('/browse')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse
            </button>
            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            <span className="text-gray-600">{property.location.city}</span>
            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium truncate">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-display">
                {property.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <ApperIcon name="MapPin" size={18} />
                  <span>{property.location.city}, {property.location.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Users" size={18} />
                  <span>Up to {property.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Star" size={18} className="text-yellow-500" fill="currentColor" />
                  <span className="font-medium">4.8 (24 reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                icon="Share"
                onClick={handleShare}
              >
                Share
              </Button>
<Button
                variant="secondary"
                icon="MessageCircle"
                onClick={handleWhatsApp}
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="relative">
                {/* Main Image */}
                {property?.photos && property.photos.length > 0 ? (
                  <>
                    {imagesLoading.has(0) && !imageErrors.has(0) && (
                      <div className="w-full h-96 bg-gray-200 animate-pulse flex items-center justify-center">
                        <ApperIcon name="ImageIcon" size={48} className="text-gray-400" />
                      </div>
                    )}
                    
                    {imageErrors.has(0) ? (
                      <div className="w-full h-96 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                        <ApperIcon name="ImageOff" size={48} className="mb-4" />
                        <span className="text-lg mb-2">Gambar tidak dapat dimuat</span>
                        <span className="text-sm">Coba muat ulang halaman</span>
                      </div>
                    ) : (
                      <img
                        src={property.photos[0]}
                        alt={property?.title || 'Property'}
                        className={`w-full h-96 object-cover cursor-pointer transition-opacity ${
                          imagesLoading.has(0) ? 'opacity-0' : 'opacity-100'
                        }`}
                        onClick={() => {
                          setSelectedImageIndex(0);
                          setShowImageModal(true);
                        }}
                        onError={() => handleImageError(0)}
                        onLoad={() => handleImageLoad(0)}
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full h-96 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                    <ApperIcon name="ImageIcon" size={48} className="mb-4" />
                    <span className="text-lg">Tidak ada gambar tersedia</span>
                  </div>
                )}
                
                <div className="absolute top-4 left-4">
                  <Badge variant={property?.status === 'available' ? 'success' : 'warning'}>
                    {property?.status === 'available' ? 'Tersedia' : 'Tidak Tersedia'}
                  </Badge>
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {property?.photos && property.photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {property.photos.slice(1, 5).map((photo, index) => {
                    const imageIndex = index + 1;
                    return (
                      <div key={index} className="relative">
                        {imagesLoading.has(imageIndex) && !imageErrors.has(imageIndex) && (
                          <div className="w-full h-24 bg-gray-200 animate-pulse flex items-center justify-center">
                            <ApperIcon name="ImageIcon" size={16} className="text-gray-400" />
                          </div>
                        )}
                        
                        {imageErrors.has(imageIndex) ? (
                          <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                            <ApperIcon name="ImageOff" size={16} className="text-gray-400" />
                          </div>
                        ) : (
                          <img
                            src={photo}
                            alt={`${property?.title || 'Property'} ${index + 2}`}
                            className={`w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity ${
                              imagesLoading.has(imageIndex) ? 'opacity-0' : 'opacity-100'
                            }`}
                            onClick={() => {
                              setSelectedImageIndex(imageIndex);
                              setShowImageModal(true);
                            }}
                            onError={() => handleImageError(imageIndex)}
                            onLoad={() => handleImageLoad(imageIndex)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {property?.photos && property.photos.length > 5 && (
            <div className="text-center mt-4">
              <Button
                variant="outline"
                icon="Grid"
                onClick={() => setShowAllPhotos(true)}
              >
                View all {property.photos.length} photos
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                About this homestay
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Check" size={16} className="text-primary-600" />
                    </div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
                Location
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ApperIcon name="MapPin" size={20} className="text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{property.location.address}</p>
                    <p className="text-gray-600">{property.location.city}, {property.location.state} {property.location.postcode}</p>
                  </div>
                </div>
                
                {/* Mock map placeholder */}
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ApperIcon name="Map" size={48} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive map would appear here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Host Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
                Meet your host
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Siti Rahman</h3>
                  <p className="text-gray-600 mb-3">Host since 2022 • Speaks Malay, English</p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to my family homestay! I love sharing Malaysian culture and helping guests 
                    discover the beauty of our local area. I'm always happy to provide recommendations 
                    for the best food and attractions nearby.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      icon="MessageCircle"
                      size="sm"
                      onClick={handleWhatsApp}
                    >
                      Contact Host
                    </Button>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <ApperIcon name="Star" size={16} fill="currentColor" />
                      <span className="text-sm font-medium text-gray-700">4.9 host rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
                Reviews
              </h2>
              <div className="space-y-6">
                {/* Sample reviews */}
                {[
                  {
                    name: "Ahmad Zaki",
                    rating: 5,
                    date: "March 2024",
                    comment: "Amazing homestay experience! Siti was incredibly welcoming and the house was exactly as described. The location is perfect for exploring the area."
                  },
                  {
                    name: "Lisa Chen",
                    rating: 5,
                    date: "February 2024",
                    comment: "Clean, comfortable, and authentic Malaysian hospitality. The breakfast prepared by the host family was delicious. Highly recommend!"
                  }
                ].map((review, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{review.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <ApperIcon key={i} name="Star" size={14} className="text-yellow-500" fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget property={property} />
          </div>
        </div>
      </div>

{/* Photo Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">
                {selectedImageIndex + 1} / {property.photos.length}
              </h3>
              <button
                onClick={() => setShowAllPhotos(false)}
                className="text-white hover:text-gray-300 p-2"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative max-w-4xl max-h-[80vh]">
                {property?.photos && property.photos[selectedImageIndex] ? (
                  <>
                    {imageErrors.has(selectedImageIndex) ? (
                      <div className="w-full h-96 bg-gray-100 flex flex-col items-center justify-center text-white">
                        <ApperIcon name="ImageOff" size={48} className="mb-4" />
                        <span className="text-lg mb-2">Gambar tidak dapat dimuat</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newErrors = new Set(imageErrors);
                            newErrors.delete(selectedImageIndex);
                            setImageErrors(newErrors);
                            // Force reload by adding timestamp
                            const img = new Image();
                            img.src = property.photos[selectedImageIndex] + '?t=' + Date.now();
                          }}
                          className="text-white border-white hover:bg-white hover:text-gray-900"
                        >
                          Coba Lagi
                        </Button>
                      </div>
                    ) : (
                      <img
                        src={property.photos[selectedImageIndex]}
                        alt={`${property?.title || 'Property'} ${selectedImageIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                        onError={() => handleImageError(selectedImageIndex)}
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-white">
                    <ApperIcon name="ImageIcon" size={48} />
                  </div>
                )}
                
                {property?.photos && property.photos.length > 1 && (
                  <>
                    <button
                      disabled={selectedImageIndex === 0}
                      onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ApperIcon name="ChevronLeft" size={24} />
                    </button>
                    <button
                      disabled={selectedImageIndex === (property.photos.length - 1)}
                      onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ApperIcon name="ChevronRight" size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {property?.photos && property.photos.length > 0 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                  {property.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === selectedImageIndex
                          ? 'bg-white'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;