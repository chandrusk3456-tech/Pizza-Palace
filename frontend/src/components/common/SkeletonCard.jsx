import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-neutralLight-dark p-5 flex flex-col gap-4 animate-pulse">
      {/* Pizza Image Placeholder */}
      <div className="bg-neutral-200 aspect-[4/3] rounded-2xl w-full"></div>
      
      {/* Category badge */}
      <div className="bg-neutral-200 h-5 w-20 rounded-full"></div>
      
      {/* Pizza Name */}
      <div className="bg-neutral-200 h-7 w-3/4 rounded-md"></div>
      
      {/* Pizza Description */}
      <div className="flex flex-col gap-2">
        <div className="bg-neutral-200 h-4 w-full rounded-md"></div>
        <div className="bg-neutral-200 h-4 w-5/6 rounded-md"></div>
      </div>
      
      {/* Price and Add button */}
      <div className="flex justify-between items-center mt-2 pt-4 border-t border-neutralLight/60">
        <div className="bg-neutral-200 h-6 w-16 rounded-md"></div>
        <div className="bg-neutral-200 h-10 w-24 rounded-full"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
