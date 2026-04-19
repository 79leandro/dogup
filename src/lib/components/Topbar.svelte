<script lang="ts">
	import { page } from '$app/stores';
	import { sidebarState } from '$lib/stores/ui';

	let { data } = $props();

	const breadcrumbMap: Record<string, string[]> = {
		'/dashboard': ['Dashboard'],
		'/dashboard/clientes': ['Clientes', 'DOGUP 360°'],
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

	const hasUnreadMessages = 6;

	function toggleMobileSidebar() {
		sidebarState.update(current => current === 'mobile' ? 'expanded' : 'mobile');
	}

	const sidebarState_val = $derived($sidebarState);
	const isCollapsed = $derived(sidebarState_val === 'collapsed');
	const isMobile = $derived(sidebarState_val === 'mobile');

	const leftOffset = $derived(
		isMobile ? 'left-0' :
		isCollapsed ? 'left-[72px]' : 'left-64'
	);
</script>

<header class="fixed top-0 {leftOffset} right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-40 transition-all duration-300">
	<div class="flex items-center justify-between h-full px-4 lg:px-6">
		<!-- Left: Menu button + Breadcrumb -->
		<div class="flex items-center gap-3 lg:gap-4">
			<!-- Mobile menu toggle -->
			<button
				onclick={toggleMobileSidebar}
				class="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
				aria-label={isMobile ? 'Fechar menu' : 'Abrir menu'}
			>
				{#if isMobile}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				{:else}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
					</svg>
				{/if}
			</button>

			<!-- Desktop collapse toggle -->
			<button
				onclick={() => sidebarState.update(s => s === 'collapsed' ? 'expanded' : 'collapsed')}
				class="hidden lg:block p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
				aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
			>
				{#if isCollapsed}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
					</svg>
				{:else}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m5 5h8"/>
					</svg>
				{/if}
			</button>

			<!-- Breadcrumb -->
			<nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
				{#each breadcrumbs as crumb, i}
					{#if i > 0}
						<svg class="w-4 h-4 text-slate-300 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
						</svg>
					{/if}
					<span class="{i === breadcrumbs.length - 1 ? 'text-slate-800 font-medium' : 'text-slate-400'}">
						{crumb}
					</span>
				{/each}
			</nav>
		</div>

		<!-- Right side: Search + Notifications + Date -->
		<div class="flex items-center gap-3 lg:gap-4">
			<!-- Search - hidden on small screens -->
			<div class="hidden md:block relative">
				<input
					type="text"
					placeholder="Buscar CNPJ, cliente..."
					class="w-48 lg:w-64 bg-slate-100/50 border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-semantic-accent/50 focus:border-semantic-accent transition-all"
					aria-label="Buscar"
				/>
				<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
				</svg>
			</div>

			<!-- Notifications -->
			<button
				class="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
				aria-label="Notificações"
			>
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
			<div class="hidden sm:flex items-center text-sm text-slate-500 border-l border-slate-200 pl-3 lg:pl-4">
				<span class="text-slate-700 font-medium">
					{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
				</span>
				<span class="mx-1.5">·</span>
				<span>{new Date().getFullYear()}</span>
			</div>
		</div>
	</div>
</header>