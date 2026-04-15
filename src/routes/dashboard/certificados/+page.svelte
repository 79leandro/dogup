<script lang="ts">
	// Certificates Page
	const certificados = [
		{ cnpj: '12.345.678/0001-90', cliente: 'Empresa Alpha Ltda', tipo: 'A1', validade: '2025-06-15', responsavel: 'João Silva', status: 'VALIDO' },
		{ cnpj: '98.765.432/0001-54', cliente: 'Comercial Beta S.A.', tipo: 'A3', validade: '2024-04-20', responsavel: 'Maria Santos', status: 'VENCIDO' },
		{ cnpj: '45.678.901/0001-23', cliente: 'Serviços Gamma Eireli', tipo: 'A1', validade: '2024-05-10', responsavel: 'Pedro Costa', status: 'VENCIDO' },
		{ cnpj: '78.901.234/0001-67', cliente: 'Indústria Delta Ltda', tipo: 'A1', validade: '2026-03-01', responsavel: 'Ana Oliveira', status: 'VALIDO' }
	];

	function getDaysUntilExpiry(date: string): number {
		const now = new Date();
		const expiry = new Date(date);
		const diff = expiry.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	}

	function getStatusInfo(status: string, validade: string) {
		const days = getDaysUntilExpiry(validade);
		if (status === 'VENCIDO') {
			return { class: 'status-critical', label: `Vencido há ${Math.abs(days)} dias` };
		}
		if (days <= 30) {
			return { class: 'status-warning', label: `Vence em ${days} dias` };
		}
		return { class: 'status-success', label: `Válido (${days} dias)` };
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-terminal-100">Certificados Digitais</h1>
			<p class="text-terminal-500">Validade e-CAC e NF-e</p>
		</div>
		<button class="btn btn-primary flex items-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
			</svg>
			Novo Certificado
		</button>
	</div>

	<!-- Summary -->
	<div class="grid grid-cols-4 gap-4">
		<div class="card p-4 text-center">
			<div class="text-2xl font-bold text-terminal-100">221</div>
			<div class="text-xs text-terminal-500">Total</div>
		</div>
		<div class="card p-4 text-center border-l-4 border-l-semantic-success">
			<div class="text-2xl font-bold text-semantic-success">180</div>
			<div class="text-xs text-terminal-500">Válidos</div>
		</div>
		<div class="card p-4 text-center border-l-4 border-l-semantic-warning">
			<div class="text-2xl font-bold text-semantic-warning">29</div>
			<div class="text-xs text-terminal-500">Próximo Vencimento</div>
		</div>
		<div class="card p-4 text-center border-l-4 border-l-semantic-critical">
			<div class="text-2xl font-bold text-semantic-critical">12</div>
			<div class="text-xs text-terminal-500">Vencidos</div>
		</div>
	</div>

	<!-- Table -->
	<div class="card">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-terminal-700/50">
					<tr>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">CNPJ</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Cliente</th>
						<th class="text-center px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Tipo</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Responsável</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Validade</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-terminal-700">
					{#each certificados as cert}
						{@const statusInfo = getStatusInfo(cert.status, cert.validade)}
						<tr class="hover:bg-terminal-700/30">
							<td class="px-4 py-4 text-sm font-mono text-terminal-200">{cert.cnpj}</td>
							<td class="px-4 py-4 text-sm text-terminal-100">{cert.cliente}</td>
							<td class="px-4 py-4 text-center">
								<span class="px-2 py-1 rounded bg-terminal-700 text-terminal-200 text-sm font-medium">{cert.tipo}</span>
							</td>
							<td class="px-4 py-4 text-sm text-terminal-300">{cert.responsavel}</td>
							<td class="px-4 py-4 text-sm text-terminal-300">{cert.validade}</td>
							<td class="px-4 py-4">
								<span class="status-badge {statusInfo.class}">{statusInfo.label}</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
