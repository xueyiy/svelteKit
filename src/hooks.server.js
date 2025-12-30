import * as cookie from 'cookie';

/** 
 * Handle incoming requests: parse cookies, set user in locals 
 */
export async function handle({ event, resolve }) {
    try {
        // Parse cookies from the request
        const cookies = cookie.parse(event.request.headers.get('cookie') || '');
        
        // Decode JWT from base64 if it exists
        const jwt = cookies.jwt ? Buffer.from(cookies.jwt, 'base64').toString('utf-8') : null;
        
        // Set user info in locals
        event.locals.user = jwt ? JSON.parse(jwt) : null;

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
 * Note: getSession is used in older SvelteKit versions. 
 * In newer versions, access locals in +page.server.js or load functions.
 */
export function getSession({ locals }) {
    return {
        user: locals.user && {
            username: locals.user.username,
            email: locals.user.email,
            image: locals.user.image,
            bio: locals.user.bio
        }
    };
}

/**
 * Global error handler
 */
export function handleError({ error, event }) {
    console.error('Error occurred:', error);

    // Return minimal info in production
    return {
        message: error?.message || 'An unexpected error occurred',
        status: error?.status || 500,
        // Only include stack in development
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    };
}
