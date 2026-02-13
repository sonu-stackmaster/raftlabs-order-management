import React from 'react';
import { OrderStatus } from '@/types';

interface StatusTrackerProps {
  currentStatus: OrderStatus;
}

const statusSteps: OrderStatus[] = [
  'Order Received',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

export const StatusTracker: React.FC<StatusTrackerProps> = ({ currentStatus }) => {
  const currentStepIndex = statusSteps.indexOf(currentStatus);

  const getStepClass = (index: number) => {
    if (index <= currentStepIndex) {
      return 'bg-green-500 text-white';
    }
    return 'bg-gray-200 text-gray-600';
  };

  const getConnectorClass = (index: number) => {
    if (index < currentStepIndex) {
      return 'bg-green-500';
    }
    return 'bg-gray-200';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        {statusSteps.map((status, index) => (
          <React.Fragment key={status}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${getStepClass(
                  index
                )}`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-xs text-center text-gray-600 max-w-20">
                {status}
              </span>
            </div>
            
            {index < statusSteps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors ${getConnectorClass(
                  index
                )}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-gray-800">
          Current Status: <span className="text-blue-600">{currentStatus}</span>
        </p>
      </div>
    </div>
  );
};