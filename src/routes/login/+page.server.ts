import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/server/config';
import { login, setSessionCookie, getSession } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	// Check if already logged in
	const user = await getSession(event);
	if (user) {
		throw redirect(302, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email') as string;
		const senha = formData.get('senha') as string;
		const rememberMe = formData.get('rememberMe') === 'on';

		if (!email || !senha) {
			return fail(400, { error: 'Email e senha são obrigatórios', email });
		}

		const result = await login(email, senha, rememberMe);

		if (!result.success) {
			return fail(401, { error: result.error, email });
		}

		setSessionCookie(event, result.token, rememberMe);

		throw redirect(302, '/dashboard');
	}
};
