// src/components/SkeletonProductCard.jsx
import React from 'react';

const SkeletonCategory = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse w-full">
      {/* Skeleton for Image */}
      <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
      {/* Skeleton for Title */}
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
      {/* Skeleton for Price */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      {/* Skeleton for Button/Action */}
      <div className="h-9 bg-gray-300 rounded w-full"></div>
    </div>
  );
};

export default SkeletonCategory;