import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/server/config';

export const actions: Actions = {
	default: async (event) => {
		event.cookies.delete(SESSION_COOKIE, { path: '/' });
		throw redirect(302, '/login');
	}
};
