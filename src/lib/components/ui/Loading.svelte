<script lang="ts">
	import { loading } from '$lib/stores/loading';

	const state = $derived($loading);
</script>

{#if state.visible}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
		<div class="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5 min-w-[280px]">
			<!-- Animated spinner -->
			<div class="relative w-16 h-16">
				<div class="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
				<div class="absolute inset-0 border-4 border-semantic-accent border-t-transparent rounded-full animate-spin"></div>
				<div class="absolute inset-3 border-4 border-slate-100 rounded-full"></div>
			</div>

			<!-- Loading text -->
			<div class="text-center">
				<p class="text-slate-800 font-medium text-lg">{state.message}</p>
				<p class="text-slate-400 text-sm mt-1">Aguarde...</p>
			</div>

			<!-- Progress dots animation -->
			<div class="flex gap-1.5">
				<div class="w-2 h-2 bg-semantic-accent rounded-full animate-bounce" style="animation-delay: 0ms"></div>
				<div class="w-2 h-2 bg-semantic-accent rounded-full animate-bounce" style="animation-delay: 150ms"></div>
				<div class="w-2 h-2 bg-semantic-accent rounded-full animate-bounce" style="animation-delay: 300ms"></div>
			</div>
		</div>
	</div>
{/if}