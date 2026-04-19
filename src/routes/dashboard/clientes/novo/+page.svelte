<script lang="ts">
	import { goto } from '$app/navigation';
	import ClienteForm from '$lib/components/clientes/ClienteForm.svelte';

	function handleSave(cliente: any) {
		goto('/dashboard/clientes');
	}

	function handleCancel() {
		goto('/dashboard/clientes');
	}
</script>

<div class="space-y-6 animate-fade-in">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-slate-800">Novo Cliente</h1>
			<p class="text-slate-400 mt-1">Cadastre um novo cliente na base</p>
		</div>
	</div>

	<!-- Form -->
	<div class="card p-6">
		<ClienteForm onSave={handleSave} onCancel={handleCancel} />
	</div>
</div>
