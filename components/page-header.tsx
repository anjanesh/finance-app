import Link from "next/link";
import DarkModeToggle from './dark-mode-toggle'
import getServerDarkMode from '@/hooks/use-server-dark-mode'
import {Theme} from "@/hooks/use-dark-mode";
import { createClient } from '@/lib/supabase/server';
import { KeyRound } from 'lucide-react';
import Avatar from "./avatar";
import { sizes, variants } from '@/lib/variants';
import SignOutButton from './sign-out-button';

const PageHeader = async ({className}: {className: string}) =>
{
    const theme:Theme = await getServerDarkMode();
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log(user);

    return (
        <header className={`flex items-center justify-between w-full ${className}`}>
            <Link href="/dashboard" className={"text-xl hover:underline underline-offset-8 decoration-2"}>Finance Tracker</Link>
            <div className={"flex items-center space-x-4"}>
                <DarkModeToggle defaultMode={theme} />
                {user && <Link href="/dashboard/settings" className={`flex items-center space-x-1 ${variants['ghost']} ${sizes['sm']}`}>
                    <Avatar />
                    <span>{user?.user_metadata?.fullName ?? user?.email}</span>
                </Link>}
                {user && <SignOutButton />}
                {!user && <Link href="/login" className={`${variants['ghost']} ${sizes['sm']}`}>
                    <KeyRound className="w-6 h-6" />
                </Link>}
            </div>
        </header>
    )
}

export default PageHeader;