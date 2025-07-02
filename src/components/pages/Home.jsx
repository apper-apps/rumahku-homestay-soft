import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import PropertyCard from '@/components/molecules/PropertyCard';
import Loading from '@/components/ui/Loading';
import { propertyService } from '@/services/api/propertyService';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      const properties = await propertyService.getAll();
      setFeaturedProperties(properties.slice(0, 6));
    } catch (error) {
      console.error('Error loading featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchParams) => {
    navigate('/browse', { state: { searchParams } });
  };

  const locations = [
    { name: 'Kuala Lumpur', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=500&h=300&fit=crop', count: '120+ homestays' },
    { name: 'Langkawi', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d96?w=500&h=300&fit=crop', count: '85+ homestays' },
    { name: 'Penang', image: 'https://images.unsplash.com/photo-1559291001-693fb9166cba?w=500&h=300&fit=crop', count: '95+ homestays' },
    { name: 'Malacca', image: 'https://images.unsplash.com/photo-1611297834923-81c65a0c7d15?w=500&h=300&fit=crop', count: '65+ homestays' },
    { name: 'Cameron Highlands', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop', count: '45+ homestays' },
    { name: 'Johor Bahru', image: 'https://images.unsplash.com/photo-1580673913567-45b9e5a2bb30?w=500&h=300&fit=crop', count: '75+ homestays' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-white overflow-hidden">
        <div className="absolute inset-0 batik-overlay opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
              Discover Authentic
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                Malaysian Homestays
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Experience genuine Malaysian hospitality in carefully selected homestays across beautiful Malaysia
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} className="max-w-4xl mx-auto" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore Malaysia's most beloved destinations and find your perfect homestay
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => navigate('/browse', { state: { location: location.name } })}
              >
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold font-display mb-1">{location.name}</h3>
                  <p className="text-sm text-gray-200">{location.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
              Featured Homestays
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked homestays that offer the best Malaysian hospitality experience
            </p>
          </div>
          
          {loading ? (
            <Loading type="properties" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.Id} property={property} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button
              variant="primary"
              size="lg"
              icon="ArrowRight"
              onClick={() => navigate('/browse')}
            >
              View All Homestays
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose RumahKu */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
              Why Choose RumahKu?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find and book authentic Malaysian homestay experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ApperIcon name="Shield" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">Secure Payments</h3>
              <p className="text-gray-600 leading-relaxed">
                Pay safely with BayarCash, Malaysia's trusted payment gateway, with full buyer protection
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ApperIcon name="MessageCircle" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">WhatsApp Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Instant booking confirmations and 24/7 support through WhatsApp for your convenience
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ApperIcon name="Heart" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">Authentic Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay with local families and experience genuine Malaysian culture and hospitality
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section for Property Owners */}
      <section className="py-16 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
            Own a Property?
          </h2>
          <p className="text-xl text-secondary-100 mb-8 leading-relaxed">
            Join thousands of Malaysian hosts earning extra income by sharing their homes with travelers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              icon="Plus"
              onClick={() => navigate('/list-property')}
            >
              List Your Property
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon="Package"
              onClick={() => navigate('/plans')}
              className="border-white text-white hover:bg-white hover:text-secondary-700"
            >
              View Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;