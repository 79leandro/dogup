import type { PageServerLoad } from './$types';
import { getSession } from '$lib/server/auth';
import { getSituacaoFiscalStats, listClientes } from '$lib/services/clienteService';

export const load: PageServerLoad = async (event) => {
	const user = await getSession(event);

	if (!user) {
		return {
			stats: { regular: 0, regularizado: 0, irregular: 0, percentages: { regular: 0, regularizado: 0, irregular: 0 } },
			clientes: []
		};
	}

	const empresaId = user.empresaId;

	const [stats, clientes] = await Promise.all([
		getSituacaoFiscalStats(empresaId),
		listClientes(empresaId)
	]);

	return {
		stats,
		clientes
	};
};
