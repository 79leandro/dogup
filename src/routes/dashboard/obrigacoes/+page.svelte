<script lang="ts">
	// Obligations page
	let selectedYear = $state('2024');
	let selectedMonth = $state('todos');
	let selectedType = $state('todos');

	const obligations = [
		{ cnpj: '12.345.678/0001-90', cliente: 'Empresa Alpha Ltda', tipo: 'DCTFWEB', ano: 2024, mes: 3, status: 'ENTREGUE', recibo: '2024-03-15' },
		{ cnpj: '98.765.432/0001-54', cliente: 'Comercial Beta S.A.', tipo: 'DCTFWEB', ano: 2024, mes: 3, status: 'EM_PROCESSAMENTO', recibo: null },
		{ cnpj: '45.678.901/0001-23', cliente: 'Serviços Gamma Eireli', tipo: 'DCTFWEB', ano: 2024, mes: 2, status: 'INCONSISTENCIA', recibo: null },
		{ cnpj: '78.901.234/0001-67', cliente: 'Indústria Delta Ltda', tipo: 'DCTFWEB', ano: 2024, mes: 3, status: 'ENTREGUE', recibo: '2024-03-18' },
		{ cnpj: '34.567.890/0001-45', cliente: 'Tech Solutions Eireli', tipo: 'DCTFWEB', ano: 2024, mes: 3, status: 'ENTREGUE', recibo: '2024-03-20' }
	];

	function getStatusBadge(status: string): { class: string; label: string } {
		const badges: Record<string, { class: string; label: string }> = {
			ENTREGUE: { class: 'status-success', label: 'Entregue' },
			NAO_ENTREGUE: { class: 'status-critical', label: 'Não Entregue' },
			INCONSISTENCIA: { class: 'status-warning', label: 'Inconsistência' },
			EM_PROCESSAMENTO: { class: 'status-warning', label: 'Em Processamento' },
			OUTROS: { class: 'bg-terminal-700 text-terminal-300', label: 'Outros' }
		};
		return badges[status] || badges.OUTROS;
	}

	function getMonthName(month: number): string {
		const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
		return months[month - 1];
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-terminal-100">Obrigações Acessórias</h1>
			<p class="text-terminal-500">Monitoramento de transmissões DCTFWeb</p>
		</div>
	</div>

	<!-- Filters -->
	<div class="card p-4">
		<div class="flex items-center gap-4">
			<div>
				<label class="label text-xs">Tipo</label>
				<select bind:value={selectedType} class="input w-40">
					<option value="todos">Todos</option>
					<option value="DCTFWEB">DCTFWeb</option>
					<option value="GFIP">GFIP</option>
					<option value="DIRF">DIRF</option>
				</select>
			</div>
			<div>
				<label class="label text-xs">Ano</label>
				<select bind:value={selectedYear} class="input w-28">
					<option value="2024">2024</option>
					<option value="2023">2023</option>
					<option value="2022">2022</option>
				</select>
			</div>
			<div>
				<label class="label text-xs">Mês</label>
				<select bind:value={selectedMonth} class="input w-32">
					<option value="todos">Todos</option>
					<option value="1">Janeiro</option>
					<option value="2">Fevereiro</option>
					<option value="3">Março</option>
					<option value="4">Abril</option>
					<option value="5">Maio</option>
					<option value="6">Junho</option>
				</select>
			</div>
			<div class="flex-1"></div>
			<div class="flex items-end gap-2">
				<span class="text-sm text-terminal-400">Taxa de entrega:</span>
				<span class="text-xl font-bold text-semantic-success">83.7%</span>
			</div>
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
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Tipo</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Período</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Status</th>
						<th class="text-left px-4 py-3 text-xs font-medium text-terminal-400 uppercase">Recibo</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-terminal-700">
					{#each obligations as obg}
						{@const badge = getStatusBadge(obg.status)}
						<tr class="hover:bg-terminal-700/30 transition-colors">
							<td class="px-4 py-4 text-sm font-mono text-terminal-200">{obg.cnpj}</td>
							<td class="px-4 py-4 text-sm text-terminal-100">{obg.cliente}</td>
							<td class="px-4 py-4 text-sm text-terminal-300">{obg.tipo}</td>
							<td class="px-4 py-4 text-sm text-terminal-300">{getMonthName(obg.mes)}/{obg.ano}</td>
							<td class="px-4 py-4">
								<span class="status-badge {badge.class}">{badge.label}</span>
							</td>
							<td class="px-4 py-4 text-sm text-terminal-400">
								{obg.recibo || '-'}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
