import {NextRequest, NextResponse} from 'next/server'
import { updateSession } from './lib/supabase/middleware'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse)
{
    return await updateSession(request, response);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}