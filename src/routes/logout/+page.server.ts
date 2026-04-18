import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/server/config';
import { logout, clearSessionCookie } from '$lib/server/auth';

export const actions: Actions = {
	default: async (event) => {
		const token = event.cookies.get(SESSION_COOKIE);

		if (token) {
			await logout(token);
		}

		clearSessionCookie(event);
		throw redirect(302, '/login');
	}
};
