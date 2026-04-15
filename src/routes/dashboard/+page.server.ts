// Server-side data loading for dashboard
export async function load() {
	// In production, fetch from Prisma
	// For now, return mock data based on requisitosIniciais.txt

	return {
		stats: {
			totalClientes: 221,
			simplesNacional: { count: 155, percentage: 70 },
			normal: { count: 66, percentage: 30 }
		},
		situacaoFiscal: {
			regular: { count: 90, percentage: 41.5 },
			regularizado: { count: 33, percentage: 15.2 },
			irregular: { count: 94, percentage: 43.3 }
		},
		obrigacoes: {
			total: 221,
			emAndamento: 36,
			entregue: 185,
			naoEntregue: 0,
			percentualEntrega: 83.7
		},
		parcelamentos: [
			{ tipo: 'PGFN', total: 29, emAtraso: 21 },
			{ tipo: 'Simples Nacional', total: 52, emAtraso: 13 },
			{ tipo: 'Simplificado', total: 24, emAtraso: 6 },
			{ tipo: 'Não Prev.', total: 0, emAtraso: 0 },
			{ tipo: 'Prev.', total: 0, emAtraso: 0 }
		],
		mensagensRelevantes: 6,
		certificados: {
			validos: 180,
			vencidos: 12,
			proximasVencimento: 29
		},
		procuracoes: {
			emDia: 150,
			proximoVencimento: 45,
			vencidas: 26
		}
	};
}
