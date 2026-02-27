import { useState } from 'react'
import { useCookies } from 'react-cookie'

// 1. Define a type for the allowed themes
export type Theme = 'light' | 'dark';

const useDarkMode = (defaultTheme: Theme = 'dark') =>
{
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    // useCookies usually returns [cookies, setCookie, removeCookie]
    const [_, setCookie] = useCookies(['theme']);

    const setAndSaveTheme = (theme: Theme) =>
    {
        setTheme(theme)
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        setCookie('theme', theme);
    }

    const toggleTheme = () => {
        setAndSaveTheme(theme === 'dark' ? 'light' : 'dark');
    }

    return { theme, toggleTheme }
}

export default useDarkMode