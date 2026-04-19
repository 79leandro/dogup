<script lang="ts">
	type ColorKey = 'info' | 'success' | 'critical' | 'warning';

	interface KPIData {
		totalClientes: number;
		percentualEntrega: number;
		clientesCriticos: number;
		alertasEcac: number;
	}

	let { data }: { data: KPIData } = $props();

	const kpis = $derived([
		{
			label: 'Total Clientes',
			value: data.totalClientes,
			trend: '+3 este mês',
			trendUp: true,
			color: 'info' as ColorKey,
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
		},
		{
			label: 'Taxa de Entrega',
			value: `${data.percentualEntrega}%`,
			trend: 'Meta: 95%',
			trendUp: data.percentualEntrega >= 83.7,
			color: 'success' as ColorKey,
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
		},
		{
			label: 'Clientes Críticos',
			value: data.clientesCriticos,
			trend: 'Requer atenção',
			trendUp: false,
			color: 'critical' as ColorKey,
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
		},
		{
			label: 'Alertas e-CAC',
			value: data.alertasEcac,
			trend: 'Não lidas',
			trendUp: false,
			color: 'warning' as ColorKey,
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>`
		}
	]);

	const colorClasses: Record<ColorKey, string> = {
		info: 'from-semantic-info/20 to-semantic-info/5 border-semantic-info/30',
		success: 'from-semantic-success/20 to-semantic-success/5 border-semantic-success/30',
		critical: 'from-semantic-critical/20 to-semantic-critical/5 border-semantic-critical/30',
		warning: 'from-semantic-warning/20 to-semantic-warning/5 border-semantic-warning/30'
	};

	const iconBgClasses: Record<ColorKey, string> = {
		info: 'bg-semantic-info/20 text-semantic-info',
		success: 'bg-semantic-success/20 text-semantic-success',
		critical: 'bg-semantic-critical/20 text-semantic-critical',
		warning: 'bg-semantic-warning/20 text-semantic-warning'
	};

	const trendColorClasses: Record<ColorKey, string> = {
		info: 'text-semantic-info',
		success: 'text-semantic-success',
		critical: 'text-semantic-critical',
		warning: 'text-semantic-warning'
	};

	function getColorClass(color: ColorKey): string {
		return colorClasses[color];
	}
</script>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
	{#each kpis as kpi, i}
		<div
			class="card p-4 lg:p-5 border transition-all duration-300 hover:scale-[1.02] animate-slide-up"
			style="animation-delay: {i * 50}ms; background: linear-gradient(135deg, {getColorClass(kpi.color).split(' ')[0]}, {getColorClass(kpi.color).split(' ')[1]}); border-color: {getColorClass(kpi.color).split(' ')[2]};"
		>
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<p class="text-sm text-slate-500 font-medium">{kpi.label}</p>
					<p class="text-2xl lg:text-3xl font-bold font-display text-slate-900 mt-1">
						{kpi.value}
					</p>
					<p class="text-xs {trendColorClasses[kpi.color as ColorKey]} mt-2 flex items-center gap-1">
						{#if kpi.trendUp}
							<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
							</svg>
						{:else}
							<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
							</svg>
						{/if}
						{kpi.trend}
					</p>
				</div>
				<div class="w-10 h-10 rounded-xl {iconBgClasses[kpi.color as ColorKey]} flex items-center justify-center flex-shrink-0">
					{@html kpi.icon}
				</div>
			</div>
		</div>
	{/each}
</div>