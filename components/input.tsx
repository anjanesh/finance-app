import React from 'react';
import { forwardRef } from "react";

// Define the component props by extending the standard input attributes
type InputProps = React.ComponentProps<"input">;

export default forwardRef<HTMLInputElement, InputProps>(function Input({ className = '', ...props}: InputProps, ref) {
    const styles = {
        // Add 'accent-gray-700' (or any color) to show the checkmark fill
        'checkbox': 'h-4 w-4 rounded border-gray-300 accent-gray-700 dark:accent-gray-500 disabled:opacity-7',
        'default': 'w-full rounded-md shadow-sm border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950 disabled:opacity-7'
    }

    // Using a type guard to ensure we access the style map safely
    const typeKey = props.type === 'checkbox' ? 'checkbox' : 'default';

    return (
        <input
            ref={ref}
            {...props}
            className={`${styles[typeKey]} ${className}`}
        />
    );
});