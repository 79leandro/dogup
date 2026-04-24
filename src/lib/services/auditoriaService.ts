import { getPrisma } from '$lib/server/prisma';
import type { EnumAuditoria } from '@prisma/client';

export interface AuditLogEntry {
	usuarioId: string;
	usuarioNome: string;
	empresaId: string;
	acao: EnumAuditoria;
	entidade: string;
	entidadeId: string;
	dadosAntigos?: Record<string, any> | null;
	dadosNovos?: Record<string, any> | null;
	ipAddress?: string | null;
	userAgent?: string | null;
}

export async function registrarAuditoria(entry: AuditLogEntry): Promise<void> {
	const prisma = getPrisma();
	await prisma.auditoria.create({
		data: {
			usuarioId: entry.usuarioId,
			usuarioNome: entry.usuarioNome,
			empresaId: entry.empresaId,
			acao: entry.acao,
			entidade: entry.entidade,
			entidadeId: entry.entidadeId,
			dadosAntigos: entry.dadosAntigos ?? undefined,
			dadosNovos: entry.dadosNovos ?? undefined,
			ipAddress: entry.ipAddress ?? null,
			userAgent: entry.userAgent ?? null
		}
	});
}

export interface ListAuditoriaOptions {
	entidade?: string;
	entidadeId?: string;
	usuarioId?: string;
	acao?: EnumAuditoria;
	dataInicio?: Date;
	dataFim?: Date;
	limit?: number;
	offset?: number;
}

export interface AuditoriaRegistro {
	id: string;
	usuarioId: string;
	usuarioNome: string;
	empresaId: string;
	acao: EnumAuditoria;
	entidade: string;
	entidadeId: string;
	dadosAntigos: Record<string, any> | null;
	dadosNovos: Record<string, any> | null;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: Date;
}

export async function listarAuditoria(
	empresaId: string,
	options?: ListAuditoriaOptions
): Promise<AuditoriaRegistro[]> {
	const prisma = getPrisma();

	const where: Record<string, any> = {
		empresaId
	};

	if (options?.entidade) {
		where.entidade = options.entidade;
	}

	if (options?.entidadeId) {
		where.entidadeId = options.entidadeId;
	}

	if (options?.usuarioId) {
		where.usuarioId = options.usuarioId;
	}

	if (options?.acao) {
		where.acao = options.acao;
	}

	if (options?.dataInicio || options?.dataFim) {
		where.createdAt = {};
		if (options.dataInicio) {
			where.createdAt.gte = options.dataInicio;
		}
		if (options.dataFim) {
			where.createdAt.lte = options.dataFim;
		}
	}

	return prisma.auditoria.findMany({
		where,
		orderBy: { createdAt: 'desc' },
		take: options?.limit ?? 50,
		skip: options?.offset ?? 0
	}) as Promise<AuditoriaRegistro[]>;
}
