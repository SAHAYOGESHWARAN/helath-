import React from 'react';

const Spinner: React.FC = () => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="status"
    >
      <style>
        {`
          @keyframes pulse-cross {
            0%, 100% { transform: scale(0.95); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          @keyframes ripple {
            from {
              stroke-width: 2;
              r: 0;
              opacity: 1;
            }
            to {
              stroke-width: 0;
              r: 30;
              opacity: 0;
            }
          }
          .pulsing-cross {
            transform-origin: center;
            animation: pulse-cross 2s ease-in-out infinite;
          }
          .ripple-circle {
            transform-origin: center;
            animation: ripple 2s ease-out infinite;
          }
        `}
      </style>
      <g>
        {/* Ripple Effect */}
        <circle className="ripple-circle" cx="32" cy="32" fill="none" stroke="#3b82f6" />
        <circle className="ripple-circle" cx="32" cy="32" fill="none" stroke="#60a5fa" style={{ animationDelay: '1s' }} />

        {/* Health Cross */}
        <g className="pulsing-cross" fill="#3b82f6">
          <rect x="26" y="12" width="12" height="40" rx="2" />
          <rect x="12" y="26" width="40" height="12" rx="2" />
        </g>
      </g>
    </svg>
  );
};

export default Spinner;