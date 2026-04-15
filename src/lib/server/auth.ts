import type { RequestEvent } from '@sveltejs/kit';
import { SESSION_COOKIE } from './config';

export interface SessionUser {
	id: string;
	email: string;
	nome: string;
	empresaId: string;
	empresaNome: string;
}

// In production, use Prisma to validate session
export async function getSession(event: RequestEvent): Promise<SessionUser | null> {
	const token = event.cookies.get(SESSION_COOKIE);

	if (!token) {
		return null;
	}

	// Mock session for demo - in production, query Prisma
	// const session = await prisma.sessao.findUnique({
	//   where: { token },
	//   include: { usuario: { include: { empresa: true } } }
	// });

	// Demo user for development
	if (token === 'demo-session-token') {
		return {
			id: 'demo-user-id',
			email: 'admin@dog.com.br',
			nome: 'Administrador',
			empresaId: 'demo-empresa-id',
			empresaNome: 'DOG Assessoria'
		};
	}

	return null;
}

export async function requireAuth(event: RequestEvent): Promise<SessionUser> {
	const user = await getSession(event);
	if (!user) {
		throw new Error('Unauthorized');
	}
	return user;
}
