import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession } from '$lib/server/auth';
import {
	listObrigacoes,
	createObrigacao,
	getObrigacaoStats,
	simulateDCTFWebTransmission
} from '$lib/services/obrigacaoService';
import type { TipoObrigacao, StatusObrigacao } from '@prisma/client';

export const GET: RequestHandler = async (event) => {
	try {
		const user = await getSession(event);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const url = new URL(event.request.url);
		const tipo = url.searchParams.get('tipo') as TipoObrigacao | null;
		const status = url.searchParams.get('status') as StatusObrigacao | null;
		const stats = url.searchParams.get('stats') === 'true';

		if (stats) {
			const obrigacaoStats = await getObrigacaoStats(user.empresaId);
			return json({ stats: obrigacaoStats });
		}

		const obrigacoes = await listObrigacoes(user.empresaId, {
			...(tipo && { tipo }),
			...(status && { status })
		});

		return json({ obrigacoes });
	} catch (error) {
		console.error('GET obrigacoes error:', error);
		return json({ error: 'Erro ao buscar obrigações' }, { status: 500 });
	}
};

export const POST: RequestHandler = async (event) => {
	try {
		const user = await getSession(event);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const data = await event.request.json();
		const ipAddress = event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
		const userAgent = event.request.headers.get('user-agent');

		// Check if this is a DCTFWeb transmission simulation
		if (data.action === 'transmitirDCTFWeb') {
			const resultado = await simulateDCTFWebTransmission({
				clienteId: data.clienteId,
				ano: data.ano,
				mes: data.mes,
				irpf: data.irpf,
				csll: data.csll,
				pis: data.pis,
				cofins: data.cofins,
				recolhimento: data.recolhimento
			});

			// Create obligation with status based on simulation result
			const obrigacao = await createObrigacao(
				{
					clienteId: data.clienteId,
					tipo: 'DCTFWEB',
					ano: data.ano,
					mes: data.mes,
					status: resultado.status === 'entregue' ? 'ENTREGUE' : 'EM_PROCESSAMENTO',
					observacao: resultado.protocolo
						? `Protocolo: ${resultado.protocolo}`
						: resultado.erro
				},
				user.empresaId,
				{ id: user.id, nome: user.nome },
				ipAddress,
				userAgent
			);

			return json({ obrigacao, resultado });
		}

		// Basic validation for regular obligation creation
		if (!data.clienteId || !data.tipo || !data.ano || data.mes === undefined) {
			return json(
				{ error: 'Cliente, Tipo, Ano e Mês são campos obrigatórios' },
				{ status: 400 }
			);
		}

		const obrigacao = await createObrigacao(
			{
				clienteId: data.clienteId,
				tipo: data.tipo,
				ano: data.ano,
				mes: data.mes,
				status: data.status,
				observacao: data.observacao
			},
			user.empresaId,
			{ id: user.id, nome: user.nome },
			ipAddress,
			userAgent
		);

		return json({ obrigacao }, { status: 201 });
	} catch (error) {
		console.error('POST obrigacoes error:', error);
		return json({ error: 'Erro ao criar obrigação' }, { status: 500 });
	}
};
