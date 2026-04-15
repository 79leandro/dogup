<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();

	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Login - DOGUP Contábil</title>
</svelte:head>

<div class="min-h-screen flex">
	<!-- Left Panel - Branding -->
	<div class="hidden lg:flex lg:w-1/2 bg-terminal-800 relative overflow-hidden">
		<!-- Background decoration -->
		<div class="absolute inset-0">
			<div class="absolute top-0 left-0 w-96 h-96 bg-semantic-accent/10 rounded-full blur-3xl"></div>
			<div class="absolute bottom-0 right-0 w-96 h-96 bg-semantic-success/10 rounded-full blur-3xl"></div>
		</div>

		<div class="relative z-10 flex flex-col justify-between p-12 w-full">
			<!-- Logo -->
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-semantic-accent to-semantic-info flex items-center justify-center">
					<span class="text-white font-bold text-xl">D</span>
				</div>
				<div>
					<h1 class="font-display font-bold text-2xl text-terminal-100">DOGUP</h1>
					<p class="text-sm text-terminal-500">Contábil</p>
				</div>
			</div>

			<!-- Hero content -->
			<div class="space-y-8">
				<h2 class="font-display text-4xl font-bold text-terminal-100 leading-tight">
					Monitoramento de<br/>
					<span class="text-transparent bg-clip-text bg-gradient-to-r from-semantic-success to-semantic-info">
						Conformidade Fiscal
					</span>
				</h2>
				<p class="text-lg text-terminal-400 max-w-md">
					Plataforma centralizada de inteligência e monitoramento para escritórios de contabilidade e departamentos fiscais.
				</p>

				<!-- Features -->
				<div class="space-y-4">
					{#each [
						{ icon: '📊', text: 'Dashboard intuitivo com dados em tempo real' },
						{ icon: '⚡', text: 'Alertas automáticos de pendências e prazos' },
						{ icon: '🔒', text: 'Integração segura com e-CAC e PGFN' }
					] as feature}
						<div class="flex items-center gap-3 text-terminal-300">
							<span class="text-xl">{feature.icon}</span>
							<span class="text-sm">{feature.text}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Footer -->
			<div class="text-sm text-terminal-500">
				© 2024 DOGUP Contábil
			</div>
		</div>
	</div>

	<!-- Right Panel - Login Form -->
	<div class="flex-1 flex items-center justify-center p-8 bg-terminal-900">
		<div class="w-full max-w-md">
			<!-- Mobile logo -->
			<div class="lg:hidden flex items-center justify-center gap-3 mb-8">
				<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-semantic-accent to-semantic-info flex items-center justify-center">
					<span class="text-white font-bold">D</span>
				</div>
				<span class="font-display font-bold text-xl text-terminal-100">DOGUP Contábil</span>
			</div>

			<div class="text-center mb-8">
				<h2 class="font-display text-2xl font-bold text-terminal-100">Bem-vindo de volta</h2>
				<p class="text-terminal-500 mt-2">Entre com suas credenciais para acessar</p>
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
						<input type="checkbox" class="w-4 h-4 rounded border-terminal-600 bg-terminal-700 text-semantic-accent focus:ring-semantic-accent/50" />
						<span class="text-terminal-400">Lembrar-me</span>
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
			<div class="mt-8 p-4 rounded-xl bg-terminal-800/50 border border-terminal-700 text-center">
				<p class="text-xs text-terminal-500 mb-2">Credenciais de demonstração:</p>
				<p class="text-sm text-terminal-300">admin@dogup.com.br / admin123</p>
			</div>
		</div>
	</div>
</div>
