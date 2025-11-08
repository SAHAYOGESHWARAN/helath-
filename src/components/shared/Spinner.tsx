import React from 'react';

// A basic spinner for fallback purposes. Most of the app uses the themed SpinnerIcon.
const Spinner: React.FC = () => {
    return (
        <div className="w-6 h-6 border-4 border-t-primary-500 border-gray-200 rounded-full animate-spin"></div>
    );
};

export default Spinner;