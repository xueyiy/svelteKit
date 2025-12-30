import * as cookie from 'cookie';

/** 
 * Handle incoming requests: parse cookies, set user in locals 
 */
export async function handle({ event, resolve }) {
    try {
        // Parse cookies from the request
        const cookies = cookie.parse(event.request.headers.get('cookie') || '');
        
        // Decode JWT from base64 if it exists, safely
        let jwt = null;
        if (cookies.jwt) {
            try {
                const decoded = Buffer.from(cookies.jwt, 'base64').toString('utf-8');
                jwt = JSON.parse(decoded);
            } catch (err) {
                console.warn('Invalid JWT cookie, ignoring:', err.message);
                jwt = null;
            }
        }

        // Set user info in locals
        event.locals.user = jwt || null;

        // Proceed with request
        return await resolve(event);
    } catch (error) {
        console.error('Error in handle function:', error);
        // Re-throw so handleError can process it
        throw error;
    }
}

/**
 * Provide session info to the client
 * For SvelteKit <1.0, getSession is used; newer versions can access locals directly
 */
export function getSession({ locals }) {
    const user = locals.user;
    return {
        user: user
            ? {
                  username: user.username,
                  email: user.email,
                  image: user.image,
                  bio: user.bio
              }
            : null
    };
}

/**
 * Global error handler
 */
export function handleError({ error, event }) {
    // Ensure error is always an object
    if (!error) {
        error = new Error('Unknown error');
    }

    console.error('Error occurred during request:', {
        message: error.message,
        status: error.status,
        stack: error.stack
    });

    return {
        message: error.message || 'An unexpected error occurred',
        status: error.status || 500,
        // Only include stack in development
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
}
