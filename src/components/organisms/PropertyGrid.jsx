import React from 'react';
import PropertyCard from '@/components/molecules/PropertyCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  onRetry, 
  onAddProperty,
  emptyTitle,
  emptyDescription 
}) => {
  if (loading) {
    return <Loading type="properties" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry}
        type="general"
      />
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Empty 
        type="properties"
        title={emptyTitle}
        description={emptyDescription}
        onAction={onAddProperty}
        actionText="List Your Property"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard 
          key={property.Id} 
          property={property} 
        />
      ))}
    </div>
  );
};

export default PropertyGrid;