// Report generation service for PDF and Excel exports
// Using browser-native APIs for PDF (jsPDF) and Excel (ExcelJS)

export interface ClienteReport {
	id: string;
	cnpj: string;
	nomeRazao: string;
	nomeFantasia: string | null;
	regime: string;
	situacaoFiscal: string;
	obrigacoesCount: number;
	parcelamentosCount: number;
	mensagensCount: number;
	data: {
		[key: string]: string | number | null;
	};
}

export async function generateClientePDF(cliente: ClienteReport): Promise<Blob> {
	// Dynamic import of jsPDF to avoid SSR issues
	const { default: jsPDF } = await import('jspdf');

	const doc = new jsPDF();

	// Header
	doc.setFontSize(20);
	doc.setTextColor(40);
	doc.text('DOGUP Contábil', 20, 20);

	doc.setFontSize(12);
	doc.setTextColor(100);
	doc.text('Relatório de Conformidade Fiscal', 20, 28);

	doc.setDrawColor(200);
	doc.line(20, 32, 190, 32);

	// Client Info
	let y = 45;
	doc.setFontSize(14);
	doc.setTextColor(40);
	doc.text(cliente.nomeRazao, 20, y);

	if (cliente.nomeFantasia) {
		y += 8;
		doc.setFontSize(10);
		doc.setTextColor(100);
		doc.text(cliente.nomeFantasia, 20, y);
	}

	y += 15;
	doc.setFontSize(10);
	doc.setTextColor(60);

	const formatCNPJ = (cnpj: string) => {
		if (cnpj.length !== 14) return cnpj;
		return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
	};

	const getSituacaoLabel = (situacao: string) => {
		const labels: Record<string, string> = {
			REGULAR: 'Regular',
			REGULARIZADO: 'Regularizado',
			IRREGULAR: 'Irregular'
		};
		return labels[situacao] || situacao;
	};

	// Dados Cadastrais
	doc.setFontSize(12);
	doc.setTextColor(40);
	doc.text('Dados Cadastrais', 20, y);
	y += 8;

	doc.setFontSize(10);
	doc.setTextColor(60);

	const clientData = [
		['CNPJ', formatCNPJ(cliente.cnpj)],
		['Regime Tributário', cliente.regime === 'SIMPLES_NACIONAL' ? 'Simples Nacional' : 'Normal'],
		['Situação Fiscal', getSituacaoLabel(cliente.situacaoFiscal)]
	];

	clientData.forEach(([label, value]) => {
		doc.text(`${label}:`, 20, y);
		doc.text(String(value), 70, y);
		y += 6;
	});

	// Estatísticas
	y += 10;
	doc.setFontSize(12);
	doc.setTextColor(40);
	doc.text('Estatísticas', 20, y);
	y += 8;

	doc.setFontSize(10);
	doc.setTextColor(60);

	const statsData = [
		['Obrigações Acessórias', cliente.obrigacoesCount.toString()],
		['Parcelamentos', cliente.parcelamentosCount.toString()],
		['Mensagens e-CAC', cliente.mensagensCount.toString()]
	];

	statsData.forEach(([label, value]) => {
		doc.text(`${label}:`, 20, y);
		doc.text(value, 70, y);
		y += 6;
	});

	// Footer
	y = 280;
	doc.setFontSize(8);
	doc.setTextColor(150);
	doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 20, y);
	doc.text('DOGUP Contábil - Sistema de Conformidade Fiscal', 20, y + 4);

	// Return as blob
	return doc.output('blob');
}

export async function generateExcelClientes(clientes: ClienteReport[]): Promise<Blob> {
	// Dynamic import of exceljs to avoid SSR issues
	const ExcelJS = await import('exceljs');

	const formatCNPJ = (cnpj: string) => {
		if (cnpj.length !== 14) return cnpj;
		return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
	};

	const getSituacaoLabel = (situacao: string) => {
		const labels: Record<string, string> = {
			REGULAR: 'Regular',
			REGULARIZADO: 'Regularizado',
			IRREGULAR: 'Irregular'
		};
		return labels[situacao] || situacao;
	};

	const getRegimeLabel = (regime: string) => {
		return regime === 'SIMPLES_NACIONAL' ? 'Simples Nacional' : 'Normal';
	};

	// Create workbook and worksheet
	const workbook = new ExcelJS.Workbook();
	workbook.creator = 'DOGUP Contábil';
	workbook.created = new Date();

	const worksheet = workbook.addWorksheet('Clientes');

	// Add headers
	worksheet.columns = [
		{ header: 'CNPJ', key: 'cnpj', width: 18 },
		{ header: 'Razão Social', key: 'razaoSocial', width: 40 },
		{ header: 'Nome Fantasia', key: 'nomeFantasia', width: 30 },
		{ header: 'Regime', key: 'regime', width: 18 },
		{ header: 'Situação Fiscal', key: 'situacao', width: 15 },
		{ header: 'Obrigações', key: 'obrigacoes', width: 12 },
		{ header: 'Parcelamentos', key: 'parcelamentos', width: 15 }
	];

	// Style headers
	worksheet.getRow(1).font = { bold: true };
	worksheet.getRow(1).fill = {
		type: 'pattern',
		pattern: 'solid',
		fgColor: { argb: 'FF334155' }
	};
	worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

	// Add data rows
	clientes.forEach((c) => {
		worksheet.addRow({
			cnpj: formatCNPJ(c.cnpj),
			razaoSocial: c.nomeRazao,
			nomeFantasia: c.nomeFantasia || '',
			regime: getRegimeLabel(c.regime),
			situacao: getSituacaoLabel(c.situacaoFiscal),
			obrigacoes: c.obrigacoesCount,
			parcelamentos: c.parcelamentosCount
		});
	});

	// Return as blob
	const buffer = await workbook.xlsx.writeBuffer();
	return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
