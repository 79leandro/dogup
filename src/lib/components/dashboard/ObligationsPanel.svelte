<script lang="ts">
	let { total, emAndamento, entregue, percentualEntrega } = $props();

	const statusItems = [
		{ label: 'Entregue', value: entregue, color: 'success', icon: '✓' },
		{ label: 'Em Andamento', value: emAndamento, color: 'warning', icon: '↻' },
		{ label: 'Não Entregue', value: 0, color: 'critical', icon: '!' }
	];
</script>

<div class="card card-hover p-6 h-full">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h2 class="font-display font-bold text-lg text-terminal-100">Obrigações Acessórias</h2>
			<p class="text-sm text-terminal-500">DCTFWeb - Progresso de Entrega</p>
		</div>
		<div class="flex items-center gap-2">
			<span class="px-2.5 py-1 text-xs font-medium bg-terminal-700 text-terminal-300 rounded-full">
				{total} Total
			</span>
		</div>
	</div>

	<!-- Progress Section -->
	<div class="mb-6">
		<div class="flex items-end justify-between mb-2">
			<span class="text-sm text-terminal-400">Taxa de Entrega</span>
			<span class="text-2xl font-bold text-semantic-success">{percentualEntrega}%</span>
		</div>
		<div class="h-3 bg-terminal-700 rounded-full overflow-hidden">
			<div
				class="h-full bg-gradient-to-r from-semantic-success to-semantic-success/80 rounded-full transition-all duration-1000 ease-out glow-success"
				style="width: {percentualEntrega}%"
			></div>
		</div>
	</div>

	<!-- Status Cards -->
	<div class="grid grid-cols-3 gap-4">
		{#each statusItems as item}
			<div class="p-4 rounded-xl bg-terminal-700/30 border border-terminal-700 text-center">
				<div class="inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2
					{item.color === 'success' ? 'bg-semantic-success/20 text-semantic-success' : ''}
					{item.color === 'warning' ? 'bg-semantic-warning/20 text-semantic-warning' : ''}
					{item.color === 'critical' ? 'bg-semantic-critical/20 text-semantic-critical' : ''}
				">
					<span class="text-sm font-bold">{item.icon}</span>
				</div>
				<div class="text-xl font-bold text-terminal-100">{item.value}</div>
				<div class="text-xs text-terminal-500 mt-1">{item.label}</div>
			</div>
		{/each}
	</div>

	<!-- Filters hint -->
	<div class="mt-6 pt-4 border-t border-terminal-700 flex items-center justify-between">
		<div class="flex items-center gap-2 text-sm text-terminal-400">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
			</svg>
			<span>Filtrar por: Tipo, Ano, Mês</span>
		</div>
		<a href="/dashboard/obrigacoes" class="text-sm text-semantic-accent hover:text-semantic-accent/80 font-medium transition-colors">
			Ver Detalhes →
		</a>
	</div>
</div>
