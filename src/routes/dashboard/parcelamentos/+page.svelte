<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';

	let { data } = $props();

	const columns = [
		{ key: 'cnpj', label: 'CNPJ', sortable: true, width: '140px' },
		{ key: 'cliente', label: 'Cliente', sortable: true },
		{ key: 'tipo', label: 'Tipo', sortable: true, width: '130px', align: 'center' as const },
		{ key: 'parcelas', label: 'Parcelas', sortable: true, width: '90px', align: 'center' as const },
		{ key: 'parcelasEmAtraso', label: 'Em Atraso', sortable: true, width: '100px', align: 'center' as const },
		{ key: 'valorTotal', label: 'Valor Total', sortable: true, width: '120px', align: 'right' as const },
		{ key: 'valorAtraso', label: 'Valor Atraso', sortable: true, width: '120px', align: 'right' as const }
	];

	const summaryItems = $derived(data.summary);

	function formatCurrency(value: unknown): string {
		if (!value) return 'R$ 0,00';
		const num = typeof value === 'string' ? parseFloat(value) : Number(value);
		if (isNaN(num)) return 'R$ 0,00';
		return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
	}

	function formatCNPJ(cnpj: string): string {
		if (cnpj.length !== 14) return cnpj;
		return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
	}

	function getTipoLabel(tipo: string): string {
		const labels: Record<string, string> = {
			PGFN: 'PGFN',
			SIMPLES_NACIONAL: 'Simples Nacional',
			SIMPLIFICADO: 'Simplificado',
			PREVIDENCIARIO: 'Previdenciário',
			NAO_PREVIDENCIARIO: 'Não Prev.'
		};
		return labels[tipo] || tipo;
	}

	function formatRow(row: any) {
		return {
			...row,
			cnpj: formatCNPJ(row.cliente.cnpj),
			cliente: row.cliente.nomeRazao,
			tipo: getTipoLabel(row.tipo),
			total: row.parcelas,
			valorTotal: formatCurrency(row.total),
			valorAtraso: formatCurrency(row.valorAtraso)
		};
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-slate-800">Parcelamentos Federais</h1>
			<p class="text-slate-400">Acompanhamento de débitos parcelados</p>
		</div>
		<button class="btn btn-primary flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
			</svg>
			Novo Parcelamento
		</button>
	</div>

	<!-- Summary Cards -->
	<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
		{#each summaryItems as item}
			<div class="card p-4 text-center">
				<div class="text-xs text-slate-400 uppercase mb-2">{item.tipo}</div>
				<div class="text-2xl font-bold text-slate-800">{item.total}</div>
				{#if item.atraso > 0}
					<div class="mt-1 px-2 py-0.5 rounded text-xs font-medium bg-semantic-critical/20 text-semantic-critical inline-block">
						{item.atraso} em atraso
					</div>
				{:else}
					<div class="mt-1 text-xs text-semantic-success">Ok</div>
				{/if}
			</div>
		{:else}
			{#each ['PGFN', 'Simples', 'Simplif.', 'Não Prev.', 'Prev.'] as tipo, i}
				<div class="card p-4 text-center">
					<div class="text-xs text-slate-400 uppercase mb-2">{tipo}</div>
					<div class="text-2xl font-bold text-slate-800">0</div>
					<div class="mt-1 text-xs text-semantic-success">Ok</div>
				</div>
			{/each}
		{/each}
	</div>

	<!-- Table -->
	<DataTable
		data={data.parcelamentos}
		{columns}
		rowKey="id"
		searchable={true}
		searchPlaceholder="Buscar por CNPJ ou cliente..."
		pageSize={10}
		emptyMessage="Nenhum parcelamento encontrado"
		formatRow={formatRow}
	/>
</div>
