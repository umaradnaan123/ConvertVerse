import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  borderRadius = '0.5rem'
}) => {
  return (
    <div
      className={`animate-pulse bg-slate-700/40 rounded-lg ${className}`}
      style={{
        width: width || undefined,
        height: height || undefined,
        borderRadius: borderRadius
      }}
      aria-hidden="true"
    />
  );
};
