import * as cookie from 'cookie';

export async function handle({ event, resolve }) {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    let user = null;

    if (cookies.jwt) {
        try {
            user = JSON.parse(Buffer.from(cookies.jwt, 'base64').toString('utf-8'));
        } catch (err) {
            console.warn('Invalid JWT cookie, ignoring:', err.message);
        }
    }

    event.locals.user = user;
    return resolve(event);
}

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

// Only export handleError safely
export function handleError({ error }) {
    // Ensure error object exists
    error = error || new Error('Unknown error');

    console.error('Global error:', error.message);
    return {
        message: error.message || 'An unexpected error occurred',
        status: error.status || 500,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
}
