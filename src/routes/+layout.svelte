<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { sidebarState } from '$lib/stores/ui';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	let { children, data } = $props();

	const isLoginPage = $derived($page.url.pathname === '/login');

	const contentMargin = $derived(
		$sidebarState === 'mobile' ? 'ml-0' :
		$sidebarState === 'collapsed' ? 'ml-[72px]' : 'ml-64'
	);
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="flex min-h-screen">
		<Sidebar {data} />
		<div class="flex-1 flex flex-col {contentMargin} transition-all duration-300">
			<Topbar {data} />
			<main class="flex-1 p-4 lg:p-6 mt-16">
				{@render children()}
			</main>
		</div>
	</div>
{/if}

<Toast />
