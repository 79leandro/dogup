<script lang="ts">
	// DCTFWeb em Andamento Page
	const obrigacoes = [
		{ cnpj: '12.345.678/0001-90', cliente: 'Empresa Alpha Ltda', mes: 3, ano: 2024, status: 'EM_PROCESSAMENTO', inicio: '2024-03-15' },
		{ cnpj: '98.765.432/0001-54', cliente: 'Comercial Beta S.A.', mes: 3, ano: 2024, status: 'EM_PROCESSAMENTO', inicio: '2024-03-18' },
		{ cnpj: '45.678.901/0001-23', cliente: 'Serviços Gamma Eireli', mes: 3, ano: 2024, status: 'INCONSISTENCIA', inicio: '2024-03-10' },
		{ cnpj: '78.901.234/0001-67', cliente: 'Indústria Delta Ltda', mes: 3, ano: 2024, status: 'EM_PROCESSAMENTO', inicio: '2024-03-20' }
	];

	function getMonthName(month: number): string {
		const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
		return months[month - 1];
	}

	function getStatusInfo(status: string) {
		const badges: Record<string, { class: string; label: string }> = {
			EM_PROCESSAMENTO: { class: 'status-warning', label: 'Em Processamento' },
			INCONSISTENCIA: { class: 'status-critical', label: 'Inconsistência' },
			ENTREGUE: { class: 'status-success', label: 'Entregue' }
		};
		return badges[status] || badges.EM_PROCESSAMENTO;
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl font-bold text-terminal-100">DCTFWeb em Andamento</h1>
		<p class="text-terminal-500">Declarações sendo processadas ou com inconsistências</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-3 gap-4">
		<div class="card p-5 border-l-4 border-l-semantic-warning">
			<div class="text-3xl font-bold text-semantic-warning">{obrigacoes.filter(o => o.status === 'EM_PROCESSAMENTO').length}</div>
			<div class="text-sm text-terminal-500">Em Processamento</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-critical">
			<div class="text-3xl font-bold text-semantic-critical">{obrigacoes.filter(o => o.status === 'INCONSISTENCIA').length}</div>
			<div class="text-sm text-terminal-500">Com Inconsistência</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-success">
			<div class="text-3xl font-bold text-semantic-success">{obrigacoes.filter(o => o.status === 'ENTREGUE').length}</div>
			<div class="text-sm text-terminal-500">Entregues (Total)</div>
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
						<th class="text-center px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Período</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Status</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Início</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-terminal-700">
					{#each obrigacoes as obg}
						{@const statusInfo = getStatusInfo(obg.status)}
						<tr class="hover:bg-terminal-700/30">
							<td class="px-4 py-4 text-sm font-mono text-terminal-200">{obg.cnpj}</td>
							<td class="px-4 py-4 text-sm text-terminal-100">{obg.cliente}</td>
							<td class="px-4 py-4 text-center text-sm text-terminal-300">{getMonthName(obg.mes)}/{obg.ano}</td>
							<td class="px-4 py-4">
								<span class="status-badge {statusInfo.class}">{statusInfo.label}</span>
							</td>
							<td class="px-4 py-4 text-sm text-terminal-300">{obg.inicio}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
