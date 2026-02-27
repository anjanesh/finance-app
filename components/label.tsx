import React from 'react';

// Extend React.ComponentProps<"label"> to get 'htmlFor', 'children', etc.
type LabelProps = React.ComponentProps<"label">

export default function Label({ className = '', ...props }: LabelProps)
{
    return <label {...props} className={`block text-gray-700 dark:text-gray-300 ${className}`}></label>
}