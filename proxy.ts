import { NextRequest } from 'next/server';
import { NextResponse} from 'next/server';
import { updateSession } from './lib/supabase/middleware'
import {createClient} from "./lib/supabase/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest)
{
    const supabase = await createClient();
    const { data: { user }} = await supabase.auth.getUser();

    if (request.nextUrl.pathname.startsWith('/about'))
    {
        return NextResponse.rewrite(new URL('/about-2', request.url)); // Just as an example of proxy middleware
    }

    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        return Response.redirect(new URL('/login', request.url))
    }

    if (user && request.nextUrl.pathname.startsWith('/login')) {
        return Response.redirect(new URL('/dashboard', request.url))
    }

    return await updateSession(request);
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