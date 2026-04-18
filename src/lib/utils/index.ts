import { clsx, type ClassValue } from 'clsx';
import { formatCNPJ as formatCNPJUtil } from './cnpj';

export function cn(...inputs: ClassValue[]): string {
	return clsx(inputs);
}

export function formatCnpj(cnpj: string): string {
	return formatCNPJUtil(cnpj);
}

export function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(value);
}

export function formatDate(date: Date | string): string {
	return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

export function formatPercent(value: number): string {
	return `${value.toFixed(1)}%`;
}

export function getStatusColor(status: string): string {
	const colors: Record<string, string> = {
		REGULAR: 'success',
		REGULARIZADO: 'warning',
		IRREGULAR: 'critical',
		ENTREGUE: 'success',
		NAO_ENTREGUE: 'critical',
		INCONSISTENCIA: 'warning',
		EM_PROCESSAMENTO: 'warning',
		OUTROS: 'info'
	};
	return colors[status] || 'info';
}
