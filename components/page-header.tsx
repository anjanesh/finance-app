import Link from "next/link";
import DarkModeToggle from './dark-mode-toggle'
import getServerDarkMode from '@/hooks/use-server-dark-mode'
import {Theme} from "@/hooks/use-dark-mode";

const PageHeader = async ({className}: {className: string}) =>
{
    const theme:Theme = await getServerDarkMode();

    return (
        <header className={`flex items-center justify-between w-full ${className}`}>
            <Link href="/dashboard" className={"text-xl hover:underline underline-offset-8 decoration-2"}>Finance Tracker</Link>
            <div className={"flex items-center space-x-4"}>
                <DarkModeToggle defaultMode={theme} />
                <div>User Dropdown</div>
            </div>
        </header>
    )
}

export default PageHeader;