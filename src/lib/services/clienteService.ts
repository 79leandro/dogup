import { getPrisma } from '$lib/server/prisma';
import type { RegimeTributario, SituacaoFiscal } from '@prisma/client';
import { registrarAuditoria } from './auditoriaService';

export interface AuditUser {
	id: string;
	nome: string;
}

export interface CreateClienteDTO {
	cnpj: string;
	nomeRazao: string;
	nomeFantasia?: string;
	regime: RegimeTributario;
	situacaoFiscal?: SituacaoFiscal;
	logradouro?: string;
	bairro?: string;
	cidade?: string;
	uf?: string;
	cep?: string;
	email?: string;
	telefone?: string;
	responsavelTecnico?: string;
}

export interface UpdateClienteDTO {
	nomeRazao?: string;
	nomeFantasia?: string;
	regime?: RegimeTributario;
	situacaoFiscal?: SituacaoFiscal;
	logradouro?: string;
	bairro?: string;
	cidade?: string;
	uf?: string;
	cep?: string;
	email?: string;
	telefone?: string;
	responsavelTecnico?: string;
}

export interface ClienteWithRelations {
	id: string;
	cnpj: string;
	nomeRazao: string;
	nomeFantasia: string | null;
	regime: RegimeTributario;
	situacaoFiscal: SituacaoFiscal;
	logradouro?: string | null;
	cidade?: string | null;
	uf?: string | null;
	cep?: string | null;
	email?: string | null;
	telefone?: string | null;
	responsavelTecnico?: string | null;
	empresaId: string;
	createdAt: Date;
	updatedAt: Date;
	_count?: {
		obrigacoes: number;
		parcelamentos: number;
		mensagens: number;
	};
}

export async function listClientes(empresaId: string): Promise<ClienteWithRelations[]> {
	const prisma = getPrisma();
	return prisma.cliente.findMany({
		where: { empresaId },
		orderBy: { nomeRazao: 'asc' },
		include: {
			_count: {
				select: {
					obrigacoes: true,
					parcelamentos: true,
					mensagens: true
				}
			}
		}
	});
}

export async function getCliente(id: string, empresaId: string): Promise<ClienteWithRelations | null> {
	const prisma = getPrisma();
	return prisma.cliente.findFirst({
		where: { id, empresaId },
		include: {
			_count: {
				select: {
					obrigacoes: true,
					parcelamentos: true,
					mensagens: true
				}
			}
		}
	});
}

export async function createCliente(
	empresaId: string,
	data: CreateClienteDTO,
	user: AuditUser,
	ipAddress?: string | null,
	userAgent?: string | null
): Promise<ClienteWithRelations> {
	const prisma = getPrisma();
	const formattedCnpj = data.cnpj.replace(/\D/g, '');

	const result = await prisma.cliente.create({
		data: {
			...data,
			cnpj: formattedCnpj,
			situacaoFiscal: data.situacaoFiscal || 'REGULAR',
			empresaId
		},
		include: {
			_count: {
				select: {
					obrigacoes: true,
					parcelamentos: true,
					mensagens: true
				}
			}
		}
	});

	await registrarAuditoria({
		usuarioId: user.id,
		usuarioNome: user.nome,
		empresaId,
		acao: 'CREATE',
		entidade: 'Cliente',
		entidadeId: result.id,
		dadosNovos: result,
		ipAddress,
		userAgent
	});

	return result;
}

export async function updateCliente(
	id: string,
	empresaId: string,
	data: UpdateClienteDTO,
	user: AuditUser,
	ipAddress?: string | null,
	userAgent?: string | null
): Promise<ClienteWithRelations> {
	const prisma = getPrisma();

	const dadosAntigos = await prisma.cliente.findUnique({ where: { id } });

	const result = await prisma.cliente.update({
		where: { id },
		data,
		include: {
			_count: {
				select: {
					obrigacoes: true,
					parcelamentos: true,
					mensagens: true
				}
			}
		}
	});

	await registrarAuditoria({
		usuarioId: user.id,
		usuarioNome: user.nome,
		empresaId,
		acao: 'UPDATE',
		entidade: 'Cliente',
		entidadeId: id,
		dadosAntigos,
		dadosNovos: result,
		ipAddress,
		userAgent
	});

	return result;
}

export async function deleteCliente(
	id: string,
	empresaId: string,
	user: AuditUser,
	ipAddress?: string | null,
	userAgent?: string | null
): Promise<void> {
	const prisma = getPrisma();

	const dadosAntigos = await prisma.cliente.findUnique({ where: { id } });

	await prisma.cliente.delete({
		where: { id, empresaId }
	});

	await registrarAuditoria({
		usuarioId: user.id,
		usuarioNome: user.nome,
		empresaId,
		acao: 'DELETE',
		entidade: 'Cliente',
		entidadeId: id,
		dadosAntigos,
		ipAddress,
		userAgent
	});
}

export async function searchClientes(
	empresaId: string,
	query: string
): Promise<ClienteWithRelations[]> {
	const prisma = getPrisma();
	const normalizedQuery = query.replace(/\D/g, '');

	return prisma.cliente.findMany({
		where: {
			empresaId,
			OR: [
				{ cnpj: { contains: normalizedQuery } },
				{ nomeRazao: { contains: query, mode: 'insensitive' } },
				{ nomeFantasia: { contains: query, mode: 'insensitive' } }
			]
		},
		orderBy: { nomeRazao: 'asc' },
		include: {
			_count: {
				select: {
					obrigacoes: true,
					parcelamentos: true,
					mensagens: true
				}
			}
		}
	});
}

export async function getClienteStats(empresaId: string) {
	const prisma = getPrisma();
	const [total, simplesNacional, normal] = await Promise.all([
		prisma.cliente.count({ where: { empresaId } }),
		prisma.cliente.count({ where: { empresaId, regime: 'SIMPLES_NACIONAL' } }),
		prisma.cliente.count({ where: { empresaId, regime: 'NORMAL' } })
	]);

	return {
		total,
		simplesNacional,
		normal,
		percentages: {
			simplesNacional: total > 0 ? Math.round((simplesNacional / total) * 100) : 0,
			normal: total > 0 ? Math.round((normal / total) * 100) : 0
		}
	};
}

export async function getSituacaoFiscalStats(empresaId: string) {
	const prisma = getPrisma();
	const [regular, regularizado, irregular] = await Promise.all([
		prisma.cliente.count({ where: { empresaId, situacaoFiscal: 'REGULAR' } }),
		prisma.cliente.count({ where: { empresaId, situacaoFiscal: 'REGULARIZADO' } }),
		prisma.cliente.count({ where: { empresaId, situacaoFiscal: 'IRREGULAR' } })
	]);

	const total = regular + regularizado + irregular;

	return {
		regular,
		regularizado,
		irregular,
		percentages: {
			regular: total > 0 ? Math.round((regular / total) * 100 * 10) / 10 : 0,
			regularizado: total > 0 ? Math.round((regularizado / total) * 100 * 10) / 10 : 0,
			irregular: total > 0 ? Math.round((irregular / total) * 100 * 10) / 10 : 0
		}
	};
}
