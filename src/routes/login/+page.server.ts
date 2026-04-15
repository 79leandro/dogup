import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { SESSION_COOKIE, SESSION_MAX_AGE } from '$lib/server/config';

export const load: PageServerLoad = async (event) => {
	// Check if already logged in
	const token = event.cookies.get(SESSION_COOKIE);
	if (token) {
		throw redirect(302, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email') as string;
		const senha = formData.get('senha') as string;

		if (!email || !senha) {
			return fail(400, { error: 'Email e senha são obrigatórios', email });
		}

		// Demo authentication - in production, validate against Prisma
		if (email === 'admin@gob.com.br' && senha === 'admin123') {
			// Create session token
			const token = 'demo-session-token';

			// Set cookie
			event.cookies.set(SESSION_COOKIE, token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: SESSION_MAX_AGE
			});

			throw redirect(302, '/dashboard');
		}

		return fail(401, { error: 'Credenciais inválidas', email });
	}
};
