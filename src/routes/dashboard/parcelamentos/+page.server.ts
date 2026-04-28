import type { PageServerLoad } from './$types';
import { getSession } from '$lib/server/auth';
import { getPrisma } from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
	const user = await getSession(event);

	if (!user) {
		return {
			summary: [],
			parcelamentos: []
		};
	}

	const contadorId = user.contadorId;

	let parcelamentos: any[] = [];
	let summary: any[] = [];

	try {
		const prisma = getPrisma();
		parcelamentos = await prisma.parcelamento.findMany({
			where: {
				cliente: { contadorId }
			},
			include: {
				cliente: {
					select: {
						id: true,
						documento: true,
						nomeRazao: true
					}
				}
			},
			orderBy: { inicio: 'desc' }
		});

		// Group by tipo for summary
		const summaryMap = new Map<string, { tipo: string; total: number; atraso: number }>();

		for (const p of parcelamentos) {
			const existing = summaryMap.get(p.tipo);
			if (existing) {
				existing.total += p.parcelas;
				existing.atraso += p.parcelasEmAtraso;
			} else {
				summaryMap.set(p.tipo, {
					tipo: p.tipo,
					total: p.parcelas,
					atraso: p.parcelasEmAtraso
				});
			}
		}

		summary = Array.from(summaryMap.values()).map(s => ({
			...s,
			color: s.atraso > 0 ? 'warning' : 'success'
		}));
	} catch (error) {
		console.warn('Error fetching parcelamentos:', error);
	}

	return { summary, parcelamentos };
};