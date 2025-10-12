
import React from 'react';

const UniqueLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4" aria-label="Loading..." role="status">
        <svg
            width="200"
            height="100"
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>
                {`
                .ekg-line {
                    stroke-dasharray: 400;
                    stroke-dashoffset: 400;
                    animation: draw-line 2.5s ease-in-out infinite;
                }
                .ekg-heartbeat {
                    animation: pulse-heart 2.5s ease-in-out infinite;
                    transform-origin: 100px 50px;
                }
                @keyframes draw-line {
                    0% {
                        stroke-dashoffset: 400;
                    }
                    30% {
                        stroke-dashoffset: 0;
                    }
                    70% {
                        stroke-dashoffset: 0;
                    }
                    100% {
                        stroke-dashoffset: -400;
                    }
                }
                @keyframes pulse-heart {
                    30%, 40% {
                        transform: scale(1.1);
                        filter: drop-shadow(0 0 3px #60a5fa);
                    }
                    35% {
                        transform: scale(1.15);
                        filter: drop-shadow(0 0 5px #3b82f6);
                    }
                    0%, 25%, 45%, 100% {
                        transform: scale(1);
                        filter: none;
                    }
                }
                `}
            </style>
            <path
                className="ekg-line"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M0 50 H 80 L 90 30 L 100 70 L 110 50 H 200"
            />
            <path
                className="ekg-heartbeat"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M80 50 L 90 30 L 100 70 L 110 50"
            />
        </svg>
        <p className="text-lg font-semibold text-primary-600 animate-pulse">Analyzing Vitals...</p>
    </div>
  );
};

export default UniqueLoader;
