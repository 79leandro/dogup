<script lang="ts">
	import type { Snippet } from 'svelte';
	import { hasPermission } from '$lib/utils/rbac';
	import type { SessionUser } from '$lib/server/auth';

	interface Props {
		role: string;
		user?: SessionUser | null;
		children?: Snippet;
	}

	let { role, user, children }: Props = $props();

	const allowed = $derived(hasPermission(user ?? null, role));
</script>

{#if allowed}
	{@render children?.()}
{/if}