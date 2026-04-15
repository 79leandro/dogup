<script lang="ts">
	let { total, simplesNacional, normal } = $props();
</script>

<div class="card card-hover p-6 h-full">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h2 class="font-display font-bold text-lg text-terminal-100">DOG 360°</h2>
			<p class="text-sm text-terminal-500">Gestão de Clientes</p>
		</div>
		<div class="w-10 h-10 rounded-xl bg-semantic-info/10 flex items-center justify-center">
			<svg class="w-5 h-5 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
			</svg>
		</div>
	</div>

	<!-- Total -->
	<div class="text-center py-6 border-b border-terminal-700">
		<div class="text-5xl font-display font-bold text-terminal-100 animate-count-up">
			{total}
		</div>
		<div class="text-sm text-terminal-500 mt-1">CNPJs Ativos</div>
	</div>

	<!-- Breakdown -->
	<div class="grid grid-cols-2 gap-4 mt-6">
		<!-- Simples Nacional -->
		<div class="relative p-4 rounded-xl bg-semantic-success/5 border border-semantic-success/20">
			<div class="flex items-center justify-between mb-2">
				<span class="text-xs font-medium text-semantic-success/80 uppercase tracking-wider">Simples</span>
				<div class="w-2 h-2 rounded-full bg-semantic-success animate-pulse"></div>
			</div>
			<div class="text-2xl font-bold text-semantic-success">{simplesNacional.count}</div>
			<div class="text-sm text-terminal-500 mt-1">{simplesNacional.percentage}%</div>
			<!-- Progress bar -->
			<div class="mt-3 h-1.5 bg-terminal-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-semantic-success rounded-full transition-all duration-1000"
					style="width: {simplesNacional.percentage}%"
				></div>
			</div>
		</div>

		<!-- Normal -->
		<div class="relative p-4 rounded-xl bg-semantic-info/5 border border-semantic-info/20">
			<div class="flex items-center justify-between mb-2">
				<span class="text-xs font-medium text-semantic-info/80 uppercase tracking-wider">Normal</span>
				<div class="w-2 h-2 rounded-full bg-semantic-info"></div>
			</div>
			<div class="text-2xl font-bold text-semantic-info">{normal.count}</div>
			<div class="text-sm text-terminal-500 mt-1">{normal.percentage}%</div>
			<!-- Progress bar -->
			<div class="mt-3 h-1.5 bg-terminal-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-semantic-info rounded-full transition-all duration-1000"
					style="width: {normal.percentage}%"
				></div>
			</div>
		</div>
	</div>
</div>
