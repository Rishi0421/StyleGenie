// src/components/SkeletonProductDetail.jsx
import React from 'react';
import SkeletonProductCard from './SkeletonProductCard'; // Import the existing card skeleton

const SkeletonProductDetail = () => {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      {/* Main Product Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Left Column (Image Gallery) Skeleton */}
        <div>
          {/* Main Image Skeleton */}
          <div className="relative h-[500px] bg-gray-300 rounded-lg mb-4"></div>
          {/* Thumbnails Skeleton */}
          <div className="grid grid-cols-5 gap-2"> {/* Assuming 4 thumbs + 1 AR button space */}
            <div className="h-24 bg-gray-300 rounded-lg"></div>
            <div className="h-24 bg-gray-300 rounded-lg"></div>
            <div className="h-24 bg-gray-300 rounded-lg"></div>
            <div className="h-24 bg-gray-300 rounded-lg"></div>
            <div className="h-24 bg-gray-300 rounded-lg"></div> {/* Placeholder for AR button */}
          </div>
        </div>

        {/* Right Column (Details) Skeleton */}
        <div>
          {/* Title Skeleton */}
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-3"></div>
          {/* Price Skeleton */}
          <div className="h-10 bg-gray-300 rounded w-1/2 mb-6"></div>
          {/* Description Skeleton */}
          <div className="space-y-2 mb-8">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
          {/* Color Options Skeleton */}
          <div className="mb-6">
            <div className="h-5 bg-gray-300 rounded w-1/4 mb-3"></div>
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>
          {/* Size Options Skeleton */}
          <div className="mb-6">
            <div className="h-5 bg-gray-300 rounded w-1/4 mb-3"></div>
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-md bg-gray-300"></div>
              <div className="w-10 h-10 rounded-md bg-gray-300"></div>
              <div className="w-10 h-10 rounded-md bg-gray-300"></div>
            </div>
          </div>
          {/* Quantity Skeleton */}
          <div className="mb-8">
            <div className="h-5 bg-gray-300 rounded w-1/4 mb-3"></div>
            <div className="h-10 bg-gray-300 rounded w-1/3"></div>
          </div>
          {/* Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
            <div className="h-12 bg-gray-300 rounded-md flex-1"></div>
            <div className="h-12 bg-gray-300 rounded-md flex-1"></div>
          </div>
          {/* Features Skeleton */}
          <div>
            <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section Skeleton */}
      <div className="mb-16">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Use the SkeletonProductCard for related items */}
          <SkeletonProductCard />
          <SkeletonProductCard />
          <SkeletonProductCard />
          <SkeletonProductCard />
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductDetail;