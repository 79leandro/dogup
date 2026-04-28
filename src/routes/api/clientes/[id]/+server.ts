import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession } from '$lib/server/auth';
import { getCliente, updateCliente, deleteCliente } from '$lib/services/clienteService';
import { validateCNPJ, validateCPF, removeMascaraCNPJ, removeMascaraCPF } from '$lib/utils/cnpj';
import type { TipoPessoa } from '@prisma/client';

export const GET: RequestHandler = async (event) => {
	try {
		const user = await getSession(event);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const id = event.params.id;
		const cliente = await getCliente(id, user.contadorId);

		if (!cliente) {
			return json({ error: 'Cliente não encontrado' }, { status: 404 });
		}

		return json({ cliente });
	} catch (error) {
		console.error('GET cliente error:', error);
		return json({ error: 'Erro ao buscar cliente' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async (event) => {
	try {
		const user = await getSession(event);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const id = event.params.id;
		const data = await event.request.json();

		// Check if cliente exists and belongs to user's contador
		const existingCliente = await getCliente(id, user.contadorId);
		if (!existingCliente) {
			return json({ error: 'Cliente não encontrado' }, { status: 404 });
		}

		// If updating documento, validate format (supports both CPF and CNPJ)
		if (data.documento) {
			const tipoPessoa: TipoPessoa = data.tipoPessoa || existingCliente.tipoPessoa;

			if (tipoPessoa === 'PF') {
				const cpfClean = removeMascaraCPF(data.documento);
				if (!validateCPF(cpfClean)) {
					return json({ error: 'CPF inválido' }, { status: 400 });
				}
				data.documento = cpfClean;
			} else {
				const cnpjClean = removeMascaraCNPJ(data.documento).toUpperCase();
				if (!validateCNPJ(cnpjClean)) {
					return json({ error: 'CNPJ inválido' }, { status: 400 });
				}
				data.documento = cnpjClean;
			}
		}

		const ipAddress = event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
		const userAgent = event.request.headers.get('user-agent');

		const cliente = await updateCliente(
			id,
			user.contadorId,
			data,
			{ id: user.id, nome: user.nome },
			ipAddress,
			userAgent
		);

		return json({ cliente });
	} catch (error) {
		console.error('PUT cliente error:', error);
		return json({ error: 'Erro ao atualizar cliente' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async (event) => {
	try {
		const user = await getSession(event);
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const id = event.params.id;

		// Check if cliente exists and belongs to user's contador
		const existingCliente = await getCliente(id, user.contadorId);
		if (!existingCliente) {
			return json({ error: 'Cliente não encontrado' }, { status: 404 });
		}

		const ipAddress = event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
		const userAgent = event.request.headers.get('user-agent');

		await deleteCliente(
			id,
			user.contadorId,
			{ id: user.id, nome: user.nome },
			ipAddress,
			userAgent
		);

		return json({ success: true });
	} catch (error) {
		console.error('DELETE cliente error:', error);
		return json({ error: 'Erro ao deletar cliente' }, { status: 500 });
	}
};