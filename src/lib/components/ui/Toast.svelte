<script lang="ts">
	import { onMount } from 'svelte';

	interface ToastItem {
		id: number;
		type: 'success' | 'error' | 'warning' | 'info';
		title: string;
		message?: string;
		duration?: number;
	}

	let toasts = $state<ToastItem[]>([]);
	let nextId = 1;

	export function addToast(toast: Omit<ToastItem, 'id'>) {
		const id = nextId++;
		const duration = toast.duration ?? 5000;

		toasts = [...toasts, { ...toast, id }];

		if (duration > 0) {
			setTimeout(() => removeToast(id), duration);
		}
	}

	export function removeToast(id: number) {
		toasts = toasts.filter(t => t.id !== id);
	}

	const typeStyles = {
		success: 'border-semantic-success/30 bg-semantic-success/10',
		error: 'border-semantic-critical/30 bg-semantic-critical/10',
		warning: 'border-semantic-warning/30 bg-semantic-warning/10',
		info: 'border-semantic-info/30 bg-semantic-info/10'
	};

	const typeIcons = {
		success: `<svg class="w-5 h-5 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
		</svg>`,
		error: `<svg class="w-5 h-5 text-semantic-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
		</svg>`,
		warning: `<svg class="w-5 h-5 text-semantic-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
		</svg>`,
		info: `<svg class="w-5 h-5 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
		</svg>`
	};
</script>

<!-- Toast Container -->
<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
	{#each toasts as toast (toast.id)}
		<div
			class="flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm animate-slide-in-left
				{typeStyles[toast.type]}"
			role="alert"
		>
			<div class="flex-shrink-0">
				{@html typeIcons[toast.type]}
			</div>
			<div class="flex-1 min-w-0">
				<p class="text-sm font-medium text-terminal-100">{toast.title}</p>
				{#if toast.message}
					<p class="text-xs text-terminal-400 mt-1">{toast.message}</p>
				{/if}
			</div>
			<button
				onclick={() => removeToast(toast.id)}
				class="flex-shrink-0 p-1 rounded hover:bg-terminal-700 text-terminal-400 hover:text-terminal-100 transition-colors"
				aria-label="Dismiss"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
				</svg>
			</button>
		</div>
	{/each}
</div>