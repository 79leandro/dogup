<script lang="ts">
	interface Props {
		content: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		children?: import('svelte').Snippet;
	}

	let { content, position = 'top', children }: Props = $props();

	let visible = $state(false);
	let triggerEl: HTMLSpanElement;

	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};

	const arrowClasses = {
		top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800',
		bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800',
		left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800',
		right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800'
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	class="relative inline-flex"
	bind:this={triggerEl}
	onmouseenter={() => visible = true}
	onmouseleave={() => visible = false}
	onfocus={() => visible = true}
	onblur={() => visible = false}
	role="group"
>
	{@render children?.()}

	{#if visible}
		<div
			class="absolute z-50 px-3 py-2 text-sm bg-slate-100 text-slate-800 rounded-lg shadow-lg whitespace-nowrap animate-fade-in
				{positionClasses[position]}"
			role="tooltip"
		>
			{content}
			<div class="absolute w-2 h-2 bg-slate-100 rotate-45
				{position === 'top' ? '-bottom-1' : ''}
				{position === 'bottom' ? '-top-1' : ''}
				{position === 'left' ? '-right-1' : ''}
				{position === 'right' ? '-left-1' : ''}
				{position === 'top' || position === 'bottom' ? 'left-1/2 -translate-x-1/2' : ''}
				{position === 'left' || position === 'right' ? 'top-1/2 -translate-y-1/2' : ''}"
			></div>
		</div>
	{/if}
</span>
