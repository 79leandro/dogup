<script lang="ts">
	let { validos, vencidos, proximasVencimento } = $props();

	const total = $derived(validos + vencidos + proximasVencimento);
	const statusOk = $derived(vencidos === 0 && proximasVencimento === 0);
</script>

<div class="card card-hover p-5">
	<!-- Header -->
	<div class="flex items-center justify-between mb-4">
		<div>
			<h3 class="font-semibold text-terminal-100">Certificados</h3>
			<p class="text-xs text-terminal-500">Digitais</p>
		</div>
		<div class="w-8 h-8 rounded-lg bg-terminal-700 flex items-center justify-center">
			<svg class="w-4 h-4 text-terminal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
			</svg>
		</div>
	</div>

	{#if statusOk}
		<!-- Success State -->
		<div class="p-4 rounded-xl bg-semantic-success/10 border border-semantic-success/30 text-center">
			<div class="w-10 h-10 rounded-full bg-semantic-success/20 flex items-center justify-center mx-auto mb-2">
				<svg class="w-5 h-5 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
				</svg>
			</div>
			<p class="text-sm font-medium text-semantic-success">Tudo certo com seu certificado!</p>
			<p class="text-xs text-semantic-success/70 mt-1">Validade superior a 30 dias</p>
		</div>
	{:else}
		<!-- Warning State -->
		<div class="space-y-2">
			{#if vencidos > 0}
				<div class="flex items-center justify-between p-2 rounded-lg bg-semantic-critical/10 border border-semantic-critical/20">
					<span class="text-xs text-semantic-critical">Vencidos</span>
					<span class="text-sm font-bold text-semantic-critical">{vencidos}</span>
				</div>
			{/if}
			{#if proximasVencimento > 0}
				<div class="flex items-center justify-between p-2 rounded-lg bg-semantic-warning/10 border border-semantic-warning/20">
					<span class="text-xs text-semantic-warning">Próximo Vencimento</span>
					<span class="text-sm font-bold text-semantic-warning">{proximasVencimento}</span>
				</div>
			{/if}
			<div class="flex items-center justify-between p-2 rounded-lg bg-semantic-success/10 border border-semantic-success/20">
				<span class="text-xs text-semantic-success">Válidos</span>
				<span class="text-sm font-bold text-semantic-success">{validos}</span>
			</div>
		</div>
	{/if}
</div>
