import React from 'react';
import { OrderStatus } from '@/types';

interface StatusTrackerProps {
  currentStatus: OrderStatus;
}

const statusSteps = [
  { 
    status: 'Order Received' as OrderStatus, 
    icon: '📝', 
    description: 'Order confirmed and received',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    status: 'Preparing' as OrderStatus, 
    icon: '👨‍🍳', 
    description: 'Chef is preparing your meal',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    status: 'Out for Delivery' as OrderStatus, 
    icon: '🚚', 
    description: 'On the way to your location',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    status: 'Delivered' as OrderStatus, 
    icon: '✨', 
    description: 'Enjoy your delicious meal!',
    color: 'from-green-500 to-green-600'
  },
];

export const StatusTracker: React.FC<StatusTrackerProps> = ({ currentStatus }) => {
  const currentStepIndex = statusSteps.findIndex(step => step.status === currentStatus);

  const getStepClass = (index: number) => {
    if (index <= currentStepIndex) {
      return `bg-gradient-to-r ${statusSteps[index].color} text-white shadow-lg transform scale-110`;
    }
    return 'bg-gray-200 text-gray-500';
  };

  const getConnectorClass = (index: number) => {
    if (index < currentStepIndex) {
      return 'bg-gradient-to-r from-green-400 to-green-600';
    } else if (index === currentStepIndex) {
      return 'bg-gradient-to-r from-green-400 to-gray-300';
    }
    return 'bg-gray-200';
  };

  const isStepActive = (index: number) => index === currentStepIndex;
  const isStepCompleted = (index: number) => index < currentStepIndex;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Mobile View */}
      <div className="block md:hidden space-y-4">
        {statusSteps.map((step, index) => (
          <div
            key={step.status}
            className={`
              flex items-center p-4 rounded-xl transition-all duration-500 transform
              ${isStepCompleted(index) ? 'bg-green-50 border-2 border-green-200' : 
                isStepActive(index) ? 'bg-blue-50 border-2 border-blue-200 scale-105' : 
                'bg-gray-50 border-2 border-gray-200'}
            `}
          >
            <div
              className={`
                w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500
                ${getStepClass(index)}
                ${isStepActive(index) ? 'pulse-glow animate-pulse' : ''}
              `}
            >
              {isStepCompleted(index) ? '✅' : step.icon}
            </div>
            <div className="ml-4 flex-1">
              <h3 className={`font-bold text-lg ${isStepActive(index) ? 'text-blue-600' : isStepCompleted(index) ? 'text-green-600' : 'text-gray-600'}`}>
                {step.status}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>
            </div>
            {isStepActive(index) && (
              <div className="ml-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          {statusSteps.map((step, index) => (
            <React.Fragment key={step.status}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold transition-all duration-500 transform
                    ${getStepClass(index)}
                    ${isStepActive(index) ? 'pulse-glow animate-bounce' : ''}
                  `}
                >
                  {isStepCompleted(index) ? '✅' : step.icon}
                </div>
                <div className="mt-4 text-center max-w-32">
                  <h3 className={`font-bold text-sm ${isStepActive(index) ? 'text-blue-600' : isStepCompleted(index) ? 'text-green-600' : 'text-gray-600'}`}>
                    {step.status}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">
                    {step.description}
                  </p>
                </div>
                
                {/* Active step indicator */}
                {isStepActive(index) && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="animate-ping w-4 h-4 bg-blue-400 rounded-full"></div>
                  </div>
                )}
              </div>
              
              {index < statusSteps.length - 1 && (
                <div className="flex-1 relative mx-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`
                        h-full transition-all duration-1000 ease-out rounded-full
                        ${getConnectorClass(index)}
                        ${index < currentStepIndex ? 'w-full' : 
                          index === currentStepIndex ? 'w-1/2 animate-pulse' : 'w-0'}
                      `}
                    />
                  </div>
                  
                  {/* Animated dots for active connection */}
                  {index === currentStepIndex && (
                    <div className="absolute top-0 left-0 w-full h-2 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping ml-2" style={{ animationDelay: '0.5s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping ml-2" style={{ animationDelay: '1s' }}></div>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Current status display */}
        <div className="mt-12 text-center">
          <div className="glass-card p-6 max-w-md mx-auto">
            <div className="text-4xl mb-3">
              {statusSteps[Math.max(0, currentStepIndex)]?.icon || '📦'}
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-2">
              {currentStatus}
            </h3>
            <p className="text-gray-600">
              {statusSteps[Math.max(0, currentStepIndex)]?.description || 'Processing your order...'}
            </p>
            
            {/* Estimated time */}
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>⏱️</span>
              <span>
                {currentStepIndex === 0 && 'Estimated: 5-10 minutes'}
                {currentStepIndex === 1 && 'Estimated: 15-25 minutes'}
                {currentStepIndex === 2 && 'Estimated: 10-20 minutes'}
                {currentStepIndex === 3 && 'Order completed!'}
                {currentStepIndex === -1 && 'Processing...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};