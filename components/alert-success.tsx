import Alert from '@/components/alert';
import { Check } from 'lucide-react';
import {ReactNode} from "react";

export default function AlertSuccess({ children }: { children: ReactNode })
{
    return <Alert icon={<Check className="text-green-700 dark:text-green-300 w-6 h-6" />} title={<span className="text-green-700 dark:text-green-300">Success</span>}><span className="text-green-700 dark:text-green-300">{children}</span></Alert>
}