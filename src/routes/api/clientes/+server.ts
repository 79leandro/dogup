import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession } from '$lib/server/auth';
import {
	listClientes,
	createCliente,
	searchClientes,
	getClienteStats,
	getSituacaoFiscalStats
} from '$lib/services/clienteService';
import { validateCNPJ, validateCPF, removeMascaraCNPJ, removeMascaraCPF } from '$lib/utils/cnpj';
import type { TipoPessoa } from '@prisma/client';

export const GET: RequestHandler = async (event) => {
	try {
		const user = await getSession(event);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const url = new URL(event.request.url);
		const query = url.searchParams.get('q');
		const stats = url.searchParams.get('stats') === 'true';

		if (stats) {
			const [clienteStats, situacaoStats] = await Promise.all([
				getClienteStats(user.contadorId),
				getSituacaoFiscalStats(user.contadorId)
			]);
			return json({ ...clienteStats, situacao: situacaoStats });
		}

		if (query) {
			const clientes = await searchClientes(user.contadorId, query);
			return json({ clientes });
		}

		const clientes = await listClientes(user.contadorId);
		return json({ clientes });
	} catch (error) {
		console.error('GET clientes error:', error);
		return json({ error: 'Erro ao buscar clientes' }, { status: 500 });
	}
};

export const POST: RequestHandler = async (event) => {
	try {
		const user = await getSession(event);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const data = await event.request.json();

		// Basic validation
		if (!data.documento || !data.nomeRazao || !data.regime) {
			return json(
				{ error: 'Documento (CPF/CNPJ), Razão Social e Regime são campos obrigatórios' },
				{ status: 400 }
			);
		}

		// Validate documento (CPF or CNPJ)
		const tipoPessoa: TipoPessoa = data.tipoPessoa || 'PJ';
		let documentoClean: string;

		if (tipoPessoa === 'PF') {
			documentoClean = removeMascaraCPF(data.documento);
			if (!validateCPF(documentoClean)) {
				return json({ error: 'CPF inválido' }, { status: 400 });
			}
		} else {
			documentoClean = removeMascaraCNPJ(data.documento).toUpperCase();
			if (!validateCNPJ(documentoClean)) {
				return json({ error: 'CNPJ inválido' }, { status: 400 });
			}
		}

		// Check if documento already exists
		const { getPrisma } = await import('$lib/server/prisma');
		const prisma = getPrisma();
		const existingCliente = await prisma.clienteFinal.findUnique({
			where: { documento: documentoClean }
		});

		if (existingCliente) {
			return json({ error: 'Cliente já existente' }, { status: 409 });
		}

		const ipAddress = event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
		const userAgent = event.request.headers.get('user-agent');

		const cliente = await createCliente(
			user.contadorId,
			{
				...data,
				tipoPessoa,
				documento: documentoClean
			},
			{ id: user.id, nome: user.nome },
			ipAddress,
			userAgent
		);

		return json({ cliente }, { status: 201 });
	} catch (error) {
		console.error('POST clientes error:', error);
		return json({ error: 'Erro ao criar cliente' }, { status: 500 });
	}
};