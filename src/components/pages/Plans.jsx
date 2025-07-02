import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PlanCard from '@/components/molecules/PlanCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Plans = () => {
  const [currentPlan, setCurrentPlan] = useState('basic'); // Mock current plan
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started with your first homestay listing',
      features: [
        '1 property listing',
        'Basic WhatsApp notifications',
        'Standard listing visibility',
        'Basic booking management',
        'Community support'
      ]
    },
    {
      name: 'Basic',
      price: 29,
      description: 'Ideal for small homestay owners managing multiple properties',
      features: [
        'Up to 5 property listings',
        'Advanced WhatsApp automation',
        'Priority listing visibility',
        'Calendar management',
        'Basic analytics dashboard',
        'Email support',
        'Custom pricing rules'
      ]
    },
    {
      name: 'Pro',
      price: 79,
      description: 'Complete solution for serious homestay business operators',
      features: [
        'Unlimited property listings',
        'Full WhatsApp automation suite',
        'Premium listing placement',
        'Advanced analytics & insights',
        'Multi-calendar sync',
        'Priority customer support',
        'Custom branding options',
        'Revenue optimization tools',
        'API access'
      ]
    }
  ];

  const handlePlanSelect = async (plan) => {
    if (plan.name.toLowerCase() === currentPlan) {
      toast.info('You are already on this plan');
      return;
    }

    setLoading(true);

    try {
      // Simulate plan upgrade/downgrade
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentPlan(plan.name.toLowerCase());
      
      if (plan.price === 0) {
        toast.success('Successfully downgraded to Free plan');
      } else {
        toast.success(`Successfully upgraded to ${plan.name} plan!`);
        toast.info('BayarCash payment processed successfully');
      }
      
    } catch (error) {
      toast.error('Failed to update plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Scale your homestay business with our flexible pricing plans designed for Malaysian property owners
            </p>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              isPopular={index === 1}
              currentPlan={plan.name.toLowerCase() === currentPlan}
              onSelectPlan={handlePlanSelect}
            />
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 text-center font-display">
              Detailed Feature Comparison
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Basic</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: 'Property Listings', free: '1', basic: '5', pro: 'Unlimited' },
                  { feature: 'WhatsApp Notifications', free: 'Basic', basic: 'Advanced', pro: 'Full Suite' },
                  { feature: 'Booking Management', free: '✓', basic: '✓', pro: '✓' },
                  { feature: 'Calendar Sync', free: '✗', basic: 'Basic', pro: 'Multi-platform' },
                  { feature: 'Analytics Dashboard', free: '✗', basic: 'Basic', pro: 'Advanced' },
                  { feature: 'Priority Support', free: '✗', basic: 'Email', pro: 'Phone & Email' },
                  { feature: 'Custom Branding', free: '✗', basic: '✗', pro: '✓' },
                  { feature: 'API Access', free: '✗', basic: '✗', pro: '✓' },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.free}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.basic}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">
              Secure Payment Options
            </h2>
            <p className="text-gray-600">
              All payments are processed securely through BayarCash, Malaysia's trusted payment gateway
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CreditCard" size={32} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Online Banking</h3>
              <p className="text-gray-600 text-sm">All major Malaysian banks supported</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Smartphone" size={32} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">E-Wallet</h3>
              <p className="text-gray-600 text-sm">Touch 'n Go, GrabPay, Boost & more</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Shield" size={32} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Protected</h3>
              <p className="text-gray-600 text-sm">256-bit SSL encryption & fraud protection</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center font-display">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h3>
                <p className="text-gray-600 text-sm">
                  No setup fees! You only pay the monthly subscription fee for your chosen plan.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What happens if I exceed my property limit?</h3>
                <p className="text-gray-600 text-sm">
                  You'll be prompted to upgrade to a higher plan to add more properties.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600 text-sm">
                  We offer a 30-day money-back guarantee for all paid plans if you're not satisfied.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is WhatsApp automation included?</h3>
                <p className="text-gray-600 text-sm">
                  Basic notifications are included in Free plan. Advanced automation requires Basic or Pro plans.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How does billing work?</h3>
                <p className="text-gray-600 text-sm">
                  Monthly billing through BayarCash. You can cancel anytime without penalties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 font-display">
            Ready to Start Your Homestay Business?
          </h2>
          <p className="text-xl text-secondary-100 mb-8">
            Join thousands of Malaysian hosts already earning with RumahKu
          </p>
          <Button
            variant="accent"
            size="lg"
            icon="ArrowRight"
            loading={loading}
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Plans;