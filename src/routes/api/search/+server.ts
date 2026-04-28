import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession } from '$lib/server/auth';
import { searchClientes } from '$lib/services/clienteService';
import { listObrigacoes } from '$lib/services/obrigacaoService';

export const GET: RequestHandler = async (event) => {
	try {
		const user = await getSession(event);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const url = new URL(event.request.url);
		const query = url.searchParams.get('q') || '';

		if (query.length < 2) {
			return json({ results: [] });
		}

		const normalizedQuery = query.replace(/\D/g, '');
		const results: Array<{
			id: string;
			type: 'cliente' | 'obrigacao' | 'parcelamento';
			titulo: string;
			subtitulo: string;
			href: string;
		}> = [];

		// Search clientes
		const clientes = await searchClientes(user.contadorId, query);
		for (const cliente of clientes.slice(0, 5)) {
			results.push({
				id: cliente.id,
				type: 'cliente',
				titulo: cliente.nomeRazao,
				subtitulo: cliente.documento,
				href: `/dashboard/clientes/${cliente.id}`
			});
		}

		// Search obrigacoes (by tipo or cliente nome)
		const obrigacoes = await listObrigacoes(user.contadorId);
		const filteredObrigacoes = obrigacoes.filter(o => {
			const tipoMatch = o.tipo.toLowerCase().includes(query.toLowerCase());
			const clienteMatch = o.cliente.nomeRazao.toLowerCase().includes(query.toLowerCase());
			return tipoMatch || clienteMatch;
		}).slice(0, 5);

		for (const obr of filteredObrigacoes) {
			results.push({
				id: obr.id,
				type: 'obrigacao',
				titulo: `${obr.tipo} - ${obr.mes.toString().padStart(2, '0')}/${obr.ano}`,
				subtitulo: obr.cliente.nomeRazao,
				href: `/dashboard/obrigacoes/${obr.tipo.toLowerCase()}`
			});
		}

		return json({ results });
	} catch (error) {
		console.error('Search error:', error);
		return json({ error: 'Erro na busca' }, { status: 500 });
	}
};