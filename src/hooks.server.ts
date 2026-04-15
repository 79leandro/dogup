import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/server/config';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SESSION_COOKIE);
	const isLoginPage = event.url.pathname === '/login';
	const isPublicRoute = event.url.pathname === '/' || event.url.pathname.startsWith('/login') || event.url.pathname.startsWith('/logout');

	// Allow public routes
	if (isPublicRoute) {
		return resolve(event);
	}

	// Redirect to login if not authenticated
	if (!token) {
		throw redirect(302, '/login');
	}

	// In production, validate session against database
	// For demo, allow access with demo token
	if (token !== 'demo-session-token') {
		throw redirect(302, '/login');
	}

	return resolve(event);
};
