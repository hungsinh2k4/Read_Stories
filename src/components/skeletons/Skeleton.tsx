import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

/**
 * Base Skeleton component - tái sử dụng cho mọi loading state
 * Sử dụng className để tùy chỉnh size, shape
 * 
 * @example
 * <Skeleton className="h-4 w-32" /> // text line
 * <Skeleton className="h-12 w-12 rounded-full" /> // avatar
 * <Skeleton className="h-48 w-full rounded-lg" /> // card image
 */
const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
    return (
        <div
            className={`animate-pulse bg-gray-700 rounded ${className}`}
            {...props}
        />
    );
};

export default Skeleton;
