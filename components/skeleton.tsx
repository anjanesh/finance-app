import React from 'react';

// Using a type alias for the standard div props
type SkeletonProps = React.ComponentProps<"div">;

export default function Skeleton({ className = '', ...props }: SkeletonProps)
{
    return <div {...props} className={`animate-pulse w-full h-4 bg-gray-300 dark:bg-gray-700 rounded-md ${className}`}></div>
}