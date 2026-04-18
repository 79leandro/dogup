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
import { validateCNPJ, removeMascaraCNPJ } from '$lib/utils/cnpj';

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
				getClienteStats(user.empresaId),
				getSituacaoFiscalStats(user.empresaId)
			]);
			return json({ ...clienteStats, situacao: situacaoStats });
		}

		if (query) {
			const clientes = await searchClientes(user.empresaId, query);
			return json({ clientes });
		}

		const clientes = await listClientes(user.empresaId);
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
		if (!data.cnpj || !data.nomeRazao || !data.regime) {
			return json(
				{ error: 'CNPJ, Razão Social e Regime são campos obrigatórios' },
				{ status: 400 }
			);
		}

		// Validate CNPJ (supports both numeric and alphanumeric formats)
		const cnpjClean = removeMascaraCNPJ(data.cnpj).toUpperCase();
		if (!validateCNPJ(cnpjClean)) {
			return json({ error: 'CNPJ inválido' }, { status: 400 });
		}

		// Check if CNPJ already exists
		const { getPrisma } = await import('$lib/server/prisma');
		const prisma = getPrisma();
		const existingCliente = await prisma.cliente.findUnique({
			where: { cnpj: cnpjClean }
		});

		if (existingCliente) {
			return json({ error: 'Já existe um cliente com este CNPJ' }, { status: 409 });
		}

		const cliente = await createCliente(user.empresaId, {
			...data,
			cnpj: cnpjClean
		});

		return json({ cliente }, { status: 201 });
	} catch (error) {
		console.error('POST clientes error:', error);
		return json({ error: 'Erro ao criar cliente' }, { status: 500 });
	}
};
