<script lang="ts">
	interface Props {
		title?: string;
		message?: string;
		icon?: 'empty' | 'error' | 'search';
		actionLabel?: string;
		onAction?: () => void;
	}

	let {
		title = 'Nenhum dado encontrado',
		message = 'Não há itens para exibir no momento.',
		icon = 'empty',
		actionLabel,
		onAction
	}: Props = $props();

	const icons = {
		empty: `<svg class="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
		</svg>`,
		error: `<svg class="w-16 h-16 text-semantic-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
		</svg>`,
		search: `<svg class="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
		</svg>`
	};
</script>

<div class="empty-state text-center py-12 px-6">
	<div class="inline-flex items-center justify-center mb-4">
		{@html icons[icon]}
	</div>
	<h3 class="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
	<p class="text-sm text-slate-400 max-w-sm mx-auto mb-6">{message}</p>
	{#if actionLabel && onAction}
		<button
			onclick={onAction}
			class="btn btn-primary inline-flex items-center gap-2"
		>
			{actionLabel}
		</button>
	{/if}
</div>