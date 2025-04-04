import React from 'react';
import { X } from 'lucide-react'; // Import close icon

const FeedbackPopup = ({
  isOpen,
  onClose,
  suggestedSize,
  feedback,
  error,
  onSelectSize, // Function to call when user selects the suggested size
}) => {
  if (!isOpen) {
    return null; // Don't render anything if the popup is not open
  }

  // Handle clicking the overlay to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle selecting the size
  const handleSelectClick = () => {
    if (suggestedSize) {
      onSelectSize(suggestedSize); // Pass the size back
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={handleOverlayClick} // Close on overlay click
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-popup-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative transform transition-all duration-300 scale-100 opacity-100 animate__animated animate__fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-indigo-600 transition duration-300"
          aria-label="Close feedback popup"
        >
          <X size={24} />
        </button>

        <h2
          id="feedback-popup-title"
          className="text-2xl font-semibold mb-6 text-center text-gray-800 tracking-wide"
        >
          Fit Analysis Results
        </h2>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-md">
            <p className="font-semibold">Oops! Something went wrong.</p>
            <p>{error}</p>
          </div>
        )}

        {/* Size Suggestion */}
        {!error && suggestedSize && (
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-md">
            <p className="text-gray-700 mb-2 text-lg">Suggested Size:</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl font-bold text-indigo-700">{suggestedSize}</span>
              <button
                onClick={handleSelectClick}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                Select this size
              </button>
            </div>
          </div>
        )}

        {/* Appearance Feedback */}
        {!error && feedback && (
          <div className="text-center border-t pt-6 mt-6">
            <p className="text-lg text-gray-700">"{feedback}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPopup;
