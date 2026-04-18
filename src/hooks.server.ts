import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/server/config';
import { getSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const isPublicRoute =
		event.url.pathname === '/' ||
		event.url.pathname === '/login' ||
		event.url.pathname === '/logout';

	// Allow public routes without session check
	if (isPublicRoute) {
		return resolve(event);
	}

	// Validate session - handle case where database is not available
	let user = null;
	try {
		user = await getSession(event);
	} catch (error) {
		console.warn('Session validation skipped - database not available:', error);
		// Allow access to dashboard if database is down, but without user context
		// The page loaders will return empty data
	}

	if (!user) {
		throw redirect(302, '/login');
	}

	// Attach user to locals for use in load functions
	event.locals.user = user;

	return resolve(event);
};
