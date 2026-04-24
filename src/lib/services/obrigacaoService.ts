import { getPrisma } from '$lib/server/prisma';
import type { TipoObrigacao, StatusObrigacao } from '@prisma/client';
import { registrarAuditoria } from './auditoriaService';
import type { AuditUser } from './clienteService';

export { type AuditUser } from './clienteService';

export interface CreateObrigacaoDTO {
	clienteId: string;
	tipo: TipoObrigacao;
	ano: number;
	mes: number;
	status?: StatusObrigacao;
	observacao?: string;
}

export interface DCTFWebSimulation {
	status: 'rascunho' | 'validando' | 'processando' | 'entregue' | 'erro';
	protocolo: string | null;
	dataEnvio: Date | null;
	recibo: string | null;
	erro?: string;
}

export interface DCTFWebData {
	clienteId: string;
	ano: number;
	mes: number;
	irpf?: number;
	csll?: number;
	pis?: number;
	cofins?: number;
	recolhimento?: number;
}

export async function listObrigacoes(
	empresaId: string,
	filters?: {
		tipo?: TipoObrigacao;
		status?: StatusObrigacao;
		ano?: number;
		mes?: number;
	}
) {
	const prisma = getPrisma();
	return prisma.obrigacao.findMany({
		where: {
			cliente: { empresaId },
			...(filters?.tipo && { tipo: filters.tipo }),
			...(filters?.status && { status: filters.status }),
			...(filters?.ano && { ano: filters.ano }),
			...(filters?.mes && { mes: filters.mes })
		},
		include: {
			cliente: {
				select: {
					id: true,
					cnpj: true,
					nomeRazao: true
				}
			}
		},
		orderBy: [{ ano: 'desc' }, { mes: 'desc' }]
	});
}

export async function getObrigacaoStats(empresaId: string) {
	const prisma = getPrisma();
	const [total, entregue, naoEntregue, emProcessamento, inconsistencia] = await Promise.all([
		prisma.obrigacao.count({
			where: { cliente: { empresaId } }
		}),
		prisma.obrigacao.count({
			where: { cliente: { empresaId }, status: 'ENTREGUE' }
		}),
		prisma.obrigacao.count({
			where: { cliente: { empresaId }, status: 'NAO_ENTREGUE' }
		}),
		prisma.obrigacao.count({
			where: { cliente: { empresaId }, status: 'EM_PROCESSAMENTO' }
		}),
		prisma.obrigacao.count({
			where: { cliente: { empresaId }, status: 'INCONSISTENCIA' }
		})
	]);

	return {
		total,
		entregue,
		naoEntregue,
		emProcessamento,
		inconsistencia,
		percentualEntrega: total > 0 ? Math.round((entregue / total) * 100 * 10) / 10 : 0
	};
}

export async function createObrigacao(
	data: CreateObrigacaoDTO,
	empresaId: string,
	user: AuditUser,
	ipAddress?: string | null,
	userAgent?: string | null
) {
	const prisma = getPrisma();

	const result = await prisma.obrigacao.create({
		data: {
			...data,
			status: data.status || 'NAO_ENTREGUE'
		},
		include: {
			cliente: {
				select: {
					id: true,
					cnpj: true,
					nomeRazao: true
				}
			}
		}
	});

	await registrarAuditoria({
		usuarioId: user.id,
		usuarioNome: user.nome,
		empresaId,
		acao: 'CREATE',
		entidade: 'Obrigacao',
		entidadeId: result.id,
		dadosNovos: result,
		ipAddress,
		userAgent
	});

	return result;
}

export async function updateObrigacaoStatus(
	id: string,
	empresaId: string,
	status: StatusObrigacao,
	reciboUrl: string | undefined,
	user: AuditUser,
	ipAddress?: string | null,
	userAgent?: string | null
) {
	const prisma = getPrisma();

	const dadosAntigos = await prisma.obrigacao.findUnique({ where: { id } });

	const result = await prisma.obrigacao.update({
		where: { id },
		data: {
			status,
			...(reciboUrl && { reciboUrl })
		}
	});

	await registrarAuditoria({
		usuarioId: user.id,
		usuarioNome: user.nome,
		empresaId,
		acao: 'UPDATE',
		entidade: 'Obrigacao',
		entidadeId: id,
		dadosAntigos,
		dadosNovos: result,
		ipAddress,
		userAgent
	});

	return result;
}

export async function simulateDCTFWebTransmission(
	data: DCTFWebData
): Promise<DCTFWebSimulation> {
	// Simulate validation delay (2 seconds)
	await new Promise((resolve) => setTimeout(resolve, 2000));

	// Generate protocol number
	const protocolo = `PROT${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

	// Generate mock receipt
	const recibo = `REC${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

	// Simulate processing (1 second)
	await new Promise((resolve) => setTimeout(resolve, 1000));

	return {
		status: 'entregue',
		protocolo,
		dataEnvio: new Date(),
		recibo
	};
}

export async function getObrigacoesPorVencer(
	empresaId: string,
	dias: number = 7
) {
	const prisma = getPrisma();
	const hoje = new Date();
	const limite = new Date();
	limite.setDate(hoje.getDate() + dias);

	// Get obligations that are NAO_ENTREGUE and due within the period
	// This would need a vencimento field - for now return upcoming by mes/ano
	return prisma.obrigacao.findMany({
		where: {
			cliente: { empresaId },
			status: 'NAO_ENTREGUE',
			// Simple logic: current month or next
			OR: [
				{
					AND: [
						{ ano: hoje.getFullYear() },
						{ mes: hoje.getMonth() + 1 }
					]
				},
				{
					AND: [
						{ ano: limite.getFullYear() },
						{ mes: limite.getMonth() + 1 }
					]
				}
			]
		},
		include: {
			cliente: {
				select: {
					id: true,
					cnpj: true,
					nomeRazao: true
				}
			}
		},
		orderBy: [{ mes: 'asc' }, { ano: 'asc' }]
	});
}
