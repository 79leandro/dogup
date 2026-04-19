<script lang="ts">
	import ChartDoughnut from '$lib/components/charts/ChartDoughnut.svelte';

	interface Props {
		regular: { count: number; percentage?: number };
		regularizado: { count: number; percentage?: number };
		irregular: { count: number; percentage?: number };
	}

	let { regular, regularizado, irregular }: Props = $props();

	const chartData = $derived([regular.count, regularizado.count, irregular.count]);
	const chartLabels = ['Regular', 'Regularizado', 'Irregular'];
	const chartColors = ['#10B981', '#F59E0B', '#EF4444'];

	const total = $derived(regular.count + regularizado.count + irregular.count);
	const calcPercentage = (count: number) => total > 0 ? Math.round((count / total) * 100) : 0;
</script>

<div class="card card-hover p-5 h-full">
	<!-- Header -->
	<div class="flex items-center justify-between mb-4">
		<div>
			<h2 class="font-display font-bold text-lg text-slate-800">Situação Fiscal</h2>
			<p class="text-sm text-slate-400">Federal</p>
		</div>
		<div class="w-10 h-10 rounded-xl bg-semantic-info/20 flex items-center justify-center">
			<svg class="w-5 h-5 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
			</svg>
		</div>
	</div>

	<!-- Chart -->
	<div class="h-48">
		<ChartDoughnut data={chartData} labels={chartLabels} colors={chartColors} />
	</div>

	<!-- Legend -->
	<div class="space-y-2 mt-4">
		<div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-100/50 border border-slate-200/50">
			<div class="flex items-center gap-2">
				<div class="w-2.5 h-2.5 rounded-full bg-semantic-success"></div>
				<span class="text-sm text-slate-600">Regular</span>
			</div>
			<div class="text-right">
				<span class="text-sm font-bold text-slate-800">{regular.count}</span>
				<span class="text-xs text-slate-400 ml-1">({calcPercentage(regular.count)}%)</span>
			</div>
		</div>
		<div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-100/50 border border-slate-200/50">
			<div class="flex items-center gap-2">
				<div class="w-2.5 h-2.5 rounded-full bg-semantic-warning"></div>
				<span class="text-sm text-slate-600">Regularizado</span>
			</div>
			<div class="text-right">
				<span class="text-sm font-bold text-slate-800">{regularizado.count}</span>
				<span class="text-xs text-slate-400 ml-1">({calcPercentage(regularizado.count)}%)</span>
			</div>
		</div>
		<div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-100/50 border border-slate-200/50">
			<div class="flex items-center gap-2">
				<div class="w-2.5 h-2.5 rounded-full bg-semantic-critical"></div>
				<span class="text-sm text-slate-600">Irregular</span>
			</div>
			<div class="text-right">
				<span class="text-sm font-bold text-slate-800">{irregular.count}</span>
				<span class="text-xs text-slate-400 ml-1">({calcPercentage(irregular.count)}%)</span>
			</div>
		</div>
	</div>
</div>