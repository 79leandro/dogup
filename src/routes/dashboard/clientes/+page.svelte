<script lang="ts">
	// DOG 360° - Client Management Page
	const clientes = [
		{ cnpj: '12.345.678/0001-90', nome: 'Empresa Alpha Ltda', regime: 'SIMPLES_NACIONAL', situacao: 'REGULAR' },
		{ cnpj: '98.765.432/0001-54', nome: 'Comercial Beta S.A.', regime: 'NORMAL', situacao: 'IRREGULAR' },
		{ cnpj: '45.678.901/0001-23', nome: 'Serviços Gamma Eireli', regime: 'SIMPLES_NACIONAL', situacao: 'REGULARIZADO' },
		{ cnpj: '78.901.234/0001-67', nome: 'Indústria Delta Ltda', regime: 'NORMAL', situacao: 'REGULAR' },
		{ cnpj: '34.567.890/0001-45', nome: 'Tech Solutions Eireli', regime: 'SIMPLES_NACIONAL', situacao: 'IRREGULAR' }
	];

	const stats = {
		total: 221,
		simplesNacional: 155,
		normal: 66
	};

	function getSituacaoClass(situacao: string): string {
		const classes: Record<string, string> = {
			REGULAR: 'status-success',
			REGULARIZADO: 'status-warning',
			IRREGULAR: 'status-critical'
		};
		return classes[situacao] || '';
	}

	function getRegimeClass(regime: string): string {
		return regime === 'SIMPLES_NACIONAL' ? 'text-semantic-success' : 'text-semantic-info';
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-terminal-100">DOG 360°</h1>
			<p class="text-terminal-500">Gestão completa da base de clientes</p>
		</div>
		<div class="flex gap-3">
			<button class="btn btn-ghost flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
				</svg>
				Exportar
			</button>
			<button class="btn btn-primary flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
				</svg>
				Novo Cliente
			</button>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-3 gap-6">
		<div class="card p-5">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 rounded-xl bg-semantic-info/10 flex items-center justify-center">
					<svg class="w-6 h-6 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
					</svg>
				</div>
				<div>
					<div class="text-2xl font-bold text-terminal-100">{stats.total}</div>
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
					<div class="text-2xl font-bold text-semantic-success">{stats.simplesNacional}</div>
					<div class="text-sm text-terminal-500">Simples Nacional (70%)</div>
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
					<div class="text-2xl font-bold text-semantic-info">{stats.normal}</div>
					<div class="text-sm text-terminal-500">Normal (30%)</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Clients Table -->
	<div class="card">
		<div class="p-4 border-b border-terminal-700">
			<div class="flex items-center justify-between">
				<h2 class="font-semibold text-terminal-100">Lista de Clientes</h2>
				<div class="flex items-center gap-2">
					<div class="relative">
						<input
							type="text"
							placeholder="Buscar cliente..."
							class="input w-64 pl-10 py-2 text-sm"
						/>
						<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-terminal-700/50">
					<tr>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase tracking-wider">CNPJ</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase tracking-wider">Razão Social</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase tracking-wider">Regime</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase tracking-wider">Situação</th>
						<th class="text-right px-4 py-3 text-xs font-medium text-terminal-400 uppercase tracking-wider">Ações</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-terminal-700">
					{#each clientes as cliente}
						<tr class="hover:bg-terminal-700/30 transition-colors">
							<td class="px-4 py-4 text-sm font-mono text-terminal-200">{cliente.cnpj}</td>
							<td class="px-4 py-4 text-sm text-terminal-100">{cliente.nome}</td>
							<td class="px-4 py-4">
								<span class="{getRegimeClass(cliente.regime)} text-sm font-medium">
									{cliente.regime === 'SIMPLES_NACIONAL' ? 'Simples Nacional' : 'Normal'}
								</span>
							</td>
							<td class="px-4 py-4">
								<span class="status-badge {getSituacaoClass(cliente.situacao)}">
									{cliente.situacao === 'REGULARIZADO' ? 'Regularizado' : cliente.situacao.charAt(0) + cliente.situacao.slice(1).toLowerCase()}
								</span>
							</td>
							<td class="px-4 py-4 text-right">
								<button class="text-terminal-400 hover:text-terminal-100 transition-colors">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
									</svg>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		<div class="p-4 border-t border-terminal-700 flex items-center justify-between">
			<span class="text-sm text-terminal-500">Mostrando 1-5 de 221 clientes</span>
			<div class="flex items-center gap-2">
				<button class="btn btn-ghost px-3 py-1.5 text-sm" disabled>Anterior</button>
				<button class="btn btn-primary px-3 py-1.5 text-sm">1</button>
				<button class="btn btn-ghost px-3 py-1.5 text-sm">2</button>
				<button class="btn btn-ghost px-3 py-1.5 text-sm">3</button>
				<span class="text-terminal-500 px-2">...</span>
				<button class="btn btn-ghost px-3 py-1.5 text-sm">45</button>
				<button class="btn btn-ghost px-3 py-1.5 text-sm">Próximo</button>
			</div>
		</div>
	</div>
</div>
