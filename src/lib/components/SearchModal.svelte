<script lang="ts">
	import { searchStore, type SearchResult } from '$lib/stores/search';
	import { goto } from '$app/navigation';

	let inputRef: HTMLInputElement | undefined = $state();

	const storeState = $state({
		query: '',
		isOpen: false,
		results: [] as SearchResult[],
		isLoading: false
	});

	// Subscribe to store
	$effect(() => {
		const unsubscribe = searchStore.subscribe(s => {
			storeState.query = s.query;
			storeState.isOpen = s.isOpen;
			storeState.results = s.results;
			storeState.isLoading = s.isLoading;
		});
		return unsubscribe;
	});

	$effect(() => {
		if (storeState.isOpen && inputRef) {
			inputRef.focus();
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			searchStore.close();
		}
	}

	function handleResultClick(result: SearchResult) {
		searchStore.close();
		goto(result.href);
	}

	function getTypeIcon(type: SearchResult['type']) {
		switch (type) {
			case 'cliente':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>`;
			case 'obrigacao':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`;
			case 'parcelamento':
				return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>`;
		}
	}

	function backdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			searchStore.close();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if storeState.isOpen}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
		onclick={backdropClick}
		role="presentation"
	></div>

	<!-- Modal -->
	<div class="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
		<!-- Search input -->
		<div class="flex items-center gap-3 p-4 border-b border-slate-100">
			<svg class="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
			</svg>
			<input
				bind:this={inputRef}
				type="text"
				placeholder="Buscar CNPJ, cliente, obrigação..."
				class="flex-1 text-lg text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
				value={storeState.query}
				oninput={(e) => searchStore.setQuery(e.currentTarget.value)}
				aria-label="Buscar"
			/>
			{#if storeState.isLoading}
				<svg class="w-5 h-5 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			{/if}
			<button
				onclick={() => searchStore.close()}
				class="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
				aria-label="Fechar"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
				</svg>
			</button>
		</div>

		<!-- Results -->
		<div class="max-h-80 overflow-y-auto">
			{#if storeState.results.length > 0}
				<div class="py-2">
					{#each storeState.results as result (result.id + result.type)}
						<button
							onclick={() => handleResultClick(result)}
							class="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
						>
							<div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									{@html getTypeIcon(result.type)}
								</svg>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-slate-800 truncate">{result.titulo}</p>
								<p class="text-xs text-slate-500 truncate">{result.subtitulo}</p>
							</div>
							<span class="text-xs text-slate-400 capitalize">{result.type}</span>
						</button>
					{/each}
				</div>
			{:else if storeState.query.length >= 2 && !storeState.isLoading}
				<div class="py-8 text-center text-slate-400">
					<svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
					<p class="text-sm">Nenhum resultado encontrado</p>
				</div>
			{:else if storeState.query.length < 2}
				<div class="py-8 text-center text-slate-400">
					<p class="text-sm">Digite pelo menos 2 caracteres para buscar</p>
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
			<span>Pressione ESC para fechar</span>
			<span>{storeState.results.length} resultado(s)</span>
		</div>
	</div>
{/if}