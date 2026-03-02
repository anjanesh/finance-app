'use client';

import useDarkMode, { Theme } from '@/hooks/use-dark-mode';
import Button from './button';
import {Moon, Sun} from 'lucide-react';

// 1. Define the props interface using the Theme type
interface DarkModeToggleProps {
    defaultMode?: Theme;
}

export default function DarkModeToggle({defaultMode = 'dark'}: DarkModeToggleProps)
{
    const {theme, toggleTheme} = useDarkMode(defaultMode);
    return <Button variant="ghost" size="sm" onClick={toggleTheme}>
        {theme === 'light' && <Moon className="w-6 h-6" />}
        {theme === 'dark' && <Sun className="w-6 h-6" />}
    </Button>
}