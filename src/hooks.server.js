import * as cookie from 'cookie';

export async function handle({ request, resolve }) {
	try {
		const cookies = cookie.parse(request.headers.cookie || '');
		const jwt = cookies.jwt && Buffer.from(cookies.jwt, 'base64').toString('utf-8');
		request.locals.user = jwt ? JSON.parse(jwt) : null;
		return await resolve(request);
	} catch (error) {
		console.error('Error in handle function:', error);
		// Re-throw to let handleError handle it
		throw error;
	}
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

/**
 * Handles errors that occur during server-side rendering or in the handle function
 * @param {Object} params - Error handling parameters
 * @param {Error} params.error - The error that occurred
 * @param {Object} params.event - The event object (request)
 * @returns {Object} Error information to display
 */
export function handleError({ error, event }) {
	// Ensure error is always defined
	if (!error) {
		error = new Error('Unknown error occurred');
	}
	
	console.error('Error occurred:', error);
	
	// Return error information that will be passed to __error.svelte
	return {
		message: error?.message || 'An error occurred',
		stack: error?.stack,
		status: error?.status || 500
	};
}

