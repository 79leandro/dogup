<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';

	let { children } = $props();

	const isLoginPage = $derived($page.url.pathname === '/login');
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="flex min-h-screen">
		<Sidebar />
		<div class="flex-1 flex flex-col ml-64">
			<Topbar />
			<main class="flex-1 p-6 mt-16">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
