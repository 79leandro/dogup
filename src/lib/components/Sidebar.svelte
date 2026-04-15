<script lang="ts">
	import { page } from '$app/stores';

	interface NavItem {
		label: string;
		href: string;
		icon: string;
		badge?: number;
		children?: NavItem[];
	}

	const mainNav: NavItem[] = [
		{
			label: 'Dashboard',
			href: '/dashboard',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
		},
		{
			label: 'Clientes',
			href: '/dashboard/clientes',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
		}
	];

	const obligationsNav: NavItem[] = [
		{
			label: 'Obrigações Acessórias',
			href: '/dashboard/obrigacoes',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`
		},
		{
			label: 'DCTFWeb em Andamento',
			href: '/dashboard/obrigacoes/dctfweb',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
			badge: 36
		}
	];

	const fiscalNav: NavItem[] = [
		{
			label: 'Situação Fiscal Federal',
			href: '/dashboard/situacao-fiscal',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`
		},
		{
			label: 'Certidões Negativas',
			href: '/dashboard/certidoes',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`
		},
		{
			label: 'Parcelamentos Federais',
			href: '/dashboard/parcelamentos',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
			badge: 2
		}
	];

	const toolsNav: NavItem[] = [
		{
			label: 'Caixa Postal e-CAC',
			href: '/dashboard/caixa-postal',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
			badge: 6
		},
		{
			label: 'Certificados',
			href: '/dashboard/certificados',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>`
		},
		{
			label: 'Simples Nacional',
			href: '/dashboard/simples-nacional',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
		},
		{
			label: 'PER/DCOMP',
			href: '/dashboard/per-dcomp',
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>`
		}
	];

	let expandedSections = $state({
		obrigacoes: true,
		fiscal: false,
		ferramentas: false
	});

	function toggleSection(section: keyof typeof expandedSections) {
		expandedSections[section] = !expandedSections[section];
	}

	function isActive(href: string): boolean {
		return $page.url.pathname.startsWith(href);
	}
</script>

<aside class="fixed left-0 top-0 h-screen w-64 bg-terminal-800/80 backdrop-blur-xl border-r border-terminal-700 flex flex-col z-50">
	<!-- Logo -->
	<div class="p-6 border-b border-terminal-700">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-semantic-accent to-semantic-info flex items-center justify-center">
				<span class="text-white font-bold text-lg">D</span>
			</div>
			<div>
				<h1 class="font-display font-bold text-lg text-terminal-100">DOGUP</h1>
				<p class="text-xs text-terminal-500">Contábil</p>
			</div>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 overflow-y-auto p-4 space-y-6">
		<!-- Main -->
		<div class="space-y-1">
			{#each mainNav as item}
				<a
					href={item.href}
					class="nav-item {isActive(item.href) ? 'nav-item-active' : ''}"
				>
					{@html item.icon}
					<span>{item.label}</span>
				</a>
			{/each}
		</div>

		<!-- Obligations Section -->
		<div>
			<button
				onclick={() => toggleSection('obrigacoes')}
				class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-terminal-400 hover:text-terminal-200 transition-colors"
			>
				<span>Obrigações</span>
				<svg class="w-4 h-4 transition-transform {expandedSections.obrigacoes ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
				</svg>
			</button>
			{#if expandedSections.obrigacoes}
				<div class="mt-1 space-y-1 animate-slide-up">
					{#each obligationsNav as item}
						<a
							href={item.href}
							class="nav-item {isActive(item.href) ? 'nav-item-active' : ''}"
						>
							{@html item.icon}
							<span>{item.label}</span>
							{#if item.badge}
								<span class="ml-auto px-2 py-0.5 text-xs font-medium bg-semantic-critical/20 text-semantic-critical rounded-full">
									{item.badge}
								</span>
							{/if}
						</a>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Fiscal Section -->
		<div>
			<button
				onclick={() => toggleSection('fiscal')}
				class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-terminal-400 hover:text-terminal-200 transition-colors"
			>
				<span>Fiscal</span>
				<svg class="w-4 h-4 transition-transform {expandedSections.fiscal ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
				</svg>
			</button>
			{#if expandedSections.fiscal}
				<div class="mt-1 space-y-1 animate-slide-up">
					{#each fiscalNav as item}
						<a
							href={item.href}
							class="nav-item {isActive(item.href) ? 'nav-item-active' : ''}"
						>
							{@html item.icon}
							<span>{item.label}</span>
							{#if item.badge}
								<span class="ml-auto px-2 py-0.5 text-xs font-medium bg-semantic-warning/20 text-semantic-warning rounded-full">
									{item.badge}
								</span>
							{/if}
						</a>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Tools Section -->
		<div>
			<button
				onclick={() => toggleSection('ferramentas')}
				class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-terminal-400 hover:text-terminal-200 transition-colors"
			>
				<span>Ferramentas</span>
				<svg class="w-4 h-4 transition-transform {expandedSections.ferramentas ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
				</svg>
			</button>
			{#if expandedSections.ferramentas}
				<div class="mt-1 space-y-1 animate-slide-up">
					{#each toolsNav as item}
						<a
							href={item.href}
							class="nav-item {isActive(item.href) ? 'nav-item-active' : ''}"
						>
							{@html item.icon}
							<span>{item.label}</span>
							{#if item.badge}
								<span class="ml-auto px-2 py-0.5 text-xs font-medium bg-semantic-critical/20 text-semantic-critical rounded-full">
									{item.badge}
								</span>
							{/if}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</nav>

	<!-- Footer -->
	<div class="p-4 border-t border-terminal-700">
		<div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-terminal-700/50">
			<div class="w-8 h-8 rounded-full bg-gradient-to-br from-semantic-success to-semantic-info flex items-center justify-center">
				<span class="text-white text-sm font-medium">AD</span>
			</div>
			<div class="flex-1 min-w-0">
				<p class="text-sm font-medium text-terminal-100 truncate">Administrador</p>
				<p class="text-xs text-terminal-500 truncate">DOGUP Contábil</p>
			</div>
			<a href="/logout" class="p-1.5 rounded-lg hover:bg-terminal-600 text-terminal-400 hover:text-terminal-200 transition-colors">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
				</svg>
			</a>
		</div>
	</div>
</aside>
