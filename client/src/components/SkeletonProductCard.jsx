// src/components/SkeletonProductCard.jsx
import React from 'react';

const SkeletonProductCard = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse">
      {/* Skeleton for Image */}
      <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>

      {/* Skeleton for Title */}
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

      {/* Skeleton for Price */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>

      {/* Skeleton for Button/Action */}
      <div className="h-8 bg-gray-300 rounded w-full"></div>
    </div>
  );
};



export default SkeletonProductCard;