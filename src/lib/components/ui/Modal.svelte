<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		open?: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		onClose?: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		open = false,
		title = '',
		size = 'md',
		onClose,
		children
	}: Props = $props();

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget && onClose) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && onClose) {
			onClose();
		}
	}

	function handleBackdropKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			handleBackdropClick(e as unknown as MouseEvent);
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
		onclick={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<!-- Modal Content -->
		<div class="bg-terminal-800 border border-terminal-700 rounded-2xl shadow-2xl w-full {sizeClasses[size]} animate-slide-up">
			<!-- Header -->
			{#if title}
				<div class="flex items-center justify-between px-6 py-4 border-b border-terminal-700">
					<h2 id="modal-title" class="text-lg font-semibold text-terminal-100">{title}</h2>
					<button
						onclick={onClose}
						class="p-1.5 rounded-lg hover:bg-terminal-700 text-terminal-400 hover:text-terminal-100 transition-colors"
						aria-label="Fechar"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
						</svg>
					</button>
				</div>
			{/if}

			<!-- Body -->
			<div class="p-6">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
