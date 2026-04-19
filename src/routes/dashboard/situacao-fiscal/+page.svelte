<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import ChartDoughnut from '$lib/components/charts/ChartDoughnut.svelte';

	let { data } = $props();

	const stats = $derived(data.stats);
	const clientes = $derived(data.clientes);

	const columns = [
		{ key: 'cnpj', label: 'CNPJ', sortable: true, width: '140px' },
		{ key: 'nomeRazao', label: 'Cliente', sortable: true },
		{ key: 'situacaoFiscal', label: 'Status', sortable: true, width: '120px', align: 'center' as const },
		{ key: 'regime', label: 'Regime', sortable: true, width: '120px', align: 'center' as const }
	];

	function getSituacaoBadge(situacao: string): { class: string; label: string } {
		const badges: Record<string, { class: string; label: string }> = {
			REGULAR: { class: 'status-success', label: 'Regular' },
			REGULARIZADO: { class: 'status-warning', label: 'Regularizado' },
			IRREGULAR: { class: 'status-critical', label: 'Irregular' }
		};
		return badges[situacao] || { class: '', label: situacao };
	}

	function formatCNPJ(cnpj: string): string {
		if (cnpj.length !== 14) return cnpj;
		return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
	}

	function formatRow(row: any) {
		const situacao = getSituacaoBadge(row.situacaoFiscal);
		const regimeLabel = row.regime === 'SIMPLES_NACIONAL' ? 'Simples' : 'Normal';
		return {
			...row,
			cnpj: formatCNPJ(row.cnpj),
			situacaoFiscal: situacao.label,
			regime: regimeLabel
		};
	}

	function formatDate(date: Date | string): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('pt-BR');
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl font-bold text-slate-800">Situação Fiscal Federal</h1>
		<p class="text-slate-400">Status de regularidade dos clientes</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="card p-5 border-l-4 border-l-semantic-success">
			<div class="text-3xl font-bold text-semantic-success">{stats.regular}</div>
			<div class="text-sm text-slate-500 mt-1">Clientes Regulares</div>
			<div class="text-xs text-slate-400 mt-1">{stats.percentages.regular}% do total</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-warning">
			<div class="text-3xl font-bold text-semantic-warning">{stats.regularizado}</div>
			<div class="text-sm text-slate-500 mt-1">Em Regularização</div>
			<div class="text-xs text-slate-400 mt-1">{stats.percentages.regularizado}% do total</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-critical">
			<div class="text-3xl font-bold text-semantic-critical">{stats.irregular}</div>
			<div class="text-sm text-slate-500 mt-1">Irregulares</div>
			<div class="text-xs text-slate-400 mt-1">{stats.percentages.irregular}% do total</div>
		</div>
	</div>

	<!-- Chart + Table -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Doughnut Chart -->
		<div class="card p-5">
			<h3 class="font-semibold text-slate-800 mb-4">Distribuição</h3>
			<div class="h-56">
				<ChartDoughnut
					data={[stats.regular, stats.regularizado, stats.irregular]}
					labels={['Regular', 'Regularizado', 'Irregular']}
					colors={['#10B981', '#F59E0B', '#EF4444']}
				/>
			</div>
			<div class="mt-4 space-y-2">
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 rounded-full bg-semantic-success"></div>
					<span class="text-sm text-slate-500">Regular</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 rounded-full bg-semantic-warning"></div>
					<span class="text-sm text-slate-500">Regularizado</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 rounded-full bg-semantic-critical"></div>
					<span class="text-sm text-slate-500">Irregular</span>
				</div>
			</div>
		</div>

		<!-- Table -->
		<div class="lg:col-span-2">
			<DataTable
				data={clientes}
				{columns}
				rowKey="id"
				searchable={true}
				searchPlaceholder="Buscar por CNPJ ou cliente..."
				pageSize={10}
				emptyMessage="Nenhum cliente encontrado"
				formatRow={formatRow}
			/>
		</div>
	</div>
</div>
