<script lang="ts">
	// Installments Page
	const parcelamentos = [
		{ cnpj: '12.345.678/0001-90', cliente: 'Empresa Alpha Ltda', tipo: 'PGFN', total: 48, emAtraso: 21, valorTotal: 125000.00, valorAtraso: 45000.00 },
		{ cnpj: '98.765.432/0001-54', cliente: 'Comercial Beta S.A.', tipo: 'SIMPLES_NACIONAL', total: 60, emAtraso: 13, valorTotal: 89000.00, valorAtraso: 12000.00 },
		{ cnpj: '45.678.901/0001-23', cliente: 'Serviços Gamma Eireli', tipo: 'SIMPLIFICADO', total: 36, emAtraso: 6, valorTotal: 45000.00, valorAtraso: 5000.00 },
		{ cnpj: '78.901.234/0001-67', cliente: 'Indústria Delta Ltda', tipo: 'PREVIDENCIARIO', total: 24, emAtraso: 0, valorTotal: 67000.00, valorAtraso: 0 }
	];

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-terminal-100">Parcelamentos Federais</h1>
			<p class="text-terminal-500">Acompanhamento de débitos parcelados</p>
		</div>
		<button class="btn btn-primary flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
			</svg>
			Novo Parcelamento
		</button>
	</div>

	<!-- Summary Cards -->
	<div class="grid grid-cols-5 gap-4">
		{#each [
			{ tipo: 'PGFN', total: 29, atraso: 21, color: 'critical' },
			{ tipo: 'Simples', total: 52, atraso: 13, color: 'warning' },
			{ tipo: 'Simplif.', total: 24, atraso: 6, color: 'warning' },
			{ tipo: 'Não Prev.', total: 0, atraso: 0, color: 'success' },
			{ tipo: 'Prev.', total: 0, atraso: 0, color: 'success' }
		] as item}
			<div class="card p-4 text-center">
				<div class="text-xs text-terminal-500 uppercase mb-2">{item.tipo}</div>
				<div class="text-2xl font-bold text-terminal-100">{item.total}</div>
				{#if item.atraso > 0}
					<div class="mt-1 px-2 py-0.5 rounded text-xs font-medium bg-semantic-critical/20 text-semantic-critical inline-block">
						{item.atraso} em atraso
					</div>
				{:else}
					<div class="mt-1 text-xs text-semantic-success">Ok</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Table -->
	<div class="card">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-terminal-700/50">
					<tr>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">CNPJ</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Cliente</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Tipo</th>
						<th class="text-center px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Parcelas</th>
						<th class="text-center px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Em Atraso</th>
						<th class="text-right px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Valor Total</th>
						<th class="text-right px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Valor Atraso</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-terminal-700">
					{#each parcelamentos as p}
						<tr class="hover:bg-terminal-700/30">
							<td class="px-4 py-4 text-sm font-mono text-terminal-200">{p.cnpj}</td>
							<td class="px-4 py-4 text-sm text-terminal-100">{p.cliente}</td>
							<td class="px-4 py-4 text-sm text-terminal-300">{getTipoLabel(p.tipo)}</td>
							<td class="px-4 py-4 text-sm text-center text-terminal-100">{p.total}</td>
							<td class="px-4 py-4 text-center">
								{#if p.emAtraso > 0}
									<span class="status-badge status-critical">{p.emAtraso}</span>
								{:else}
									<span class="status-badge status-success">0</span>
								{/if}
							</td>
							<td class="px-4 py-4 text-sm text-right text-terminal-100">{formatCurrency(p.valorTotal)}</td>
							<td class="px-4 py-4 text-sm text-right {p.valorAtraso > 0 ? 'text-semantic-critical' : 'text-terminal-400'}">
								{formatCurrency(p.valorAtraso)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
