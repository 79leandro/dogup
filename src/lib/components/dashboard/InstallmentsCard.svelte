<script lang="ts">
	interface Parcelamento {
		tipo: string;
		total: number;
		emAtraso: number;
	}

	let { parcelamentos } = $props();

	function getUrgencyColor(atraso: number, total: number): string {
		if (atraso === 0) return 'success';
		const ratio = atraso / total;
		if (ratio >= 0.5) return 'critical';
		if (ratio >= 0.2) return 'warning';
		return 'success';
	}

	const validParcelamentos = parcelamentos.filter((p: Parcelamento) => p.total > 0);
</script>

<div class="card card-hover p-6 h-full">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h2 class="font-display font-bold text-lg text-terminal-100">Parcelamentos</h2>
			<p class="text-sm text-terminal-500">Federais</p>
		</div>
		<div class="relative">
			<div class="w-10 h-10 rounded-xl bg-semantic-warning/10 flex items-center justify-center">
				<svg class="w-5 h-5 text-semantic-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
				</svg>
			</div>
			{#if validParcelamentos.some((p: Parcelamento) => p.emAtraso > 0)}
				<span class="absolute -top-1 -right-1 w-4 h-4 bg-semantic-critical rounded-full flex items-center justify-center animate-pulse">
					<span class="text-white text-[10px] font-bold">!</span>
				</span>
			{/if}
		</div>
	</div>

	<!-- Parcelamentos List -->
	<div class="space-y-3">
		{#each validParcelamentos as item}
			{@const urgency = getUrgencyColor(item.emAtraso, item.total)}
			<div class="relative p-4 rounded-xl bg-terminal-700/30 border border-terminal-700 group hover:border-terminal-600 transition-colors">
				<!-- Urgency indicator -->
				{#if item.emAtraso > 0}
					<div class="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold
						{urgency === 'critical' ? 'bg-semantic-critical text-white' : ''}
						{urgency === 'warning' ? 'bg-semantic-warning text-terminal-900' : ''}
						{urgency === 'success' ? 'bg-semantic-success text-white' : ''}
						shadow-lg"
					>
						{item.emAtraso}
					</div>
				{/if}

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<!-- Icon -->
						<div class="w-8 h-8 rounded-lg flex items-center justify-center
							{urgency === 'critical' ? 'bg-semantic-critical/20 text-semantic-critical' : ''}
							{urgency === 'warning' ? 'bg-semantic-warning/20 text-semantic-warning' : ''}
							{urgency === 'success' ? 'bg-semantic-success/20 text-semantic-success' : ''}
						">
							{#if urgency === 'critical'}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
							{:else if urgency === 'warning'}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
								</svg>
							{:else}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
								</svg>
							{/if}
						</div>

						<div>
							<div class="text-sm font-medium text-terminal-200">{item.tipo}</div>
							{#if item.emAtraso > 0}
								<div class="text-xs text-semantic-critical/80">{item.emAtraso} em atraso</div>
							{/if}
						</div>
					</div>

					<div class="text-right">
						<div class="text-lg font-bold text-terminal-100">{item.total}</div>
						<div class="text-xs text-terminal-500">total</div>
					</div>
				</div>

				<!-- Progress bar -->
				<div class="mt-3 h-1.5 bg-terminal-700 rounded-full overflow-hidden">
					<div
						class="h-full rounded-full transition-all duration-500
							{urgency === 'critical' ? 'bg-semantic-critical' : ''}
							{urgency === 'warning' ? 'bg-semantic-warning' : ''}
							{urgency === 'success' ? 'bg-semantic-success' : ''}
						"
						style="width: {((item.total - item.emAtraso) / item.total) * 100}%"
					></div>
				</div>
			</div>
		{/each}
	</div>
</div>
