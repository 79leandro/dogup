import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logout, clearSessionCookie, getSession } from '$lib/server/auth';
import { SESSION_COOKIE } from '$lib/server/config';

export const POST: RequestHandler = async (event) => {
	try {
		const token = event.cookies.get(SESSION_COOKIE);

		if (token) {
			await logout(token);
		}

		clearSessionCookie(event);

		return json({ success: true });
	} catch (error) {
		console.error('Logout API error:', error);
		// Clear cookie even on error
		clearSessionCookie(event);
		return json({ success: true });
	}
};
