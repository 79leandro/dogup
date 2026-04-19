<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/dashboard');
	});
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="animate-pulse text-slate-500">Carregando...</div>
</div>
