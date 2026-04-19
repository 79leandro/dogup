<script lang="ts">
	import { page } from '$app/stores';
	import { sidebarState } from '$lib/stores/ui';
	import { notifications } from '$lib/stores/notifications';
	import { searchStore } from '$lib/stores/search';

	let { data } = $props();

	let showNotifications = $state(false);

	const hasUnreadMessages = $derived($notifications.filter(n => n.type !== 'success').length);

	function toggleNotifications() {
		showNotifications = !showNotifications;
	}

	function dismissNotification(id: number) {
		notifications.remove(id);
	}

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
			<!-- Search - opens super search modal -->
			<div class="hidden md:block relative">
				<button
					type="button"
					onclick={() => searchStore.open()}
					class="flex items-center gap-2 w-48 lg:w-64 bg-slate-100/50 border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 hover:bg-slate-100 transition-all text-left"
					aria-label="Abrir busca"
				>
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
					<span>Buscar CNPJ, cliente...</span>
				</button>
			</div>

			<!-- Notifications -->
			<div class="relative">
				<button
					onclick={toggleNotifications}
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

				<!-- Notifications Dropdown -->
				{#if showNotifications}
					<div class="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
						<div class="flex items-center justify-between p-4 border-b border-slate-100">
							<h3 class="font-semibold text-slate-800">Notificações</h3>
							<button
								onclick={() => notifications.clear()}
								class="text-xs text-semantic-accent hover:text-semantic-accent/80"
							>
								Limpar todas
							</button>
						</div>
						<div class="max-h-96 overflow-y-auto">
							{#each $notifications as notification (notification.id)}
								<div class="flex items-start gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
									<div class="flex-shrink-0 mt-0.5">
										{#if notification.type === 'success'}
											<svg class="w-5 h-5 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
											</svg>
										{:else if notification.type === 'error'}
											<svg class="w-5 h-5 text-semantic-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
											</svg>
										{:else if notification.type === 'warning'}
											<svg class="w-5 h-5 text-semantic-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
											</svg>
										{:else}
											<svg class="w-5 h-5 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
											</svg>
										{/if}
									</div>
									<div class="flex-1 min-w-0">
										<p class="text-sm font-medium text-slate-800">{notification.title}</p>
										{#if notification.message}
											<p class="text-xs text-slate-500 mt-0.5">{notification.message}</p>
										{/if}
									</div>
									<button
										onclick={() => dismissNotification(notification.id)}
										class="flex-shrink-0 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
										aria-label="Dispensar notificação"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
										</svg>
									</button>
								</div>
							{:else}
								<div class="p-8 text-center text-slate-400">
									<svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
									</svg>
									<p class="text-sm">Nenhuma notificação</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

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