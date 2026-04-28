import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession } from '$lib/server/auth';
import { listarAuditoria } from '$lib/services/auditoriaService';
import type { EnumAuditoria } from '@prisma/client';

export const GET: RequestHandler = async (event) => {
	try {
		const user = await getSession(event);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const url = new URL(event.request.url);
		const entidade = url.searchParams.get('entidade') ?? undefined;
		const entidadeId = url.searchParams.get('entidadeId') ?? undefined;
		const usuarioId = url.searchParams.get('usuarioId') ?? undefined;
		const acao = url.searchParams.get('acao') as EnumAuditoria | undefined;
		const dataInicio = url.searchParams.get('dataInicio');
		const dataFim = url.searchParams.get('dataFim');
		const limit = parseInt(url.searchParams.get('limit') ?? '50');
		const offset = parseInt(url.searchParams.get('offset') ?? '0');

		const registros = await listarAuditoria(user.contadorId, {
			entidade,
			entidadeId,
			usuarioId,
			acao,
			dataInicio: dataInicio ? new Date(dataInicio) : undefined,
			dataFim: dataFim ? new Date(dataFim) : undefined,
			limit,
			offset
		});

		return json({ registros });
	} catch (error) {
		console.error('GET auditoria error:', error);
		return json({ error: 'Erro ao buscar auditoria' }, { status: 500 });
	}
};