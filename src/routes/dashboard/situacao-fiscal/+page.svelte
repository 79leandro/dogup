<script lang="ts">
	// Fiscal Status Page
	const clientes = [
		{ cnpj: '12.345.678/0001-90', nome: 'Empresa Alpha Ltda', situacao: 'REGULAR', since: '2024-01-01' },
		{ cnpj: '98.765.432/0001-54', nome: 'Comercial Beta S.A.', situacao: 'IRREGULAR', since: '2024-02-15' },
		{ cnpj: '45.678.901/0001-23', nome: 'Serviços Gamma Eireli', situacao: 'REGULARIZADO', since: '2024-03-01' },
		{ cnpj: '78.901.234/0001-67', nome: 'Indústria Delta Ltda', situacao: 'REGULAR', since: '2024-01-15' },
		{ cnpj: '34.567.890/0001-45', nome: 'Tech Solutions Eireli', situacao: 'IRREGULAR', since: '2024-03-10' }
	];

	const stats = {
		regular: { count: 90, percentage: 41.5 },
		regularizado: { count: 33, percentage: 15.2 },
		irregular: { count: 94, percentage: 43.3 }
	};

	function getSituacaoBadge(situacao: string) {
		const badges: Record<string, { class: string; label: string }> = {
			REGULAR: { class: 'status-success', label: 'Regular' },
			REGULARIZADO: { class: 'status-warning', label: 'Regularizado' },
			IRREGULAR: { class: 'status-critical', label: 'Irregular' }
		};
		return badges[situacao];
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl font-bold text-terminal-100">Situação Fiscal Federal</h1>
		<p class="text-terminal-500">Status de regularidade dos clientes</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-3 gap-6">
		<div class="card p-5 border-l-4 border-l-semantic-success">
			<div class="text-3xl font-bold text-semantic-success">{stats.regular.count}</div>
			<div class="text-sm text-terminal-400 mt-1">Clientes Regulares</div>
			<div class="text-xs text-terminal-500 mt-1">{stats.regular.percentage}% do total</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-warning">
			<div class="text-3xl font-bold text-semantic-warning">{stats.regularizado.count}</div>
			<div class="text-sm text-terminal-400 mt-1">Em Regularização</div>
			<div class="text-xs text-terminal-500 mt-1">{stats.regularizado.percentage}% do total</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-critical">
			<div class="text-3xl font-bold text-semantic-critical">{stats.irregular.count}</div>
			<div class="text-sm text-terminal-400 mt-1">Irregulares</div>
			<div class="text-xs text-terminal-500 mt-1">{stats.irregular.percentage}% do total</div>
		</div>
	</div>

	<!-- Chart + Table -->
	<div class="grid grid-cols-3 gap-6">
		<!-- Doughnut Chart -->
		<div class="card p-6">
			<h3 class="font-semibold text-terminal-100 mb-4">Distribuição</h3>
			<div class="flex justify-center">
				<svg width="200" height="200" class="transform -rotate-90">
					<circle cx="100" cy="100" r="80" fill="none" stroke="#334155" stroke-width="20"/>
					<circle cx="100" cy="100" r="80" fill="none" stroke="#10B981" stroke-width="20" stroke-dasharray="207" stroke-dashoffset="0" stroke-linecap="round"/>
					<circle cx="100" cy="100" r="80" fill="none" stroke="#F59E0B" stroke-width="20" stroke-dasharray="76" stroke-dashoffset="-207" stroke-linecap="round"/>
					<circle cx="100" cy="100" r="80" fill="none" stroke="#EF4444" stroke-width="20" stroke-dasharray="217" stroke-dashoffset="-283" stroke-linecap="round"/>
				</svg>
				<div class="absolute flex flex-col items-center justify-center">
					<span class="text-3xl font-bold text-terminal-100">217</span>
					<span class="text-xs text-terminal-500">Total</span>
				</div>
			</div>
			<div class="mt-6 space-y-2">
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 rounded-full bg-semantic-success"></div>
					<span class="text-sm text-terminal-400">Regular</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 rounded-full bg-semantic-warning"></div>
					<span class="text-sm text-terminal-400">Regularizado</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 rounded-full bg-semantic-critical"></div>
					<span class="text-sm text-terminal-400">Irregular</span>
				</div>
			</div>
		</div>

		<!-- Table -->
		<div class="col-span-2 card">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-terminal-700/50">
						<tr>
							<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">CNPJ</th>
							<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Cliente</th>
							<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Status</th>
							<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Desde</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-terminal-700">
						{#each clientes as cliente}
							{@const badge = getSituacaoBadge(cliente.situacao)}
							<tr class="hover:bg-terminal-700/30">
								<td class="px-4 py-4 text-sm font-mono text-terminal-200">{cliente.cnpj}</td>
								<td class="px-4 py-4 text-sm text-terminal-100">{cliente.nome}</td>
								<td class="px-4 py-4"><span class="status-badge {badge.class}">{badge.label}</span></td>
								<td class="px-4 py-4 text-sm text-terminal-400">{cliente.since}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
