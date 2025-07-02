import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ type = 'properties', onAction, actionText, title, description }) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'properties':
        return {
          icon: 'Home',
          title: title || 'No Properties Found',
          description: description || 'Start your homestay journey by listing your first property or explore available stays.',
          actionText: actionText || 'List Your Property',
          actionIcon: 'Plus',
        };
      case 'bookings':
        return {
          icon: 'Calendar',
          title: title || 'No Bookings Yet',
          description: description || 'Your booking history will appear here once you start making reservations.',
          actionText: actionText || 'Browse Homestays',
          actionIcon: 'Search',
        };
      case 'search':
        return {
          icon: 'MapPin',
          title: title || 'No Properties in This Area',
          description: description || 'Try expanding your search area or adjusting your filters to find more options.',
          actionText: actionText || 'Clear Filters',
          actionIcon: 'Filter',
        };
      default:
        return {
          icon: 'Smile',
          title: title || 'Nothing Here Yet',
          description: description || 'Get started by taking an action.',
          actionText: actionText || 'Get Started',
          actionIcon: 'ArrowRight',
        };
    }
  };

  const { icon, title: emptyTitle, description: emptyDescription, actionText: emptyActionText, actionIcon } = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 batik-overlay">
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-full p-8 mb-6">
        <ApperIcon 
          name={icon} 
          size={64} 
          className="text-primary-500" 
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center font-display">
        {emptyTitle}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
        {emptyDescription}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary flex items-center gap-2"
        >
          <ApperIcon name={actionIcon} size={18} />
          {emptyActionText}
        </button>
      )}
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-secondary-200 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-accent-200 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-primary-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default Empty;