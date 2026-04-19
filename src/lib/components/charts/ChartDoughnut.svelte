<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'chart.js/auto';

	interface Props {
		data: number[];
		labels: string[];
		colors?: string[];
	}

	let { data, labels, colors = ['#10B981', '#F59E0B', '#EF4444'] }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chartInstance: Chart | null = null;

	onMount(() => {
		chartInstance = new Chart(canvas, {
			type: 'doughnut',
			data: {
				labels,
				datasets: [{
					data,
					backgroundColor: colors.map(c => c + '30'),
					borderColor: colors,
					borderWidth: 2,
					hoverOffset: 8
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				cutout: '70%',
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						backgroundColor: '#1E293B',
						titleColor: '#F8FAFC',
						bodyColor: '#94A3B8',
						borderColor: '#334155',
						borderWidth: 1,
						padding: 12,
						cornerRadius: 8,
						displayColors: true
					}
				}
			}
		} as any);

		return () => {
			chartInstance?.destroy();
		};
	});

	$effect(() => {
		if (chartInstance && data) {
			chartInstance.data.datasets[0].data = data;
			chartInstance.update();
		}
	});
</script>

<div class="relative w-full h-full flex items-center justify-center">
	<canvas bind:this={canvas}></canvas>
	<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
		<div class="text-center">
			<p class="text-2xl font-bold text-slate-900">{data.reduce((a, b) => a + b, 0)}</p>
			<p class="text-xs text-slate-400">Total</p>
		</div>
	</div>
</div>