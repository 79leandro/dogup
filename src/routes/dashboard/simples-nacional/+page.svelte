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
		<h1 class="font-display text-2xl font-bold text-terminal-100">Simples Nacional</h1>
		<p class="text-terminal-500">acompanhamento de clientes optantes</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-4 gap-4">
		<div class="card p-5">
			<div class="text-3xl font-bold text-semantic-success">155</div>
			<div class="text-sm text-terminal-500">Optantes Ativos</div>
		</div>
		<div class="card p-5">
			<div class="text-3xl font-bold text-semantic-warning">8</div>
			<div class="text-sm text-terminal-500">Em Processo de Exclusão</div>
		</div>
		<div class="card p-5">
			<div class="text-3xl font-bold text-semantic-critical">4</div>
			<div class="text-sm text-terminal-500">Excluídos</div>
		</div>
		<div class="card p-5">
			<div class="text-3xl font-bold text-terminal-100">R$ 45.2M</div>
			<div class="text-sm text-terminal-500">Faturamento Anual</div>
		</div>
	</div>

	<!-- Table -->
	<div class="card">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-terminal-700/50">
					<tr>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">CNPJ</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Cliente</th>
						<th class="text-center px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Status</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Desde</th>
						<th class="text-right px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Faturamento</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-terminal-700">
					{#each clientes as cliente}
						<tr class="hover:bg-terminal-700/30">
							<td class="px-4 py-4 text-sm font-mono text-terminal-200">{cliente.cnpj}</td>
							<td class="px-4 py-4 text-sm text-terminal-100">{cliente.cliente}</td>
							<td class="px-4 py-4 text-center">
								{#if cliente.situacao === 'OPTANTE'}
									<span class="status-badge status-success">Optante</span>
								{:else if cliente.situacao === 'EXCLUIDO'}
									<span class="status-badge status-critical">Excluído</span>
								{:else}
									<span class="status-badge status-warning">Em Análise</span>
								{/if}
							</td>
							<td class="px-4 py-4 text-sm text-terminal-300">{cliente.since}</td>
							<td class="px-4 py-4 text-sm text-right text-terminal-100">{formatCurrency(cliente.营业额)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
