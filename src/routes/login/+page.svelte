<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();

	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Login - DOGUP Contábil</title>
</svelte:head>

<div class="min-h-screen flex bg-slate-50">
	<!-- Left side: Login Form -->
	<div class="w-full lg:w-1/2 flex items-center justify-center p-8">
		<div class="w-full max-w-md">
			<!-- Logo -->
			<div class="flex items-center gap-3 mb-10">
				<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-semantic-accent to-semantic-info flex items-center justify-center">
					<span class="text-white font-bold text-xl">D</span>
				</div>
				<div>
					<h1 class="font-display font-bold text-2xl text-slate-800">DOGUP</h1>
					<p class="text-sm text-slate-400">Contábil</p>
				</div>
			</div>

			<div class="mb-8">
				<h2 class="font-display text-2xl font-bold text-slate-800">Bem-vindo de volta</h2>
				<p class="text-slate-400 mt-2">Entre com suas credenciais para acessar</p>
			</div>

			{#if form?.error}
				<div class="mb-6 p-4 rounded-xl bg-semantic-critical/10 border border-semantic-critical/30 text-semantic-critical text-sm">
					{form.error}
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						isLoading = false;
						await update();
					};
				}}
				class="space-y-5"
			>
				<div>
					<label for="email" class="label">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						value={form?.email ?? ''}
						class="input"
						placeholder="seu@email.com.br"
						required
					/>
				</div>

				<div>
					<label for="senha" class="label">Senha</label>
					<input
						type="password"
						id="senha"
						name="senha"
						class="input"
						placeholder="••••••••"
						required
					/>
				</div>

				<div class="flex items-center justify-between text-sm">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" name="rememberMe" class="w-4 h-4 rounded border-slate-300 bg-slate-100 text-semantic-accent focus:ring-semantic-accent/50" />
						<span class="text-slate-500">Lembrar-me</span>
					</label>
					<a href="/recuperar-senha" class="text-semantic-accent hover:text-semantic-accent/80 transition-colors">
						Esqueceu a senha?
					</a>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					class="btn btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isLoading}
						<span class="flex items-center justify-center gap-2">
							<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Entrando...
						</span>
					{:else}
						Entrar
					{/if}
				</button>
			</form>

			<!-- Demo credentials hint -->
			<div class="mt-8 p-4 rounded-xl bg-white/50 border border-slate-200 text-center">
				<p class="text-xs text-slate-400 mb-2">Credenciais de demonstração:</p>
				<p class="text-sm text-slate-600">admin@dogup.com.br / admin123</p>
			</div>
		</div>
	</div>

	<!-- Right side: Hero content -->
	<div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-12 items-center justify-center">
		<div class="max-w-lg">
			<div class="mb-12">
				<h2 class="font-display text-4xl font-bold text-white leading-tight mb-4">
					Monitoramento de<br/>
					<span class="text-transparent bg-clip-text bg-gradient-to-r from-semantic-success to-semantic-info">
						Conformidade Fiscal
					</span>
				</h2>
				<p class="text-lg text-slate-300 mb-8">
					Plataforma centralizada de inteligência e monitoramento para escritórios de contabilidade e departamentos fiscais.
				</p>
			</div>

			<!-- Features -->
			<div class="space-y-4">
				{#each [
					{ icon: '📊', text: 'Dashboard intuitivo com dados em tempo real' },
					{ icon: '⚡', text: 'Alertas automáticos de pendências e prazos' },
					{ icon: '🔒', text: 'Integração segura com e-CAC e PGFN' }
				] as feature}
					<div class="flex items-center gap-4 text-slate-200">
						<span class="text-2xl">{feature.icon}</span>
						<span class="text-base">{feature.text}</span>
					</div>
				{/each}
			</div>

			<!-- Footer -->
			<div class="mt-16 text-sm text-slate-400">
				© 2024 DOGUP Contábil
			</div>
		</div>
	</div>
</div>