<script lang="ts">
	let { regular, regularizado, irregular } = $props();

	const data = [
		{ label: 'Regular', value: regular.count, percentage: regular.percentage, color: '#10B981' },
		{ label: 'Regularizado', value: regularizado.count, percentage: regularizado.percentage, color: '#F59E0B' },
		{ label: 'Irregular', value: irregular.count, percentage: irregular.percentage, color: '#EF4444' }
	];

	// SVG arc calculations for doughnut
	const size = 180;
	const strokeWidth = 24;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	function getArcValues(percentage: number, offset: number) {
		const dashArray = (percentage / 100) * circumference;
		const dashOffset = -offset;
		return { dashArray, dashOffset };
	}
</script>

<div class="card card-hover p-6 h-full">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h2 class="font-display font-bold text-lg text-terminal-100">Situação Fiscal</h2>
			<p class="text-sm text-terminal-500">Federal</p>
		</div>
	</div>

	<!-- Doughnut Chart -->
	<div class="flex justify-center py-4">
		<div class="relative">
			<svg width={size} height={size} class="transform -rotate-90">
				<!-- Background circle -->
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="#334155"
					stroke-width={strokeWidth}
				/>
				<!-- Regular (41.5%) -->
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="#10B981"
					stroke-width={strokeWidth}
					stroke-dasharray={(regular.percentage / 100) * circumference}
					stroke-dashoffset="0"
					stroke-linecap="round"
					class="transition-all duration-1000"
				/>
				<!-- Regularizado (15.2%) -->
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="#F59E0B"
					stroke-width={strokeWidth}
					stroke-dasharray={(regularizado.percentage / 100) * circumference}
					stroke-dashoffset={-(regular.percentage / 100) * circumference}
					stroke-linecap="round"
					class="transition-all duration-1000"
				/>
				<!-- Irregular (43.3%) -->
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="#EF4444"
					stroke-width={strokeWidth}
					stroke-dasharray={(irregular.percentage / 100) * circumference}
					stroke-dashoffset={-((regular.percentage + regularizado.percentage) / 100) * circumference}
					stroke-linecap="round"
					class="transition-all duration-1000"
				/>
			</svg>

			<!-- Center text -->
			<div class="absolute inset-0 flex flex-col items-center justify-center">
				<span class="text-3xl font-bold text-terminal-100">{regular.count + regularizado.count + irregular.count}</span>
				<span class="text-xs text-terminal-500">Total</span>
			</div>
		</div>
	</div>

	<!-- Legend -->
	<div class="space-y-3 mt-4">
		{#each data as item, i}
			<div class="flex items-center justify-between p-3 rounded-lg bg-terminal-700/30 border border-terminal-700">
				<div class="flex items-center gap-3">
					<div
						class="w-3 h-3 rounded-full"
						style="background-color: {item.color}"
					></div>
					<span class="text-sm text-terminal-300">{item.label}</span>
				</div>
				<div class="text-right">
					<span class="text-sm font-bold text-terminal-100">{item.value}</span>
					<span class="text-xs text-terminal-500 ml-1">({item.percentage}%)</span>
				</div>
			</div>
		{/each}
	</div>
</div>
