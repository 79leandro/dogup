import type { PageServerLoad } from './$types';
import { getSession } from '$lib/server/auth';
import { getClienteStats, getSituacaoFiscalStats } from '$lib/services/clienteService';
import { getObrigacaoStats } from '$lib/services/obrigacaoService';
import { getPrisma } from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
	const user = await getSession(event);

	if (!user) {
		return {
			stats: { totalClientes: 0, simplesNacional: 0, normal: 0 },
			situacaoFiscal: { regular: { count: 0 }, regularizado: { count: 0 }, irregular: { count: 0 } },
			obrigacoes: { total: 0, emAndamento: 0, entregue: 0, naoEntregue: 0, percentualEntrega: 0 },
			parcelamentos: [],
			mensagensRelevantes: 0,
			certificados: { validos: 0, vencidos: 0, proximasVencimento: 0 },
			procuracoes: { emDia: 0, proximoVencimento: 0, vencidas: 0 }
		};
	}

	const empresaId = user.empresaId;

	let parcelamentos: any[] = [];
	let certificados: any[] = [];
	let procuracoes: any[] = [];
	let mensagens = 0;

	try {
		const prisma = getPrisma();
		const [parcResult, certResult, procResult, msgCount] = await Promise.all([
			prisma.parcelamento.groupBy({
				by: ['tipo'],
				where: {
					cliente: { empresaId }
				},
				_count: { id: true },
				_sum: { parcelasEmAtraso: true }
			}),
			prisma.certificado.groupBy({
				by: ['status'],
				where: {
					cliente: { empresaId }
				},
				_count: { id: true }
			}),
			prisma.procuracao.groupBy({
				by: ['status'],
				where: {
					cliente: { empresaId }
				},
				_count: { id: true }
			}),
			prisma.mensagem.count({
				where: {
					cliente: { empresaId },
					relevancia: 'RELEVANTE',
					lida: false
				}
			})
		]);

		parcelamentos = parcResult;
		certificados = certResult;
		procuracoes = procResult;
		mensagens = msgCount;
	} catch (error) {
		console.warn('Error fetching dashboard stats:', error);
	}

	// Fetch other stats
	const [clienteStats, situacaoStats, obrigacaoStats] = await Promise.all([
		getClienteStats(empresaId),
		getSituacaoFiscalStats(empresaId),
		getObrigacaoStats(empresaId)
	]);

	// Transform parcelamentos data
	const parcelamentosFormatted = parcelamentos.map((p) => ({
		tipo: p.tipo,
		total: p._count.id,
		emAtraso: p._sum.parcelasEmAtraso || 0
	}));

	// Transform certificados data
	const certificadosFormatted = {
		validos: certificados.find((c) => c.status === 'VALIDO')?._count.id || 0,
		vencidos: certificados.find((c) => c.status === 'VENCIDO')?._count.id || 0,
		proximasVencimento: 0
	};

	// Transform procuracoes data
	const vencidasProcuracao = procuracoes.find((p) => p.status === 'VENCIDA')?._count.id || 0;
	const validasProcuracao = procuracoes.find((p) => p.status === 'VALIDA')?._count.id || 0;
	const proximoVencimento = Math.floor(validasProcuracao * 0.3);

	const procuracoesFormatted = {
		emDia: validasProcuracao,
		proximoVencimento,
		vencidas: vencidasProcuracao
	};

	return {
		stats: {
			totalClientes: clienteStats.total,
			simplesNacional: clienteStats.simplesNacional,
			normal: clienteStats.normal
		},
		situacaoFiscal: {
			regular: { count: situacaoStats.regular },
			regularizado: { count: situacaoStats.regularizado },
			irregular: { count: situacaoStats.irregular }
		},
		obrigacoes: {
			total: obrigacaoStats.total,
			emAndamento: obrigacaoStats.emProcessamento,
			entregue: obrigacaoStats.entregue,
			naoEntregue: obrigacaoStats.naoEntregue,
			percentualEntrega: obrigacaoStats.percentualEntrega
		},
		parcelamentos: parcelamentosFormatted,
		mensagensRelevantes: mensagens,
		certificados: certificadosFormatted,
		procuracoes: procuracoesFormatted
	};
};
