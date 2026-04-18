<script lang="ts">
	import { onMount } from 'svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import { notifications } from '$lib/stores/notifications';

	interface Cliente {
		id: string;
		cnpj: string;
		nomeRazao: string;
		nomeFantasia: string | null;
		regime: string;
		situacaoFiscal: string;
		_count?: {
			obrigacoes: number;
			parcelamentos: number;
		};
	}

	let clientes = $state<Cliente[]>([]);
	let isLoading = $state(true);
	let searchQuery = $state('');

	const columns = [
		{ key: 'cnpj', label: 'CNPJ', sortable: true, width: '140px' },
		{ key: 'nomeRazao', label: 'Razão Social', sortable: true },
		{ key: 'nomeFantasia', label: 'Nome Fantasia', sortable: false },
		{
			key: 'regime',
			label: 'Regime',
			sortable: true,
			width: '120px',
			align: 'center' as const
		},
		{
			key: 'situacaoFiscal',
			label: 'Situação',
			sortable: true,
			width: '120px',
			align: 'center' as const
		},
		{
			key: 'obrigacoes',
			label: 'Obrig.',
			sortable: false,
			width: '80px',
			align: 'center' as const
		}
	];

	function getSituacaoBadge(situacao: string): { class: string; label: string } {
		const badges: Record<string, { class: string; label: string }> = {
			REGULAR: { class: 'status-success', label: 'Regular' },
			REGULARIZADO: { class: 'status-warning', label: 'Regularizado' },
			IRREGULAR: { class: 'status-critical', label: 'Irregular' }
		};
		return badges[situacao] || { class: '', label: situacao };
	}

	async function fetchClientes() {
		isLoading = true;
		try {
			const params = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
			const response = await fetch(`/api/clientes${params}`);
			const data = await response.json();

			if (response.ok) {
				clientes = data.clientes || [];
			} else {
				notifications.error('Erro ao carregar clientes', data.error);
			}
		} catch (error) {
			notifications.error('Erro de conexão', 'Não foi possível carregar os clientes');
		} finally {
			isLoading = false;
		}
	}

	async function deleteCliente(id: string, nomeRazao: string) {
		if (!confirm(`Tem certeza que deseja excluir ${nomeRazao}?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
			const data = await response.json();

			if (response.ok) {
				notifications.success('Cliente excluído', `${nomeRazao} foi removido`);
				fetchClientes();
			} else {
				notifications.error('Erro ao excluir', data.error);
			}
		} catch (error) {
			notifications.error('Erro de conexão', 'Não foi possível excluir o cliente');
		}
	}

	function formatRow(row: any) {
		const situacao = getSituacaoBadge(row.situacaoFiscal);
		const regimeLabel = row.regime === 'SIMPLES_NACIONAL' ? 'Simples Nacional' : 'Normal';
		return {
			...row,
			nomeFantasia: row.nomeFantasia || '-',
			regime: regimeLabel,
			situacaoFiscal: situacao.label,
			obrigacoes: row._count?.obrigacoes || 0
		};
	}

	function handleRowClick(row: Cliente) {
		window.location.href = `/dashboard/clientes/${row.id}`;
	}

	onMount(() => {
		fetchClientes();
	});
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-terminal-100">DOGUP 360°</h1>
			<p class="text-terminal-500">Gestão completa da base de clientes</p>
		</div>
		<a href="/dashboard/clientes/novo" class="btn btn-primary flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
			</svg>
			Novo Cliente
		</a>
	</div>

	<!-- Stats Cards -->
	{#if !isLoading && clientes.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="card p-5">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-semantic-info/10 flex items-center justify-center">
						<svg class="w-6 h-6 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
						</svg>
					</div>
					<div>
						<div class="text-2xl font-bold text-terminal-100">{clientes.length}</div>
						<div class="text-sm text-terminal-500">Total de Clientes</div>
					</div>
				</div>
			</div>
			<div class="card p-5">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-semantic-success/10 flex items-center justify-center">
						<svg class="w-6 h-6 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<div>
						<div class="text-2xl font-bold text-semantic-success">
							{clientes.filter(c => c.regime === 'SIMPLES_NACIONAL').length}
						</div>
						<div class="text-sm text-terminal-500">Simples Nacional</div>
					</div>
				</div>
			</div>
			<div class="card p-5">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-semantic-warning/10 flex items-center justify-center">
						<svg class="w-6 h-6 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
						</svg>
					</div>
					<div>
						<div class="text-2xl font-bold text-semantic-info">
							{clientes.filter(c => c.regime === 'NORMAL').length}
						</div>
						<div class="text-sm text-terminal-500">Normal</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Clients Table -->
	<DataTable
		data={clientes}
		{columns}
		rowKey="id"
		searchable={true}
		searchPlaceholder="Buscar por CNPJ ou razão social..."
		pageSize={10}
		emptyMessage="Nenhum cliente encontrado"
		loading={isLoading}
		formatRow={formatRow}
		onRowClick={handleRowClick}
	/>
</div>
