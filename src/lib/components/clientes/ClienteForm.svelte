<script lang="ts">
	import { notifications } from '$lib/stores/notifications';
	import {
		formatCNPJInput,
		formatCPFInput,
		validateCNPJ,
		validateCPF,
		getCNPJErrorMessage,
		getCPFErrorMessage,
		isCNPJAlfanumerico
	} from '$lib/utils/cnpj';
	import { fetchCNPJData, mapSituacaoFiscal } from '$lib/services/receitaFederal';
	import type { TipoPessoa } from '@prisma/client';

	interface Props {
		cliente?: {
			id?: string;
			tipoPessoa?: TipoPessoa;
			documento: string;
			nomeRazao: string;
			nomeFantasia?: string | null;
			estadoCivil?: string | null;
			regime: string;
			situacaoFiscal: string;
			logradouro?: string | null;
			cidade?: string | null;
			uf?: string | null;
			cep?: string | null;
			email?: string | null;
			telefone?: string | null;
			responsavelTecnico?: string | null;
		};
		onSave?: (cliente: any) => void;
		onCancel?: () => void;
	}

	let { cliente, onSave, onCancel }: Props = $props();

	let isLoading = $state(false);
	let isSearching = $state(false);

	// Initialize form data directly without referencing cliente prop
	let formData = $state({
		tipoPessoa: 'PJ' as 'PF' | 'PJ',
		documento: '',
		nomeRazao: '',
		nomeFantasia: '',
		estadoCivil: '',
		regime: 'SIMPLES_NACIONAL',
		situacaoFiscal: 'REGULAR',
		logradouro: '',
		bairro: '',
		cidade: '',
		uf: '',
		cep: '',
		email: '',
		telefone: '',
		responsavelTecnico: ''
	});

	// Sync formData when cliente changes
	$effect(() => {
		if (cliente) {
			formData = {
				tipoPessoa: (cliente.tipoPessoa as 'PF' | 'PJ') || 'PJ',
				documento: cliente.tipoPessoa === 'PF'
					? formatCPFInput(cliente.documento || '')
					: formatCNPJInput(cliente.documento || ''),
				nomeRazao: cliente.nomeRazao || '',
				nomeFantasia: cliente.nomeFantasia || '',
				estadoCivil: cliente.estadoCivil || '',
				regime: cliente.regime || 'SIMPLES_NACIONAL',
				situacaoFiscal: cliente.situacaoFiscal || 'REGULAR',
				logradouro: cliente.logradouro || '',
				bairro: (cliente as any).bairro || '',
				cidade: cliente.cidade || '',
				uf: cliente.uf || '',
				cep: cliente.cep || '',
				email: cliente.email || '',
				telefone: cliente.telefone || '',
				responsavelTecnico: cliente.responsavelTecnico || ''
			};
		}
	});

	let documentoError = $state<string | null>(null);

	function formatCEP(value: string): string {
		const digits = value.replace(/\D/g, '');
		if (digits.length <= 5) return digits;
		return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
	}

	function handleDocumentoInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const cleaned = input.value.replace(/[^A-Z\d]/gi, '').toUpperCase();

		if (formData.tipoPessoa === 'PF') {
			// CPF: 11 digits
			formData.documento = cleaned.slice(0, 11);
		} else {
			// CNPJ: 14 digits
			formData.documento = cleaned.slice(0, 14);
		}
		// Limpa erro enquanto digita
		documentoError = null;
	}

	function handleDocumentoBlur(e: Event) {
		const input = e.target as HTMLInputElement;
		const cleaned = input.value.replace(/[^A-Z\d]/gi, '').toUpperCase();

		if (formData.tipoPessoa === 'PF') {
			formData.documento = formatCPFInput(cleaned);
			if (cleaned.length > 0 && cleaned.length < 11) {
				documentoError = 'CPF está incompleto';
			} else if (cleaned.length === 11) {
				documentoError = getCPFErrorMessage(formData.documento);
			}
		} else {
			formData.documento = formatCNPJInput(cleaned);
			if (cleaned.length > 0) {
				documentoError = getCNPJErrorMessage(formData.documento);
			}
		}
	}

	function handleCEPInput(e: Event) {
		const input = e.target as HTMLInputElement;
		formData.cep = formatCEP(input.value);
	}

	function handleTipoPessoaChange(e: Event) {
		const select = e.target as HTMLSelectElement;
		formData.tipoPessoa = select.value as 'PF' | 'PJ';
		formData.documento = '';
		documentoError = null;
	}

	async function handleBuscarDocumento() {
		const cleanDoc = formData.documento.replace(/[^A-Z\d]/gi, '').toUpperCase();

		if (formData.tipoPessoa === 'PF') {
			notifications.warning('CPF', 'Consulta Receita Federal disponível apenas para CNPJ');
			return;
		}

		if (cleanDoc.length !== 14) {
			notifications.warning('CNPJ incompleto', 'Digite os 14 dígitos do CNPJ');
			return;
		}

		if (!validateCNPJ(formData.documento)) {
			notifications.warning('CNPJ inválido', 'Verifique o número digitado');
			return;
		}

		isSearching = true;

		try {
			const result = await fetchCNPJData(cleanDoc);

			if (result.success && result.data) {
				const data = result.data;

				// Auto-fill form with fetched data
				formData.nomeRazao = data.nomeRazao || formData.nomeRazao;
				formData.nomeFantasia = data.nomeFantasia || formData.nomeFantasia;

				// Build complete address
				const parts = [data.logradouro, data.numero, data.complemento]
					.filter(Boolean)
					.join(', ');
				formData.logradouro = parts || formData.logradouro;
				formData.bairro = data.bairro || formData.bairro;
				formData.cidade = data.cidade || formData.cidade;
				formData.uf = data.uf || formData.uf;
				formData.cep = data.cep ? data.cep.replace(/(\d{5})(\d{3})/, '$1-$2') : formData.cep;
				formData.telefone = data.telefone || formData.telefone;
				formData.email = data.email || formData.email;

				// Auto-detect fiscal situation if not set
				if (data.situacaoCadastral) {
					const mapped = mapSituacaoFiscal(data.situacaoCadastral);
					if (mapped === 'IRREGULAR') {
						formData.situacaoFiscal = 'IRREGULAR';
					}
				}

				notifications.success('Dados carregados', `CNPJ ${data.cnpj} encontrado na Receita Federal`);
			} else {
				notifications.error('CNPJ não encontrado', result.error || 'Verifique o número digitado');
			}
		} catch (error) {
			notifications.error('Erro na consulta', 'Não foi possível acessar a Receita Federal');
		} finally {
			isSearching = false;
		}
	}

	function validateDocumento(): boolean {
		const cleanDoc = formData.documento.replace(/[^A-Z\d]/gi, '').toUpperCase();

		if (formData.tipoPessoa === 'PF') {
			if (cleanDoc.length !== 11) {
				documentoError = 'CPF incompleto';
				return false;
			}
			if (!validateCPF(cleanDoc)) {
				documentoError = getCPFErrorMessage(formData.documento);
				return false;
			}
		} else {
			if (cleanDoc.length !== 14) {
				documentoError = 'CNPJ incompleto';
				return false;
			}
			if (!validateCNPJ(cleanDoc)) {
				documentoError = getCNPJErrorMessage(formData.documento);
				return false;
			}
		}

		documentoError = null;
		return true;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateDocumento()) {
			notifications.error(
				formData.tipoPessoa === 'PF' ? 'CPF inválido' : 'CNPJ inválido',
				documentoError || 'Verifique o formato do documento'
			);
			return;
		}

		if (!formData.nomeRazao.trim()) {
			notifications.error('Razão Social é obrigatória');
			return;
		}

		// Always send clean documento to API (without formatting)
		const cleanDoc = formData.documento.replace(/[^A-Z\d]/gi, '').toUpperCase();
		const submitData = {
			...formData,
			documento: cleanDoc
		};

		isLoading = true;

		try {
			const url = cliente?.id ? `/api/clientes/${cliente.id}` : '/api/clientes';
			const method = cliente?.id ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(submitData)
			});

			const result = await response.json();

			if (!response.ok) {
				if (response.status === 409 || result.error?.includes('Cliente já existente') || result.error?.includes('já existe')) {
					notifications.warning('Cliente já existente', 'Este documento já está cadastrado');
				} else {
					throw new Error(result.error || 'Erro ao salvar cliente');
				}
				return;
			}

			notifications.success(
				cliente?.id ? 'Cliente atualizado' : 'Cliente criado',
				`${formData.nomeRazao} foi salvo com sucesso`
			);

			if (onSave) {
				onSave(result.cliente);
			}
		} catch (error) {
			notifications.error(
				'Erro ao salvar',
				error instanceof Error ? error.message : 'Tente novamente'
			);
		} finally {
			isLoading = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<!-- Tipo de Pessoa -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div>
			<label for="tipoPessoa" class="label">Tipo de Pessoa *</label>
			<select id="tipoPessoa" bind:value={formData.tipoPessoa} onchange={handleTipoPessoaChange} class="input">
				<option value="PJ">Pessoa Jurídica (CNPJ)</option>
				<option value="PF">Pessoa Física (CPF)</option>
			</select>
		</div>

		<div class="md:col-span-2">
			<label for="documento" class="label">
				{formData.tipoPessoa === 'PF' ? 'CPF *' : 'CNPJ *'}
			</label>
			<input
				type="text"
				id="documento"
				value={formData.documento}
				oninput={handleDocumentoInput}
				onblur={handleDocumentoBlur}
				class="input {documentoError ? 'input-error' : ''}"
				placeholder={formData.tipoPessoa === 'PF' ? 'Digite o CPF' : 'Digite o CNPJ'}
				maxlength={formData.tipoPessoa === 'PF' ? 11 : 14}
				required
			/>
			{#if documentoError}
				<p class="text-xs text-semantic-critical mt-1">{documentoError}</p>
			{:else if formData.tipoPessoa === 'PJ' && formData.documento && isCNPJAlfanumerico(formData.documento)}
				<p class="text-xs text-semantic-warning mt-1">CNPJ alfanumérico (novo formato)</p>
			{:else if formData.documento && (formData.tipoPessoa === 'PF' ? validateCPF(formData.documento) : validateCNPJ(formData.documento))}
				<p class="text-xs text-semantic-success mt-1">{formData.tipoPessoa === 'PF' ? 'CPF válido' : 'CNPJ válido'}</p>
			{/if}
		</div>
	</div>

	{#if formData.tipoPessoa === 'PJ'}
		<!-- Buscar CNPJ - only for PJ -->
		<div class="flex items-end">
			<button
				type="button"
				onclick={handleBuscarDocumento}
				disabled={isSearching}
				class="btn btn-ghost w-full flex items-center justify-center gap-2"
			>
				{#if isSearching}
					<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
					</svg>
					Buscando...
				{:else}
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
					Buscar CNPJ
				{/if}
			</button>
		</div>
	{/if}

	<div>
		<label for="regime" class="label">Regime Tributário *</label>
		<select id="regime" bind:value={formData.regime} class="input">
			<option value="SIMPLES_NACIONAL">Simples Nacional</option>
			<option value="NORMAL">Normal (Lucro Presumido/Real)</option>
		</select>
	</div>

	<!-- Razão Social / Nome Completo -->
	<div>
		<label for="nomeRazao" class="label">
			{formData.tipoPessoa === 'PF' ? 'Nome Completo *' : 'Razão Social *'}
		</label>
		<input
			type="text"
			id="nomeRazao"
			bind:value={formData.nomeRazao}
			class="input"
			placeholder={formData.tipoPessoa === 'PF' ? 'Nome completo' : 'Razão Social completa'}
			required
		/>
	</div>

	{#if formData.tipoPessoa === 'PJ'}
		<!-- Nome Fantasia - only for PJ -->
		<div>
			<label for="nomeFantasia" class="label">Nome Fantasia</label>
			<input
				type="text"
				id="nomeFantasia"
				bind:value={formData.nomeFantasia}
				class="input"
				placeholder="Nome fantasia (opcional)"
			/>
		</div>
	{:else}
		<!-- Estado Civil - only for PF -->
		<div>
			<label for="estadoCivil" class="label">Estado Civil</label>
			<select id="estadoCivil" bind:value={formData.estadoCivil} class="input">
				<option value="">Selecione</option>
				<option value="SOLTEIRO">Solteiro(a)</option>
				<option value="CASADO">Casado(a)</option>
				<option value="DIVORCIADO">Divorciado(a)</option>
				<option value="VIUVO">Viúvo(a)</option>
				<option value="UNIAO_ESTAVEL">União Estável</option>
			</select>
		</div>
	{/if}

	<!-- Situação Fiscal -->
	<div>
		<label for="situacaoFiscal" class="label">Situação Fiscal</label>
		<select id="situacaoFiscal" bind:value={formData.situacaoFiscal} class="input">
			<option value="REGULAR">Regular</option>
			<option value="REGULARIZADO">Regularizado</option>
			<option value="IRREGULAR">Irregular</option>
		</select>
	</div>

	<!-- Endereço -->
	<fieldset class="border border-slate-200 rounded-lg p-4">
		<legend class="text-sm font-medium text-slate-600 px-2">Endereço</legend>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
			<div class="md:col-span-2">
				<label for="logradouro" class="label">Logradouro</label>
				<input
					type="text"
					id="logradouro"
					bind:value={formData.logradouro}
					class="input"
					placeholder="Rua, número, complemento"
				/>
			</div>

			<div class="md:col-span-2">
				<label for="bairro" class="label">Bairro</label>
				<input
					type="text"
					id="bairro"
					bind:value={formData.bairro}
					class="input"
					placeholder="Bairro"
				/>
			</div>

			<div class="md:col-span-2">
				<label for="cidade" class="label">Cidade</label>
				<input
					type="text"
					id="cidade"
					bind:value={formData.cidade}
					class="input"
					placeholder="Cidade"
				/>
			</div>

			<div>
				<label for="uf" class="label">UF</label>
				<select id="uf" bind:value={formData.uf} class="input">
					<option value="">Selecione</option>
					<option value="AC">AC</option>
					<option value="AL">AL</option>
					<option value="AP">AP</option>
					<option value="AM">AM</option>
					<option value="BA">BA</option>
					<option value="CE">CE</option>
					<option value="DF">DF</option>
					<option value="ES">ES</option>
					<option value="GO">GO</option>
					<option value="MA">MA</option>
					<option value="MT">MT</option>
					<option value="MS">MS</option>
					<option value="MG">MG</option>
					<option value="PA">PA</option>
					<option value="PB">PB</option>
					<option value="PR">PR</option>
					<option value="PE">PE</option>
					<option value="PI">PI</option>
					<option value="RJ">RJ</option>
					<option value="RN">RN</option>
					<option value="RS">RS</option>
					<option value="RO">RO</option>
					<option value="RR">RR</option>
					<option value="SC">SC</option>
					<option value="SP">SP</option>
					<option value="SE">SE</option>
					<option value="TO">TO</option>
				</select>
			</div>

			<div>
				<label for="cep" class="label">CEP</label>
				<input
					type="text"
					id="cep"
					value={formData.cep}
					oninput={handleCEPInput}
					class="input"
					placeholder="00000-000"
					maxlength="9"
				/>
			</div>
		</div>
	</fieldset>

	<!-- Contato -->
	<fieldset class="border border-slate-200 rounded-lg p-4">
		<legend class="text-sm font-medium text-slate-600 px-2">Contato</legend>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
			<div>
				<label for="email" class="label">E-mail</label>
				<input
					type="email"
					id="email"
					bind:value={formData.email}
					class="input"
					placeholder="contato@empresa.com.br"
				/>
			</div>

			<div>
				<label for="telefone" class="label">Telefone</label>
				<input
					type="tel"
					id="telefone"
					bind:value={formData.telefone}
					class="input"
					placeholder="(00) 0000-0000"
				/>
			</div>
		</div>
	</fieldset>

	<!-- Responsável Técnico -->
	<div>
		<label for="responsavelTecnico" class="label">Responsável Técnico</label>
		<input
			type="text"
			id="responsavelTecnico"
			bind:value={formData.responsavelTecnico}
			class="input"
			placeholder="Nome do contador responsável"
		/>
	</div>

	<!-- Actions -->
	<div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
		{#if onCancel}
			<button type="button" onclick={onCancel} class="btn btn-ghost">
				Cancelar
			</button>
		{/if}
		<button type="submit" disabled={isLoading} class="btn btn-primary">
			{#if isLoading}
				<span class="flex items-center gap-2">
					<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Salvando...
				</span>
			{:else}
				{cliente?.id ? 'Atualizar Cliente' : 'Criar Cliente'}
			{/if}
		</button>
	</div>
</form>