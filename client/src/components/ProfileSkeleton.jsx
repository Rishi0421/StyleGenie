// src/components/ProfileSkeleton.jsx (Create this new file)
import React from 'react';

const ProfileSkeleton = () => {
  const SkeletonOrderCard = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-32"></div> {/* Order # */}
          <div className="h-4 bg-gray-300 rounded w-48"></div> {/* Date */}
        </div>
        <div className="text-right space-y-2">
           <div className="h-5 bg-gray-300 rounded w-20 ml-auto"></div> {/* Amount */}
           <div className="h-4 bg-gray-300 rounded w-16 ml-auto"></div> {/* Status Badge */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section Skeleton */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-300"></div> {/* Avatar Placeholder */}
                <div className="h-6 bg-gray-300 rounded w-3/4 mt-4"></div> {/* Name Placeholder */}
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-300 rounded mr-3"></div> {/* Icon */}
                  <div className="h-4 bg-gray-300 rounded flex-1"></div> {/* Email */}
                </div>
                <div className="flex items-center">
                   <div className="w-5 h-5 bg-gray-300 rounded mr-3"></div> {/* Icon */}
                   <div className="h-4 bg-gray-300 rounded flex-1"></div> {/* Phone */}
                </div>
                {/* Add placeholder for address if it were present */}
              </div>
            </div>
          </div>

          {/* Orders Section Skeleton */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex items-center mb-4">
                 <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div> {/* Icon */}
                 <div className="h-6 bg-gray-300 rounded w-1/3"></div> {/* Title */}
              </div>
              {/* Skeleton Order Cards */}
              <div className="space-y-4">
                <SkeletonOrderCard />
                <SkeletonOrderCard />
                <SkeletonOrderCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;