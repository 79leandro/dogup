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
		<h1 class="font-display text-2xl font-bold text-slate-800">DCTFWeb em Andamento</h1>
		<p class="text-slate-400">Declarações sendo processadas ou com inconsistências</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-3 gap-4">
		<div class="card p-5 border-l-4 border-l-semantic-warning">
			<div class="text-3xl font-bold text-semantic-warning">{obrigacoes.filter(o => o.status === 'EM_PROCESSAMENTO').length}</div>
			<div class="text-sm text-slate-400">Em Processamento</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-critical">
			<div class="text-3xl font-bold text-semantic-critical">{obrigacoes.filter(o => o.status === 'INCONSISTENCIA').length}</div>
			<div class="text-sm text-slate-400">Com Inconsistência</div>
		</div>
		<div class="card p-5 border-l-4 border-l-semantic-success">
			<div class="text-3xl font-bold text-semantic-success">{obrigacoes.filter(o => o.status === 'ENTREGUE').length}</div>
			<div class="text-sm text-slate-400">Entregues (Total)</div>
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
						<th class="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Período</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Início</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200">
					{#each obrigacoes as obg}
						{@const statusInfo = getStatusInfo(obg.status)}
						<tr class="hover:bg-slate-100/50">
							<td class="px-4 py-4 text-sm font-mono text-slate-700">{obg.cnpj}</td>
							<td class="px-4 py-4 text-sm text-slate-800">{obg.cliente}</td>
							<td class="px-4 py-4 text-center text-sm text-slate-600">{getMonthName(obg.mes)}/{obg.ano}</td>
							<td class="px-4 py-4">
								<span class="status-badge {statusInfo.class}">{statusInfo.label}</span>
							</td>
							<td class="px-4 py-4 text-sm text-slate-600">{obg.inicio}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
