import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse">
      <div className="aspect-[3/4] w-full bg-zinc-900 rounded-xl border border-zinc-800/60" />
      <div className="flex flex-col gap-2 px-1">
        <div className="h-2.5 w-16 bg-zinc-800 rounded" />
        <div className="flex justify-between items-center">
          <div className="h-4.5 w-32 bg-zinc-800 rounded" />
          <div className="h-4 w-12 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 animate-pulse">
      {/* Gallery Frame */}
      <div className="aspect-[4/5] w-full bg-zinc-900 rounded-2xl border border-zinc-800/60" />
      
      {/* Spec details */}
      <div className="flex flex-col gap-6 pt-4">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-zinc-800 rounded" />
          <div className="h-10 w-3/4 bg-zinc-800 rounded mt-1" />
        </div>
        <div className="h-6 w-20 bg-zinc-800 rounded" />
        
        <div className="h-0.5 w-full bg-zinc-900 my-2" />
        
        <div className="flex flex-col gap-3">
          <div className="h-4 w-full bg-zinc-800 rounded" />
          <div className="h-4 w-5/6 bg-zinc-800 rounded" />
          <div className="h-4 w-2/3 bg-zinc-800 rounded" />
        </div>
        
        <div className="h-12 w-48 bg-zinc-800 rounded-full mt-6" />
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-16 bg-zinc-200/40 rounded" />
        <div className="h-8 w-64 bg-zinc-200/40 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-zinc-200/40 border border-zinc-300 rounded-2xl" />
        <div className="h-32 bg-zinc-200/40 border border-zinc-300 rounded-2xl" />
        <div className="h-32 bg-zinc-200/40 border border-zinc-300 rounded-2xl" />
      </div>
      <div className="h-64 bg-zinc-200/40 border border-zinc-300 rounded-2xl" />
    </div>
  );
};
