import React from 'react';

const SkeletonChatBubble: React.FC = () => {
  return (
    <div className="flex items-start gap-3 justify-start animate-pulse">
      <div className="w-8 h-8 rounded-full shimmer-bg flex-shrink-0"></div>
      <div className="flex-1 space-y-2 p-3 rounded-lg bg-gray-100 max-w-md">
        <div className="h-4 w-4/5 rounded shimmer-bg"></div>
        <div className="h-4 w-full rounded shimmer-bg"></div>
        <div className="h-4 w-2/3 rounded shimmer-bg"></div>
      </div>
    </div>
  );
};

export default SkeletonChatBubble;