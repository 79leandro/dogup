<script lang="ts">
	let { count } = $props();
</script>

{#if count > 0}
	<div class="relative overflow-hidden bg-semantic-warning/10 border border-semantic-warning/30 rounded-xl p-4 animate-slide-up">
		<!-- Background pattern -->
		<div class="absolute inset-0 opacity-5">
			<div class="absolute inset-0" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(245, 158, 11, 0.1) 10px, rgba(245, 158, 11, 0.1) 20px);"></div>
		</div>

		<div class="relative flex items-center gap-4">
			<!-- Warning Icon -->
			<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-semantic-warning/20 flex items-center justify-center">
				<svg class="w-6 h-6 text-semantic-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
				</svg>
			</div>

			<!-- Content -->
			<div class="flex-1">
				<h3 class="text-semantic-warning font-semibold">
					Você tem {count} mensagem{count > 1 ? 's' : ''} relevante{count > 1 ? 's' : ''} não lida{count > 1 ? 's' : ''} no e-CAC
				</h3>
				<p class="text-sm text-semantic-warning/80 mt-0.5">
					Ignorar essas mensagens pode afetar a consulta de obrigações e situação fiscal.
				</p>
			</div>

			<!-- Action -->
			<a
				href="/dashboard/caixa-postal"
				class="flex-shrink-0 px-4 py-2 bg-semantic-warning text-slate-900 font-medium text-sm rounded-lg hover:bg-semantic-warning/90 transition-colors"
			>
				Ver Mensagens
			</a>
		</div>
	</div>
{/if}
