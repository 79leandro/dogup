import type { RequestEvent } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { getPrisma } from './prisma';
import { SESSION_COOKIE, SESSION_MAX_AGE } from './config';

export interface SessionUser {
	id: string;
	email: string;
	nome: string;
	empresaId: string;
	empresaNome: string;
	empresaSlug: string;
}

export async function getSession(event: RequestEvent): Promise<SessionUser | null> {
	const token = event.cookies.get(SESSION_COOKIE);

	if (!token) {
		return null;
	}

	try {
		const prisma = getPrisma();
		const session = await prisma.sessao.findUnique({
			where: { token },
			include: {
				usuario: {
					include: { empresa: true }
				}
			}
		});

		if (!session) {
			return null;
		}

		// Check if session expired
		if (session.expiresAt < new Date()) {
			// Delete expired session
			await prisma.sessao.delete({ where: { id: session.id } });
			return null;
		}

		return {
			id: session.usuario.id,
			email: session.usuario.email,
			nome: session.usuario.nome,
			empresaId: session.usuario.empresaId,
			empresaNome: session.usuario.empresa.nome,
			empresaSlug: session.usuario.empresa.slug
		};
	} catch (error) {
		console.error('Session validation error:', error);
		return null;
	}
}

export async function requireAuth(event: RequestEvent): Promise<SessionUser> {
	const user = await getSession(event);
	if (!user) {
		throw new Error('Unauthorized');
	}
	return user;
}

export async function login(
	email: string,
	senha: string,
	rememberMe: boolean = false
): Promise<{ success: true; user: SessionUser; token: string } | { success: false; error: string }> {
	try {
		const prisma = getPrisma();
		const user = await prisma.usuario.findUnique({
			where: { email },
			include: { empresa: true }
		});

		if (!user) {
			return { success: false, error: 'Credenciais inválidas' };
		}

		const validPassword = await bcrypt.compare(senha, user.senha);

		if (!validPassword) {
			return { success: false, error: 'Credenciais inválidas' };
		}

		// Generate session token
		const token = crypto.randomUUID();
		const expiresAt = new Date();

		if (rememberMe) {
			// 30 days for "remember me"
			expiresAt.setDate(expiresAt.getDate() + 30);
		} else {
			// 7 days default
			expiresAt.setDate(expiresAt.getDate() + 7);
		}

		// Create session in database
		await prisma.sessao.create({
			data: {
				token,
				usuarioId: user.id,
				expiresAt
			}
		});

		return {
			success: true,
			token,
			user: {
				id: user.id,
				email: user.email,
				nome: user.nome,
				empresaId: user.empresaId,
				empresaNome: user.empresa.nome,
				empresaSlug: user.empresa.slug
			}
		};
	} catch (error) {
		console.error('Login error:', error);
		return { success: false, error: 'Erro ao realizar login' };
	}
}

export async function logout(token: string): Promise<void> {
	try {
		const prisma = getPrisma();
		await prisma.sessao.delete({ where: { token } });
	} catch (error) {
		// Session may not exist, that's okay
	}
}

export function setSessionCookie(event: RequestEvent, token: string, rememberMe: boolean = false): void {
	const maxAge = rememberMe ? 60 * 60 * 24 * 30 : SESSION_MAX_AGE;

	event.cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge
	});
}

export function clearSessionCookie(event: RequestEvent): void {
	event.cookies.delete(SESSION_COOKIE, { path: '/' });
}
