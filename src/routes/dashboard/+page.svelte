<script lang="ts">
	import EcacAlertBanner from '$lib/components/dashboard/EcacAlertBanner.svelte';
	import Gob360Card from '$lib/components/dashboard/Gob360Card.svelte';
	import ObligationsPanel from '$lib/components/dashboard/ObligationsPanel.svelte';
	import FiscalStatusCard from '$lib/components/dashboard/FiscalStatusCard.svelte';
	import InstallmentsCard from '$lib/components/dashboard/InstallmentsCard.svelte';
	import CertificatesCard from '$lib/components/dashboard/CertificatesCard.svelte';
	import ProcuracoesCard from '$lib/components/dashboard/ProcuracoesCard.svelte';

	let { data } = $props();
</script>

<div class="space-y-6 animate-fade-in">
	<!-- e-CAC Alert Banner -->
	<EcacAlertBanner count={data.mensagensRelevantes} />

	<!-- Main Stats Grid -->
	<div class="grid grid-cols-12 gap-6">
		<!-- GOB 360° - Client Management -->
		<div class="col-span-4">
			<Gob360Card
				total={data.stats.totalClientes}
				simplesNacional={data.stats.simplesNacional}
				normal={data.stats.normal}
			/>
		</div>

		<!-- Obligations Panel -->
		<div class="col-span-8">
			<ObligationsPanel
				total={data.obrigacoes.total}
				emAndamento={data.obrigacoes.emAndamento}
				entregue={data.obrigacoes.entregue}
				percentualEntrega={data.obrigacoes.percentualEntrega}
			/>
		</div>
	</div>

	<!-- Second Row -->
	<div class="grid grid-cols-12 gap-6">
		<!-- Fiscal Status - Doughnut -->
		<div class="col-span-4">
			<FiscalStatusCard
				regular={data.situacaoFiscal.regular}
				regularizado={data.situacaoFiscal.regularizado}
				irregular={data.situacaoFiscal.irregular}
			/>
		</div>

		<!-- Installments -->
		<div class="col-span-4">
			<InstallmentsCard parcelamentos={data.parcelamentos} />
		</div>

		<!-- Certificates & Procuracoes -->
		<div class="col-span-4 space-y-6">
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
