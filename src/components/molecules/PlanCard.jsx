import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const PlanCard = ({ plan, isPopular = false, currentPlan = false, onSelectPlan }) => {
  const getPlanIcon = () => {
    switch (plan.name.toLowerCase()) {
      case 'free': return 'Gift';
      case 'basic': return 'Zap';
      case 'pro': return 'Crown';
      default: return 'Package';
    }
  };

  const getPlanColor = () => {
    switch (plan.name.toLowerCase()) {
      case 'free': return 'from-gray-400 to-gray-600';
      case 'basic': return 'from-amber-400 to-yellow-600';
      case 'pro': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isPopular ? 'ring-2 ring-primary-500 scale-105' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge variant="primary" size="md">
            Most Popular
          </Badge>
        </div>
      )}
      
      {currentPlan && (
        <div className="absolute -top-4 right-4">
          <Badge variant="success" size="sm">
            Current Plan
          </Badge>
        </div>
      )}

      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getPlanColor()} text-white mb-4`}>
          <ApperIcon name={getPlanIcon()} size={32} />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">
          {plan.name}
        </h3>
        
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900 font-display">
            RM{plan.price}
          </span>
          <span className="text-gray-600 ml-1">
            {plan.price > 0 ? '/month' : 'forever'}
          </span>
        </div>
        
        <p className="text-gray-600 leading-relaxed">
          {plan.description}
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <ApperIcon name="Check" size={12} className="text-green-600" />
            </div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        variant={currentPlan ? "outline" : isPopular ? "primary" : "secondary"}
        size="lg"
        className="w-full"
        onClick={() => onSelectPlan(plan)}
        disabled={currentPlan}
      >
        {currentPlan ? 'Current Plan' : `Choose ${plan.name}`}
      </Button>
    </div>
  );
};

export default PlanCard;