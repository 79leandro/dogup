<script lang="ts">
	// CND Page
	const certidoes = [
		{ cnpj: '12.345.678/0001-90', cliente: 'Empresa Alpha Ltda', tipo: 'CND_FEDERAL', situacao: 'REGULAR', validade: '2024-06-30' },
		{ cnpj: '98.765.432/0001-54', cliente: 'Comercial Beta S.A.', tipo: 'CND_FEDERAL', situacao: 'IRREGULAR', validade: 'VENCIDA' },
		{ cnpj: '45.678.901/0001-23', cliente: 'Serviços Gamma Eireli', tipo: 'CND_ESTADUAL', situacao: 'REGULAR', validade: '2024-05-15' },
		{ cnpj: '78.901.234/0001-67', cliente: 'Indústria Delta Ltda', tipo: 'CND_FEDERAL', situacao: 'REGULAR', validade: '2024-12-31' }
	];

	function getStatusBadge(situacao: string) {
		const badges: Record<string, string> = {
			REGULAR: 'status-success',
			IRREGULAR: 'status-critical',
			PENDENTE: 'status-warning'
		};
		return badges[situacao] || '';
	}

	function getTipoLabel(tipo: string): string {
		return tipo === 'CND_FEDERAL' ? 'CND Federal' : 'CND Estadual';
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl font-bold text-slate-800">Certidões Negativas de Débitos</h1>
		<p class="text-slate-400">CND Federal e Estadual</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-3 gap-6">
		<div class="card p-5">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 rounded-xl bg-semantic-success/10 flex items-center justify-center">
					<svg class="w-6 h-6 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
					</svg>
				</div>
				<div>
					<div class="text-2xl font-bold text-semantic-success">195</div>
					<div class="text-sm text-slate-400">Regulares</div>
				</div>
			</div>
		</div>
		<div class="card p-5">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 rounded-xl bg-semantic-warning/10 flex items-center justify-center">
					<svg class="w-6 h-6 text-semantic-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
				<div>
					<div class="text-2xl font-bold text-semantic-warning">18</div>
					<div class="text-sm text-slate-400">Próximo Vencimento</div>
				</div>
			</div>
		</div>
		<div class="card p-5">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 rounded-xl bg-semantic-critical/10 flex items-center justify-center">
					<svg class="w-6 h-6 text-semantic-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
				</div>
				<div>
					<div class="text-2xl font-bold text-semantic-critical">8</div>
					<div class="text-sm text-slate-400">Irregulares/Vencidas</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Table -->
	<div class="card">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-slate-100/50">
					<tr>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">CNPJ</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Cliente</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Tipo</th>
						<th class="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Validade</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200">
					{#each certidoes as cnd}
						<tr class="hover:bg-slate-100/50">
							<td class="px-4 py-4 text-sm font-mono text-slate-700">{cnd.cnpj}</td>
							<td class="px-4 py-4 text-sm text-slate-800">{cnd.cliente}</td>
							<td class="px-4 py-4 text-sm text-slate-600">{getTipoLabel(cnd.tipo)}</td>
							<td class="px-4 py-4 text-center">
								<span class="status-badge {getStatusBadge(cnd.situacao)}">{cnd.situacao}</span>
							</td>
							<td class="px-4 py-4 text-sm text-slate-600">{cnd.validade}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
