import React from "react";

type SelectProps = React.ComponentProps<"select">

export default function Select({...props }: SelectProps)
{
    return <select {...props} className="w-full rounded-md shadow-sm border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950"></select>
}