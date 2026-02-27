import { cookies } from "next/headers";

export type Theme = 'light' | 'dark';

const getServerDarkMode = async (defaultTheme: Theme = 'dark'): Promise<Theme> =>
{
    // 1. Await the cookies() call
    const cookieStore = await cookies();

    // 2. Access the theme cookie
    const themeCookie = cookieStore.get('theme');

    // 3. Extract the value.
    // We check if themeCookie exists first using ?.value
    const themeValue = themeCookie?.value;

    // 4. Return as Theme type or fallback
    return (themeValue as Theme) ?? defaultTheme;
};

export default getServerDarkMode;