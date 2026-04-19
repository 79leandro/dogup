<script lang="ts">
	// Simples Nacional Page
	const clientes = [
		{ cnpj: '12.345.678/0001-90', cliente: 'Empresa Alpha Ltda', situacao: 'OPTANTE',since: '2020-01-01',营业额: 450000.00 },
		{ cnpj: '45.678.901/0001-23', cliente: 'Serviços Gamma Eireli', situacao: 'OPTANTE', since: '2021-01-01',营业额: 280000.00 },
		{ cnpj: '34.567.890/0001-45', cliente: 'Tech Solutions Eireli', situacao: 'EXCLUIDO', since: '2023-07-01',营业额: 180000.00 }
	];

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl font-bold text-slate-800">Simples Nacional</h1>
		<p class="text-slate-400">acompanhamento de clientes optantes</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-4 gap-4">
		<div class="card p-5">
			<div class="text-3xl font-bold text-semantic-success">155</div>
			<div class="text-sm text-slate-400">Optantes Ativos</div>
		</div>
		<div class="card p-5">
			<div class="text-3xl font-bold text-semantic-warning">8</div>
			<div class="text-sm text-slate-400">Em Processo de Exclusão</div>
		</div>
		<div class="card p-5">
			<div class="text-3xl font-bold text-semantic-critical">4</div>
			<div class="text-sm text-slate-400">Excluídos</div>
		</div>
		<div class="card p-5">
			<div class="text-3xl font-bold text-slate-800">R$ 45.2M</div>
			<div class="text-sm text-slate-400">Faturamento Anual</div>
		</div>
	</div>

	<!-- Table -->
	<div class="card">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-slate-100/50">
					<tr>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">CNPJ</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Cliente</th>
						<th class="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Desde</th>
						<th class="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Faturamento</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200">
					{#each clientes as cliente}
						<tr class="hover:bg-slate-100/50">
							<td class="px-4 py-4 text-sm font-mono text-slate-700">{cliente.cnpj}</td>
							<td class="px-4 py-4 text-sm text-slate-800">{cliente.cliente}</td>
							<td class="px-4 py-4 text-center">
								{#if cliente.situacao === 'OPTANTE'}
									<span class="status-badge status-success">Optante</span>
								{:else if cliente.situacao === 'EXCLUIDO'}
									<span class="status-badge status-critical">Excluído</span>
								{:else}
									<span class="status-badge status-warning">Em Análise</span>
								{/if}
							</td>
							<td class="px-4 py-4 text-sm text-slate-600">{cliente.since}</td>
							<td class="px-4 py-4 text-sm text-right text-slate-800">{formatCurrency(cliente.营业额)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
