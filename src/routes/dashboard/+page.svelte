<script lang="ts">
	import EcacAlertBanner from '$lib/components/dashboard/EcacAlertBanner.svelte';
	import KPIStrip from '$lib/components/dashboard/KPIStrip.svelte';
	import Dog360Card from '$lib/components/dashboard/Dog360Card.svelte';
	import ObligationsPanel from '$lib/components/dashboard/ObligationsPanel.svelte';
	import QuickActions from '$lib/components/dashboard/QuickActions.svelte';
	import FiscalStatusCard from '$lib/components/dashboard/FiscalStatusCard.svelte';
	import InstallmentsCard from '$lib/components/dashboard/InstallmentsCard.svelte';
	import CertificatesCard from '$lib/components/dashboard/CertificatesCard.svelte';
	import ProcuracoesCard from '$lib/components/dashboard/ProcuracoesCard.svelte';

	let { data } = $props();
</script>

<div class="space-y-6 animate-fade-in">
	<!-- e-CAC Alert Banner -->
	<EcacAlertBanner count={data.mensagensRelevantes} />

	<!-- KPI Strip -->
	<KPIStrip
		data={{
			totalClientes: data.stats.totalClientes,
			percentualEntrega: data.obrigacoes.percentualEntrega,
			clientesCriticos: data.situacaoFiscal.irregular.count,
			alertasEcac: data.mensagensRelevantes
		}}
	/>

	<!-- Main Grid Row -->
	<div class="grid grid-cols-12 gap-6">
		<!-- DOGUP 360° - Client Management -->
		<div class="col-span-12 lg:col-span-4">
			<Dog360Card
				total={data.stats.totalClientes}
				simplesNacional={data.stats.simplesNacional}
				normal={data.stats.normal}
			/>
		</div>

		<!-- Obligations Panel -->
		<div class="col-span-12 lg:col-span-5">
			<ObligationsPanel
				total={data.obrigacoes.total}
				emAndamento={data.obrigacoes.emAndamento}
				entregue={data.obrigacoes.entregue}
				percentualEntrega={data.obrigacoes.percentualEntrega}
			/>
		</div>

		<!-- Quick Actions -->
		<div class="col-span-12 lg:col-span-3">
			<QuickActions />
		</div>
	</div>

	<!-- Second Row -->
	<div class="grid grid-cols-12 gap-6">
		<!-- Fiscal Status - Doughnut -->
		<div class="col-span-12 lg:col-span-4">
			<FiscalStatusCard
				regular={data.situacaoFiscal.regular}
				regularizado={data.situacaoFiscal.regularizado}
				irregular={data.situacaoFiscal.irregular}
			/>
		</div>

		<!-- Installments -->
		<div class="col-span-12 lg:col-span-4">
			<InstallmentsCard parcelamentos={data.parcelamentos} />
		</div>

		<!-- Certificates & Procuracoes -->
		<div class="col-span-12 lg:col-span-4 space-y-6">
			<CertificatesCard
				validos={data.certificados.validos}
				vencidos={data.certificados.vencidos}
				proximasVencimento={data.certificados.proximasVencimento}
			/>
			<ProcuracoesCard
				emDia={data.procuracoes.emDia}
				proximoVencimento={data.procuracoes.proximoVencimento}
				vencidas={data.procuracoes.vencidas}
			/>
		</div>
	</div>
</div>