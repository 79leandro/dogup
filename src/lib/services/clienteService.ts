import { getPrisma } from '$lib/server/prisma';
import type { RegimeTributario, SituacaoFiscal, TipoPessoa } from '@prisma/client';
import { registrarAuditoria } from './auditoriaService';

export interface AuditUser {
	id: string;
	nome: string;
}

export interface CreateClienteFinalDTO {
	tipoPessoa: TipoPessoa;
	documento: string;
	nomeRazao: string;
	nomeFantasia?: string;
	estadoCivil?: string;
	inscricaoEstadual?: string;
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

export interface UpdateClienteFinalDTO {
	tipoPessoa?: TipoPessoa;
	documento?: string;
	nomeRazao?: string;
	nomeFantasia?: string;
	estadoCivil?: string;
	inscricaoEstadual?: string;
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

export interface ClienteFinalWithRelations {
	id: string;
	tipoPessoa: TipoPessoa;
	documento: string;
	nomeRazao: string;
	nomeFantasia: string | null;
	estadoCivil: string | null;
	regime: RegimeTributario;
	situacaoFiscal: SituacaoFiscal;
	logradouro?: string | null;
	cidade?: string | null;
	uf?: string | null;
	cep?: string | null;
	email?: string | null;
	telefone?: string | null;
	responsavelTecnico?: string | null;
	contadorId: string;
	createdAt: Date;
	updatedAt: Date;
	_count?: {
		obrigacoes: number;
		parcelamentos: number;
		mensagens: number;
	};
}

export async function listClientes(contadorId: string): Promise<ClienteFinalWithRelations[]> {
	const prisma = getPrisma();
	return prisma.clienteFinal.findMany({
		where: { contadorId },
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

export async function getCliente(id: string, contadorId: string): Promise<ClienteFinalWithRelations | null> {
	const prisma = getPrisma();
	return prisma.clienteFinal.findFirst({
		where: { id, contadorId },
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
	contadorId: string,
	data: CreateClienteFinalDTO,
	user: AuditUser,
	ipAddress?: string | null,
	userAgent?: string | null
): Promise<ClienteFinalWithRelations> {
	const prisma = getPrisma();
	const formattedDocumento = data.documento.replace(/\D/g, '');

	const result = await prisma.clienteFinal.create({
		data: {
			tipoPessoa: data.tipoPessoa,
			documento: formattedDocumento,
			nomeRazao: data.nomeRazao,
			nomeFantasia: data.nomeFantasia,
			estadoCivil: data.estadoCivil,
			inscricaoEstadual: data.inscricaoEstadual,
			regime: data.regime,
			situacaoFiscal: data.situacaoFiscal || 'REGULAR',
			logradouro: data.logradouro,
			bairro: data.bairro,
			cidade: data.cidade,
			uf: data.uf,
			cep: data.cep,
			email: data.email,
			telefone: data.telefone,
			responsavelTecnico: data.responsavelTecnico,
			contadorId
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
		contadorId,
		acao: 'CREATE',
		entidade: 'ClienteFinal',
		entidadeId: result.id,
		dadosNovos: result,
		ipAddress,
		userAgent
	});

	return result;
}

export async function updateCliente(
	id: string,
	contadorId: string,
	data: UpdateClienteFinalDTO,
	user: AuditUser,
	ipAddress?: string | null,
	userAgent?: string | null
): Promise<ClienteFinalWithRelations> {
	const prisma = getPrisma();

	const dadosAntigos = await prisma.clienteFinal.findUnique({ where: { id, contadorId } });

	if (!dadosAntigos) {
		throw new Error('Cliente não encontrado');
	}

	const result = await prisma.clienteFinal.update({
		where: { id, contadorId },
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
		contadorId,
		acao: 'UPDATE',
		entidade: 'ClienteFinal',
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
	contadorId: string,
	user: AuditUser,
	ipAddress?: string | null,
	userAgent?: string | null
): Promise<void> {
	const prisma = getPrisma();

	const dadosAntigos = await prisma.clienteFinal.findUnique({ where: { id, contadorId } });

	await prisma.clienteFinal.delete({
		where: { id, contadorId }
	});

	await registrarAuditoria({
		usuarioId: user.id,
		usuarioNome: user.nome,
		contadorId,
		acao: 'DELETE',
		entidade: 'ClienteFinal',
		entidadeId: id,
		dadosAntigos,
		ipAddress,
		userAgent
	});
}

export async function searchClientes(
	contadorId: string,
	query: string
): Promise<ClienteFinalWithRelations[]> {
	const prisma = getPrisma();
	const normalizedQuery = query.replace(/\D/g, '');

	return prisma.clienteFinal.findMany({
		where: {
			contadorId,
			OR: [
				{ documento: { contains: normalizedQuery } },
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

export async function getClienteStats(contadorId: string) {
	const prisma = getPrisma();
	const [total, simplesNacional, normal] = await Promise.all([
		prisma.clienteFinal.count({ where: { contadorId } }),
		prisma.clienteFinal.count({ where: { contadorId, regime: 'SIMPLES_NACIONAL' } }),
		prisma.clienteFinal.count({ where: { contadorId, regime: 'NORMAL' } })
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

export async function getSituacaoFiscalStats(contadorId: string) {
	const prisma = getPrisma();
	const [regular, regularizado, irregular] = await Promise.all([
		prisma.clienteFinal.count({ where: { contadorId, situacaoFiscal: 'REGULAR' } }),
		prisma.clienteFinal.count({ where: { contadorId, situacaoFiscal: 'REGULARIZADO' } }),
		prisma.clienteFinal.count({ where: { contadorId, situacaoFiscal: 'IRREGULAR' } })
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