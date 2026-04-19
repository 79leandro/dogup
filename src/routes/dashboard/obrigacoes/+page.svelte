<script lang="ts">
	import { onMount } from 'svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import { notifications } from '$lib/stores/notifications';

	interface Obrigacao {
		id: string;
		clienteId: string;
		tipo: string;
		ano: number;
		mes: number;
		status: string;
		reciboUrl: string | null;
		observacao: string | null;
		cliente: {
			id: string;
			cnpj: string;
			nomeRazao: string;
		};
	}

	let obrigacoes = $state<Obrigacao[]>([]);
	let isLoading = $state(true);
	let stats = $state({ total: 0, entregue: 0, percentualEntrega: 0 });

	let selectedYear = $state(new Date().getFullYear().toString());
	let selectedMonth = $state('todos');
	let selectedType = $state('todos');

	const columns = [
		{ key: 'cnpj', label: 'CNPJ', sortable: true, width: '140px' },
		{ key: 'cliente', label: 'Cliente', sortable: true },
		{ key: 'tipo', label: 'Tipo', sortable: true, width: '100px', align: 'center' as const },
		{
			key: 'periodo',
			label: 'Período',
			sortable: true,
			width: '100px',
			align: 'center' as const
		},
		{
			key: 'status',
			label: 'Status',
			sortable: true,
			width: '130px',
			align: 'center' as const
		},
		{ key: 'recibo', label: 'Recibo/Observação', width: '150px' }
	];

	async function fetchObrigacoes() {
		isLoading = true;
		try {
			const params = new URLSearchParams();
			if (selectedYear !== 'todos') params.set('ano', selectedYear);
			if (selectedMonth !== 'todos') params.set('mes', selectedMonth);
			if (selectedType !== 'todos') params.set('tipo', selectedType);

			const response = await fetch(`/api/obrigacoes?${params.toString()}`);
			const data = await response.json();

			if (response.ok) {
				obrigacoes = data.obrigacoes || [];
			} else {
				notifications.error('Erro ao carregar obrigações', data.error);
			}
		} catch (error) {
			notifications.error('Erro de conexão', 'Não foi possível carregar as obrigações');
		} finally {
			isLoading = false;
		}
	}

	async function fetchStats() {
		try {
			const response = await fetch('/api/obrigacoes?stats=true');
			const data = await response.json();

			if (response.ok) {
				stats = data.stats;
			}
		} catch (error) {
			// Silently fail for stats
		}
	}

	function getStatusBadge(status: string): { class: string; label: string } {
		const badges: Record<string, { class: string; label: string }> = {
			ENTREGUE: { class: 'status-success', label: 'Entregue' },
			NAO_ENTREGUE: { class: 'status-critical', label: 'Não Entregue' },
			INCONSISTENCIA: { class: 'status-warning', label: 'Inconsistência' },
			EM_PROCESSAMENTO: { class: 'status-warning', label: 'Em Processamento' },
			OUTROS: { class: 'bg-slate-100 text-slate-600', label: 'Outros' }
		};
		return badges[status] || badges.OUTROS;
	}

	function getMonthName(month: number): string {
		const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
		return months[month - 1];
	}

	function formatCNPJ(cnpj: string): string {
		if (cnpj.length !== 14) return cnpj;
		return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
	}

	function formatRow(row: any) {
		const badge = getStatusBadge(row.status);
		return {
			...row,
			cnpj: formatCNPJ(row.cliente.cnpj),
			cliente: row.cliente.nomeRazao,
			periodo: `${getMonthName(row.mes)}/${row.ano}`,
			status: badge.label,
			recibo: row.observacao || row.reciboUrl || '-'
		};
	}

	function handleFilterChange() {
		fetchObrigacoes();
	}

	onMount(() => {
		fetchObrigacoes();
		fetchStats();
	});
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-slate-800">Obrigações Acessórias</h1>
			<p class="text-slate-400">Monitoramento de transmissões DCTFWeb</p>
		</div>
	</div>

	<!-- Filters Card -->
	<div class="card p-4">
		<div class="flex flex-wrap items-end gap-4">
			<div>
				<label for="filter-tipo" class="label text-xs">Tipo</label>
				<select id="filter-tipo" bind:value={selectedType} onchange={handleFilterChange} class="input w-40">
					<option value="todos">Todos</option>
					<option value="DCTFWEB">DCTFWeb</option>
					<option value="GFIP">GFIP</option>
					<option value="DIRF">DIRF</option>
				</select>
			</div>
			<div>
				<label for="filter-ano" class="label text-xs">Ano</label>
				<select id="filter-ano" bind:value={selectedYear} onchange={handleFilterChange} class="input w-28">
					<option value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</option>
					<option value={(new Date().getFullYear() - 1).toString()}>{new Date().getFullYear() - 1}</option>
					<option value={(new Date().getFullYear() - 2).toString()}>{new Date().getFullYear() - 2}</option>
				</select>
			</div>
			<div>
				<label for="filter-mes" class="label text-xs">Mês</label>
				<select id="filter-mes" bind:value={selectedMonth} onchange={handleFilterChange} class="input w-32">
					<option value="todos">Todos</option>
					<option value="1">Janeiro</option>
					<option value="2">Fevereiro</option>
					<option value="3">Março</option>
					<option value="4">Abril</option>
					<option value="5">Maio</option>
					<option value="6">Junho</option>
					<option value="7">Julho</option>
					<option value="8">Agosto</option>
					<option value="9">Setembro</option>
					<option value="10">Outubro</option>
					<option value="11">Novembro</option>
					<option value="12">Dezembro</option>
				</select>
			</div>
			<div class="flex-1"></div>
			<div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100/50">
				<span class="text-sm text-slate-500">Taxa de entrega:</span>
				<span class="text-xl font-bold text-semantic-success">{stats.percentualEntrega}%</span>
			</div>
		</div>
	</div>

	<!-- Obligations Table -->
	<DataTable
		data={obrigacoes}
		{columns}
		rowKey="id"
		searchable={true}
		searchPlaceholder="Buscar por CNPJ ou cliente..."
		pageSize={10}
		emptyMessage="Nenhuma obrigação encontrada"
		loading={isLoading}
		formatRow={formatRow}
	/>
</div>
