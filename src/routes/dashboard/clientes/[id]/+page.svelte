<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { notifications } from '$lib/stores/notifications';
	import { formatDocumento } from '$lib/utils/cnpj';
	import ClienteForm from '$lib/components/clientes/ClienteForm.svelte';
	import type { TipoPessoa } from '@prisma/client';

	interface Cliente {
		id: string;
		tipoPessoa: TipoPessoa;
		documento: string;
		nomeRazao: string;
		nomeFantasia: string | null;
		estadoCivil: string | null;
		regime: string;
		situacaoFiscal: string;
		logradouro: string | null;
		cidade: string | null;
		uf: string | null;
		cep: string | null;
		email: string | null;
		telefone: string | null;
		responsavelTecnico: string | null;
		createdAt: string;
		updatedAt: string;
		_count?: {
			obrigacoes: number;
			parcelamentos: number;
			mensagens: number;
		};
	}

	let cliente = $state<Cliente | null>(null);
	let isLoading = $state(true);
	let isEditing = $state(false);

	const clienteId = $derived($page.params.id);
	const clienteSituacao = $derived(cliente ? getSituacaoBadge(cliente.situacaoFiscal) : { class: '', label: '' });

	async function fetchCliente() {
		isLoading = true;
		try {
			const response = await fetch(`/api/clientes/${clienteId}`);
			const data = await response.json();

			if (response.ok) {
				cliente = data.cliente;
			} else {
				notifications.error('Erro ao carregar cliente', data.error);
			}
		} catch (error) {
			notifications.error('Erro de conexão', 'Não foi possível carregar o cliente');
		} finally {
			isLoading = false;
		}
	}

	function formatCEP(cep: string): string {
		if (cep.length !== 8) return cep;
		return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
	}

	function getSituacaoBadge(situacao: string): { class: string; label: string } {
		const badges: Record<string, { class: string; label: string }> = {
			REGULAR: { class: 'status-success', label: 'Regular' },
			REGULARIZADO: { class: 'status-warning', label: 'Regularizado' },
			IRREGULAR: { class: 'status-critical', label: 'Irregular' }
		};
		return badges[situacao] || { class: '', label: situacao };
	}

	async function deleteCliente() {
		if (!cliente) return;

		if (!confirm(`Tem certeza que deseja excluir ${cliente.nomeRazao}? Esta ação não pode ser desfeita.`)) {
			return;
		}

		try {
			const response = await fetch(`/api/clientes/${clienteId}`, { method: 'DELETE' });

			if (response.ok) {
				notifications.success('Cliente excluído', `${cliente.nomeRazao} foi removido`);
				window.location.href = '/dashboard/clientes';
			} else {
				const data = await response.json();
				notifications.error('Erro ao excluir', data.error);
			}
		} catch (error) {
			notifications.error('Erro de conexão', 'Não foi possível excluir o cliente');
		}
	}

	onMount(() => {
		fetchCliente();
	});
</script>

<div class="space-y-6 animate-fade-in">
	{#if isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin w-8 h-8 border-2 border-semantic-accent border-t-transparent rounded-full"></div>
		</div>
	{:else if cliente}
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/dashboard/clientes" aria-label="Voltar para clientes" class="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
					</svg>
				</a>
				<div>
					<h1 class="font-display text-2xl font-bold text-slate-800">{cliente.nomeRazao}</h1>
					<p class="text-slate-400">{formatDocumento(cliente.documento)}</p>
				</div>
				<span class="badge {clienteSituacao.class}">{clienteSituacao.label}</span>
			</div>

			<div class="flex items-center gap-3">
				<button
					onclick={() => isEditing = !isEditing}
					class="btn btn-ghost flex items-center gap-2"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
					</svg>
					{isEditing ? 'Cancelar' : 'Editar'}
				</button>
				<button
					onclick={deleteCliente}
					class="btn btn-ghost text-semantic-critical hover:bg-semantic-critical/10 flex items-center gap-2"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
					</svg>
					Excluir
				</button>
			</div>
		</div>

		<!-- Main Content Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Left Column - Dados Principais -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Dados Cadastrais -->
				<div class="card p-6">
					<h2 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
						<svg class="w-5 h-5 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
						</svg>
						Dados Cadastrais
					</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<span class="text-xs text-slate-400 uppercase tracking-wide block">Razão Social</span>
							<p class="text-slate-800 mt-1">{cliente.nomeRazao}</p>
						</div>

						{#if cliente.nomeFantasia}
							<div>
								<span class="text-xs text-slate-400 uppercase tracking-wide block">Nome Fantasia</span>
								<p class="text-slate-800 mt-1">{cliente.nomeFantasia}</p>
							</div>
						{/if}

						<div>
							<span class="text-xs text-slate-400 uppercase tracking-wide block">Regime Tributário</span>
							<p class="text-slate-800 mt-1">
								{cliente.regime === 'SIMPLES_NACIONAL' ? 'Simples Nacional' : 'Normal'}
							</p>
						</div>

						<div>
							<span class="text-xs text-slate-400 uppercase tracking-wide block">{cliente.tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'}</span>
							<p class="text-slate-800 mt-1 font-mono">{formatDocumento(cliente.documento)}</p>
						</div>
					</div>
				</div>

				<!-- Endereço -->
				{#if cliente.logradouro || cliente.cidade || cliente.uf}
					<div class="card p-6">
						<h2 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
							<svg class="w-5 h-5 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
							</svg>
							Endereço
						</h2>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							{#if cliente.logradouro}
								<div class="md:col-span-2">
									<span class="text-xs text-slate-400 uppercase tracking-wide block">Logradouro</span>
									<p class="text-slate-800 mt-1">{cliente.logradouro}</p>
								</div>
							{/if}

							{#if cliente.cidade}
								<div>
									<span class="text-xs text-slate-400 uppercase tracking-wide block">Cidade</span>
									<p class="text-slate-800 mt-1">{cliente.cidade}{cliente.uf ? ` - ${cliente.uf}` : ''}</p>
								</div>
							{/if}

							{#if cliente.cep}
								<div>
									<span class="text-xs text-slate-400 uppercase tracking-wide block">CEP</span>
									<p class="text-slate-800 mt-1">{formatCEP(cliente.cep)}</p>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Contato -->
				{#if cliente.email || cliente.telefone || cliente.responsavelTecnico}
					<div class="card p-6">
						<h2 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
							<svg class="w-5 h-5 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
							</svg>
							Contato
						</h2>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							{#if cliente.email}
								<div>
									<span class="text-xs text-slate-400 uppercase tracking-wide block">E-mail</span>
									<p class="text-slate-800 mt-1">{cliente.email}</p>
								</div>
							{/if}

							{#if cliente.telefone}
								<div>
									<span class="text-xs text-slate-400 uppercase tracking-wide block">Telefone</span>
									<p class="text-slate-800 mt-1">{cliente.telefone}</p>
								</div>
							{/if}

							{#if cliente.responsavelTecnico}
								<div class="md:col-span-2">
									<span class="text-xs text-slate-400 uppercase tracking-wide block">Responsável Técnico</span>
									<p class="text-slate-800 mt-1">{cliente.responsavelTecnico}</p>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Right Column - Resumo -->
			<div class="space-y-6">
				<!-- Quick Stats -->
				<div class="card p-6">
					<h2 class="font-semibold text-slate-800 mb-4">Resumo</h2>

					<div class="space-y-4">
						<div class="flex items-center justify-between py-2 border-b border-slate-200">
							<span class="text-slate-400">Obrigações</span>
							<span class="text-slate-800 font-medium">{cliente._count?.obrigacoes || 0}</span>
						</div>
						<div class="flex items-center justify-between py-2 border-b border-slate-200">
							<span class="text-slate-400">Parcelamentos</span>
							<span class="text-slate-800 font-medium">{cliente._count?.parcelamentos || 0}</span>
						</div>
						<div class="flex items-center justify-between py-2 border-b border-slate-200">
							<span class="text-slate-400">Mensagens</span>
							<span class="text-slate-800 font-medium">{cliente._count?.mensagens || 0}</span>
						</div>
						<div class="flex items-center justify-between py-2">
							<span class="text-slate-400">Cadastro</span>
							<span class="text-slate-800 font-medium text-sm">
								{new Date(cliente.createdAt).toLocaleDateString('pt-BR')}
							</span>
						</div>
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="card p-6">
					<h2 class="font-semibold text-slate-800 mb-4">Ações Rápidas</h2>

					<div class="space-y-2">
						<a
							href="/dashboard/obrigacoes?cliente={cliente.id}"
							class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100/50 transition-colors text-slate-600 hover:text-slate-800"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
							</svg>
							Ver Obrigações
						</a>
						<a
							href="/dashboard/parcelamentos?cliente={cliente.id}"
							class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100/50 transition-colors text-slate-600 hover:text-slate-800"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
							</svg>
							Ver Parcelamentos
						</a>
						<a
							href="/dashboard/caixa-postal?cliente={cliente.id}"
							class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100/50 transition-colors text-slate-600 hover:text-slate-800"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
							</svg>
							Caixa Postal e-CAC
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Edit Form (shown when isEditing is true) -->
		{#if isEditing}
			<div class="card p-6">
				<h2 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
					</svg>
					Editar Cliente
				</h2>
				<ClienteForm
					{cliente}
					onSave={() => {
						isEditing = false;
						fetchCliente();
					}}
					onCancel={() => isEditing = false}
				/>
			</div>
		{/if}
	{:else}
		<div class="text-center py-12">
			<p class="text-slate-400">Cliente não encontrado</p>
			<a href="/dashboard/clientes" class="btn btn-primary mt-4">
				Voltar para Clientes
			</a>
		</div>
	{/if}
</div>
