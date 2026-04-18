<script lang="ts">
	type ActionColor = 'accent' | 'success' | 'warning' | 'info';

	const actions = [
		{
			label: 'Novo Cliente',
			icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>`,
			href: '/dashboard/clientes',
			color: 'accent' as ActionColor
		},
		{
			label: 'Emitir Certidão',
			icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
			href: '/dashboard/certidoes',
			color: 'success' as ActionColor
		},
		{
			label: 'Ver Pendências',
			icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
			href: '/dashboard/obrigacoes',
			color: 'warning' as ActionColor
		},
		{
			label: 'Exportar Relatório',
			icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
			href: '#',
			color: 'info' as ActionColor
		}
	];

	const colorClasses: Record<ActionColor, string> = {
		accent: 'bg-semantic-accent/10 text-semantic-accent border-semantic-accent/20 hover:bg-semantic-accent/20',
		success: 'bg-semantic-success/10 text-semantic-success border-semantic-success/20 hover:bg-semantic-success/20',
		warning: 'bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20 hover:bg-semantic-warning/20',
		info: 'bg-semantic-info/10 text-semantic-info border-semantic-info/20 hover:bg-semantic-info/20'
	};

	const iconBgClasses: Record<ActionColor, string> = {
		accent: 'bg-semantic-accent/20',
		success: 'bg-semantic-success/20',
		warning: 'bg-semantic-warning/20',
		info: 'bg-semantic-info/20'
	};
</script>

<div class="card border-terminal-700 p-5">
	<h3 class="text-sm font-semibold text-terminal-300 mb-4 flex items-center gap-2">
		<svg class="w-4 h-4 text-semantic-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
		</svg>
		Ações Rápidas
	</h3>
	<div class="grid grid-cols-2 gap-3">
		{#each actions as action}
			<a
				href={action.href}
				class="flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] {colorClasses[action.color]}"
			>
				<div class="w-8 h-8 rounded-lg {iconBgClasses[action.color]} flex items-center justify-center flex-shrink-0">
					{@html action.icon}
				</div>
				<span class="text-sm font-medium">{action.label}</span>
			</a>
		{/each}
	</div>
</div>