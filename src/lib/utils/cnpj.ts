/**
 * CNPJ/CPF Validation and Formatting Utilities
 * Supports CPF (11 digits), traditional numeric CNPJ (14 digits) and new alphanumeric CNPJ format
 *
 * New alphanumeric format (from July 2026):
 * - 12 base characters (A-Z, 0-9) + 2 numeric check digits = 14 total
 * - Valid characters: A-Z (uppercase) and 0-9
 * - Check digits (DV) are always numeric
 *
 * Reference: Receita Federal IN 2229/2024
 */

const TAMANHO_CNPJ_SEM_DV = 12;
const TAMANHO_CNPJ = 14;
const TAMANHO_CPF = 11;

// Regex patterns
const REGEX_CNPJ_SEM_DV = /^([A-Z\d]){12}$/;
const REGEX_CNPJ_COMPLETO = /^([A-Z\d]){12}(\d){2}$/;
const REGEX_CPF_COMPLETO = /^\d{11}$/;
const REGEX_MASCARA_CNPJ = /[./-]/g;
const REGEX_MASCARA_CPF = /[.-]/g;
const REGEX_CARACTERES_NAO_PERMITIDOS_CNPJ = /[^A-Z\d./-]/i;
const REGEX_CARACTERES_NAO_PERMITIDOS_CPF = /[^0-9.-]/i;
const CPF_ZERADO = '00000000000';

// Pesos para cálculo do DV (alfanumérico)
// Posições: 5,4,3,2,9,8,7,6,5,4,3,2,1 (da direita para esquerda)
const PESOS_DV = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const VALOR_BASE = '0'.charCodeAt(0);
const CNPJ_ZERADO = '00000000000000';

/**
 * Remove máscara do CNPJ (pontos, barra, hífen)
 */
export function removeMascaraCNPJ(cnpj: string): string {
	return cnpj.replace(REGEX_MASCARA_CNPJ, '');
}

/**
 * Remove máscara do CPF (ponto, hífen)
 */
export function removeMascaraCPF(cpf: string): string {
	return cpf.replace(REGEX_MASCARA_CPF, '');
}

/**
 * Verifica se um caractere é válido para CNPJ alfanumérico (A-Z ou 0-9)
 */
export function isCaractereValido(char: string): boolean {
	return /^[A-Z\d]$/i.test(char);
}

/**
 * Converte caractere alfanumérico para valor numérico
 * 0-9 = 0-9, A-Z = 10-35
 */
export function charParaValor(char: string): number {
	const code = char.toUpperCase().charCodeAt(0);
	if (code >= 48 && code <= 57) {
		// 0-9
		return code - VALOR_BASE;
	}
	if (code >= 65 && code <= 90) {
		// A-Z
		return code - 55; // A=10, B=11, ..., Z=35
	}
	return 0;
}

/**
 * Calcula os dígitos verificadores de um CNPJ alfanumérico (12 caracteres base)
 * Retorna string com 2 dígitos numéricos
 */
export function calculaDV(cnpjSemDV: string): string {
	const cnpj = removeMascaraCNPJ(cnpjSemDV).toUpperCase();

	if (!REGEX_CARACTERES_NAO_PERMITIDOS_CNPJ.test(cnpj)) {
		if (REGEX_CNPJ_SEM_DV.test(cnpj) && cnpj !== CNPJ_ZERADO.substring(0, TAMANHO_CNPJ_SEM_DV)) {
			let somatorioDV1 = 0;
			let somatorioDV2 = 0;

			for (let i = 0; i < TAMANHO_CNPJ_SEM_DV; i++) {
				const asciiDigito = cnpj.charCodeAt(i) - VALOR_BASE;
				somatorioDV1 += asciiDigito * PESOS_DV[i + 1];
				somatorioDV2 += asciiDigito * PESOS_DV[i];
			}

			const dv1 = somatorioDV1 % 11 < 2 ? 0 : 11 - (somatorioDV1 % 11);
			somatorioDV2 += dv1 * PESOS_DV[TAMANHO_CNPJ_SEM_DV];
			const dv2 = somatorioDV2 % 11 < 2 ? 0 : 11 - (somatorioDV2 % 11);

			return `${dv1}${dv2}`;
		}
	}
	throw new Error('CNPJ inválido para cálculo de DV');
}

/**
 * Valida CPF (11 dígitos)
 */
export function validateCPF(cpf: string): boolean {
	const cleaned = cpf.replace(/\D/g, '');

	if (!REGEX_CPF_COMPLETO.test(cleaned)) {
		return false;
	}

	if (cleaned === CPF_ZERADO) {
		return false;
	}

	// Validação do primeiro dígito verificador
	let soma = 0;
	for (let i = 0; i < 9; i++) {
		soma += parseInt(cleaned[i]) * (10 - i);
	}
	let dv1 = soma % 11;
	dv1 = dv1 < 2 ? 0 : 11 - dv1;

	if (parseInt(cleaned[9]) !== dv1) return false;

	// Validação do segundo dígito verificador
	soma = 0;
	for (let i = 0; i < 10; i++) {
		soma += parseInt(cleaned[i]) * (11 - i);
	}
	let dv2 = soma % 11;
	dv2 = dv2 < 2 ? 0 : 11 - dv2;

	return parseInt(cleaned[10]) === dv2;
}

/**
 * Valida CNPJ (suporta ambos os formatos: numérico tradicional e alfanumérico)
 *
 * Formato numérico tradicional: 14 dígitos
 * Formato alfanumérico: 12 caracteres (A-Z, 0-9) + 2 dígitos
 *
 * Para formato alfanumérico com máscara: XX.XXX.XXX/XXXX-XX ou XX.XXX.XXX/XXXX-XX
 * Para formato numérico com máscara: XX.XXX.XXX/XXXX-XX
 */
export function validateCNPJ(cnpj: string): boolean {
	const cleaned = removeMascaraCNPJ(cnpj).toUpperCase();

	// Verifica caracteres não permitidos
	if (REGEX_CARACTERES_NAO_PERMITIDOS_CNPJ.test(cleaned)) {
		return false;
	}

	// CNPJ numérico tradicional (14 dígitos)
	if (/^\d{14}$/.test(cleaned)) {
		return validateCNPJNumerico(cleaned);
	}

	// CNPJ alfanumérico (12 chars + 2 dígitos)
	if (REGEX_CNPJ_COMPLETO.test(cleaned) && cleaned !== CNPJ_ZERADO) {
		try {
			const dvInformado = cleaned.substring(TAMANHO_CNPJ_SEM_DV);
			const dvCalculado = calculaDV(cleaned.substring(0, TAMANHO_CNPJ_SEM_DV));
			return dvInformado === dvCalculado;
		} catch {
			return false;
		}
	}

	return false;
}

/**
 * Validação de CNPJ numérico tradicional (antigo formato)
 * Usa o algoritmo padrão da Receita Federal
 */
function validateCNPJNumerico(cnpj: string): boolean {
	if (cnpj === CNPJ_ZERADO) return false;

	// Validação do primeiro dígito verificador
	let soma = 0;
	let peso = 5;
	for (let i = 0; i < 12; i++) {
		soma += parseInt(cnpj[i]) * peso;
		peso = peso === 2 ? 9 : peso - 1;
	}
	let dv1 = soma % 11;
	dv1 = dv1 < 2 ? 0 : 11 - dv1;

	if (parseInt(cnpj[12]) !== dv1) return false;

	// Validação do segundo dígito verificador
	soma = 0;
	peso = 6;
	for (let i = 0; i < 13; i++) {
		soma += parseInt(cnpj[i]) * peso;
		peso = peso === 2 ? 9 : peso - 1;
	}
	let dv2 = soma % 11;
	dv2 = dv2 < 2 ? 0 : 11 - dv2;

	return parseInt(cnpj[13]) === dv2;
}

/**
 * Verifica se o CNPJ é do novo formato alfanumérico
 */
export function isCNPJAlfanumerico(cnpj: string): boolean {
	const cleaned = removeMascaraCNPJ(cnpj).toUpperCase();
	// Se contém letras e tem 14 caracteres (após remover máscara), é alfanumérico
	return /^[A-Z\d]{14}$/.test(cleaned) && /[A-Z]/.test(cleaned);
}

/**
 * Formata CNPJ para exibição
 * Suporta ambos os formatos (numérico e alfanumérico)
 *
 * Formatos de saída:
 * - Numérico/Antigo: 00.000.000/0000-00
 * - Alfanumérico: 00.ABC.000/000X-00
 */
export function formatCNPJ(cnpj: string): string {
	const cleaned = removeMascaraCNPJ(cnpj).toUpperCase();

	if (cleaned.length !== TAMANHO_CNPJ) {
		return cnpj;
	}

	// Detecta se é alfanumérico (contém letras na base)
	const isAlfanumerico = /[A-Z]/.test(cleaned.substring(0, 12));

	if (isAlfanumerico) {
		// Formato alfanumérico: XX.XXX.XXX/XXXX-XX
		return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
	} else {
		// Formato numérico: 00.000.000/0000-00
		return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
	}
}

/**
 * Formata CPF para exibição (XXX.XXX.XXX-XX)
 */
export function formatCPF(cpf: string): string {
	const cleaned = cpf.replace(/\D/g, '');

	if (cleaned.length !== TAMANHO_CPF) {
		return cpf;
	}

	return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
}

/**
 * Formata documento (CPF ou CNPJ) para exibição
 * Detecta automaticamente o tipo pelo comprimento
 */
export function formatDocumento(documento: string): string {
	const cleaned = documento.replace(/\D/g, '');

	if (cleaned.length === TAMANHO_CPF) {
		return formatCPF(cleaned);
	} else if (cleaned.length === TAMANHO_CNPJ) {
		return formatCNPJ(cleaned);
	}

	return documento;
}

/**
 * Formata CNPJ durante digitação (mascaramento automático)
 * Suporta tanto números quanto letras
 *
 * Regras de formatação:
 * - Posições 1-2: XX
 * - Posições 3-5: .XXX
 * - Posições 6-8: .XXX
 * - Posições 9-12: /XXXX
 * - Posições 13-14: -XX
 */
export function formatCNPJInput(value: string): string {
	// Aceita apenas letras (A-Z), números e máscara
	const cleaned = value.toUpperCase().replace(/[^A-Z\d./-]/g, '');

	// Se ainda está digitando (menos de 14 caracteres), retorna sem formatação parcial
	// para não interferir na digitação
	if (cleaned.length < 14) {
		return cleaned;
	}

	// Aplica máscara apenas quando tiver 14 caracteres completos
	if (cleaned.length === 14) {
		const isAlfanumerico = /[A-Z]/.test(cleaned.substring(0, 12));
		if (isAlfanumerico) {
			return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
		} else {
			return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
		}
	}

	// Se tiver mais de 14, limita
	return cleaned.slice(0, 14);
}

/**
 * Formata CPF durante digitação (mascaramento automático)
 */
export function formatCPFInput(value: string): string {
	const cleaned = value.replace(/\D/g, '');

	if (cleaned.length < 11) {
		return cleaned;
	}

	if (cleaned.length === 11) {
		return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
	}

	return cleaned.slice(0, 11);
}

/**
 * Retorna mensagem de erro para CNPJ inválido
 */
export function getCNPJErrorMessage(cnpj: string): string | null {
	const cleaned = removeMascaraCNPJ(cnpj).toUpperCase();

	if (!cleaned) {
		return 'CNPJ é obrigatório';
	}

	if (REGEX_CARACTERES_NAO_PERMITIDOS_CNPJ.test(cleaned)) {
		return 'CNPJ contém caracteres inválidos';
	}

	if (cleaned.length < TAMANHO_CNPJ) {
		return 'CNPJ está incompleto';
	}

	if (cleaned.length > TAMANHO_CNPJ) {
		return 'CNPJ tem caracteres excedentes';
	}

	if (cleaned === CNPJ_ZERADO) {
		return 'CNPJ não pode ser zero';
	}

	if (/^[A-Z\d]{12}(\d){2}$/.test(cleaned) || /^\d{14}$/.test(cleaned)) {
		if (!validateCNPJ(cleaned)) {
			return 'Dígitos verificadores inválidos';
		}
	}

	return null;
}

/**
 * Retorna mensagem de erro para CPF inválido
 */
export function getCPFErrorMessage(cpf: string): string | null {
	const cleaned = cpf.replace(/\D/g, '');

	if (!cleaned) {
		return 'CPF é obrigatório';
	}

	if (cleaned.length < TAMANHO_CPF) {
		return 'CPF está incompleto';
	}

	if (cleaned.length > TAMANHO_CPF) {
		return 'CPF tem caracteres excedentes';
	}

	if (cleaned === CPF_ZERADO) {
		return 'CPF não pode ser zero';
	}

	if (!validateCPF(cleaned)) {
		return 'Dígitos verificadores inválidos';
	}

	return null;
}

/**
 * Exemplo de CNPJs válidos para teste
 */
export const CNPJ_EXAMPLES = {
	alfanumerico: ['12.ABC.345/01DE-35', '90.021.382/0001-22', 'R55231B3000700', '44.108.058/0001-29', 'ABCDEFGHIJKL80'],
	numerico: ['00.000.000/0000-00', '12.345.678/0001-90', '90.024.778/0001-23']
};

/**
 * Exemplo de CPFs válidos para teste
 */
export const CPF_EXAMPLES = ['123.456.789-00', '000.000.001-91'];