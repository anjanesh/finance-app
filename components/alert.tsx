import {ReactNode} from "react";

export default function Alert({title, icon, children}: {title: ReactNode, icon: ReactNode, children: ReactNode}) {
    return <div className="p-2 rounded-md border border-gray-200 dark:border-gray-800 flex space-x-2">
        <div className="flex-shrink-0">{icon}</div>
        <div className="space-y-1">
            <h5>{title}</h5>
            <div className="text-sm">{children}</div>
        </div>
    </div>
}