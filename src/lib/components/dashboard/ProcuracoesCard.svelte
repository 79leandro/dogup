<script lang="ts">
	let { emDia, proximoVencimento, vencidas } = $props();

	const total = emDia + proximoVencimento + vencidas;
	const percentage = {
		emDia: (emDia / total) * 100,
		proximo: (proximoVencimento / total) * 100,
		vencidas: (vencidas / total) * 100
	};
</script>

<div class="card card-hover p-5">
	<!-- Header -->
	<div class="flex items-center justify-between mb-4">
		<div>
			<h3 class="font-semibold text-terminal-100">Procurations e-CAC</h3>
			<p class="text-xs text-terminal-500">Poderes</p>
		</div>
		<div class="w-8 h-8 rounded-lg bg-terminal-700 flex items-center justify-center">
			<svg class="w-4 h-4 text-terminal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
			</svg>
		</div>
	</div>

	<!-- Semicircle Gauge -->
	<div class="relative flex justify-center py-2">
		<svg width="160" height="90" viewBox="0 0 160 90">
			<!-- Background arc -->
			<path
				d="M 20 80 A 60 60 0 0 1 140 80"
				fill="none"
				stroke="#334155"
				stroke-width="16"
				stroke-linecap="round"
			/>

			<!-- Valid (green) - bottom -->
			<path
				d="M 20 80 A 60 60 0 0 1 140 80"
				fill="none"
				stroke="#10B981"
				stroke-width="16"
				stroke-linecap="round"
				stroke-dasharray="{(percentage.emDia / 100) * 188.5} 188.5"
				stroke-dashoffset="0"
				class="transition-all duration-1000"
			/>

			<!-- Warning (yellow) - right side -->
			<path
				d="M 20 80 A 60 60 0 0 1 140 80"
				fill="none"
				stroke="#F59E0B"
				stroke-width="16"
				stroke-linecap="round"
				stroke-dasharray="{(percentage.proximo / 100) * 188.5} 188.5"
				stroke-dashoffset="{-(percentage.emDia / 100) * 188.5}"
				class="transition-all duration-1000"
			/>

			<!-- Expired (red) - left side -->
			<path
				d="M 20 80 A 60 60 0 0 1 140 80"
				fill="none"
				stroke="#EF4444"
				stroke-width="16"
				stroke-linecap="round"
				stroke-dasharray="{(percentage.vencidas / 100) * 188.5} 188.5"
				stroke-dashoffset="{ -((percentage.emDia + percentage.proximo) / 100) * 188.5}"
				class="transition-all duration-1000"
			/>
		</svg>

		<!-- Center percentage -->
		<div class="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
			<div class="text-xl font-bold text-terminal-100">{total}</div>
			<div class="text-[10px] text-terminal-500 uppercase tracking-wider">Total</div>
		</div>
	</div>

	<!-- Legend - Centered below -->
	<div class="flex justify-center gap-4 mt-2">
		<div class="flex items-center gap-1.5">
			<div class="w-2.5 h-2.5 rounded-full bg-semantic-success"></div>
			<span class="text-[10px] text-terminal-400">Em dia ({emDia})</span>
		</div>
		<div class="flex items-center gap-1.5">
			<div class="w-2.5 h-2.5 rounded-full bg-semantic-warning"></div>
			<span class="text-[10px] text-terminal-400">Alerta ({proximoVencimento})</span>
		</div>
		<div class="flex items-center gap-1.5">
			<div class="w-2.5 h-2.5 rounded-full bg-semantic-critical"></div>
			<span class="text-[10px] text-terminal-400">Vencidas ({vencidas})</span>
		</div>
	</div>
</div>
