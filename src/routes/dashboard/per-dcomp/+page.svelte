<script lang="ts">
	// PER/DCOMP Page
	const pedidos = [
		{ id: 'PER-2024-001234', cliente: 'Empresa Alpha Ltda', tipo: 'PER', situacao: 'DEFERIDO', valor: 45000.00, data: '2024-02-15' },
		{ id: 'DCOMP-2024-005678', cliente: 'Comercial Beta S.A.', tipo: 'DCOMP', situacao: 'INDEFERIDO', valor: 12000.00, data: '2024-02-10' },
		{ id: 'PER-2024-003456', cliente: 'Serviços Gamma Eireli', tipo: 'PER', situacao: 'EM_ANALISE', valor: 28000.00, data: '2024-03-01' }
	];

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-slate-800">PER/DCOMP</h1>
			<p class="text-slate-400">Pedidos de Restituição e Compensação</p>
		</div>
		<button class="btn btn-primary flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
			</svg>
			Nuevo PED/DCOMP
		</button>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-4 gap-4">
		<div class="card p-5">
			<div class="text-3xl font-bold text-slate-800">24</div>
			<div class="text-sm text-slate-400">Total de Pedidos</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-success">
			<div class="text-3xl font-bold text-semantic-success">18</div>
			<div class="text-sm text-slate-400">Deferidos</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-warning">
			<div class="text-3xl font-bold text-semantic-warning">4</div>
			<div class="text-sm text-slate-400">Em Análise</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-critical">
			<div class="text-3xl font-bold text-semantic-critical">2</div>
			<div class="text-sm text-slate-400">Indeferidos</div>
		</div>
	</div>

	<!-- Table -->
	<div class="card">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-slate-100/50">
					<tr>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Número</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Cliente</th>
						<th class="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Tipo</th>
						<th class="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
						<th class="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Valor</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Data</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200">
					{#each pedidos as pedido}
						<tr class="hover:bg-slate-100/50">
							<td class="px-4 py-4 text-sm font-mono text-slate-700">{pedido.id}</td>
							<td class="px-4 py-4 text-sm text-slate-800">{pedido.cliente}</td>
							<td class="px-4 py-4 text-center">
								<span class="px-2 py-1 rounded bg-semantic-info/20 text-semantic-info text-sm font-medium">{pedido.tipo}</span>
							</td>
							<td class="px-4 py-4 text-center">
								{#if pedido.situacao === 'DEFERIDO'}
									<span class="status-badge status-success">Deferido</span>
								{:else if pedido.situacao === 'INDEFERIDO'}
									<span class="status-badge status-critical">Indeferido</span>
								{:else}
									<span class="status-badge status-warning">Em Análise</span>
								{/if}
							</td>
							<td class="px-4 py-4 text-sm text-right text-slate-800">{formatCurrency(pedido.valor)}</td>
							<td class="px-4 py-4 text-sm text-slate-600">{pedido.data}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
