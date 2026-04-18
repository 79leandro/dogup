<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';

	interface Props {
		data: number[];
		labels: string[];
		color?: string;
		horizontal?: boolean;
	}

	let { data, labels, color = '#8B5CF6', horizontal = false }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chartInstance: Chart | null = null;

	onMount(() => {
		const config: ChartConfiguration = {
			type: 'bar',
			data: {
				labels,
				datasets: [{
					data,
					backgroundColor: color + '30',
					borderColor: color,
					borderWidth: 2,
					borderRadius: 6,
					borderSkipped: false
				}]
			},
			options: {
				indexAxis: horizontal ? 'y' : 'x',
				responsive: true,
				maintainAspectRatio: false,
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
						callbacks: {
							label: (context) => ` ${context.raw}`
						}
					}
				},
				scales: {
					x: {
						grid: {
							color: '#33415530',
							display: !horizontal
						},
						ticks: {
							color: '#64748B',
							font: { size: 11 }
						}
					},
					y: {
						grid: {
							color: '#33415530',
							display: horizontal
						},
						ticks: {
							color: '#64748B',
							font: { size: 11 }
						}
					}
				},
				animation: {
					duration: 800,
					easing: 'easeOutQuart'
				}
			}
		};

		chartInstance = new Chart(canvas, config);

		return () => {
			chartInstance?.destroy();
		};
	});

	$effect(() => {
		if (chartInstance && data) {
			chartInstance.data.datasets[0].data = data;
			chartInstance.data.labels = labels;
			chartInstance.update();
		}
	});
</script>

<div class="w-full h-full min-h-[150px]">
	<canvas bind:this={canvas}></canvas>
</div>