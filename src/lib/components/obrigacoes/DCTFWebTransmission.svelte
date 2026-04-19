<script lang="ts">
	import { notifications } from '$lib/stores/notifications';

	interface Props {
		clienteId: string;
		clienteNome: string;
		onSuccess?: (result: any) => void;
	}

	let { clienteId, clienteNome, onSuccess }: Props = $props();

	let ano = $state(new Date().getFullYear());
	let mes = $state(new Date().getMonth() + 1);
	let irpf = $state('');
	let csll = $state('');
	let pis = $state('');
	let cofins = $state('');
	let recolhimento = $state('');

	let isTransmitting = $state(false);
	let transmissionResult = $state<{
		status: string;
		protocolo: string | null;
		dataEnvio: string | null;
		recibo: string | null;
		erro?: string;
	} | null>(null);

	const transmissionStatus = $derived(
		!transmissionResult ? 'idle' :
		transmissionResult.status === 'entregue' ? 'success' :
		transmissionResult.status === 'erro' ? 'error' : 'processing'
	);

	function formatCurrency(value: string): string {
		if (!value) return '';
		const digits = value.replace(/\D/g, '');
		if (!digits) return '';
		const number = parseInt(digits) / 100;
		return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}

	function parseCurrency(value: string): number {
		if (!value) return 0;
		const digits = value.replace(/\D/g, '');
		return parseInt(digits) || 0;
	}

	async function handleTransmit() {
		// Basic validation
		if (!irpf && !csll && !pis && !cofins) {
			notifications.warning('Campos obrigatórios', 'Informe pelo menos um valor');
			return;
		}

		isTransmitting = true;
		transmissionResult = null;

		try {
			const response = await fetch('/api/obrigacoes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'transmitirDCTFWeb',
					clienteId,
					ano,
					mes,
					irpf: parseCurrency(irpf),
					csll: parseCurrency(csll),
					pis: parseCurrency(pis),
					cofins: parseCurrency(cofins),
					recolhimento: parseCurrency(recolhimento)
				})
			});

			const data = await response.json();

			if (response.ok) {
				transmissionResult = data.resultado;
				notifications.success(
					'DCTFWeb transmitida',
					`Protocolo: ${data.resultado.protocolo}`
				);
				if (onSuccess) {
					onSuccess(data);
				}
			} else {
				transmissionResult = {
					status: 'erro',
					protocolo: null,
					dataEnvio: null,
					recibo: null,
					erro: data.error || 'Erro ao transmitir'
				};
				notifications.error('Erro na transmissão', data.error);
			}
		} catch (error) {
			transmissionResult = {
				status: 'erro',
				protocolo: null,
				dataEnvio: null,
				recibo: null,
				erro: 'Erro de conexão'
			};
			notifications.error('Erro de conexão', 'Não foi possível conectar com o servidor');
		} finally {
			isTransmitting = false;
		}
	}

	function resetForm() {
		transmissionResult = null;
		irpf = '';
		csll = '';
		pis = '';
		cofins = '';
		recolhimento = '';
	}
</script>

<div class="card p-6">
	<div class="flex items-center justify-between mb-6">
		<h2 class="font-semibold text-slate-800 flex items-center gap-2">
			<svg class="w-5 h-5 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
			</svg>
			Transmissão DCTFWeb
		</h2>
		<span class="text-sm text-slate-400">{clienteNome}</span>
	</div>

	{#if transmissionStatus === 'idle' || transmissionStatus === 'processing'}
		<!-- Transmission Form -->
		<div class="space-y-4">
			<!-- Período -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="ano" class="label">Ano *</label>
					<select id="ano" bind:value={ano} class="input">
						<option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
						<option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
					</select>
				</div>
				<div>
					<label for="mes" class="label">Mês *</label>
					<select id="mes" bind:value={mes} class="input">
						{#each [
							{ value: 1, label: 'Janeiro' },
							{ value: 2, label: 'Fevereiro' },
							{ value: 3, label: 'Março' },
							{ value: 4, label: 'Abril' },
							{ value: 5, label: 'Maio' },
							{ value: 6, label: 'Junho' },
							{ value: 7, label: 'Julho' },
							{ value: 8, label: 'Agosto' },
							{ value: 9, label: 'Setembro' },
							{ value: 10, label: 'Outubro' },
							{ value: 11, label: 'Novembro' },
							{ value: 12, label: 'Dezembro' }
						] as month}
							<option value={month.value}>{month.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Valores -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="irpf" class="label">IRPF</label>
					<input
						type="text"
						id="irpf"
						bind:value={irpf}
						class="input font-mono"
						placeholder="R$ 0,00"
					/>
				</div>
				<div>
					<label for="csll" class="label">CSLL</label>
					<input
						type="text"
						id="csll"
						bind:value={csll}
						class="input font-mono"
						placeholder="R$ 0,00"
					/>
				</div>
				<div>
					<label for="pis" class="label">PIS/Pasep</label>
					<input
						type="text"
						id="pis"
						bind:value={pis}
						class="input font-mono"
						placeholder="R$ 0,00"
					/>
				</div>
				<div>
					<label for="cofins" class="label">COFINS</label>
					<input
						type="text"
						id="cofins"
						bind:value={cofins}
						class="input font-mono"
						placeholder="R$ 0,00"
					/>
				</div>
			</div>

			<div>
				<label for="recolhimento" class="label">Valor Total do Recolhimento</label>
				<input
					type="text"
					id="recolhimento"
					bind:value={recolhimento}
					class="input font-mono"
					placeholder="R$ 0,00"
				/>
			</div>

			<button
				onclick={handleTransmit}
				disabled={isTransmitting}
				class="btn btn-primary w-full mt-4"
			>
				{#if isTransmitting}
					<span class="flex items-center justify-center gap-2">
						<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Transmitindo...
					</span>
				{:else}
					<span class="flex items-center justify-center gap-2">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
						</svg>
						Transmitir DCTFWeb
					</span>
				{/if}
			</button>
		</div>
	{:else if transmissionStatus === 'success'}
		<!-- Success Result -->
		<div class="text-center py-6">
			<div class="w-16 h-16 rounded-full bg-semantic-success/20 flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
				</svg>
			</div>

			<h3 class="text-lg font-semibold text-slate-800 mb-2">Transmissão Concluída</h3>

			<div class="space-y-2 text-sm mt-6">
				{#if transmissionResult?.protocolo}
					<div class="flex justify-between py-2 border-b border-slate-200">
						<span class="text-slate-400">Protocolo</span>
						<span class="text-slate-800 font-mono">{transmissionResult.protocolo}</span>
					</div>
				{/if}
				{#if transmissionResult?.recibo}
					<div class="flex justify-between py-2 border-b border-slate-200">
						<span class="text-slate-400">Recibo</span>
						<span class="text-slate-800 font-mono">{transmissionResult.recibo}</span>
					</div>
				{/if}
				{#if transmissionResult?.dataEnvio}
					<div class="flex justify-between py-2">
						<span class="text-slate-400">Data/Hora</span>
						<span class="text-slate-800">
							{new Date(transmissionResult.dataEnvio).toLocaleString('pt-BR')}
						</span>
					</div>
				{/if}
			</div>

			<button
				onclick={resetForm}
				class="btn btn-ghost mt-6"
			>
				Nova Transmissão
			</button>
		</div>
	{:else if transmissionStatus === 'error'}
		<!-- Error Result -->
		<div class="text-center py-6">
			<div class="w-16 h-16 rounded-full bg-semantic-critical/20 flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8 text-semantic-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
				</svg>
			</div>

			<h3 class="text-lg font-semibold text-slate-800 mb-2">Erro na Transmissão</h3>
			<p class="text-slate-400 mt-2">{transmissionResult?.erro || 'Ocorreu um erro desconhecido'}</p>

			<button
				onclick={resetForm}
				class="btn btn-primary mt-6"
			>
				Tentar Novamente
			</button>
		</div>
	{/if}
</div>
