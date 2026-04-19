/**
 * Service for querying CNPJ data from Receita Federal via BrasilAPI
 * API Docs: https://brasilapi.com.br/api/cnpj/v1
 */

export interface CNPJData {
	cnpj: string;
	nomeRazao: string;
	nomeFantasia?: string;
	logradouro?: string;
	numero?: string;
	complemento?: string;
	bairro?: string;
	cidade?: string;
	uf?: string;
	cep?: string;
	telefone?: string;
	email?: string;
	situacaoCadastral?: string;
}

export interface ReceitaFederalResult {
	success: boolean;
	data?: CNPJData;
	error?: string;
}

/**
 * Fetch CNPJ data from BrasilAPI
 * This is a free API that doesn't require authentication
 */
export async function fetchCNPJData(cnpj: string): Promise<ReceitaFederalResult> {
	try {
		// Remove formatting - only digits and uppercase letters
		const cnpjClean = cnpj.replace(/[^A-Z\d]/gi, '').toUpperCase();

		if (cnpjClean.length !== 14) {
			return { success: false, error: 'CNPJ deve ter 14 dígitos' };
		}

		const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjClean}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			if (response.status === 404) {
				return { success: false, error: 'CNPJ não encontrado na Receita Federal' };
			}
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();

		// Map the API response to our format
		// BrasilAPI returns flat structure (not nested under estabelecimento)
		const cnpjData: CNPJData = {
			cnpj: cnpjClean,
			nomeRazao: data.razao_social || '',
			nomeFantasia: data.nome_fantasia || undefined,
			logradouro: data.logradouro || undefined,
			numero: data.numero || undefined,
			complemento: data.complemento || undefined,
			bairro: data.bairro || undefined,
			cidade: data.municipio || undefined,
			uf: data.uf || undefined,
			cep: data.cep || undefined,
			telefone: data.ddd_telefone_1 || undefined,
			email: data.email || undefined,
			situacaoCadastral: data.descricao_situacao_cadastral || undefined
		};

		return { success: true, data: cnpjData };
	} catch (error) {
		console.error('Erro ao consultar CNPJ:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Erro ao consultar CNPJ'
		};
	}
}

/**
 * Map Receita Federal situation to our internal status
 */
export function mapSituacaoFiscal(situacaoRF: string | undefined): string {
	if (!situacaoRF) return 'REGULAR';

	const situacaoMap: Record<string, string> = {
		'ATIVA': 'REGULAR',
		'INATIVA': 'IRREGULAR',
		'BAIXADA': 'IRREGULAR',
		'SUSPENSA': 'IRREGULAR',
		'INAPTA': 'IRREGULAR'
	};

	return situacaoMap[situacaoRF.toUpperCase()] || 'REGULAR';
}
