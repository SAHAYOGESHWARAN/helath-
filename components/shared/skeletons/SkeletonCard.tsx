
import React from 'react';

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 ${className}`}>
            <div className="animate-pulse">
                <div className="h-6 w-2/5 rounded shimmer-bg mb-6"></div>
                <div className="space-y-3">
                    <div className="h-4 w-full rounded shimmer-bg"></div>
                    <div className="h-4 w-4/5 rounded shimmer-bg"></div>
                    <div className="h-4 w-3/5 rounded shimmer-bg"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
