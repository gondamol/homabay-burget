import React from 'react';
import { CheckCircleIcon } from './icons';

interface AIConciergeModalProps {
  response: string;
  onClose: () => void;
}

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({ response, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 sm:p-8 text-center transform transition-all scale-100 opacity-100">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4"/>
        <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
        <p className="text-gray-600 mt-4 text-left">
          {response}
        </p>
        <button
          onClick={onClose}
          className="mt-8 w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          View Dashboard & Track Priorities
        </button>
      </div>
    </div>
  );
};
