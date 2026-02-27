'use client'

import { CookiesProvider } from 'react-cookie';
// Define the interface for the props
interface Props {
    children: React.ReactNode;
}

export default function CookiesProviderClient({ children }: Props)
{
    return <CookiesProvider>{children}</CookiesProvider>;
}