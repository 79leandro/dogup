import type { PageServerLoad } from './$types';
import { getSession } from '$lib/server/auth';
import { getPrisma } from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
	const user = await getSession(event);

	if (!user) {
		return { mensagens: [], stats: { total: 0, relevantes: 0 } };
	}

	const empresaId = user.empresaId;

	let mensagens: any[] = [];
	let stats = { total: 0, relevantes: 0 };

	try {
		const prisma = getPrisma();
		mensagens = await prisma.mensagem.findMany({
			where: {
				cliente: { empresaId }
			},
			include: {
				cliente: {
					select: {
						id: true,
						cnpj: true,
						nomeRazao: true
					}
				}
			},
			orderBy: { data: 'desc' },
			take: 50
		});

		stats = {
			total: mensagens.length,
			relevantes: mensagens.filter(m => m.relevancia === 'RELEVANTE' && !m.lida).length
		};
	} catch (error) {
		console.warn('Error fetching mensagens:', error);
	}

	return { mensagens, stats };
};
