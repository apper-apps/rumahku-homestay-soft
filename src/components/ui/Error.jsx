import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message = "Something went wrong", onRetry, type = 'general' }) => {
  const getErrorContent = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'Wifi',
          title: 'Connection Problem',
          description: 'Please check your internet connection and try again.',
        };
      case 'notfound':
        return {
          icon: 'Search',
          title: 'No Results Found',
          description: 'We couldn\'t find what you\'re looking for. Try adjusting your search.',
        };
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Oops! Something went wrong',
          description: message,
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full p-6 mb-6">
        <ApperIcon 
          name={icon} 
          size={48} 
          className="text-red-500" 
        />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center font-display">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {description}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;