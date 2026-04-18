import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { login, setSessionCookie } from '$lib/server/auth';

export const POST: RequestHandler = async (event) => {
	try {
		const { email, senha, rememberMe } = await event.request.json();

		if (!email || !senha) {
			return json({ success: false, error: 'Email e senha são obrigatórios' }, { status: 400 });
		}

		const result = await login(email, senha, rememberMe === true);

		if (!result.success) {
			return json(result, { status: 401 });
		}

		setSessionCookie(event, result.token, rememberMe === true);

		return json({
			success: true,
			user: result.user
		});
	} catch (error) {
		console.error('Login API error:', error);
		return json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
	}
};
