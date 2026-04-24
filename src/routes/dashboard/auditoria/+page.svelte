<script lang="ts">
	import { onMount } from 'svelte';
	import { notifications } from '$lib/stores/notifications';

	interface AuditoriaRegistro {
		id: string;
		usuarioId: string;
		usuarioNome: string;
		empresaId: string;
		acao: 'CREATE' | 'UPDATE' | 'DELETE';
		entidade: string;
		entidadeId: string;
		dadosAntigos: Record<string, any> | null;
		dadosNovos: Record<string, any> | null;
		ipAddress: string | null;
		userAgent: string | null;
		createdAt: string;
	}

	let registros = $state<AuditoriaRegistro[]>([]);
	let isLoading = $state(true);
	let expandedId = $state<string | null>(null);

	// Filters
	let filterEntidade = $state('');
	let filterAcao = $state('');
	let filterUsuario = $state('');

	const entidades = ['Cliente', 'Obrigacao'];
	const acoes = ['CREATE', 'UPDATE', 'DELETE'];

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getAcaoBadge(acao: string): { class: string; label: string } {
		const badges: Record<string, { class: string; label: string }> = {
			CREATE: { class: 'status-success', label: 'Criação' },
			UPDATE: { class: 'status-warning', label: 'Alteração' },
			DELETE: { class: 'status-critical', label: 'Exclusão' }
		};
		return badges[acao] || { class: '', label: acao };
	}

	async function fetchAuditoria() {
		isLoading = true;
		try {
			const params = new URLSearchParams();
			if (filterEntidade) params.set('entidade', filterEntidade);
			if (filterAcao) params.set('acao', filterAcao);
			if (filterUsuario) params.set('usuarioId', filterUsuario);

			const response = await fetch(`/api/auditoria?${params.toString()}`);
			const data = await response.json();

			if (response.ok) {
				registros = data.registros || [];
			} else {
				notifications.error('Erro ao carregar auditoria', data.error);
			}
		} catch (error) {
			notifications.error('Erro de conexão', 'Não foi possível carregar os registros');
		} finally {
			isLoading = false;
		}
	}

	function toggleExpand(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	onMount(() => {
		fetchAuditoria();
	});
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-slate-800">Auditoria</h1>
			<p class="text-slate-400 mt-1">Registro de alterações no sistema</p>
		</div>
	</div>

	<!-- Filters -->
	<div class="card p-4">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div>
				<label for="entidade" class="label">Entidade</label>
				<select id="entidade" bind:value={filterEntidade} class="input">
					<option value="">Todas</option>
					{#each entidades as ent}
						<option value={ent}>{ent}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="acao" class="label">Ação</label>
				<select id="acao" bind:value={filterAcao} class="input">
					<option value="">Todas</option>
					{#each acoes as acao}
						<option value={acao}>{acao}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="usuario" class="label">Usuário ID</label>
				<input
					type="text"
					id="usuario"
					bind:value={filterUsuario}
					class="input"
					placeholder="ID do usuário"
				/>
			</div>

			<div class="flex items-end">
				<button onclick={fetchAuditoria} class="btn btn-primary w-full">
					Filtrar
				</button>
			</div>
		</div>
	</div>

	<!-- Table -->
	<div class="card overflow-hidden">
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin w-8 h-8 border-2 border-semantic-accent border-t-transparent rounded-full"></div>
			</div>
		{:else if registros.length === 0}
			<div class="text-center py-12">
				<p class="text-slate-400">Nenhum registro encontrado</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-slate-50 border-b border-slate-200">
						<tr>
							<th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Data/Hora</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Usuário</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Ação</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Entidade</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">ID</th>
							<th class="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wide">Detalhes</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200">
						{#each registros as registro}
							<tr class="hover:bg-slate-50 transition-colors">
								<td class="px-4 py-3 text-sm text-slate-600">
									{formatDate(registro.createdAt)}
								</td>
								<td class="px-4 py-3 text-sm text-slate-800">
									{registro.usuarioNome}
								</td>
								<td class="px-4 py-3">
									<span class="badge {getAcaoBadge(registro.acao).class}">
										{getAcaoBadge(registro.acao).label}
									</span>
								</td>
								<td class="px-4 py-3 text-sm text-slate-800">
									{registro.entidade}
								</td>
								<td class="px-4 py-3 text-sm text-slate-600 font-mono">
									{registro.entidadeId.slice(0, 8)}...
								</td>
								<td class="px-4 py-3 text-center">
									<button
										onclick={() => toggleExpand(registro.id)}
										class="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
										aria-label={expandedId === registro.id ? 'Recolher detalhes' : 'Expandir detalhes'}
									>
										<svg
											class="w-5 h-5 transition-transform {expandedId === registro.id ? 'rotate-180' : ''}"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
										</svg>
									</button>
								</td>
							</tr>
							{#if expandedId === registro.id}
								<tr>
									<td colspan="6" class="px-4 py-4 bg-slate-50">
										<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
											{#if registro.dadosAntigos}
												<div>
													<h4 class="text-sm font-medium text-slate-700 mb-2">Dados Anteriores</h4>
													<pre class="bg-slate-100 p-3 rounded-lg text-xs text-slate-600 overflow-auto max-h-48">{JSON.stringify(registro.dadosAntigos, null, 2)}</pre>
												</div>
											{/if}
											{#if registro.dadosNovos}
												<div>
													<h4 class="text-sm font-medium text-slate-700 mb-2">Dados Novos</h4>
													<pre class="bg-slate-100 p-3 rounded-lg text-xs text-slate-600 overflow-auto max-h-48">{JSON.stringify(registro.dadosNovos, null, 2)}</pre>
												</div>
											{/if}
											{#if !registro.dadosAntigos && !registro.dadosNovos}
												<div class="text-sm text-slate-500">Sem detalhes disponíveis</div>
											{/if}
										</div>
										{#if registro.ipAddress}
											<p class="text-xs text-slate-400 mt-3">IP: {registro.ipAddress}</p>
										{/if}
									</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
