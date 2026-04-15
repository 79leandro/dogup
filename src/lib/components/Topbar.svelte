<script lang="ts">
	import { page } from '$app/stores';

	const breadcrumbMap: Record<string, string[]> = {
		'/dashboard': ['Dashboard'],
		'/dashboard/clientes': ['Clientes', 'DOG 360°'],
		'/dashboard/obrigacoes': ['Obrigações', 'Acessórias'],
		'/dashboard/obrigacoes/dctfweb': ['Obrigações', 'DCTFWeb em Andamento'],
		'/dashboard/situacao-fiscal': ['Fiscal', 'Situação Federal'],
		'/dashboard/certidoes': ['Fiscal', 'Certidões Negativas'],
		'/dashboard/parcelamentos': ['Fiscal', 'Parcelamentos Federais'],
		'/dashboard/caixa-postal': ['Ferramentas', 'Caixa Postal e-CAC'],
		'/dashboard/certificados': ['Ferramentas', 'Certificados'],
		'/dashboard/simples-nacional': ['Ferramentas', 'Simples Nacional'],
		'/dashboard/per-dcomp': ['Ferramentas', 'PER/DCOMP']
	};

	const currentPath = $derived($page.url.pathname);
	const breadcrumbs = $derived(breadcrumbMap[currentPath] || ['Dashboard']);

	// Demo notifications
	const hasUnreadMessages = 6;
</script>

<header class="fixed top-0 left-64 right-0 h-16 bg-terminal-800/80 backdrop-blur-xl border-b border-terminal-700 z-40">
	<div class="flex items-center justify-between h-full px-6">
		<!-- Breadcrumb -->
		<nav class="flex items-center gap-2 text-sm">
			{#each breadcrumbs as crumb, i}
				{#if i > 0}
					<svg class="w-4 h-4 text-terminal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
					</svg>
				{/if}
				<span class="{i === breadcrumbs.length - 1 ? 'text-terminal-100 font-medium' : 'text-terminal-500'}">
					{crumb}
				</span>
			{/each}
		</nav>

		<!-- Right side -->
		<div class="flex items-center gap-4">
			<!-- Search -->
			<div class="relative">
				<input
					type="text"
					placeholder="Buscar CNPJ, cliente..."
					class="w-64 bg-terminal-700/50 border border-terminal-600 rounded-lg pl-10 pr-4 py-2 text-sm text-terminal-100 placeholder-terminal-500 focus:outline-none focus:ring-2 focus:ring-semantic-accent/50 focus:border-semantic-accent transition-all"
				/>
				<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
				</svg>
			</div>

			<!-- Notifications -->
			<button class="relative p-2 rounded-lg hover:bg-terminal-700 text-terminal-400 hover:text-terminal-100 transition-colors">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
				</svg>
				{#if hasUnreadMessages > 0}
					<span class="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center bg-semantic-critical text-white text-xs font-medium rounded-full">
						{hasUnreadMessages}
					</span>
				{/if}
			</button>

			<!-- Date -->
			<div class="text-sm text-terminal-400 border-l border-terminal-700 pl-4">
				<span class="text-terminal-200 font-medium">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
				<span class="mx-1">·</span>
				<span>{new Date().getFullYear()}</span>
			</div>
		</div>
	</div>
</header>
