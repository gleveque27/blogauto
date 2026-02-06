import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    // HTTP Basic Auth
    const basicAuth = request.headers.get('authorization')

    // Credentials
    const validUsername = process.env.BASIC_AUTH_USER || 'admin'
    const validPassword = process.env.BASIC_AUTH_PASSWORD || 'password123'

    let isAuthenticated = false

    if (basicAuth) {
        try {
            const authValue = basicAuth.split(' ')[1]
            if (authValue) {
                const [username, password] = Buffer.from(authValue, 'base64').toString().split(':')
                
                if (username === validUsername && password === validPassword) {
                    isAuthenticated = true
                }
            }
        } catch (error) {
            // Erreur de décodage
            console.error('Auth decode error:', error)
        }
    }

    if (!isAuthenticated) {
        // Authentification requise
        return new NextResponse('Authentication required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area", charset="UTF-8"',
            },
        })
    }

    // Authentification réussie, continuer avec Supabase
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
