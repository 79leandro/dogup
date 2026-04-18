<script lang="ts">
	let { data } = $props();

	let filterRelevancia = $state('todas');

	const relevanciaCount = $derived(data.stats.relevantes);

	const mensagensFiltradas = $derived.by(() => {
		let msgs = data.mensagens;
		switch (filterRelevancia) {
			case 'relevantes':
				return msgs.filter(m => m.relevancia === 'RELEVANTE');
			case 'lidas':
				return msgs.filter(m => m.lida);
			case 'naoLidas':
				return msgs.filter(m => !m.lida);
			default:
				return msgs;
		}
	});

	function getTipoBadge(tipo: string) {
		const badges: Record<string, { class: string; label: string }> = {
			INTIMACAO: { class: 'status-critical', label: 'Intimação' },
			NOTIFICACAO: { class: 'status-warning', label: 'Notificação' },
			TERMO_EXCLUSAO: { class: 'status-critical', label: 'Termo Exclusão' },
			INFORMATIVA: { class: 'bg-terminal-700 text-terminal-300', label: 'Informativa' },
			OTIMOS: { class: 'status-success', label: 'Otimoss' }
		};
		return badges[tipo] || badges.INFORMATIVA;
	}

	function formatDate(date: Date | string): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('pt-BR');
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Alert Banner -->
	{#if relevanciaCount > 0}
		<div class="p-4 rounded-xl bg-semantic-warning/10 border border-semantic-warning/30 flex items-center gap-4">
			<div class="w-10 h-10 rounded-lg bg-semantic-warning/20 flex items-center justify-center">
				<svg class="w-5 h-5 text-semantic-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
				</svg>
			</div>
			<div class="flex-1">
				<h3 class="font-semibold text-semantic-warning">Você tem {relevanciaCount} mensagens relevantes não lidas</h3>
				<p class="text-sm text-semantic-warning/80">Mensagens de intimação e notificação requerem atenção imediata</p>
			</div>
		</div>
	{/if}

	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-terminal-100">Caixa Postal e-CAC</h1>
			<p class="text-terminal-500">Mensagens dos clientes</p>
		</div>
		<div class="flex items-center gap-2">
			<select bind:value={filterRelevancia} class="input w-40">
				<option value="todas">Todas</option>
				<option value="relevantes">Relevantes</option>
				<option value="lidas">Lidas</option>
				<option value="naoLidas">Não Lidas</option>
			</select>
		</div>
	</div>

	<!-- Messages -->
	<div class="space-y-3">
		{#each mensagensFiltradas as msg (msg.id)}
			{@const badge = getTipoBadge(msg.tipo)}
			<div class="card p-4 hover:border-terminal-600 transition-colors {!msg.lida && msg.relevancia === 'RELEVANTE' ? 'border-l-4 border-l-semantic-critical' : ''}">
				<div class="flex items-start gap-4">
					<!-- Icon -->
					<div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
						{msg.relevancia === 'RELEVANTE' ? 'bg-semantic-critical/20' : 'bg-terminal-700'}">
						<svg class="w-5 h-5 {msg.relevancia === 'RELEVANTE' ? 'text-semantic-critical' : 'text-terminal-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
						</svg>
					</div>

					<!-- Content -->
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-1">
							<h3 class="font-medium text-terminal-100 {!msg.lida ? 'font-semibold' : ''}">{msg.titulo}</h3>
							{#if !msg.lida}
								<span class="w-2 h-2 rounded-full bg-semantic-accent"></span>
							{/if}
						</div>
						<div class="flex items-center gap-3 text-sm">
							<span class="text-terminal-400">{msg.cliente.nomeRazao}</span>
							<span class="text-terminal-600">·</span>
							<span class="status-badge {badge.class}">{badge.label}</span>
							{#if msg.relevancia === 'RELEVANTE'}
								<span class="status-badge bg-semantic-critical/20 text-semantic-critical">Relevante</span>
							{/if}
						</div>
					</div>

					<!-- Date & Actions -->
					<div class="flex items-center gap-3">
						<span class="text-sm text-terminal-500">{formatDate(msg.data)}</span>
						<button class="p-2 rounded-lg hover:bg-terminal-700 text-terminal-400 hover:text-terminal-100 transition-colors" aria-label="Mais ações">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="card p-8 text-center">
				<svg class="w-12 h-12 text-terminal-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
				</svg>
				<p class="text-terminal-500">Nenhuma mensagem encontrada</p>
			</div>
		{/each}
	</div>
</div>
