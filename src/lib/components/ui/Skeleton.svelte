<script lang="ts">
	interface Props {
		variant?: 'text' | 'circular' | 'rectangular';
		width?: string;
		height?: string;
		class?: string;
	}

	let { variant = 'text', width = 'w-full', height = 'h-4', class: className = '' }: Props = $props();
</script>

{#if variant === 'circular'}
	<div class="rounded-full animate-pulse bg-slate-100 {className}" style="width: {width}; height: {width};"></div>
{:else if variant === 'rectangular'}
	<div class="rounded-lg animate-pulse bg-slate-100 {className}" style="width: {width}; height: {height};"></div>
{:else}
	<div class="animate-pulse bg-slate-100 rounded {width} {height} {className}"></div>
{/if}